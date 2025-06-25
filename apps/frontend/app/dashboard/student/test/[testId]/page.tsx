'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Target,
  Timer,
  Eye,
  EyeOff
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
}

interface TestData {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  totalQuestions: number;
  questions: Question[];
}

const sampleTest: TestData = {
  id: 'javascript',
  title: 'JavaScript Fundamentals',
  description: 'Test your core JavaScript knowledge',
  duration: 30,
  totalQuestions: 25,
  questions: [
    {
      id: 1,
      question: 'What is the correct way to declare a variable in JavaScript?',
      options: [
        'var myVariable = 5;',
        'variable myVariable = 5;',
        'v myVariable = 5;',
        'declare myVariable = 5;'
      ],
      correctAnswer: 0,
      explanation: 'The "var" keyword is used to declare variables in JavaScript. ES6 also introduced "let" and "const" for variable declaration.',
      difficulty: 'Easy',
      topic: 'Variables'
    },
    {
      id: 2,
      question: 'Which of the following is NOT a JavaScript data type?',
      options: [
        'String',
        'Boolean',
        'Float',
        'Number'
      ],
      correctAnswer: 2,
      explanation: 'JavaScript has Number type for all numeric values. There is no separate Float type in JavaScript.',
      difficulty: 'Medium',
      topic: 'Data Types'
    },
    {
      id: 3,
      question: 'What does the "===" operator do in JavaScript?',
      options: [
        'Assigns a value',
        'Compares values only',
        'Compares values and types',
        'Declares a constant'
      ],
      correctAnswer: 2,
      explanation: 'The "===" operator performs strict equality comparison, checking both value and type without type coercion.',
      difficulty: 'Medium',
      topic: 'Operators'
    },
    {
      id: 4,
      question: 'Which method is used to add an element to the end of an array?',
      options: [
        'append()',
        'push()',
        'add()',
        'insert()'
      ],
      correctAnswer: 1,
      explanation: 'The push() method adds one or more elements to the end of an array and returns the new length of the array.',
      difficulty: 'Easy',
      topic: 'Arrays'
    },
    {
      id: 5,
      question: 'What is a closure in JavaScript?',
      options: [
        'A way to close the browser',
        'A function that has access to variables in its outer scope',
        'A method to end a loop',
        'A type of error handling'
      ],
      correctAnswer: 1,
      explanation: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.',
      difficulty: 'Hard',
      topic: 'Functions'
    }
  ]
};

export default function TakeTestPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params.testId as string;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(sampleTest.duration * 60); // Convert to seconds
  const [testStarted, setTestStarted] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);

  // Timer effect
  useEffect(() => {
    if (testStarted && timeLeft > 0 && !testSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [testStarted, timeLeft, testSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: optionIndex
    }));
  };

  const handleFlagQuestion = () => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion);
      } else {
        newSet.add(currentQuestion);
      }
      return newSet;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < sampleTest.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleStartTest = () => {
    setTestStarted(true);
    toast.success('Test started! Good luck!');
  };

  const handleSubmitTest = () => {
    setTestSubmitted(true);
    toast.success('Test submitted successfully!');
    
    // Calculate score
    let correctAnswers = 0;
    sampleTest.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / sampleTest.questions.length) * 100);
    
    // Redirect to results page after a delay
    setTimeout(() => {
      router.push(`/dashboard/student/results?testId=${testId}&score=${score}`);
    }, 2000);
  };

  const getQuestionStatus = (index: number) => {
    if (answers[index] !== undefined) return 'answered';
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

  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / sampleTest.questions.length) * 100;

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
                <CardTitle className="text-2xl">{sampleTest.title}</CardTitle>
                <CardDescription className="text-lg">{sampleTest.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{sampleTest.totalQuestions}</div>
                    <div className="text-sm text-gray-600">Questions</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{sampleTest.duration}</div>
                    <div className="text-sm text-gray-600">Minutes</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">100</div>
                    <div className="text-sm text-gray-600">Max Score</div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Read each question carefully before selecting an answer</li>
                    <li>• You can flag questions for review and come back to them later</li>
                    <li>• The test will auto-submit when time runs out</li>
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Test Submitted Successfully!</h1>
            <p className="text-gray-600 mb-4">Your answers have been recorded. Redirecting to results...</p>
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

  const currentQ = sampleTest.questions[currentQuestion];

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
              <h1 className="text-xl font-bold text-gray-800">{sampleTest.title}</h1>
              <p className="text-gray-600">Question {currentQuestion + 1} of {sampleTest.questions.length}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center px-3 py-2 rounded-lg ${timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                <Timer className="w-4 h-4 mr-2" />
                {formatTime(timeLeft)}
              </div>
              <Button
                variant="outline"
                onClick={() => setShowReview(!showReview)}
                className="flex items-center"
              >
                {showReview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showReview ? 'Hide' : 'Show'} Overview
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Progress: {answeredCount}/{sampleTest.questions.length} answered</span>
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
                    <Badge className={getDifficultyColor(currentQ.difficulty)}>
                      {currentQ.difficulty}
                    </Badge>
                    <Badge variant="outline">{currentQ.topic}</Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFlagQuestion}
                    className={flaggedQuestions.has(currentQuestion) ? 'bg-yellow-100 text-yellow-700' : ''}
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    {flaggedQuestions.has(currentQuestion) ? 'Flagged' : 'Flag'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-lg font-medium text-gray-800 leading-relaxed">
                  {currentQ.question}
                </div>

                <div className="space-y-3">
                  <AnimatePresence mode="wait">
                    {currentQ.options.map((option, index) => (
                      <motion.div
                        key={`${currentQuestion}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          answers[currentQuestion] === index
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handleAnswerSelect(index)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            answers[currentQuestion] === index
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {answers[currentQuestion] === index && (
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
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex space-x-3">
                    {currentQuestion === sampleTest.questions.length - 1 ? (
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
                  {sampleTest.questions.map((_, index) => {
                    const status = getQuestionStatus(index);
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestion(index)}
                        className={`w-10 h-10 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                          currentQuestion === index
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : `border-gray-300 ${getStatusColor(status)} text-white hover:scale-105`
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Answered ({answeredCount})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>Flagged ({flaggedQuestions.size})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <span>Unanswered ({sampleTest.questions.length - answeredCount})</span>
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
                  <div className="text-2xl font-bold text-blue-600">{Math.round(progressPercentage)}%</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Time Elapsed:</span>
                    <span>{formatTime((sampleTest.duration * 60) - timeLeft)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg. per Question:</span>
                    <span>{Math.round(((sampleTest.duration * 60) - timeLeft) / Math.max(1, answeredCount))}s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}