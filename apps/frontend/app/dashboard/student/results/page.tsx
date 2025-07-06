'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  Users,
  ArrowLeft,
  Trophy,
  Target,
  AlertCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { assessmentApi } from '@/lib/api-client';
import { toast } from 'sonner';

interface QuestionWithAnswers {
  id: string;
  question_text: string;
  question_type: 'mcq' | 'subjective';
  options: string[] | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  order_sequence: number;
  user_answers?: {
    id: string;
    answer: string;
    is_correct: boolean;
    points_earned: number;
  };
  correct_answer?: string;
}

interface CompleteAssessmentData {
  id: string;
  user_id: string;
  assessment_id: string;
  scheduled_at: string;
  started_at?: string;
  status: string;
  total_score: number;
  percentage_score: number;
  assessment: {
    id: string;
    name: string;
    description: string;
    duration_minutes: number;
    total_questions: number;
    difficulty: string;
  };
  questions: QuestionWithAnswers[];
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const testId = searchParams.get('testId');
  const score = searchParams.get('score');

  const [assessmentData, setAssessmentData] =
    useState<CompleteAssessmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompleteAssessmentData = async () => {
      if (!testId) {
        toast.error('Test ID not found');
        router.push('/dashboard/student/test');
        return;
      }

      try {
        setLoading(true);
        const response =
          await assessmentApi.assessmentsControllerGetUserAssessmentCompleteData(
            {
              userAssessmentId: testId,
            },
          );

        if (response?.data) {
          setAssessmentData(response.data);
        } else {
          toast.error('No assessment data found');
          router.push('/dashboard/student/test');
        }
      } catch (error) {
        console.error('Error fetching assessment data:', error);
        toast.error('Failed to load assessment results');
        router.push('/dashboard/student/test');
      } finally {
        setLoading(false);
      }
    };

    fetchCompleteAssessmentData();
  }, [testId, router]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <DashboardLayout role="student" currentPath="/dashboard/student/results">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading results...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!assessmentData) {
    return (
      <DashboardLayout role="student" currentPath="/dashboard/student/results">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No Results Found
            </h2>
            <p className="text-gray-600 mb-4">
              The assessment results could not be loaded.
            </p>
            <Button onClick={() => router.push('/dashboard/student/test')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tests
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const correctAnswers = assessmentData.questions.filter(
    (q) => q.user_answers?.is_correct,
  ).length;
  const totalQuestions = assessmentData.questions.length;

  return (
    <DashboardLayout role="student" currentPath="/dashboard/student/results">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/student/test')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tests
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Test Results</h1>
            <p className="text-gray-600">{assessmentData.assessment.name}</p>
          </div>
        </div>

        {/* Score Summary */}
        <Card className="bg-white/80 backdrop-blur-lg border-white/20">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">
              <span className={getScoreColor(assessmentData.percentage_score)}>
                {assessmentData.percentage_score}%
              </span>
            </CardTitle>
            <CardDescription className="text-lg">
              {assessmentData.total_score} out of {totalQuestions * 4} points
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {correctAnswers}
                </div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {totalQuestions - correctAnswers}
                </div>
                <div className="text-sm text-gray-600">Incorrect Answers</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Details */}
        <Card className="bg-white/80 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle>Assessment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">
                  {assessmentData.assessment.total_questions} Questions
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">
                  {assessmentData.assessment.duration_minutes} Minutes
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Target className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">
                  <Badge
                    className={getDifficultyColor(
                      assessmentData.assessment.difficulty,
                    )}
                  >
                    {assessmentData.assessment.difficulty}
                  </Badge>
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Trophy className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">
                  <Badge
                    className={getScoreBadgeColor(
                      assessmentData.percentage_score,
                    )}
                  >
                    {assessmentData.percentage_score}% Score
                  </Badge>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card className="bg-white/80 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
            <CardDescription>
              Review your answers and see the correct solutions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {assessmentData.questions.map((question, index) => (
              <div
                key={question.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">
                      Question {index + 1}
                    </span>
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Badge>
                    {question.user_answers?.is_correct ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {question.user_answers?.points_earned || 0} points
                  </div>
                </div>

                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  {question.question_text}
                </h3>

                {question.options && (
                  <div className="space-y-2 mb-4">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-3 border-2 rounded-lg ${
                          question.user_answers?.answer === option
                            ? question.user_answers.is_correct
                              ? 'border-green-500 bg-green-50'
                              : 'border-red-500 bg-red-50'
                            : question.correct_answer === option
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              question.user_answers?.answer === option
                                ? question.user_answers.is_correct
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-red-500 bg-red-500'
                                : question.correct_answer === option
                                ? 'border-green-500 bg-green-500'
                                : 'border-gray-300'
                            }`}
                          >
                            {(question.user_answers?.answer === option ||
                              question.correct_answer === option) && (
                              <div className="w-3 h-3 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="text-gray-700">{option}</span>
                          {question.user_answers?.answer === option &&
                            !question.user_answers.is_correct && (
                              <span className="text-red-600 text-sm font-medium">
                                Your Answer
                              </span>
                            )}
                          {question.correct_answer === option && (
                            <span className="text-green-600 text-sm font-medium">
                              Correct Answer
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">
                      Your Answer:{' '}
                      <span className="font-medium">
                        {question.user_answers?.answer || 'No answer'}
                      </span>
                    </span>
                    {question.correct_answer && (
                      <span className="text-gray-600">
                        Correct:{' '}
                        <span className="font-medium text-green-600">
                          {question.correct_answer}
                        </span>
                      </span>
                    )}
                  </div>
                  <div className="text-gray-500">
                    Points: {question.user_answers?.points_earned || 0}/4
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
