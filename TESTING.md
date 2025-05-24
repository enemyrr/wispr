# Testing Guide for Wispr Voice to Text Extension

## Overview

This extension includes comprehensive tests to ensure all functionality works correctly. The tests cover:

- Extension activation and deactivation
- Status bar functionality
- Voice recording features
- Transcription service
- Command registration and execution
- Configuration handling

## Running Tests

### Prerequisites

1. Ensure all dependencies are installed:
   ```bash
   npm install
   ```

2. Compile the TypeScript code:
   ```bash
   npm run compile
   ```

### Running Tests from Command Line

```bash
npm test
```

### Running Tests in VS Code

1. Open the project in VS Code
2. Press `F5` or go to Run and Debug
3. Select "Extension Tests" from the dropdown
4. Click the play button

### Running Individual Test Suites

You can run specific test suites by using the VS Code Test Explorer or by modifying the test runner.

## Test Structure

```
src/test/
├── runTest.ts              # Test runner entry point
└── suite/
    ├── index.ts            # Test suite configuration
    ├── extension.test.ts   # Main extension tests
    ├── voiceRecorder.test.ts # Voice recorder unit tests
    ├── transcriptionService.test.ts # Transcription service tests
    └── statusBar.test.ts   # Status bar specific tests
```

## Test Categories

### 1. Extension Tests (`extension.test.ts`)
- Extension presence and activation
- Command registration
- Configuration handling
- Error handling for missing API keys

### 2. Voice Recorder Tests (`voiceRecorder.test.ts`)
- Recording state management
- Event emission
- Error handling
- Cleanup and disposal

### 3. Transcription Service Tests (`transcriptionService.test.ts`)
- API key validation
- File path validation
- Configuration usage
- Error handling

### 4. Status Bar Tests (`statusBar.test.ts`)
- Status bar visibility
- Command execution
- State updates

## Debugging Tests

### Common Issues

1. **Status Bar Not Visible**: 
   - Check console output for initialization messages
   - Verify extension activation events
   - Ensure commands are properly registered

2. **Recording Tests Failing**:
   - Expected in test environment due to lack of microphone access
   - Tests should verify graceful error handling

3. **API Key Tests**:
   - Tests use mock API keys
   - Verify configuration updates work correctly

### Debug Configuration

The project includes debug configurations in `.vscode/launch.json`:

- **Run Extension**: Launches the extension in a new VS Code window
- **Extension Tests**: Runs the test suite with debugging enabled

### Console Logging

The extension includes console logging for debugging:

```typescript
console.log('Status bar item created and shown');
console.log(`Status bar updated: ${statusBarItem.text}`);
```

Check the Developer Console (Help > Toggle Developer Tools) for these messages.

## Test Environment Limitations

- **Microphone Access**: Tests run in a headless environment without microphone access
- **Navigator API**: Some browser APIs may not be available in the test environment
- **File System**: Temporary file operations may behave differently

## Continuous Integration

To set up CI/CD:

1. Add test script to your CI configuration
2. Ensure VS Code test environment is available
3. Run tests with: `npm run test`

## Writing New Tests

### Test Structure

```typescript
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Your Test Suite', () => {
    setup(() => {
        // Setup code before each test
    });

    teardown(() => {
        // Cleanup code after each test
    });

    test('Your test description', async () => {
        // Test implementation
        assert.ok(true, 'Test passed');
    });
});
```

### Best Practices

1. Use descriptive test names
2. Test both success and error cases
3. Mock external dependencies
4. Clean up resources in teardown
5. Use async/await for asynchronous operations
6. Verify both positive and negative scenarios

## Troubleshooting

### Extension Not Found
If tests fail with "Extension not found":
1. Check the extension ID in `package.json`
2. Ensure the extension is properly compiled
3. Verify the test is looking for the correct extension ID

### Command Not Registered
If command tests fail:
1. Check that commands are registered in `package.json`
2. Verify the extension activation
3. Ensure command handlers are properly bound

### Status Bar Issues
If status bar tests fail:
1. Check console for initialization messages
2. Verify the status bar item is created
3. Ensure proper disposal in deactivate function 