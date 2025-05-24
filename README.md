# Wispr Voice to Text VSCode Extension

A simple and efficient voice-to-text transcription extension for Visual Studio Code using OpenAI's Whisper API.

## Features

- 🎙️ **Voice Recording**: Click the status bar microphone to start/stop recording
- 🧠 **AI Transcription**: Powered by OpenAI's Whisper-1 model via API
- 📋 **Copy to Clipboard**: Manual copy transcribed text to clipboard
- 🌍 **Multi-language**: Supports multiple languages for transcription
- ⏱️ **Auto-timeout**: Automatically stops recording after configured time (30s, 1m, 2m, 5m)
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
- Microphone access (works best in VSCode Web)

## Configuration

Before using the extension, you need to configure your OpenAI API key:

1. Go to VSCode Settings (`Cmd/Ctrl + ,`)
2. Search for "Wispr"
3. Set your OpenAI API key in `Wispr: Openai Api Key`

### Available Settings

- `wispr.openaiApiKey`: Your OpenAI API key (required)
- `wispr.language`: Language for transcription (default: "en")
- `wispr.recordingTimeout`: Maximum recording duration in seconds (default: 120)
  - Options: 30 seconds, 1 minute, 2 minutes, 5 minutes

## Usage

1. **Start Recording**: Click the microphone icon (🎤 Wispr) in the status bar
2. **Stop Recording**: Click the recording icon (🔴 Recording...) or wait for auto-timeout
3. **Copy Text**: Click "Copy to Clipboard" in the notification popup
4. **Use Anywhere**: Paste the transcribed text with `Cmd/Ctrl + V`

## Commands

- `wispr.toggleRecording`: Toggle recording on/off (only available command)

## Platform Support

- **VSCode Web**: Full support with browser MediaRecorder API (recommended)
- **Desktop VSCode**: Limited support - use VSCode Web for best experience

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

2. **"Voice recording requires running VSCode in a browser"**
   - Use VSCode Web (vscode.dev) for best recording support
   - Grant microphone permissions when prompted

3. **"Network error"**
   - Check your internet connection
   - Verify API key is valid and has sufficient credits

4. **"API rate limit exceeded"**
   - Wait a moment and try again
   - Check your OpenAI usage limits

5. **"Recording automatically stopped due to timeout"**
   - This is normal - adjust timeout in settings if needed
   - Default timeout is 2 minutes to prevent accidental long recordings

### Error Messages

- **"Failed to start recording"**: Check microphone permissions in browser
- **"Invalid OpenAI API key"**: Verify your API key in settings
- **"API quota exceeded"**: Check your OpenAI billing and usage
- **"No audio data recorded"**: Ensure microphone is working and try speaking

## Simple Workflow

1. 🎤 **Click microphone icon** → Start recording
2. 🗣️ **Speak your content** → Record your voice
3. 🔴 **Click stop or wait for timeout** → End recording
4. ⏳ **Wait for transcription** → AI processes your audio
5. 📋 **Click "Copy to Clipboard"** → Get your text
6. 📝 **Paste anywhere** → Use transcribed text

## Supported Languages

Configure language in settings for better accuracy:
- `en` - English (default)
- `es` - Spanish
- `fr` - French  
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ru` - Russian
- `ja` - Japanese
- `ko` - Korean
- `zh` - Chinese

## License

This extension is provided as-is. OpenAI API usage is subject to OpenAI's terms and pricing. 