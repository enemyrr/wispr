import * as vscode from 'vscode';
import OpenAI from 'openai';
import * as fs from 'fs';

export class TranscriptionService {
    private openai: OpenAI | null = null;

    constructor() {
        this.initializeOpenAI();
    }

    private initializeOpenAI() {
        const config = vscode.workspace.getConfiguration('wispr');
        const apiKey = config.get<string>('openaiApiKey');

        if (!apiKey) {
            vscode.window.showErrorMessage(
                'OpenAI API key not configured. Please set it in settings.',
                'Open Settings'
            ).then((selection) => {
                if (selection === 'Open Settings') {
                    vscode.commands.executeCommand('workbench.action.openSettings', 'wispr.openaiApiKey');
                }
            });
            return;
        }

        this.openai = new OpenAI({ apiKey });
    }

    async transcribeAudio(audioFilePath: string): Promise<string> {
        if (!this.openai) {
            this.initializeOpenAI();
            if (!this.openai) {
                throw new Error('OpenAI API key not configured');
            }
        }

        try {
            const config = vscode.workspace.getConfiguration('wispr');
            const language = config.get<string>('language') || 'en';

            const transcription = await this.openai.audio.transcriptions.create({
                file: fs.createReadStream(audioFilePath),
                model: 'whisper-1',
                language: language,
                response_format: 'text'
            });

            return String(transcription);
        } catch (error: any) {
            if (error.status === 401) {
                throw new Error('Invalid OpenAI API key');
            } else if (error.status === 429) {
                throw new Error('API rate limit exceeded');
            } else if (error.status === 402) {
                throw new Error('API quota exceeded');
            } else {
                throw new Error(`Transcription failed: ${error.message || error}`);
            }
        }
    }

    public reconfigureAPI() {
        this.initializeOpenAI();
    }
} 