# Wispr Voice to Text VSCode Extension

A simple and efficient voice-to-text transcription extension for Visual Studio Code using OpenAI's Whisper API.

## Features

- 🎙️ **Voice Recording**: Click the status bar microphone to start/stop recording
- 🧠 **AI Transcription**: Powered by OpenAI's Whisper-1 model via API
- 📋 **Copy to Clipboard**: Easily copy transcribed text to clipboard
- 🌍 **Multi-language**: Supports multiple languages for transcription
- ⏱️ **Auto-timeout**: Automatically stops recording after configured time (30s, 1m, 2m, 5m)
- ☁️ **Cloud-based**: High accuracy with OpenAI's cloud API
- 🔧 **Simple Setup**: Just add your API key and start transcribing

## Installation

### From VSCode Marketplace

1. Open VSCode
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Wispr Voice to Text"
4. Click Install

### Manual Installation

1. Download the `.vsix` file from releases
2. Open VSCode
3. Go to Extensions view
4. Click the "..." menu and select "Install from VSIX..."
5. Select the downloaded `.vsix` file

### Development Setup

If you want to develop or modify the extension:

```bash
git clone <repository-url>
cd wispr-voice-to-text
npm install
npm run compile
```

Press F5 in VSCode to launch a new Extension Development Host window.

## Requirements

- VSCode 1.74.0 or higher
- OpenAI API key with access to Whisper API
- Internet connection for transcription
- Microphone access (works best in VSCode Web or browsers)

## Configuration

Before using the extension, you need to configure your OpenAI API key:

1. Go to VSCode Settings (`Cmd/Ctrl + ,`)
2. Search for "Wispr"
3. Set your OpenAI API key in `Wispr: Openai Api Key`

### Available Settings

- `wispr.openaiApiKey`: Your OpenAI API key (required)
- `wispr.language`: Language for transcription (default: "en")
  - Supported: en, es, fr, de, it, pt, ru, ja, ko, zh
- `wispr.recordingTimeout`: Maximum recording duration in seconds (default: 120)
  - Options: 30 seconds, 1 minute, 2 minutes, 5 minutes

## Usage

1. **Start Recording**: Click the microphone icon (🎤 Wispr) in the status bar
2. **Stop Recording**: Click the recording icon (🔴 Recording...) or wait for auto-timeout
3. **View Results**: Transcription appears in a notification popup
4. **Copy Text**: Click "Copy to Clipboard" in the notification
5. **Use Anywhere**: Paste the transcribed text with `Cmd/Ctrl + V`

## Commands

- `wispr.toggleRecording`: Toggle recording on/off
  - Available via status bar click or Command Palette

## Platform Support

- **VSCode Web**: Full support with browser MediaRecorder API (recommended)
- **Desktop VSCode**: Limited support - requires browser-like environment
- **Best Experience**: Use VSCode Web (vscode.dev) for optimal recording support

## How It Works

1. **Audio Capture**: Uses browser's MediaRecorder API to capture audio in WebM format
2. **Processing**: Saves audio to temporary file with optimized settings (16kHz, mono, noise suppression)
3. **Transcription**: Sends audio to OpenAI's Whisper-1 API for transcription
4. **Results**: Displays transcribed text with copy-to-clipboard option
5. **Cleanup**: Automatically removes temporary files

## Development

### Building

```bash
npm install
npm run compile
```

### Testing

```bash
npm run test
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

3. **"Network error" or "Transcription failed"**
   - Check your internet connection
   - Verify API key is valid and has sufficient credits
   - Check OpenAI service status

4. **"API rate limit exceeded"**
   - Wait a moment and try again
   - Check your OpenAI usage limits

5. **"Recording automatically stopped due to timeout"**
   - This is normal behavior to prevent accidental long recordings
   - Adjust timeout in settings if needed (default: 2 minutes)

### Error Messages

- **"Failed to start recording"**: Check microphone permissions in browser
- **"Invalid OpenAI API key"**: Verify your API key in settings
- **"API quota exceeded"**: Check your OpenAI billing and usage
- **"No audio data recorded"**: Ensure microphone is working and try speaking

## Workflow

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

## Technical Details

### Audio Format
- Sample Rate: 16kHz
- Channels: Mono
- Format: WebM with Opus codec
- Features: Echo cancellation, noise suppression

### API Integration
- Model: OpenAI Whisper-1
- Response Format: Plain text
- Language: Configurable per user settings

### File Handling
- Temporary files created in system temp directory
- Automatic cleanup after transcription
- Secure file naming with timestamps

## License

This extension is provided as-is. OpenAI API usage is subject to OpenAI's terms and pricing. 