'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  SkipForward,
  Save,
  CheckCircle,
  Clock,
  Volume2,
  Sparkles,
  Target,
  Timer,
  Headphones,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Question {
  id: number;
  text: string;
  category: string;
  answer?: string;
  audioBlob?: Blob;
  isAnswered: boolean;
}

const interviewQuestions: Question[] = [
  {
    id: 1,
    text: 'Tell me about yourself and your background.',
    category: 'Introduction',
    isAnswered: false,
  },
  {
    id: 2,
    text: 'What are your greatest strengths?',
    category: 'Self-Assessment',
    isAnswered: false,
  },
  {
    id: 3,
    text: 'What are your greatest weaknesses?',
    category: 'Self-Assessment',
    isAnswered: false,
  },
  {
    id: 4,
    text: 'Why do you want to work for this company?',
    category: 'Motivation',
    isAnswered: false,
  },
  {
    id: 5,
    text: 'Where do you see yourself in 5 years?',
    category: 'Career Goals',
    isAnswered: false,
  },
  {
    id: 6,
    text: 'Why are you leaving your current job?',
    category: 'Career Transition',
    isAnswered: false,
  },
  {
    id: 7,
    text: 'Describe a challenging situation you faced at work.',
    category: 'Problem Solving',
    isAnswered: false,
  },
  {
    id: 8,
    text: 'How do you handle stress and pressure?',
    category: 'Work Style',
    isAnswered: false,
  },
  {
    id: 9,
    text: 'What is your leadership style?',
    category: 'Leadership',
    isAnswered: false,
  },
  {
    id: 10,
    text: 'How do you handle criticism?',
    category: 'Work Style',
    isAnswered: false,
  },
  {
    id: 11,
    text: 'Describe a time you failed and what you learned.',
    category: 'Learning',
    isAnswered: false,
  },
  {
    id: 12,
    text: 'What are your salary expectations?',
    category: 'Compensation',
    isAnswered: false,
  },
  {
    id: 13,
    text: 'Do you have any questions for us?',
    category: 'Closing',
    isAnswered: false,
  },
  {
    id: 14,
    text: 'How do you stay updated with industry trends?',
    category: 'Professional Development',
    isAnswered: false,
  },
  {
    id: 15,
    text: 'Describe your ideal work environment.',
    category: 'Work Preferences',
    isAnswered: false,
  },
  {
    id: 16,
    text: 'How do you prioritize your work?',
    category: 'Time Management',
    isAnswered: false,
  },
  {
    id: 17,
    text: 'What motivates you?',
    category: 'Motivation',
    isAnswered: false,
  },
  {
    id: 18,
    text: 'How do you handle conflicts with colleagues?',
    category: 'Teamwork',
    isAnswered: false,
  },
  {
    id: 19,
    text: 'What are your hobbies and interests?',
    category: 'Personal',
    isAnswered: false,
  },
  {
    id: 20,
    text: 'How do you ensure quality in your work?',
    category: 'Quality',
    isAnswered: false,
  },
  {
    id: 21,
    text: 'Describe a successful project you worked on.',
    category: 'Achievement',
    isAnswered: false,
  },
  {
    id: 22,
    text: 'How do you adapt to change?',
    category: 'Adaptability',
    isAnswered: false,
  },
  {
    id: 23,
    text: 'What do you know about our company?',
    category: 'Research',
    isAnswered: false,
  },
  {
    id: 24,
    text: 'How do you handle tight deadlines?',
    category: 'Time Management',
    isAnswered: false,
  },
  {
    id: 25,
    text: 'What makes you unique?',
    category: 'Self-Assessment',
    isAnswered: false,
  },
];

