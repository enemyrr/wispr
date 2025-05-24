import * as vscode from 'vscode';
import { WisprVoiceRecorder } from './voiceRecorder';
import { TranscriptionService } from './transcriptionService';

let statusBarItem: vscode.StatusBarItem;
let voiceRecorder: WisprVoiceRecorder;
let transcriptionService: TranscriptionService;

export function activate(context: vscode.ExtensionContext) {
    try {
        // Initialize services
        transcriptionService = new TranscriptionService();
        voiceRecorder = new WisprVoiceRecorder(transcriptionService);

        // Create status bar item
        statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        statusBarItem.command = 'wispr.toggleRecording';
        statusBarItem.text = '🎤 Wispr';
        statusBarItem.tooltip = 'Click to start voice recording';
        statusBarItem.show();

        // Register toggle recording command
        let toggleRecordingCommand = vscode.commands.registerCommand('wispr.toggleRecording', () => {
            voiceRecorder.toggleRecording();
        });

        // Listen to recording state changes
        voiceRecorder.onRecordingStateChanged((isRecording: boolean) => {
            updateStatusBar(isRecording);
        });

        // Listen to transcription results
        voiceRecorder.onTranscriptionResult((text: string) => {
            showTranscriptionResult(text);
        });

        // Listen to errors
        voiceRecorder.onError((error: string) => {
            vscode.window.showErrorMessage(`Wispr Error: ${error}`);
        });

        context.subscriptions.push(
            statusBarItem,
            toggleRecordingCommand
        );

    } catch (error) {
        vscode.window.showErrorMessage(`Failed to activate Wispr extension: ${error}`);
    }
}

function updateStatusBar(isRecording: boolean) {
    if (!statusBarItem) return;

    if (isRecording) {
        statusBarItem.text = '🔴 Recording...';
        statusBarItem.tooltip = 'Click to stop recording';
        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    } else {
        statusBarItem.text = '🎤 Wispr';
        statusBarItem.tooltip = 'Click to start voice recording';
        statusBarItem.backgroundColor = undefined;
    }
}

function showTranscriptionResult(text: string) {
    // Show result with copy button
    const message = text.length > 100 ? text.substring(0, 100) + '...' : text;

    vscode.window.showInformationMessage(
        `Transcribed: "${message}"`,
        'Copy to Clipboard'
    ).then((choice) => {
        if (choice === 'Copy to Clipboard') {
            vscode.env.clipboard.writeText(text);
            vscode.window.showInformationMessage('Copied to clipboard!');
        }
    });
}

export function deactivate() {
    if (voiceRecorder) {
        voiceRecorder.dispose();
    }
    if (statusBarItem) {
        statusBarItem.dispose();
    }
} 