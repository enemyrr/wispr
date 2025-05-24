# Wispr Voice to Text - Usage Guide

## Quick Start

1. **Install and Configure**
   - Install the extension
   - Set your OpenAI API key: `Cmd/Ctrl + ,` → Search "Wispr" → Set API key

2. **Start Recording**
   - Look for the 🎤 Wispr icon in the status bar (bottom right)
   - Click the icon to start recording
   - The icon changes to 🔴 Recording... with orange background

3. **Stop and Transcribe**
   - Click the recording icon again to stop (or wait for auto-timeout)
   - Wait for "Transcribing audio..." progress notification
   - Click "Copy to Clipboard" when transcription completes

## Status Bar States

| Icon | State | Description |
|------|-------|-------------|
| 🎤 Wispr | Ready | Click to start recording |
| 🔴 Recording... | Active | Currently recording, click to stop |

## Simple Workflow

When transcription completes, you'll see a notification with the transcribed text:

### Copy to Clipboard
- Click "Copy to Clipboard" to copy the transcribed text
- Paste anywhere with `Cmd/Ctrl + V`
- Perfect for using voice input in any application

## Configuration

### Recording Timeout
Set maximum recording duration to prevent accidental long recordings:
```json
{
    "wispr.recordingTimeout": 120  // 2 minutes (default)
}
```

Available options:
- `30` - 30 seconds
- `60` - 1 minute  
- `120` - 2 minutes (default)
- `300` - 5 minutes

### Language Settings
Configure language for better transcription accuracy:
```json
{
    "wispr.language": "en"  // English (default)
}
```

Supported languages:
- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ru` - Russian
- `ja` - Japanese
- `ko` - Korean
- `zh` - Chinese

## Best Practices

### Recording Tips
- **Speak clearly** and at moderate pace
- **Minimize background noise** when possible
- **Keep recordings under 2 minutes** (default timeout)
- **Use VSCode Web** (vscode.dev) for best recording support
- **Grant microphone permissions** when prompted

### Common Use Cases

#### 1. Quick Voice Notes
```
1. 🎤 Click to record
2. 🗣️ "Remember to update the API documentation before the release"
3. 🔴 Click to stop
4. 📋 Click "Copy to Clipboard"
5. 📝 Paste into your notes app or todo list
```

#### 2. Code Comments
```
1. 🎤 Start recording
2. 🗣️ "This function validates user input and returns sanitized data"
3. 🔴 Stop recording
4. 📋 Copy to clipboard
5. 📝 Paste as comment in your code
```

#### 3. Documentation
```
1. 🎤 Record explanation
2. 🗣️ Describe complex logic or process
3. 📋 Copy transcribed text
4. 📝 Paste into documentation or README
```

## Keyboard Shortcuts

Add custom keyboard shortcuts for quick access:

1. Go to `Cmd/Ctrl + K, Cmd/Ctrl + S` (Keyboard Shortcuts)
2. Search for "wispr"
3. Add shortcut for `wispr.toggleRecording`

Example: Set `Cmd/Ctrl + Shift + V` for toggle recording

## Command Palette

Access via `Cmd/Ctrl + Shift + P`:
- `Wispr: Toggle Voice Recording`

## Configuration Examples

### Minimal Setup
```json
{
    "wispr.openaiApiKey": "your-api-key-here"
}
```

### Complete Configuration
```json
{
    "wispr.openaiApiKey": "your-api-key-here",
    "wispr.language": "en",
    "wispr.recordingTimeout": 120
}
```

## Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| Extension not visible | Look for 🎤 in status bar, restart VSCode |
| No microphone access | Use VSCode Web, grant browser permissions |
| API key error | Check `wispr.openaiApiKey` in settings |
| Poor transcription | Speak clearly, check language setting |
| Recording stops early | Check timeout setting, default is 2 minutes |

### Platform Recommendations

- **Best experience**: Use VSCode Web (vscode.dev)
- **Desktop VSCode**: Limited recording support, use web version
- **Browser permissions**: Grant microphone access when prompted

## Pro Tips

- **Use VSCode Web** for universal microphone support
- **Test with short recordings** to verify setup  
- **Speak descriptively** - Whisper understands context well
- **Pause between sentences** for better accuracy
- **Keep API key secure** - don't commit to repositories
- **Monitor usage** - Check OpenAI billing for API costs

## Quick Reference

### Essential Steps
1. 🎤 **Click** → Start recording
2. 🗣️ **Speak** → Record your voice  
3. 🔴 **Click/Wait** → Stop recording
4. 📋 **Copy** → Get transcribed text
5. 📝 **Paste** → Use anywhere

### Settings to Configure
- `wispr.openaiApiKey` - Required for transcription
- `wispr.language` - For better accuracy in your language
- `wispr.recordingTimeout` - Prevent accidental long recordings

### Requirements
- OpenAI API key with Whisper access
- Internet connection for transcription
- Microphone access (works best in browser) 