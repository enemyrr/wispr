# Wispr Voice to Text - Usage Guide

## Quick Start

1. **Install and Configure**
   - Install the extension
   - Set your OpenAI API key: `Cmd/Ctrl + ,` → Search "Wispr" → Set API key

2. **Start Recording**
   - Look for the 🎤 Wispr icon in the status bar (bottom right)
   - Click the icon to start recording
   - The icon changes to ⏹️ Recording... with orange background

3. **Stop and Transcribe**
   - Click the recording icon again to stop
   - Wait for "Transcribing audio..." progress notification
   - Choose your preferred action when transcription completes

## Status Bar States

| Icon | State | Description |
|------|-------|-------------|
| 🎤 Wispr | Ready | Click to start recording |
| ⏹️ Recording... | Active | Currently recording, click to stop |

## Output Options

When transcription completes, you'll see a notification with options:

### 1. Automatic Clipboard Copy
- Text is **automatically copied** to your clipboard
- Paste anywhere with `Cmd/Ctrl + V`

### 2. Insert at Cursor
- Click "Insert at Cursor" to add text where your cursor is
- Perfect for adding voice notes to documents or code comments

### 3. Show Full Text
- Click "Show Full Text" to open transcription in a new document
- Useful for longer transcriptions or when you want to edit first

## Best Practices

### Recording Tips
- **Speak clearly** and at moderate pace
- **Minimize background noise** when possible
- **Keep recordings under 2 minutes** for best performance
- **Use good microphone** if available

### Language Settings
Configure language in settings for better accuracy:
```
"wispr.language": "en"  // English (default)
"wispr.language": "es"  // Spanish
"wispr.language": "fr"  // French
"wispr.language": "de"  // German
```

### Common Use Cases

#### 1. Code Comments
```typescript
// Start recording, say: "This function calculates the factorial of a number"
function factorial(n: number): number {
    // Transcribed: This function calculates the factorial of a number
    return n <= 1 ? 1 : n * factorial(n - 1);
}
```

#### 2. Documentation
Record explanations for complex logic and insert into markdown files.

#### 3. Meeting Notes
Quickly capture voice notes during calls and meetings.

#### 4. Todo Items
Voice-record tasks and insert them into your task management system.

## Keyboard Shortcuts

While there are no default keyboard shortcuts, you can add them:

1. Go to `Cmd/Ctrl + K, Cmd/Ctrl + S` (Keyboard Shortcuts)
2. Search for "wispr"
3. Add shortcuts for:
   - `wispr.toggleRecording`
   - `wispr.startRecording`
   - `wispr.stopRecording`

Example shortcut: `Cmd/Ctrl + Shift + V` for toggle recording

## Command Palette

Access commands via `Cmd/Ctrl + Shift + P`:
- `Wispr: Toggle Voice Recording`
- `Wispr: Start Voice Recording`
- `Wispr: Stop Voice Recording`

## Configuration Examples

### Minimal Setup
```json
{
    "wispr.openaiApiKey": "your-api-key-here"
}
```

### Full Configuration
```json
{
    "wispr.openaiApiKey": "your-api-key-here",
    "wispr.language": "en",
    "wispr.model": "whisper-1"
}
```

## Workflow Examples

### 1. Developer Workflow
1. 🎤 Click to record
2. 🗣️ "Add error handling for null values in the user input validation"
3. ⏹️ Click to stop
4. ✏️ Click "Insert at Cursor"
5. ✅ Edit and refine the inserted comment

### 2. Writer Workflow
1. 🎤 Start recording
2. 🗣️ Speak your thoughts or draft
3. ⏹️ Stop recording
4. 📄 Click "Show Full Text"
5. ✏️ Edit in the new document
6. 📋 Copy refined text to your main document

### 3. Meeting Notes Workflow
1. 🎤 Quick record during meeting
2. 🗣️ "Action item: Review the quarterly budget proposals by Friday"
3. ⏹️ Stop and auto-copy to clipboard
4. 📝 Paste into your notes app or task manager

## Troubleshooting Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| No microphone access | Grant permissions in browser settings |
| API key error | Check settings → `wispr.openaiApiKey` |
| Poor transcription | Speak more clearly, check language setting |
| Extension not visible | Look for 🎤 in status bar, restart VSCode if needed |

## Pro Tips

- **Use in VSCode Web** (vscode.dev) for best recording support
- **Keep API key secure** - don't share in public repositories
- **Test with short recordings** first to verify setup
- **Use descriptive language** - Whisper understands context well
- **Pause between sentences** for better accuracy 