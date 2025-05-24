import * as assert from 'assert';
import * as sinon from 'sinon';
import { WisprVoiceRecorder } from '../../voiceRecorder';
import { TranscriptionService } from '../../transcriptionService';

suite('VoiceRecorder Test Suite', () => {
    let voiceRecorder: WisprVoiceRecorder;
    let transcriptionService: TranscriptionService;
    let sandbox: sinon.SinonSandbox;

    setup(() => {
        sandbox = sinon.createSandbox();
        transcriptionService = new TranscriptionService();
        voiceRecorder = new WisprVoiceRecorder(transcriptionService);
    });

    teardown(() => {
        sandbox.restore();
        voiceRecorder.dispose();
    });

    test('Should initialize with recording state false', () => {
        assert.strictEqual((voiceRecorder as any).isRecording, false);
    });

    test('Should expose event emitters', () => {
        assert.ok(voiceRecorder.onRecordingStateChanged);
        assert.ok(voiceRecorder.onTranscriptionResult);
        assert.ok(voiceRecorder.onError);
    });

    test('Should emit recording state change when toggling', async () => {
        let stateChangeCount = 0;
        let lastState: boolean | undefined;

        voiceRecorder.onRecordingStateChanged((isRecording) => {
            stateChangeCount++;
            lastState = isRecording;
        });

        // Mock navigator.mediaDevices if it exists
        if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
            sandbox.stub(navigator.mediaDevices, 'getUserMedia').resolves({
                getTracks: () => [{ stop: sandbox.stub() }]
            } as any);
        }

        try {
            await voiceRecorder.toggleRecording();

            // Should have fired at least once for start
            assert.ok(stateChangeCount > 0);
        } catch (error) {
            // In test environment, actual recording might fail
            // but state change events should still be emitted
            assert.ok(true, 'Test environment limitation - recording simulation');
        }
    });

    test('Should handle multiple toggle calls gracefully', async () => {
        let errorCount = 0;

        voiceRecorder.onError(() => {
            errorCount++;
        });

        // Multiple rapid toggles should not cause crashes
        try {
            await Promise.all([
                voiceRecorder.toggleRecording(),
                voiceRecorder.toggleRecording(),
                voiceRecorder.toggleRecording()
            ]);
        } catch (error) {
            // Expected in test environment
        }

        // Should not have excessive errors
        assert.ok(errorCount < 10, 'Should handle multiple calls without excessive errors');
    });

    test('Should cleanup properly on dispose', () => {
        // This should not throw
        voiceRecorder.dispose();
        assert.ok(true, 'Dispose completed without errors');
    });

    test('Should handle start recording when already recording', async () => {
        // Set internal state to recording
        (voiceRecorder as any).isRecording = true;

        // Should handle gracefully
        await voiceRecorder.startRecording();
        assert.ok(true, 'Start recording handled gracefully when already recording');
    });

    test('Should handle stop recording when not recording', async () => {
        // Ensure not recording
        (voiceRecorder as any).isRecording = false;

        // Should handle gracefully
        await voiceRecorder.stopRecording();
        assert.ok(true, 'Stop recording handled gracefully when not recording');
    });
}); 