# Wispr Voice to Text VSCode Extension

A simple and efficient voice-to-text transcription extension for Visual Studio Code using OpenAI's Whisper API.

## Features

- 🎙️ **Voice Recording**: Click the status bar microphone to start/stop recording
- 🧠 **AI Transcription**: Powered by OpenAI's Whisper-1 model via API
- 📋 **Smart Clipboard**: Auto-copy transcribed text or manual copy options
- ⚡ **Quick Actions**: Insert text at cursor or view in new document
- 🌍 **Multi-language**: Supports multiple languages for transcription
- ☁️ **Cloud-based**: High accuracy with OpenAI's cloud API
- 🔧 **Simple Setup**: Just add your API key and start transcribing

## Installation

### Option 1: Quick Setup (Recommended)

Use the provided installation scripts for automatic setup:

**macOS/Linux:**
```bash
chmod +x install.sh
./install.sh
```

**Windows:**
```cmd
install.bat
```

### Option 2: Manual Setup

1. Install the extension from the VSCode marketplace
2. Open VSCode settings and search for "Wispr"
3. Set your OpenAI API key in the settings

### Option 3: Development Setup

If you want to develop or modify the extension:

```bash
npm install
npm run compile
```

### Requirements

- VSCode 1.74.0 or higher
- OpenAI API key with access to Whisper API
- Internet connection for transcription
- Microphone access

## Configuration

Before using the extension, you need to configure your OpenAI API key:

1. Go to VSCode Settings (`Cmd/Ctrl + ,`)
2. Search for "Wispr"
3. Set your OpenAI API key in `Wispr: Openai Api Key`

### Available Settings

- `wispr.openaiApiKey`: Your OpenAI API key (required)
- `wispr.language`: Language for transcription (default: "en")
- `wispr.skipPermissionDialog`: Skip microphone permission dialog (macOS only)
- `wispr.autoCopyToClipboard`: Automatically copy transcribed text to clipboard (default: true)

## Usage

1. **Start Recording**: Click the microphone icon (🎤 Wispr) in the status bar
2. **Stop Recording**: Click the recording icon (🔴 Recording...) or click again to stop
3. **View Results**: 
   - Text is automatically copied to clipboard (if enabled)
   - Choose to insert at cursor or view in new document
   - Notification shows the transcribed text

## Commands

- `wispr.toggleRecording`: Toggle recording on/off
- `wispr.startRecording`: Start voice recording  
- `wispr.stopRecording`: Stop voice recording
- `wispr.togglePermissionDialog`: Toggle microphone permission dialog
- `wispr.toggleAutoCopyClipboard`: Toggle auto-copy to clipboard
- `wispr.resetPermissionDialog`: Reset microphone permission dialog
- `wispr.removeInstalledModels`: Remove any previously installed local Whisper models

## Platform Support

- **VSCode Web**: Full support with browser MediaRecorder API
- **Desktop VSCode (macOS)**: Native recording support with microphone permissions
- **Desktop VSCode (Windows/Linux)**: Use VSCode Web for best experience

## Development

### Building

```bash
npm install
npm run compile
```

### Packaging

```bash
npm run vscode:prepublish
vsce package
```

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**
   - Set your API key in VSCode settings under `wispr.openaiApiKey`
   - Ensure your API key has access to Whisper API

2. **"Microphone access denied"**
   - Grant microphone permissions in your browser (for VSCode Web)
   - Check system microphone permissions (for desktop VSCode)

3. **"Network error"**
   - Check your internet connection
   - Verify API key is valid and has sufficient credits

4. **"API rate limit exceeded"**
   - Wait a moment and try again
   - Check your OpenAI usage limits

5. **"Recording not working on desktop"**
   - Try using VSCode Web (vscode.dev) for universal compatibility
   - Grant microphone permissions when prompted

### Error Messages

- **"Failed to start recording"**: Check microphone permissions
- **"Invalid OpenAI API key"**: Verify your API key in settings
- **"OpenAI API quota exceeded"**: Check your OpenAI billing and usage
- **"No audio data recorded"**: Ensure microphone is working and try again

## Migration from Local Mode

If you previously used local Whisper models, you can:
1. Run the "Remove Installed Whisper Models" command to clean up local installations
2. Your transcription will now use the high-quality OpenAI API instead
3. No more local setup or maintenance required

## License

This extension is provided as-is. OpenAI API usage is subject to OpenAI's terms and pricing. 