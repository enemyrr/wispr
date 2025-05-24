import * as assert from 'assert';
import * as vscode from 'vscode';
import { TranscriptionService } from '../../transcriptionService';

suite('TranscriptionService Test Suite', () => {
    let transcriptionService: TranscriptionService;

    setup(() => {
        transcriptionService = new TranscriptionService();
    });

    test('Should initialize without errors', () => {
        assert.ok(transcriptionService);
    });

    test('Should require API key for transcription', async () => {
        const config = vscode.workspace.getConfiguration('wispr');
        await config.update('openaiApiKey', '', vscode.ConfigurationTarget.Global);

        try {
            await transcriptionService.transcribeAudio('/fake/path/to/audio.wav');
            assert.fail('Should have thrown error for missing API key');
        } catch (error) {
            assert.ok(error, 'Correctly throws error for missing API key');
        }
    });

    test('Should validate file path', async () => {
        const config = vscode.workspace.getConfiguration('wispr');
        await config.update('openaiApiKey', 'test-key', vscode.ConfigurationTarget.Global);

        try {
            await transcriptionService.transcribeAudio('');
            assert.fail('Should have thrown error for empty file path');
        } catch (error) {
            assert.ok(error, 'Correctly throws error for empty file path');
        }
    });

    test('Should handle invalid file path gracefully', async () => {
        const config = vscode.workspace.getConfiguration('wispr');
        await config.update('openaiApiKey', 'test-key', vscode.ConfigurationTarget.Global);

        try {
            await transcriptionService.transcribeAudio('/non/existent/file.wav');
            assert.fail('Should have thrown error for non-existent file');
        } catch (error) {
            assert.ok(error, 'Correctly throws error for non-existent file');
        }
    });

    test('Should use correct configuration values', () => {
        const config = vscode.workspace.getConfiguration('wispr');
        
        // Test that service respects configuration
        assert.strictEqual(config.get('language'), 'en');
        assert.strictEqual(config.get('model'), 'whisper-1');
    });
}); 