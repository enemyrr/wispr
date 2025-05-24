import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { TranscriptionService } from './transcriptionService';

// Desktop recording dependencies
let mic: any = null;
let wav: any = null;

// Dynamically import recording modules when needed
async function getMic() {
    if (!mic) {
        try {
            mic = require('mic');
        } catch (error) {
            throw new Error('Mic module not available. Please install mic.');
        }
    }
    return mic;
}

async function getWav() {
    if (!wav) {
        try {
            wav = require('wav');
        } catch (error) {
            throw new Error('WAV module not available. Please install wav.');
        }
    }
    return wav;
}

export class WisprVoiceRecorder {
    private isRecording = false;
    private mediaRecorder: any = null;
    private audioChunks: Blob[] = [];
    private recordingStream: MediaStream | null = null;
    private micInstance: any = null;
    private recordingFilePath: string | null = null;
    private audioWriteStream: any = null;

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
        if (this.isRecording) {
            return;
        }

        try {
            // Check if we're in a web extension context
            if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
                await this.startWebRecording();
            } else {
                // For desktop VSCode, use native recording
                await this.startNativeRecording();
            }

            this.isRecording = true;
            this.recordingStateChangedEmitter.fire(true);

        } catch (error) {
            this.errorEmitter.fire(`Failed to start recording: ${error}`);
        }
    }

    async stopRecording(): Promise<void> {
        if (!this.isRecording) {
            return;
        }

        try {
            this.isRecording = false;
            this.recordingStateChangedEmitter.fire(false);

            if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                this.mediaRecorder.stop();
            }

            if (this.recordingStream) {
                this.recordingStream.getTracks().forEach(track => track.stop());
                this.recordingStream = null;
            }

            // Stop native recording
            if (this.micInstance) {
                this.micInstance.stop();
                this.micInstance = null;

                if (this.audioWriteStream) {
                    this.audioWriteStream.end();
                    this.audioWriteStream = null;
                }

                // Wait a moment for the file to be fully written
                setTimeout(async () => {
                    await this.processNativeRecording();
                }, 500);
            }

        } catch (error) {
            this.errorEmitter.fire(`Failed to stop recording: ${error}`);
        }
    }

    private async startWebRecording(): Promise<void> {
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
            await this.processWebRecording();
        };

        this.mediaRecorder.start();
    }

    private async startNativeRecording(): Promise<void> {
        const platform = os.platform();

        if (platform !== 'darwin') {
            throw new Error('Native recording is currently only supported on macOS. Please use VSCode in a browser for other platforms.');
        }

        try {
            const micLib = await getMic();
            const wavLib = await getWav();

            // Create a temporary file for recording
            const tempDir = os.tmpdir();
            this.recordingFilePath = path.join(tempDir, `wispr-recording-${Date.now()}.wav`);

            // Check if user wants to skip permission dialog
            const config = vscode.workspace.getConfiguration('wispr');
            const skipPermissionDialog = config.get<boolean>('skipPermissionDialog', false);

            console.log(`Permission dialog setting: skipPermissionDialog = ${skipPermissionDialog}`);

            // Request microphone permissions first (unless user opted to skip)
            if (!skipPermissionDialog) {
                console.log('Showing permission dialog...');
                const permissionChoice = await vscode.window.showInformationMessage(
                    'Voice recording requires microphone access. Please grant permission when prompted.',
                    'Start Recording', 'Don\'t ask again', 'Cancel'
                );

                console.log(`User choice: ${permissionChoice}`);

                if (permissionChoice === 'Cancel') {
                    throw new Error('Recording cancelled by user');
                } else if (permissionChoice === 'Don\'t ask again') {
                    // Save the preference to not ask again
                    console.log('Saving skipPermissionDialog setting to true...');
                    await config.update('skipPermissionDialog', true, vscode.ConfigurationTarget.Global);
                    console.log('Setting saved successfully');

                    // Show confirmation
                    vscode.window.showInformationMessage('Permission dialog disabled. You can re-enable it using the "Reset Microphone Permission Dialog" command.');
                }
            } else {
                console.log('Skipping permission dialog as per user setting');
            }

            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Starting microphone recording...",
                cancellable: false
            }, async (progress) => {
                // Configure microphone input
                this.micInstance = micLib({
                    rate: '16000',
                    channels: '1',
                    debug: false,
                    exitOnSilence: 6
                });

                // Create WAV file writer
                this.audioWriteStream = new wavLib.FileWriter(this.recordingFilePath, {
                    channels: 1,
                    sampleRate: 16000,
                    bitDepth: 16
                });

                // Get the microphone input stream
                const micInputStream = this.micInstance.getAudioStream();

                // Pipe the microphone input to the WAV file
                micInputStream.pipe(this.audioWriteStream);

                micInputStream.on('error', (error: Error) => {
                    this.errorEmitter.fire(`Microphone error: ${error.message}`);
                });

                this.audioWriteStream.on('error', (error: Error) => {
                    this.errorEmitter.fire(`File write error: ${error.message}`);
                });

                // Start recording
                this.micInstance.start();

                progress.report({ message: "Recording in progress... Click the extension icon again to stop." });
            });

        } catch (error) {
            const errorMessage = `Native recording setup failed: ${error}. 

For macOS ARM recording, please ensure:
1. Grant microphone permissions to VSCode when prompted
2. If you see "sox" errors, install with: brew install sox
3. Ensure VSCode has necessary system permissions

Alternative: Use VSCode in a browser for automatic web-based recording.`;

            throw new Error(errorMessage);
        }
    }

    private async processWebRecording(): Promise<void> {
        if (this.audioChunks.length === 0) {
            this.errorEmitter.fire('No audio data recorded');
            return;
        }

        try {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm;codecs=opus' });
            const tempFilePath = await this.saveBlobToTempFile(audioBlob);

            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Transcribing audio...",
                cancellable: false
            }, async (progress) => {
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

    private async processNativeRecording(): Promise<void> {
        if (!this.recordingFilePath || !fs.existsSync(this.recordingFilePath)) {
            this.errorEmitter.fire('No audio file was created during recording');
            return;
        }

        try {
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Transcribing audio...",
                cancellable: false
            }, async (progress) => {
                try {
                    const transcriptionText = await this.transcriptionService.transcribeAudio(this.recordingFilePath!);
                    this.transcriptionResultEmitter.fire(transcriptionText);
                } catch (error) {
                    this.errorEmitter.fire(`Transcription failed: ${error}`);
                } finally {
                    // Clean up temp file
                    try {
                        if (this.recordingFilePath) {
                            fs.unlinkSync(this.recordingFilePath);
                            this.recordingFilePath = null;
                        }
                    } catch (cleanupError) {
                        // Ignore cleanup errors
                    }
                }
            });

        } catch (error) {
            this.errorEmitter.fire(`Failed to process native recording: ${error}`);
        }
    }

    private async saveBlobToTempFile(blob: Blob): Promise<string> {
        const tempDir = os.tmpdir();
        const tempFilePath = path.join(tempDir, `wispr-recording-${Date.now()}.webm`);

        // Convert Blob to Buffer
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Write to temp file
        fs.writeFileSync(tempFilePath, buffer);

        return tempFilePath;
    }

    dispose(): void {
        if (this.isRecording) {
            this.stopRecording();
        }

        if (this.micInstance) {
            this.micInstance.stop();
        }

        if (this.audioWriteStream) {
            this.audioWriteStream.end();
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