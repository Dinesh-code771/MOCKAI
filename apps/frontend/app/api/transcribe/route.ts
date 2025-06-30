import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('Transcription API called');

  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const questionId = formData.get('questionId') as string;

    console.log('Received audio file:', audioFile ? 'Yes' : 'No');
    console.log('Question ID:', questionId);

    if (!audioFile) {
      console.log('No audio file provided');
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 },
      );
    }

    console.log('Audio file size:', audioFile.size);
    console.log('Audio file type:', audioFile.type);

    // For now, we'll use a mock transcription service
    // In a real implementation, you would integrate with services like:
    // - OpenAI Whisper API
    // - Google Speech-to-Text
    // - Azure Speech Services
    // - AWS Transcribe

    console.log('Starting mock transcription...');
    const mockTranscription = await mockTranscribeAudio(audioFile, questionId);
    console.log('Mock transcription completed:', mockTranscription);

    return NextResponse.json({
      text: mockTranscription,
      questionId: questionId,
      success: true,
    });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      {
        error: 'Failed to transcribe audio',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

async function mockTranscribeAudio(
  audioFile: File,
  questionId: string,
): Promise<string> {
  // This is a mock implementation
  // In a real app, you would send the audio file to a transcription service

  const mockAnswers = [
    'I am a passionate software developer with 3 years of experience in web development.',
    'My greatest strengths include problem-solving, attention to detail, and strong communication skills.',
    "I sometimes struggle with perfectionism, but I'm working on finding the right balance.",
    "I'm excited about this company's innovative approach and the opportunity to work on meaningful projects.",
    'In 5 years, I see myself as a senior developer leading technical initiatives and mentoring junior developers.',
    "I'm looking for new challenges and opportunities to grow in my career.",
    'I once had to debug a critical production issue under pressure, and I learned the importance of systematic troubleshooting.',
    'I handle stress by breaking down problems into smaller tasks and maintaining open communication with my team.',
    'My leadership style is collaborative - I believe in empowering team members and leading by example.',
    'I welcome constructive criticism as it helps me improve and grow professionally.',
    'I once missed a deadline due to poor estimation, but I learned to build in buffer time and communicate early about potential delays.',
    "I'm looking for a competitive salary that reflects my experience and the value I can bring to the team.",
    "I'd like to know more about the team structure and opportunities for professional development.",
    'I stay updated through online courses, tech blogs, and participating in developer communities.',
    'I prefer a collaborative environment where team members support each other and share knowledge.',
    'I use tools like Trello and time-blocking to prioritize tasks and ensure nothing falls through the cracks.',
    "I'm motivated by solving complex problems and seeing the impact of my work on users.",
    'I address conflicts by having open, honest conversations and finding common ground.',
    'I enjoy hiking, reading tech books, and contributing to open-source projects.',
    'I ensure quality through thorough testing, code reviews, and following best practices.',
    "I led a project that improved our application's performance by 40% through optimization.",
    'I adapt to change by staying flexible, asking questions, and focusing on the end goal.',
    "I've researched your company's mission, products, and recent achievements in the industry.",
    'I handle tight deadlines by prioritizing effectively and communicating progress regularly.',
    'My unique combination of technical skills and strong interpersonal abilities sets me apart.',
  ];

  // Simulate processing time
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 2000),
  );

  // Return a random mock answer based on question ID
  const questionIndex = parseInt(questionId) - 1;
  return (
    mockAnswers[questionIndex] ||
    'I would need to think about this question and provide a thoughtful response.'
  );
}
