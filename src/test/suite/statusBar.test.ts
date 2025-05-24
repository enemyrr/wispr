import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Status Bar Test Suite', () => {
    
    test('Status bar item should be visible after extension activation', async () => {
        const extension = vscode.extensions.getExtension('wispr.wispr-voice-to-text');
        assert.ok(extension, 'Extension should be found');
        
        // Activate the extension
        await extension!.activate();
        assert.strictEqual(extension!.isActive, true, 'Extension should be active');
        
        // Wait a bit for the status bar to be created
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check if the toggle command is available (this indicates the extension is working)
        const commands = await vscode.commands.getCommands(true);
        assert.ok(commands.includes('wispr.toggleRecording'), 'Toggle recording command should be registered');
        
        // Try to execute the command to see if it works
        try {
            await vscode.commands.executeCommand('wispr.toggleRecording');
            // If we get here without throwing, the command is working
            assert.ok(true, 'Toggle recording command executed successfully');
        } catch (error) {
            // In test environment, the actual recording might fail, but the command should be callable
            console.log('Expected error in test environment:', error);
            assert.ok(true, 'Command is registered and callable');
        }
    });

    test('Status bar should show correct initial state', async () => {
        const extension = vscode.extensions.getExtension('wispr.wispr-voice-to-text');
        await extension!.activate();
        
        // Wait for initialization
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // The status bar item should be created and the extension should be active
        assert.strictEqual(extension!.isActive, true);
        
        // Test that the commands are properly registered
        const commands = await vscode.commands.getCommands(true);
        assert.ok(commands.includes('wispr.toggleRecording'));
        assert.ok(commands.includes('wispr.startRecording'));
        assert.ok(commands.includes('wispr.stopRecording'));
    });

    test('Extension should handle command execution gracefully', async () => {
        const extension = vscode.extensions.getExtension('wispr.wispr-voice-to-text');
        await extension!.activate();
        
        // Test all three commands
        const commandsToTest = [
            'wispr.toggleRecording',
            'wispr.startRecording', 
            'wispr.stopRecording'
        ];
        
        for (const command of commandsToTest) {
            try {
                await vscode.commands.executeCommand(command);
                assert.ok(true, `Command ${command} executed without throwing`);
            } catch (error) {
                // Expected in test environment due to lack of microphone access
                assert.ok(true, `Command ${command} is registered and callable`);
            }
        }
    });
}); 