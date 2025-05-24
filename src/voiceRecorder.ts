import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { TranscriptionService } from './transcriptionService';

export class WisprVoiceRecorder {
    private isRecording = false;
    private mediaRecorder: MediaRecorder | null = null;
    private audioChunks: Blob[] = [];
    private recordingStream: MediaStream | null = null;
    private recordingTimeout: NodeJS.Timeout | null = null;

    private recordingStateChangedEmitter = new vscode.EventEmitter<boolean>();
    private transcriptionResultEmitter = new vscode.EventEmitter<string>();
    private errorEmitter = new vscode.EventEmitter<string>();

    public readonly onRecordingStateChanged = this.recordingStateChangedEmitter.event;
    public readonly onTranscriptionResult = this.transcriptionResultEmitter.event;
    public readonly onError = this.errorEmitter.event;

    constructor(private transcriptionService: TranscriptionService) { }

    async toggleRecording(): Promise<void> {
        if (this.isRecording) {
            await this.stopRecording();
        } else {
            await this.startRecording();
        }
    }

    async startRecording(): Promise<void> {
        if (this.isRecording) return;

        try {
            await this.startWebRecording();
            this.isRecording = true;
            this.recordingStateChangedEmitter.fire(true);
            
            // Set up timeout
            this.setupRecordingTimeout();
        } catch (error) {
            this.errorEmitter.fire(`Failed to start recording: ${error}`);
        }
    }

    async stopRecording(isTimeout: boolean = false): Promise<void> {
        if (!this.isRecording) return;

        try {
            this.isRecording = false;
            this.recordingStateChangedEmitter.fire(false);

            // Clear timeout
            if (this.recordingTimeout) {
                clearTimeout(this.recordingTimeout);
                this.recordingTimeout = null;
            }

            if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                this.mediaRecorder.stop();
            }

            if (this.recordingStream) {
                this.recordingStream.getTracks().forEach(track => track.stop());
                this.recordingStream = null;
            }

            // Show timeout message if auto-stopped
            if (isTimeout) {
                vscode.window.showWarningMessage('Recording automatically stopped due to timeout');
            }
        } catch (error) {
            this.errorEmitter.fire(`Failed to stop recording: ${error}`);
        }
    }

    private setupRecordingTimeout(): void {
        const config = vscode.workspace.getConfiguration('wispr');
        const timeoutSeconds = config.get<number>('recordingTimeout', 120);
        
        this.recordingTimeout = setTimeout(async () => {
            await this.stopRecording(true);
        }, timeoutSeconds * 1000);
    }

    private async startWebRecording(): Promise<void> {
        // Check if we're in a web context or if mediaDevices is available
        if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
            throw new Error('Voice recording requires running VSCode in a browser or with proper media device access.');
        }

        this.audioChunks = [];

        this.recordingStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                sampleRate: 16000,
                channelCount: 1,
                echoCancellation: true,
                noiseSuppression: true
            }
        });

        this.mediaRecorder = new MediaRecorder(this.recordingStream, {
            mimeType: 'audio/webm;codecs=opus'
        });

        this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
            if (event.data.size > 0) {
                this.audioChunks.push(event.data);
            }
        };

        this.mediaRecorder.onstop = async () => {
            await this.processRecording();
        };

        this.mediaRecorder.start();
    }

    private async processRecording(): Promise<void> {
        if (this.audioChunks.length === 0) {
            this.errorEmitter.fire('No audio data recorded');
            return;
        }

        try {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm;codecs=opus' });
            const tempFilePath = await this.saveBlobToTempFile(audioBlob);

            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Transcribing audio...",
                cancellable: false
            }, async () => {
                try {
                    const transcriptionText = await this.transcriptionService.transcribeAudio(tempFilePath);
                    this.transcriptionResultEmitter.fire(transcriptionText);
                } catch (error) {
                    this.errorEmitter.fire(`Transcription failed: ${error}`);
                } finally {
                    // Clean up temp file
                    try {
                        fs.unlinkSync(tempFilePath);
                    } catch (cleanupError) {
                        // Ignore cleanup errors
                    }
                }
            });
        } catch (error) {
            this.errorEmitter.fire(`Failed to process recording: ${error}`);
        }
    }

    private async saveBlobToTempFile(blob: Blob): Promise<string> {
        const tempDir = os.tmpdir();
        const tempFilePath = path.join(tempDir, `wispr-recording-${Date.now()}.webm`);

        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(tempFilePath, buffer);

        return tempFilePath;
    }

    dispose(): void {
        if (this.isRecording) {
            this.stopRecording();
        }

        if (this.recordingTimeout) {
            clearTimeout(this.recordingTimeout);
            this.recordingTimeout = null;
        }

        this.recordingStateChangedEmitter.dispose();
        this.transcriptionResultEmitter.dispose();
        this.errorEmitter.dispose();
    }
}

// Define BlobEvent interface for TypeScript
interface BlobEvent extends Event {
    data: Blob;
} 