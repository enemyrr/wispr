import * as vscode from 'vscode';
import OpenAI from 'openai';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class TranscriptionService {
    private openai: OpenAI | null = null;

    constructor() {
        this.initializeOpenAI();
    }

    private initializeOpenAI() {
        const config = vscode.workspace.getConfiguration('wispr');
        const apiKey = config.get<string>('openaiApiKey');

        if (!apiKey) {
            // Only show error for API mode
            const transcriptionMode = config.get<string>('transcriptionMode', 'api');
            if (transcriptionMode === 'api') {
                vscode.window.showErrorMessage(
                    'OpenAI API key not configured. Please set it in settings or switch to local mode.',
                    'Open Settings', 'Switch to Local'
                ).then((selection) => {
                    if (selection === 'Open Settings') {
                        vscode.commands.executeCommand('workbench.action.openSettings', 'wispr.openaiApiKey');
                    } else if (selection === 'Switch to Local') {
                        config.update('transcriptionMode', 'local', vscode.ConfigurationTarget.Global);
                    }
                });
            }
            return;
        }

        this.openai = new OpenAI({
            apiKey: apiKey
        });
    }

    async transcribeAudio(audioFilePath: string): Promise<string> {
        const config = vscode.workspace.getConfiguration('wispr');
        const transcriptionMode = config.get<string>('transcriptionMode', 'api');

        if (transcriptionMode === 'local') {
            return this.transcribeWithLocalWhisper(audioFilePath);
        } else {
            return this.transcribeWithAPI(audioFilePath);
        }
    }

    private async transcribeWithAPI(audioFilePath: string): Promise<string> {
        if (!this.openai) {
            this.initializeOpenAI();
            if (!this.openai) {
                throw new Error('OpenAI API key not configured');
            }
        }

        try {
            const config = vscode.workspace.getConfiguration('wispr');
            const language = config.get<string>('language') || 'en';
            const model = config.get<string>('model') || 'whisper-1';

            const transcription = await this.openai.audio.transcriptions.create({
                file: fs.createReadStream(audioFilePath),
                model: model,
                language: language,
                response_format: 'text'
            });

            return String(transcription);
        } catch (error) {
            console.error('API Transcription error:', error);
            throw new Error(`Failed to transcribe audio with API: ${error}`);
        }
    }

    private async transcribeWithLocalWhisper(audioFilePath: string): Promise<string> {
        try {
            const config = vscode.workspace.getConfiguration('wispr');
            const pythonPath = config.get<string>('pythonPath', 'python3');
            const model = config.get<string>('localWhisperModel', 'base');
            const language = config.get<string>('language', 'en');

            // First check if whisper is installed
            await this.checkWhisperInstallation(pythonPath);

            // Construct the whisper command
            const command = `"${pythonPath}" -m whisper "${audioFilePath}" --model ${model} --language ${language} --output_format txt --output_dir /tmp --verbose False`;

            console.log(`Running whisper command: ${command}`);

            const { stdout, stderr } = await execAsync(command, {
                timeout: 60000, // 60 second timeout
                maxBuffer: 1024 * 1024 * 10 // 10MB buffer
            });

            if (stderr && !stderr.includes('100%')) {
                console.warn('Whisper stderr:', stderr);
            }

            // Whisper saves the transcription to a .txt file
            const audioFileName = audioFilePath.split('/').pop()?.replace(/\.[^/.]+$/, "") || 'audio';
            const outputPath = `/tmp/${audioFileName}.txt`;

            if (fs.existsSync(outputPath)) {
                const transcription = fs.readFileSync(outputPath, 'utf8').trim();
                // Clean up the output file
                fs.unlinkSync(outputPath);
                return transcription;
            } else {
                throw new Error('Whisper output file not found');
            }

        } catch (error) {
            console.error('Local Whisper transcription error:', error);
            
            const errorMessage = error instanceof Error ? error.message : String(error);
            
            if (errorMessage.includes('No module named')) {
                throw new Error('Whisper not installed. Please run "Install Local Whisper Dependencies" command.');
            } else if (errorMessage.includes('timeout')) {
                throw new Error('Transcription timed out. Try using a smaller model or shorter audio.');
            } else {
                throw new Error(`Local transcription failed: ${errorMessage}`);
            }
        }
    }

    async checkWhisperInstallation(pythonPath: string = 'python3'): Promise<boolean> {
        try {
            const { stdout } = await execAsync(`"${pythonPath}" -c "import whisper; print(whisper.__version__)"`);
            console.log(`Whisper version: ${stdout.trim()}`);
            return true;
        } catch (error) {
            throw new Error(`Whisper not installed or Python not found at: ${pythonPath}`);
        }
    }

    async installWhisper(pythonPath: string = 'python3'): Promise<void> {
        try {
            vscode.window.showInformationMessage('Installing Whisper... This may take a few minutes.');
            
            const { stdout, stderr } = await execAsync(`"${pythonPath}" -m pip install -U openai-whisper`, {
                timeout: 300000 // 5 minute timeout for installation
            });

            console.log('Whisper installation output:', stdout);
            if (stderr) {
                console.warn('Whisper installation warnings:', stderr);
            }

            vscode.window.showInformationMessage('Whisper installed successfully!');
        } catch (error) {
            console.error('Whisper installation error:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to install Whisper: ${errorMessage}`);
        }
    }

    public reconfigureAPI() {
        this.openai = null;
        this.initializeOpenAI();
    }

    public getCurrentMode(): string {
        const config = vscode.workspace.getConfiguration('wispr');
        return config.get<string>('transcriptionMode', 'api');
    }
} 