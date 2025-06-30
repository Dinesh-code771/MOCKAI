# Mock Interview System

## Overview

The Mock Interview System is a comprehensive interview practice platform that allows students to:

- Take mock interviews with 25 pre-defined questions
- Record audio responses using their microphone
- Convert speech to text automatically
- Review their performance and track progress
- Access detailed analytics and feedback

## Features

### 🎤 Audio Recording

- **Manual Recording**: Click "Start Recording" to begin immediately
- **Auto-start**: Set a 10-second countdown for automatic recording start
- **Visual Feedback**: Animated microphone icon with recording indicator
- **Timer Display**: Real-time recording duration counter

### 📝 Speech-to-Text Conversion

- **Automatic Transcription**: Converts audio recordings to text
- **Fallback Support**: Uses browser's speech recognition if API fails
- **Mock Implementation**: Currently uses mock responses for demonstration

### 📊 Progress Tracking

- **Question Progress**: Shows current question and total completion
- **Answer Review**: Displays transcribed answers for each question
- **Category Breakdown**: Organizes questions by interview categories
- **Performance Analytics**: Tracks completion rates and scores

### 🎯 Interview Questions

The system includes 25 comprehensive interview questions across 8 categories:

1. **Introduction** - Tell me about yourself
2. **Self-Assessment** - Strengths, weaknesses, uniqueness
3. **Motivation** - Why this company, what motivates you
4. **Career Goals** - 5-year plan, career transitions
5. **Problem Solving** - Challenging situations, failures
6. **Work Style** - Stress management, leadership, criticism
7. **Professional Development** - Industry trends, ideal environment
8. **Closing** - Questions for interviewer

## How to Use

### Starting an Interview

1. Navigate to the Student Dashboard
2. Click "Start Interview" in Quick Actions or "Join" on upcoming interviews
3. Grant microphone permissions when prompted
4. Choose recording method:
   - **Manual**: Click "Start Recording"
   - **Auto-start**: Click "Auto-start in 10 seconds"

### During the Interview

1. **Read the Question**: Each question displays with its category
2. **Record Your Answer**:
   - Click "Start Recording" or wait for auto-start
   - Speak clearly into your microphone
   - Watch the animated recording indicator
   - Click "Stop Recording" when finished
3. **Review Transcription**: Your answer will be converted to text
4. **Navigate**: Use "Previous" and "Next" buttons to move between questions
5. **Re-record**: Click "Re-record" if you want to try again

### Completing the Interview

1. Answer all 25 questions (or as many as you want)
2. Click "Finish" on the last question
3. Review your completion summary
4. Click "Save Interview Results"
5. View detailed results and analytics

## Technical Implementation

### Frontend Components

- **Interview Page**: `/app/dashboard/student/interview/page.tsx`
- **Results Page**: `/app/dashboard/student/results/page.tsx`
- **API Routes**:
  - `/app/api/transcribe/route.ts` - Audio transcription
  - `/app/api/interviews/save/route.ts` - Save interview results

### Key Technologies

- **Audio Recording**: MediaRecorder API
- **Speech Recognition**: Web Speech API (fallback)
- **UI Framework**: Next.js 15 with Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React hooks (useState, useRef, useEffect)

### API Integration

#### Transcription API

```typescript
POST /api/transcribe
Content-Type: multipart/form-data

FormData:
- audio: Blob (audio file)
- questionId: string

Response:
{
  text: string,
  questionId: string,
  success: boolean
}
```

#### Save Interview API

```typescript
POST /api/interviews/save
Content-Type: application/json

Body:
{
  questions: Question[],
  completedAt: string
}

Response:
{
  success: boolean,
  interviewId: string,
  message: string
}
```

## Future Enhancements

### Real Transcription Service

Replace mock transcription with:

- OpenAI Whisper API
- Google Speech-to-Text
- Azure Speech Services
- AWS Transcribe

### Advanced Features

- **AI Feedback**: Analyze answer quality and provide suggestions
- **Interview Scoring**: Rate responses based on content and delivery
- **Practice Modes**: Different interview types (technical, behavioral, etc.)
- **Video Recording**: Add video capabilities for body language analysis
- **Peer Review**: Allow students to review each other's interviews
- **Interviewer Simulation**: AI-powered follow-up questions

### Analytics & Insights

- **Answer Quality Metrics**: Content analysis, keyword usage
- **Speaking Patterns**: Pace, clarity, filler words
- **Progress Tracking**: Improvement over time
- **Comparative Analysis**: Performance vs. other students

## Setup Instructions

1. **Install Dependencies**:

   ```bash
   cd mockAI/apps/frontend
   npm install
   ```

2. **Start Development Server**:

   ```bash
   npm run dev
   ```

3. **Access the Application**:
   - Navigate to `http://localhost:3000`
   - Login as a student
   - Go to Dashboard → Start Interview

## Browser Compatibility

- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

**Note**: Microphone permissions are required for audio recording functionality.

## Troubleshooting

### Microphone Issues

- Ensure microphone permissions are granted
- Check if microphone is working in other applications
- Try refreshing the page and granting permissions again

### Recording Problems

- Make sure you're speaking clearly and at a good volume
- Check for background noise that might interfere
- Ensure stable internet connection for API calls

### Transcription Issues

- If API fails, the system will fall back to browser speech recognition
- Clear speech and proper pronunciation improve transcription accuracy
- Longer answers may take more time to process

## Contributing

To contribute to the interview system:

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is part of the MockAI platform and follows the same licensing terms.
