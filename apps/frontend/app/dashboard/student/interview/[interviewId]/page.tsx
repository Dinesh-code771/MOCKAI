'use client';

import React, { useState, useRef, useEffect } from 'react';
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
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
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
import { useRouter, useParams } from 'next/navigation';
import { startTest } from '../../test/_actions';
import { getAuthenticatedAssessmentsApi } from '@/lib/api-client';
import { toast } from 'sonner';
import { CompleteAssessmentApiResponse } from '@mockai/sdk';

interface Question {
  id: number;
  text: string;
  category: string;
  answer?: string;
  audioBlob?: Blob;
  isAnswered: boolean;
}

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

interface TestData {
  id: string;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  questions: any[];
  userAssessmentId: string;
}

export default function InterviewPage() {
  const router = useRouter();
  const params = useParams();
  const interviewId = params.interviewId as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [autoStartCountdown, setAutoStartCountdown] = useState(10);
  const [isAutoStarting, setIsAutoStarting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [testData, setTestData] = useState<TestData | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setIsLoading(true);
        // Use startTest to get the actual questions for this assessment
        const response = await startTest(interviewId);
        setTestData({
          title: response?.assessment?.name || '',
          description: response?.assessment?.description || '',
          duration: response?.assessment?.duration_minutes || 25,
          totalQuestions: response?.assessment?.total_questions || 0,
          questions: response?.questions || [],
          userAssessmentId: response?.id || '',
        } as TestData);
        console.log('Interview data:', response);

        if (response?.questions) {
          console.log('response?.questions', response?.questions);
          // Transform the questions to match our interface
          const transformedQuestions: Question[] = response.questions.map(
            (q: any, index: number) => ({
              id: q.id,
              text: q.question_text || q.text || `Question ${index + 1}`,
              category: q.category || 'Interview',
              answer: undefined,
              audioBlob: undefined,
              isAnswered: false,
            }),
          );

          setQuestions(transformedQuestions);
        } else {
          // Fallback questions if API doesn't return questions
          setQuestions([
            {
              id: 1,
              text: 'Tell me about yourself and your background.',
              category: 'Introduction',
              isAnswered: false,
            },
            {
              id: 2,
              text: 'What are your strengths and weaknesses?',
              category: 'Self-Assessment',
              isAnswered: false,
            },
            {
              id: 3,
              text: 'Why are you interested in this position?',
              category: 'Motivation',
              isAnswered: false,
            },
            {
              id: 4,
              text: 'Where do you see yourself in 5 years?',
              category: 'Career Goals',
              isAnswered: false,
            },
            {
              id: 5,
              text: 'Describe a challenging situation you faced at work and how you handled it.',
              category: 'Problem Solving',
              isAnswered: false,
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching interview:', error);
        // Set fallback questions on error
        setQuestions([
          {
            id: 1,
            text: 'Tell me about yourself and your background.',
            category: 'Introduction',
            isAnswered: false,
          },
          {
            id: 2,
            text: 'What are your strengths and weaknesses?',
            category: 'Self-Assessment',
            isAnswered: false,
          },
          {
            id: 3,
            text: 'Why are you interested in this position?',
            category: 'Motivation',
            isAnswered: false,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    if (interviewId) {
      fetchInterview();
    }
  }, [interviewId]);

  // Load test data on component mount

  // React Speech Recognition Implementation
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [finalTranscript, setFinalTranscript] = useState<string>('');

  // Check browser support on mount
  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      console.log(
        'Browser supports speech recognition:',
        browserSupportsSpeechRecognition,
      );
    }
  }, [browserSupportsSpeechRecognition]);

  // Request microphone permission on component mount
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => console.log('Microphone permission granted'))
      .catch((err) => console.error('Microphone permission denied:', err));
  }, []);

  // Capture transcript when it changes
  useEffect(() => {
    console.log('transcript', transcript);
    if (transcript && transcript.trim()) {
      console.log('=== TRANSCRIPT UPDATED ===');
      console.log('Current transcript:', transcript);
      console.log('==========================');
      setFinalTranscript(transcript);
    }
  }, [transcript]);

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
      console.log('startRecording');

      // Check if speech recognition is supported
      if (!browserSupportsSpeechRecognition) {
        console.error('Speech recognition not supported');
        return;
      }

      // Reset transcript for new recording
      resetTranscript();
      setFinalTranscript('');

      console.log('=== STARTING REACT SPEECH RECOGNITION ===');
      console.log('Question ID:', currentQuestion.id);
      console.log('Question:', currentQuestion.text);

      // Start recording timer
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Start speech recognition
      SpeechRecognition.startListening({
        continuous: true,
      });
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      console.log('=== STOPPING RECORDING ===');
      console.log('Current transcript:', transcript);
      console.log('Final transcript:', finalTranscript);

      // Stop speech recognition
      SpeechRecognition.stopListening();

      setIsRecording(false);

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }

      // Process the transcript immediately
      processTranscript();
    }
  };

  const processTranscript = () => {
    console.log('=== PROCESSING TRANSCRIPT ===');
    console.log('Question ID:', currentQuestion.id);
    console.log('Question:', currentQuestion.text);
    console.log('Current transcript:', transcript);
    console.log('Final transcript:', finalTranscript);
    console.log('=============================');

    // Use transcript from the hook, fallback to finalTranscript
    const finalText = transcript || finalTranscript;

    if (finalText && finalText.trim()) {
      // Update the question with the transcript
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === currentQuestion.id
            ? {
                ...q,
                answer: finalText.trim(),
                isAnswered: true,
              }
            : q,
        ),
      );
    } else {
      // If no transcript, mark as answered with a default message
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === currentQuestion.id
            ? {
                ...q,
                answer:
                  'Audio recorded successfully. Please try speaking more clearly next time.',
                isAnswered: true,
              }
            : q,
        ),
      );
    }
  };

  const sendAnswerToServer = async (questionIndex: number) => {
    const question = questions[questionIndex];
    // Get the current selection from the UI state
    const userAnswer = question?.answer;

    try {
      const answerText = userAnswer !== undefined ? userAnswer : 'no answer';

      console.log(interviewId, 'interviewId');
      console.log(question.id, 'question.id');
      console.log(answerText, 'answerText');

      const authenticatedApi = getAuthenticatedAssessmentsApi();

      // Add debugging for authentication
      console.log('Sending answer with authenticated API...');

      if (!testData) {
        throw new Error('Test data not available');
      }

      await authenticatedApi.assessmentsControllerStoreUserAnswers({
        userAssessmentId: testData.userAssessmentId,
        questionId: question.id.toString(),
        storeAnswerDto: {
          answer: answerText,
        },
      });

      console.log('Answer sent successfully!');

      // Mark as answered
      // setAnsweredQuestions(
      //   (prev) => new Set(Array.from(prev).concat([question.id])),
      // );
    } catch (error: any) {
      console.error('Error sending answer:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);

      if (error.response?.status === 403) {
        toast.error('Access denied. Please check your user role.');
      } else {
        toast.error('Failed to save answer');
      }
    }
  };

  const nextQuestion = async () => {
    //before moving to next question, send current question id and answer to the server
    const currentQuestionId = questions[currentQuestionIndex].id;
    const currentQuestionAnswer = questions[currentQuestionIndex].answer;
    console.log('currentQuestionId', currentQuestionId);
    console.log('currentQuestionAnswer', currentQuestionAnswer);
    sendAnswerToServer(currentQuestionIndex);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setRecordingTime(0);
      setAutoStartCountdown(10);
    } else {
      const authenticatedApi = getAuthenticatedAssessmentsApi();

      // Add debugging for authentication
      console.log('Sending answer with authenticated API...');

      if (!testData) {
        throw new Error('Test data not available');
      }

      const response: CompleteAssessmentApiResponse =
        await authenticatedApi.assessmentsControllerCompleteAssessment({
          userAssessmentId: testData.userAssessmentId,
        });

      console.log('response', response);

      if (response.statusCode === 200) {
        setIsCompleted(true);
      }
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

  if (isLoading) {
    return (
      <DashboardLayout
        role="student"
        currentPath="/dashboard/student/interview"
      >
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading interview...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
              />
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
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-600">
                        Question {currentQuestion?.id}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800 leading-relaxed">
                    {currentQuestion?.text}
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
                          className="space-y-8"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Manual Recording Card */}
                            <motion.div
                              whileHover={{ y: -5 }}
                              className="relative group"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                              <Card className="relative bg-white/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden">
                                <CardHeader className="text-center pb-4">
                                  <div className="flex justify-center mb-4">
                                    <div className="p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full">
                                      <Mic className="h-8 w-8 text-white" />
                                    </div>
                                  </div>
                                  <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                                    Manual Recording
                                  </CardTitle>
                                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                                    Start recording immediately when you're
                                    ready. Perfect for when you want full
                                    control over when to begin your answer.
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="text-center pb-8">
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-block"
                                  >
                                    <Button
                                      onClick={startRecording}
                                      className="w-20 h-20 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 hover:from-red-600 hover:via-pink-600 hover:to-rose-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border-0"
                                    >
                                      <Mic className="h-6 w-6" />
                                    </Button>
                                  </motion.div>
                                  <p className="text-sm text-gray-500 mt-4">
                                    Click to start recording now
                                  </p>
                                </CardContent>
                              </Card>
                            </motion.div>

                            {/* Auto-start Card */}
                            <motion.div
                              whileHover={{ y: -5 }}
                              className="relative group"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                              <Card className="relative bg-white/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden">
                                <CardHeader className="text-center pb-4">
                                  <div className="flex justify-center mb-4">
                                    <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full">
                                      <Clock className="h-8 w-8 text-white" />
                                    </div>
                                  </div>
                                  <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                                    Auto-start Recording
                                  </CardTitle>
                                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                                    Get a 10-second countdown to prepare
                                    yourself. Great for taking a moment to
                                    gather your thoughts before answering.
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="text-center pb-8">
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-block"
                                  >
                                    <Button
                                      variant="outline"
                                      onClick={startAutoRecording}
                                      className="w-20 h-20 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                      <Clock className="h-6 w-6" />
                                    </Button>
                                  </motion.div>
                                  <p className="text-sm text-gray-500 mt-4">
                                    Recording starts in 10 seconds
                                  </p>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}

                    {isAutoStarting && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                      >
                        <div className="flex flex-col items-center space-y-6">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                            <div className="relative w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
                              <div className="text-4xl font-bold text-white">
                                {autoStartCountdown}
                              </div>
                            </div>
                          </div>
                          <div className="text-center space-y-2">
                            <div className="text-xl font-semibold text-blue-600">
                              Recording will start in {autoStartCountdown}{' '}
                              seconds
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                              <Mic className="h-5 w-5 text-blue-500 animate-pulse" />
                              <span className="text-sm text-blue-600">
                                Get ready!
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {(isRecording || listening) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                      >
                        <div className="flex flex-col items-center space-y-8">
                          {/* Recording Animation */}
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                            <div className="relative w-40 h-40 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-2xl">
                              <div className="relative">
                                <Mic className="h-16 w-16 text-white animate-pulse" />
                                <div className="absolute inset-0 bg-red-400 rounded-full opacity-20 animate-ping"></div>
                                <div
                                  className="absolute inset-2 bg-red-300 rounded-full opacity-30 animate-ping"
                                  style={{ animationDelay: '0.5s' }}
                                ></div>
                                <div
                                  className="absolute inset-4 bg-red-200 rounded-full opacity-40 animate-ping"
                                  style={{ animationDelay: '1s' }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          {/* Timer */}
                          <div className="text-center space-y-4">
                            <div className="text-5xl font-mono font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                              {formatTime(recordingTime)}
                            </div>
                            <div className="text-lg text-red-600 font-medium">
                              Recording in progress...
                            </div>
                          </div>

                          {/* Stop Button */}
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              onClick={stopRecording}
                              className="w-20 h-20 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border-0"
                            >
                              <MicOff className="h-8 w-8" />
                            </Button>
                          </motion.div>
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
                <p className="text-sm text-gray-500">{transcript}</p>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