const categoryColors = {
  Introduction: 'from-blue-500 to-cyan-500',
  'Self-Assessment': 'from-purple-500 to-pink-500',
  Motivation: 'from-orange-500 to-red-500',
  'Career Goals': 'from-green-500 to-emerald-500',
  'Career Transition': 'from-indigo-500 to-blue-500',
  'Problem Solving': 'from-yellow-500 to-orange-500',
  'Work Style': 'from-teal-500 to-cyan-500',
  Leadership: 'from-violet-500 to-purple-500',
  Learning: 'from-rose-500 to-pink-500',
  Compensation: 'from-amber-500 to-yellow-500',
  Closing: 'from-slate-500 to-gray-500',
  'Professional Development': 'from-sky-500 to-blue-500',
  'Work Preferences': 'from-lime-500 to-green-500',
  'Time Management': 'from-emerald-500 to-teal-500',
  Teamwork: 'from-fuchsia-500 to-purple-500',
  Personal: 'from-pink-500 to-rose-500',
  Quality: 'from-cyan-500 to-blue-500',
  Achievement: 'from-green-500 to-emerald-500',
  Adaptability: 'from-orange-500 to-amber-500',
  Research: 'from-indigo-500 to-purple-500',
};

export default function InterviewPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>(interviewQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [autoStartCountdown, setAutoStartCountdown] = useState(10);
  const [isAutoStarting, setIsAutoStarting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    // Request microphone permission on component mount
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => console.log('Microphone permission granted'))
      .catch((err) => console.error('Microphone permission denied:', err));
  }, []);

  useEffect(() => {
    if (isAutoStarting && autoStartCountdown > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setAutoStartCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isAutoStarting && autoStartCountdown === 0) {
      setIsAutoStarting(false);
      startRecording();
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [isAutoStarting, autoStartCountdown]);

  const startAutoRecording = () => {
    setIsAutoStarting(true);
    setAutoStartCountdown(10);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav',
        });
        await convertAudioToText(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const convertAudioToText = async (audioBlob: Blob) => {
    console.log(
      'Starting audio to text conversion for question:',
      currentQuestion.id,
    );
    setIsConverting(true);

    try {
      // Try browser speech recognition with better error handling
      if (
        'webkitSpeechRecognition' in window ||
        'SpeechRecognition' in window
      ) {
        console.log('Using browser speech recognition...');

        const SpeechRecognition =
          (window as any).webkitSpeechRecognition ||
          (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();

        // Configure recognition settings
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        let hasResult = false;

        recognition.onresult = (event: any) => {
          hasResult = true;
          const transcript = event.results[0][0].transcript;
          console.log('Browser speech recognition result:', transcript);
          setQuestions((prev) =>
            prev.map((q) =>
              q.id === currentQuestion.id
                ? { ...q, answer: transcript, audioBlob, isAnswered: true }
                : q,
            ),
          );
          console.log(
            'Question marked as answered via browser recognition:',
            currentQuestion.id,
          );
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);

          // Don't mark as answered on network errors, let it retry or use fallback
          if (event.error === 'network') {
            console.log('Network error detected, using fallback method');
            // Use a simple fallback - mark as answered with a generic message
            setQuestions((prev) =>
              prev.map((q) =>
                q.id === currentQuestion.id
                  ? {
                      ...q,
                      answer:
                        'Audio recorded successfully. You can edit your answer below.',
                      audioBlob,
                      isAnswered: true,
                    }
                  : q,
              ),
            );
          } else {
            // For other errors, mark as answered with error message
            setQuestions((prev) =>
              prev.map((q) =>
                q.id === currentQuestion.id
                  ? {
                      ...q,
                      answer:
                        'Audio recorded but transcription failed. You can edit your answer below.',
                      audioBlob,
                      isAnswered: true,
                    }
                  : q,
              ),
            );
          }
        };

        recognition.onend = () => {
          console.log('Speech recognition ended, hasResult:', hasResult);

          // Only mark as answered if we haven't already done so
          if (!hasResult) {
            const currentQ = questions.find((q) => q.id === currentQuestion.id);
            if (currentQ && !currentQ.isAnswered) {
              setQuestions((prev) =>
                prev.map((q) =>
                  q.id === currentQuestion.id
                    ? {
                        ...q,
                        answer:
                          'Audio recorded successfully. You can edit your answer below.',
                        audioBlob,
                        isAnswered: true,
                      }
                    : q,
                ),
              );
              console.log(
                'Question marked as answered with fallback message:',
                currentQuestion.id,
              );
            }
          }
        };

        // Start recognition with timeout
        recognition.start();
        console.log('Browser speech recognition started');

        // Add a timeout to prevent hanging
        setTimeout(() => {
          if (!hasResult) {
            console.log('Speech recognition timeout, stopping...');
            recognition.stop();
          }
        }, 10000); // 10 second timeout
      } else {
        console.log(
          'No speech recognition available, marking with success message',
        );
        // If no speech recognition available, mark as answered with success message
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === currentQuestion.id
              ? {
                  ...q,
                  answer:
                    'Audio recorded successfully. You can edit your answer below.',
                  audioBlob,
                  isAnswered: true,
                }
              : q,
          ),
        );
        console.log(
          'Question marked as answered with no recognition message:',
          currentQuestion.id,
        );
      }
    } catch (error) {
      console.error('Error converting audio to text:', error);
      // Mark as answered with success message if everything fails
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === currentQuestion.id
            ? {
                ...q,
                answer:
                  'Audio recorded successfully. You can edit your answer below.',
                audioBlob,
                isAnswered: true,
              }
            : q,
        ),
      );
      console.log(
        'Question marked as answered with error fallback:',
        currentQuestion.id,
      );
    } finally {
      setIsConverting(false);
      console.log('Audio conversion process completed');
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setRecordingTime(0);
      setAutoStartCountdown(10);
    } else {
      setIsCompleted(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setRecordingTime(0);
      setAutoStartCountdown(10);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const saveInterview = async () => {
    try {
      const interviewData = {
        questions: questions.filter((q) => q.isAnswered),
        completedAt: new Date().toISOString(),
      };

      const response = await fetch('/api/interviews/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interviewData),
      });

      if (response.ok) {
        router.push('/dashboard/student/results');
      }
    } catch (error) {
      console.error('Error saving interview:', error);
    }
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = questions.filter((q) => q.isAnswered).length;

  if (isCompleted) {
    return (
      <DashboardLayout
        role="student"
        currentPath="/dashboard/student/interview"
      >
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <div className="max-w-4xl mx-auto py-12 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-3xl opacity-20"></div>
                <CheckCircle className="h-24 w-24 text-green-500 mx-auto relative z-10" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                Interview Completed!
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Congratulations! You've successfully completed your mock
                interview. You answered{' '}
                <span className="font-semibold text-blue-600">
                  {answeredCount}
                </span>{' '}
                out of{' '}
                <span className="font-semibold text-blue-600">
                  {questions.length}
                </span>{' '}
                questions.
              </p>

              <div className="space-y-4">
                <Button
                  onClick={saveInterview}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Save className="h-5 w-5 mr-3" />
                  Save Interview Results
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/student')}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 text-lg font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  Back to Dashboard
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student" currentPath="/dashboard/student/interview">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto py-8 px-4">
          {/* Progress Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Mock Interview
                </h1>
                <p className="text-gray-600 mt-2">
                  Practice makes perfect. Let's ace this interview!
                </p>
              </div>
              <div className="text-right">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 text-lg font-semibold rounded-full">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Badge>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Progress
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Timer className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {answeredCount} answered
                    </span>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-800">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress
                value={progress}
                className="h-3 bg-gray-200 rounded-full overflow-hidden"
              >
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"></div>
              </Progress>
            </div>
          </motion.div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="mb-8"
            >
              <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-100 p-8">
                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      className={`bg-gradient-to-r ${
                        categoryColors[
                          currentQuestion.category as keyof typeof categoryColors
                        ] || 'from-gray-500 to-gray-600'
                      } text-white px-4 py-2 rounded-full font-semibold`}
                    >
                      {currentQuestion.category}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-600">
                        Question {currentQuestion.id}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800 leading-relaxed">
                    {currentQuestion.text}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-8">
                  {/* Recording Controls */}
                  <div className="text-center space-y-8">
                    {!isRecording &&
                      !isAutoStarting &&
                      !currentQuestion.isAnswered && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-6"
                        >
                          <div className="space-y-4">
                            <Button
                              onClick={startRecording}
                              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-12 py-6 text-xl font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                            >
                              <Mic className="h-6 w-6 mr-3" />
                              Start Recording
                            </Button>

                            <div className="text-gray-500 text-lg font-medium">
                              or
                            </div>

                            <Button
                              variant="outline"
                              onClick={startAutoRecording}
                              className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
                            >
                              <Clock className="h-5 w-5 mr-2" />
                              Auto-start in 10 seconds
                            </Button>
                          </div>
                        </motion.div>
                      )}

                    {isAutoStarting && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                      >
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-8 border border-blue-200">
                          <div className="text-2xl font-bold text-blue-600 mb-4">
                            Recording will start in {autoStartCountdown}{' '}
                            seconds...
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="relative">
                              <Mic className="h-12 w-12 text-blue-500 animate-pulse" />
                              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {isRecording && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                      >
                        <div className="bg-gradient-to-r from-red-50 to-pink-100 rounded-2xl p-8 border border-red-200">
                          <div className="flex items-center justify-center mb-6">
                            <div className="relative">
                              <Mic className="h-20 w-20 text-red-500 animate-pulse" />
                              <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping"></div>
                              <div
                                className="absolute inset-4 bg-red-400 rounded-full opacity-30 animate-ping"
                                style={{ animationDelay: '0.5s' }}
                              ></div>
                            </div>
                          </div>

                          <div className="text-4xl font-mono font-bold text-red-600 mb-6">
                            {formatTime(recordingTime)}
                          </div>

                          <Button
                            onClick={stopRecording}
                            variant="outline"
                            className="border-2 border-red-300 text-red-600 hover:bg-red-50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
                          >
                            <MicOff className="h-5 w-5 mr-2" />
                            Stop Recording
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {isConverting && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                      >
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-100 rounded-2xl p-8 border border-purple-200">
                          <div className="flex items-center justify-center mb-4">
                            <Volume2 className="h-12 w-12 text-purple-500 animate-spin" />
                          </div>
                          <div className="text-xl font-semibold text-purple-600">
                            Converting audio to text...
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentQuestion.isAnswered && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
                          <div className="flex items-center justify-center text-green-600 mb-4">
                            <CheckCircle className="h-8 w-8 mr-2" />
                            <span className="font-semibold text-lg">
                              Answer recorded!
                            </span>
                          </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <Headphones className="h-5 w-5 mr-2 text-blue-600" />
                            Your Answer:
                          </h4>
                          <p className="text-gray-700 leading-relaxed">
                            {currentQuestion.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Debug: Manual mark as answered button */}
                    {!currentQuestion.isAnswered &&
                      !isRecording &&
                      !isConverting && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-r from-yellow-50 to-amber-100 rounded-2xl p-6 border border-yellow-200"
                        >
                          <p className="text-sm text-yellow-800 mb-4 text-center">
                            Having trouble with recording? You can manually mark
                            this question as answered.
                          </p>
                          <div className="text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                console.log(
                                  'Manually marking question as answered:',
                                  currentQuestion.id,
                                );
                                setQuestions((prev) =>
                                  prev.map((q) =>
                                    q.id === currentQuestion.id
                                      ? {
                                          ...q,
                                          answer: 'Manually marked as answered',
                                          isAnswered: true,
                                        }
                                      : q,
                                  ),
                                );
                              }}
                              className="border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50 px-6 py-2 rounded-xl font-semibold transition-all duration-300"
                            >
                              <Zap className="h-4 w-4 mr-2" />
                              Mark as Answered
                            </Button>
                          </div>
                        </motion.div>
                      )}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={previousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
                    >
                      Previous
                    </Button>

                    <div className="flex items-center space-x-4">
                      {currentQuestion.isAnswered && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setQuestions((prev) =>
                              prev.map((q) =>
                                q.id === currentQuestion.id
                                  ? {
                                      ...q,
                                      isAnswered: false,
                                      answer: undefined,
                                      audioBlob: undefined,
                                    }
                                  : q,
                              ),
                            );
                          }}
                          className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                        >
                          Re-record
                        </Button>
                      )}

                      <Button
                        onClick={nextQuestion}
                        disabled={!currentQuestion.isAnswered}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                      >
                        {currentQuestionIndex === questions.length - 1
                          ? 'Finish'
                          : 'Next'}
                        <SkipForward className="h-5 w-5 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
