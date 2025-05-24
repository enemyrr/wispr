# Change Log

All notable changes to the "Wispr Voice to Text" extension will be documented in this file.

## [0.0.1] - 2024-01-XX

### Added
- Initial release of Wispr Voice to Text extension
- Status bar integration with microphone icon
- One-click voice recording toggle
- OpenAI Whisper integration for speech-to-text transcription
- Automatic clipboard copying of transcribed text
- Option to insert transcribed text at cursor position
- Option to open transcribed text in new document
- Real-time recording status indication in status bar
- Configuration options for:
  - OpenAI API key
  - Language selection
  - Whisper model selection
- Support for VSCode Web with MediaRecorder API
- Proper error handling and user feedback
- Progress indication during transcription
- Automatic cleanup of temporary audio files

### Features
- **Quick Access**: Status bar button for instant recording
- **Smart Output**: Multiple options for using transcribed text
- **Visual Feedback**: Clear indication of recording state
- **Configurable**: Customizable settings for different use cases
- **Privacy Focused**: No permanent storage of audio data

### Technical
- Built with TypeScript
- Uses OpenAI Node.js SDK
- Supports both web and desktop VSCode environments
- Event-driven architecture for clean separation of concerns
- Comprehensive error handling and logging 