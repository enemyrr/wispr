import * as vscode from 'vscode';
import { WisprVoiceRecorder } from './voiceRecorder';
import { TranscriptionService } from './transcriptionService';

let statusBarItem: vscode.StatusBarItem;
let voiceRecorder: WisprVoiceRecorder;
let transcriptionService: TranscriptionService;

export function activate(context: vscode.ExtensionContext) {
    console.log('Wispr Voice to Text extension is now active!');

    try {
        // Initialize services
        transcriptionService = new TranscriptionService();
        voiceRecorder = new WisprVoiceRecorder(transcriptionService);
        console.log('Services initialized successfully');

        // Create status bar item
        statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        statusBarItem.command = 'wispr.toggleRecording';
        statusBarItem.text = '🎤 Wispr';
        statusBarItem.tooltip = 'Click to start voice recording';
        statusBarItem.color = undefined;
        statusBarItem.backgroundColor = undefined;

        // Ensure the status bar item is shown
        statusBarItem.show();

        console.log('Status bar item created and shown');
        console.log(`Status bar text: ${statusBarItem.text}`);
        console.log(`Status bar command: ${statusBarItem.command}`);

        // Register commands
        let toggleRecordingCommand = vscode.commands.registerCommand('wispr.toggleRecording', () => {
            console.log('Toggle recording command executed');
            voiceRecorder.toggleRecording();
        });

        let startRecordingCommand = vscode.commands.registerCommand('wispr.startRecording', () => {
            console.log('Start recording command executed');
            voiceRecorder.startRecording();
        });

        let stopRecordingCommand = vscode.commands.registerCommand('wispr.stopRecording', () => {
            console.log('Stop recording command executed');
            voiceRecorder.stopRecording();
        });

        let resetPermissionDialogCommand = vscode.commands.registerCommand('wispr.resetPermissionDialog', async () => {
            console.log('Reset permission dialog command executed');
            const config = vscode.workspace.getConfiguration('wispr');
            await config.update('skipPermissionDialog', false, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage('Microphone permission dialog has been reset. You will be prompted again on next recording.');
        });

        let togglePermissionDialogCommand = vscode.commands.registerCommand('wispr.togglePermissionDialog', async () => {
            console.log('Toggle permission dialog command executed');
            const config = vscode.workspace.getConfiguration('wispr');
            const currentValue = config.get<boolean>('skipPermissionDialog', false);
            const newValue = !currentValue;
            
            await config.update('skipPermissionDialog', newValue, vscode.ConfigurationTarget.Global);
            
            const message = newValue 
                ? 'Permission dialog disabled. Recording will start immediately when clicking the microphone.' 
                : 'Permission dialog enabled. You will be prompted before each recording.';
            
            vscode.window.showInformationMessage(message);
        });

        let toggleAutoCopyClipboardCommand = vscode.commands.registerCommand('wispr.toggleAutoCopyClipboard', async () => {
            console.log('Toggle auto-copy clipboard command executed');
            const config = vscode.workspace.getConfiguration('wispr');
            const currentValue = config.get<boolean>('autoCopyToClipboard', true);
            const newValue = !currentValue;
            
            await config.update('autoCopyToClipboard', newValue, vscode.ConfigurationTarget.Global);
            
            const message = newValue 
                ? 'Auto-copy to clipboard enabled. Transcribed text will be automatically copied.' 
                : 'Auto-copy to clipboard disabled. You can manually copy text using the action button.';
            
            vscode.window.showInformationMessage(message);
        });

        let toggleTranscriptionModeCommand = vscode.commands.registerCommand('wispr.toggleTranscriptionMode', async () => {
            console.log('Toggle transcription mode command executed');
            const config = vscode.workspace.getConfiguration('wispr');
            const currentMode = config.get<string>('transcriptionMode', 'api');
            const newMode = currentMode === 'api' ? 'local' : 'api';
            
            await config.update('transcriptionMode', newMode, vscode.ConfigurationTarget.Global);
            
            // Update status bar to reflect new mode
            updateStatusBarWithMode(newMode);
            
            const message = newMode === 'local' 
                ? 'Switched to Local Whisper mode. Transcription will run offline.' 
                : 'Switched to API mode. Transcription will use OpenAI API.';
            
            vscode.window.showInformationMessage(message);
        });

        let installLocalWhisperCommand = vscode.commands.registerCommand('wispr.installLocalWhisper', async () => {
            console.log('Install local Whisper command executed');
            
            const config = vscode.workspace.getConfiguration('wispr');
            const pythonPath = config.get<string>('pythonPath', 'python3');
            
            try {
                // First check if already installed
                const isInstalled = await transcriptionService.checkWhisperInstallation(pythonPath);
                if (isInstalled) {
                    vscode.window.showInformationMessage('Whisper is already installed and working!');
                    return;
                }
            } catch (error) {
                // Not installed, proceed with installation
            }
            
            const choice = await vscode.window.showInformationMessage(
                'This will install OpenAI Whisper using pip. Make sure Python and pip are installed on your system.',
                'Install Whisper', 'Check Requirements', 'Cancel'
            );
            
            if (choice === 'Install Whisper') {
                try {
                    await vscode.window.withProgress({
                        location: vscode.ProgressLocation.Notification,
                        title: "Installing Whisper...",
                        cancellable: false
                    }, async (progress) => {
                        progress.report({ message: "This may take several minutes..." });
                        await transcriptionService.installWhisper(pythonPath);
                    });
                } catch (error) {
                    vscode.window.showErrorMessage(`Installation failed: ${error}`);
                }
            } else if (choice === 'Check Requirements') {
                vscode.window.showInformationMessage(
                    'Requirements for Local Whisper:\n\n' +
                    '1. Python 3.8+ installed\n' +
                    '2. pip package manager\n' +
                    '3. ffmpeg (install with: brew install ffmpeg on macOS)\n' +
                    '4. At least 1GB free space for models\n\n' +
                    'After installation, models will be downloaded automatically on first use.',
                    'Install Whisper'
                ).then(selection => {
                    if (selection === 'Install Whisper') {
                        vscode.commands.executeCommand('wispr.installLocalWhisper');
                    }
                });
            }
        });

        console.log('Commands registered successfully');

        // Listen to recording state changes to update status bar
        voiceRecorder.onRecordingStateChanged((isRecording: boolean) => {
            console.log(`Recording state changed: ${isRecording}`);
            updateStatusBar(isRecording);
        });

        // Listen to transcription results
        voiceRecorder.onTranscriptionResult((text: string) => {
            console.log(`Transcription result received: ${text.substring(0, 50)}...`);
            showTranscriptionResult(text);
        });

        // Listen to errors
        voiceRecorder.onError((error: string) => {
            console.error(`Wispr Error: ${error}`);
            vscode.window.showErrorMessage(`Wispr Error: ${error}`);
        });

        context.subscriptions.push(
            statusBarItem,
            toggleRecordingCommand,
            startRecordingCommand,
            stopRecordingCommand,
            resetPermissionDialogCommand,
            togglePermissionDialogCommand,
            toggleAutoCopyClipboardCommand,
            toggleTranscriptionModeCommand,
            installLocalWhisperCommand
        );

        console.log('Extension activation completed successfully');

        // Force a status bar update to ensure it's visible
        setTimeout(() => {
            if (statusBarItem) {
                statusBarItem.show();
                console.log('Status bar visibility forced after timeout');
            }
        }, 100);

    } catch (error) {
        console.error('Error during extension activation:', error);
        vscode.window.showErrorMessage(`Failed to activate Wispr extension: ${error}`);
    }
}

function updateStatusBar(isRecording: boolean) {
    if (!statusBarItem) {
        console.error('Status bar item is not initialized');
        return;
    }

    const config = vscode.workspace.getConfiguration('wispr');
    const currentMode = config.get<string>('transcriptionMode', 'api');
    const modeIcon = currentMode === 'local' ? '🏠' : '☁️';

    if (isRecording) {
        statusBarItem.text = '🔴 Recording...';
        statusBarItem.tooltip = 'Click to stop recording';
        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        statusBarItem.color = new vscode.ThemeColor('statusBarItem.warningForeground');
    } else {
        statusBarItem.text = `🎤 Wispr ${modeIcon}`;
        statusBarItem.tooltip = `Click to start voice recording (${currentMode === 'local' ? 'Local Whisper' : 'OpenAI API'})`;
        statusBarItem.backgroundColor = undefined;
        statusBarItem.color = undefined;
    }

    console.log(`Status bar updated: ${statusBarItem.text}`);
}

function updateStatusBarWithMode(mode: string) {
    updateStatusBar(false); // Force update with current mode
}

function showTranscriptionResult(text: string) {
    const config = vscode.workspace.getConfiguration('wispr');
    const autoCopyToClipboard = config.get<boolean>('autoCopyToClipboard', true);
    
    const options: vscode.MessageOptions = {
        modal: false
    };

    // Automatically copy to clipboard if setting is enabled
    if (autoCopyToClipboard) {
        vscode.env.clipboard.writeText(text);
    }

    const message = autoCopyToClipboard 
        ? 'Transcription complete! Text copied to clipboard.'
        : 'Transcription complete!';

    const actionButtons = autoCopyToClipboard 
        ? ['Insert at Cursor', 'Show Full Text']
        : ['Copy to Clipboard', 'Insert at Cursor', 'Show Full Text'];

    vscode.window.showInformationMessage(
        message,
        options,
        ...actionButtons
    ).then(selection => {
        if (selection === 'Insert at Cursor') {
            insertTextAtCursor(text);
        } else if (selection === 'Copy to Clipboard') {
            vscode.env.clipboard.writeText(text);
            vscode.window.showInformationMessage('Text copied to clipboard!');
        } else if (selection === 'Show Full Text') {
            showFullTranscriptionText(text);
        }
    });
}

function insertTextAtCursor(text: string) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, text);
        });
    }
}

function showFullTranscriptionText(text: string) {
    vscode.workspace.openTextDocument({
        content: text,
        language: 'plaintext'
    }).then(doc => {
        vscode.window.showTextDocument(doc);
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