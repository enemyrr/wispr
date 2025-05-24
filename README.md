# Wispr Voice to Text VSCode Extension

A smooth and simple voice-to-text transcription extension for Visual Studio Code using OpenAI's Whisper model.

## Features

- 🎙️ **Voice Recording**: Click the status bar microphone to start/stop recording
- 🧠 **AI Transcription**: Powered by OpenAI's Whisper model
- 📋 **Smart Clipboard**: Auto-copy transcribed text or manual copy options
- ⚡ **Quick Actions**: Insert text at cursor or view in new document
- 🔧 **Configurable**: Multiple language support and model options
- 🏠 **Local Mode**: Run completely offline with local Whisper installation
- ☁️ **API Mode**: Use OpenAI's cloud API for transcription

## Transcription Modes

### 🏠 Local Mode (Offline)
- **Complete Privacy**: All processing happens locally on your machine
- **No API Costs**: Free transcription using local Whisper models
- **Offline Capable**: Works without internet connection
- **Multiple Models**: Choose from tiny, base, small, medium, large, or turbo models
- **Requirements**: Python 3.8+, pip, and ffmpeg

### ☁️ API Mode (Cloud)
- **High Accuracy**: Uses OpenAI's latest Whisper API
- **Fast Processing**: Cloud-based transcription
- **No Setup**: Just add your API key
- **Requirements**: OpenAI API key and internet connection

## Installation

1. Install the extension from the VSCode marketplace
2. Open VSCode settings and search for "Wispr"
3. Configure your preferred transcription mode:

### For API Mode:
- Set your OpenAI API key in the settings

### For Local Mode:
1. **Install Python**: Make sure Python 3.8+ is installed
2. **Install ffmpeg**: 
   - macOS: `brew install ffmpeg`
   - Ubuntu/Debian: `sudo apt install ffmpeg`
   - Windows: Download from [ffmpeg.org](https://ffmpeg.org/)
3. **Install Whisper**: Use the "Install Local Whisper Dependencies" command or run:
   ```bash
   pip install -U openai-whisper
   ```
4. **Configure Python Path**: Set the correct Python path in settings if needed

## Configuration

Before using the extension, you need to configure your OpenAI API key:

1. Go to VSCode Settings (`Cmd/Ctrl + ,`)
2. Search for "Wispr"
3. Set your OpenAI API key in `Wispr: Openai Api Key`

### Available Settings

- `wispr.openaiApiKey`: Your OpenAI API key (required)
- `wispr.language`: Language for transcription (default: "en")
- `wispr.model`: Whisper model to use (default: "whisper-1")

## Usage

1. **Start Recording**: Click the microphone icon (🎤 Wispr) in the status bar
2. **Stop Recording**: Click the stop icon (⏹️ Recording...) or click again to stop
3. **View Results**: 
   - Text is automatically copied to clipboard
   - Choose to insert at cursor or view in new document
   - Notification shows when transcription is complete

## Commands

- `wispr.toggleRecording`: Toggle recording on/off
- `wispr.startRecording`: Start voice recording
- `wispr.stopRecording`: Stop voice recording

## Requirements

- VSCode 1.74.0 or higher
- OpenAI API key with access to Whisper
- Microphone access (browser permissions for VSCode Web)

## Platform Support

- **VSCode Web**: Full support with browser MediaRecorder API
- **Desktop VSCode**: Limited support (shows instructions for web usage)

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

2. **"Microphone access denied"**
   - Grant microphone permissions in your browser (for VSCode Web)
   - Check system microphone permissions

3. **"Recording not working on desktop"**
   - Use VSCode Web (vscode.dev) for best recording support
   - Desktop recording requires additional native modules

### Error Messages

- **"Failed to start recording"**: Check microphone permissions
- **"Transcription failed"**: Verify API key and internet connection
- **"No audio data recorded"**: Ensure microphone is working and try again

## Privacy

- Audio data is sent to OpenAI's Whisper API for transcription
- No audio data is stored locally after transcription
- Temporary files are automatically cleaned up

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and feature requests, please use the GitHub issue tracker. 