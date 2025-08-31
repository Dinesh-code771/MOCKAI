// @ts-nocheck
'use client';

import { useState, useEffect, useRef } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Clock,
  ChevronRight,
  Flag,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Target,
  Timer,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { startTest } from '../_actions';
import { getAuthenticatedAssessmentsApi } from '@/lib/api-client';

interface UserAnswer {
  id: string;
  answer: string;
  is_correct: boolean;
  points_earned: number;
}

interface Question {
  id: string;
  question_text: string;
  question_type: 'mcq' | 'subjective';
  options: string[] | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  order_sequence: number;
  user_answers?: UserAnswer;
}

interface TestData {
  id: string;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  questions: Question[];
  userAssessmentId: string;
}

export default function TakeTestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const testId = params.testId as string;
  const noQuestion = searchParams.get('noQuestion') as string;
  const time = searchParams.get('time') as string;
  const score = searchParams.get('score') as string;


  const [testData, setTestData] = useState<TestData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>(
    {} as { [key: string]: number },
  );
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(
    new Set(),
  );
  const [questionTimer, setQuestionTimer] = useState(25);
  const [testStarted, setTestStarted] = useState(false);
  const [userStartedTest, setUserStartedTest] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(
    new Set(),
  );
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Initialize answers from existing user answers
  useEffect(() => {
    if (testData?.questions) {
      const initialAnswers: { [key: string]: number } = {};
      const answeredSet = new Set<string>();

      testData.questions.forEach((question, index) => {
        if (question.user_answers && question.options) {
          // Find the option index that matches the user's answer
          const optionIndex = question.options.findIndex(
            (option) => option === question.user_answers?.answer,
          );
          if (optionIndex !== -1) {
            initialAnswers[question?.id] = optionIndex;
            answeredSet.add(question.id);
          }
        }
      });

      setAnswers(initialAnswers);
      setAnsweredQuestions(answeredSet);
    }
  }, [testData]);

  // Question timer effect
  useEffect(() => {
    if (testStarted && questionTimer > 0 && !testSubmitted) {
      const timer = setInterval(() => {
        setQuestionTimer((prev) => {
          if (prev <= 1) {
            // Auto-progress to next question or submit test
            if (currentQuestion < (testData?.questions?.length || 0) - 1) {
              handleNextQuestion();
            } else {
              handleSubmitTest();
            }
            return 25;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [testStarted, questionTimer, testSubmitted, currentQuestion, testData]);

  // Reset timer when question changes
  useEffect(() => {
    if (testStarted && !testSubmitted) {
      setQuestionTimer(25);
    }
  }, [currentQuestion, testStarted, testSubmitted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const isQuestionAnswered = (questionId: string) => {
    const question = testData?.questions.find((q) => q.id === questionId);
    return (
      question && (answeredQuestions.has(question.id) || question.user_answers)
    );
  };

  const handleAnswerSelect = (optionIndex: number) => {
    // Don't allow changing answer if already answered
    const question = testData?.questions[currentQuestion];
    if (isQuestionAnswered(question?.id || '')) {
      return;
    }
    const questionId = question?.id || '';
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleFlagQuestion = () => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion);
      } else {
        newSet.add(currentQuestion);
      }
      return newSet;
    });
  };

  // Handle tab/window visibility changes (warnings on first two, submit on third)
  useEffect(() => {
    if (!testStarted || testSubmitted) return;

    const onVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => {
          const next = prev + 1;
          if (next === 1) {
            toast.warning('Warning: Do not switch tabs during the test. (1/2)');
          } else if (next === 2) {
            toast.warning(
              'Final Warning: One more tab switch will submit your test. (2/2)',
            );
          } else if (next >= 3) {
            toast.error('You switched tabs 3 times. Submitting your test.');
            // Fire and forget
            handleSubmitTest();
          }
          return next;
        });
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [testStarted, testSubmitted]);

  // Start webcam stream when test starts
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraEnabled(true);
    } catch (err) {
      setCameraEnabled(false);
      toast.error('Camera access denied. Proceeding without camera.');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    setCameraEnabled(false);
  };

  const sendAnswerToServer = async (questionIndex: number) => {
    if (!testData) return;

    const question = testData.questions[questionIndex];
    // Get the current selection from the UI state
    const selectedAnswer = answers[question?.id || ''];

    // Don't send if already answered
    if (isQuestionAnswered(question?.id || '')) {
      return;
    }

    try {
      const answerText =
        selectedAnswer !== undefined && question.options
          ? question.options[selectedAnswer]
          : 'no answer';


      const authenticatedApi = getAuthenticatedAssessmentsApi();

      // Add debugging for authentication


      await authenticatedApi.assessmentsControllerStoreUserAnswers({
        userAssessmentId: testData.userAssessmentId,
        questionId: question.id.toString(),
        storeAnswerDto: {
          answer: answerText,
        },
      });



      // Mark as answered
      setAnsweredQuestions(
        (prev) => new Set(Array.from(prev).concat([question.id])),
      );
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

  const handleNextQuestion = async () => {
    if (!testData) return;

    // Send current answer before moving to next question
    await sendAnswerToServer(currentQuestion);

    if (currentQuestion < testData.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setQuestionTimer(25);
    }
  };

  const handleSubmitTest = async () => {
    if (!testData) return;

    try {
      // Send current answer before submitting
      await sendAnswerToServer(currentQuestion);

      // Complete the assessment
      const authenticatedApi = getAuthenticatedAssessmentsApi();
      const completeResponse =
        await authenticatedApi.assessmentsControllerCompleteAssessment({
          userAssessmentId: testData.userAssessmentId,
        });

      setTestSubmitted(true);
      stopCamera();
      toast.success('Test submitted successfully!');

      // Get the score from the complete response
      const score = completeResponse?.data?.percentage_score || 0;

      // Redirect to results page after a delay
      setTimeout(() => {
        router.push(
          `/dashboard/student/results?testId=${testId}&score=${score}`,
        );
      }, 2000);
    } catch (error) {
      console.error('Error completing assessment:', error);
      toast.error('Failed to submit test. Please try again.');
    }
  };

  const handleQuestionNavigation = (questionIndex: number) => {
    // Don't allow navigation to answered questions
    const question = testData?.questions[questionIndex];
    if (isQuestionAnswered(question?.id || '')) {
      return;
    }
    setCurrentQuestion(questionIndex);
  };

  const getQuestionStatus = (index: number) => {
    const question = testData?.questions[index];
    if (question && isQuestionAnswered(question.id)) return 'answered';
    if (flaggedQuestions.has(index)) return 'flagged';
    return 'unanswered';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered':
        return 'bg-green-500';
      case 'flagged':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Load test data on component mount
  useEffect(() => {
    if (userStartedTest) return;
    const getTestData = async () => {
      try {
        const response = await startTest(testId);

        setTestData({
          title: response?.assessment?.name || '',
          description: response?.assessment?.description || '',
          duration: response?.assessment?.duration_minutes || 25,
          totalQuestions: response?.assessment?.total_questions || 0,
          questions: response?.questions || [],
          userAssessmentId: response?.id || '',
        } as TestData);
      } catch (error) {
        console.error('Error loading test data:', error);
        toast.error('Failed to load test data');
      }
    };
    getTestData();
  }, [testId]);

  const handleStartTest = async () => {
    setUserStartedTest(true);
    setTestStarted(true);
    await startCamera();
    toast.success('Test started! Good luck!');
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercentage = testData
    ? (answeredCount / testData.questions.length) * 100
    : 0;

  if (!testData) {
    return (
      <DashboardLayout role="student" currentPath="/dashboard/student/test">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading test...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!testStarted) {
    return (
      <DashboardLayout role="student" currentPath="/dashboard/student/test">
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="bg-white/80 backdrop-blur-lg border-white/20 shadow-2xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">{testData.title}</CardTitle>
                <CardDescription className="text-lg">
                  {testData.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {noQuestion}
                    </div>
                    <div className="text-sm text-gray-600">Questions</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {time}s
                    </div>
                    <div className="text-sm text-gray-600">Per Question</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {score}
                    </div>
                    <div className="text-sm text-gray-600">Max Score</div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">
                    Instructions:
                  </h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>
                      • Each question has a {testData.duration} second time
                      limit
                    </li>
                    <li>
                      • Questions will automatically progress after time expires
                    </li>
                    <li>• You cannot go back to previous questions</li>
                    <li>
                      • You can flag questions for review (but cannot return to
                      them)
                    </li>
                    <li>• Make sure you have a stable internet connection</li>
                  </ul>
                </div>

                <Button
                  onClick={handleStartTest}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg py-6"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Start Test
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  if (testSubmitted) {
    return (
      <DashboardLayout role="student" currentPath="/dashboard/student/test">
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Test Submitted Successfully!
            </h1>
            <p className="text-gray-600 mb-4">
              Your answers have been recorded. Redirecting to results...
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse animation-delay-200"></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse animation-delay-400"></div>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  const currentQ = testData.questions[currentQuestion];
  const isCurrentQuestionAnswered = currentQ
    ? isQuestionAnswered(currentQ.id)
    : false;

  return (
    <DashboardLayout role="student" currentPath="/dashboard/student/test">
      <div className="space-y-6">
        {/* Header with Timer and Progress */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {testData.title}
              </h1>
              <p className="text-gray-600">
                Question {currentQuestion + 1} of {testData.questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center px-3 py-2 rounded-lg ${
                  questionTimer < 10
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                <Timer className="w-4 h-4 mr-2" />
                {formatTime(questionTimer)}
              </div>
              <Button
                variant="outline"
                onClick={() => setShowReview(!showReview)}
                className="flex items-center"
              >
                {showReview ? (
                  <EyeOff className="w-4 h-4 mr-2" />
                ) : (
                  <Eye className="w-4 h-4 mr-2" />
                )}
                {showReview ? 'Hide' : 'Show'} Overview
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Progress: {answeredCount}/{testData.questions.length} answered
              </span>
              <span>{Math.round(progressPercentage)}% complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Card className="bg-white/80 backdrop-blur-lg border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge className={getDifficultyColor(currentQ?.difficulty)}>
                      {currentQ?.difficulty}
                    </Badge>
                    {/* Topic not available in Question type */}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFlagQuestion}
                    className={
                      flaggedQuestions.has(currentQuestion)
                        ? 'bg-yellow-100 text-yellow-700'
                        : ''
                    }
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    {flaggedQuestions.has(currentQuestion) ? 'Flagged' : 'Flag'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-lg font-medium text-gray-800 leading-relaxed">
                  {currentQ?.question_text}
                </div>

                <div className="space-y-3">
                  <AnimatePresence mode="wait">
                    {currentQ?.options?.map((option: string, index: number) => (
                      <motion.div
                        key={`${currentQuestion}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                          isCurrentQuestionAnswered
                            ? 'cursor-not-allowed opacity-60'
                            : 'cursor-pointer hover:border-gray-300 hover:bg-gray-50'
                        } ${
                          answers[currentQ?.id] === index
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                        onClick={() => handleAnswerSelect(index)}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              answers[currentQ?.id] === index
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            }`}
                          >
                            {answers[currentQ?.id] === index && (
                              <div className="w-3 h-3 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="text-gray-700">{option}</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-end pt-6 border-t border-gray-200">
                  <div className="flex space-x-3">
                    {currentQuestion === testData.questions.length - 1 ? (
                      <Button
                        onClick={handleSubmitTest}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit Test
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNextQuestion}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Question Overview Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`space-y-6 ${showReview ? 'block' : 'hidden lg:block'}`}
          >
            <Card className="bg-white/80 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-lg">Question Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {testData.questions.map(
                    (question: Question, index: number) => {
                      const status = getQuestionStatus(index);
                      const isAnswered = isQuestionAnswered(question.id);

                      return (
                        <button
                          key={index}
                          onClick={() => handleQuestionNavigation(index)}
                          disabled={isAnswered}
                          className={`w-10 h-10 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                            currentQuestion === index
                              ? 'border-blue-500 bg-blue-500 text-white'
                              : isAnswered
                              ? 'border-gray-300 bg-gray-200 text-gray-500 cursor-not-allowed'
                              : `border-gray-300 ${getStatusColor(
                                  status,
                                )} text-white hover:scale-105`
                          }`}
                        >
                          {index + 1}
                        </button>
                      );
                    },
                  )}
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Answered ({answeredQuestions.size})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>Flagged ({flaggedQuestions.size})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <span>
                      Unanswered (
                      {testData.questions.length - answeredQuestions.size})
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-lg">Test Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(progressPercentage)}%
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Question:</span>
                    <span>
                      {currentQuestion + 1}/{testData.questions.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Time Remaining:</span>
                    <span>{formatTime(questionTimer)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      {/* Webcam preview overlay */}
      {testStarted && !testSubmitted && (
        <div className="fixed bottom-4 right-4 z-50 w-40 h-28 bg-black rounded-lg overflow-hidden shadow-lg border border-white/20">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          {!cameraEnabled && (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-white/80 bg-black/40">
              Camera unavailable
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
