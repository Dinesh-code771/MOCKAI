'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
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
  Calendar,
  Eye,
} from 'lucide-react';
import { assessmentApi } from '@/lib/api-client';
import { toast } from 'sonner';
import {
  AssessmentsControllerGetUserAssessmentsStatusEnum,
  UserAssessmentItemDto,
  CompleteAssessmentResponseDto,
} from '@mockai/sdk';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';

// Extend the CompleteAssessmentResponseDto interface to include subjective assessment fields
interface ExtendedCompleteAssessmentResponseDto
  extends CompleteAssessmentResponseDto {
  is_assessed?: boolean;
  strong_areas?: string[];
  weak_areas?: string[];
  feedback?: string;
}

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

export default function ResultsPage() {
  const router = useRouter();
  const [selectedTest, setSelectedTest] =
    useState<ExtendedCompleteAssessmentResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewingResults, setViewingResults] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchCompletedTests = useCallback(
    async (
      setTests: (tests: any) => void,
      page: number,
      limit: number,
      setHasMore: (hasMore: boolean) => void,
    ) => {
      try {
        const response =
          await assessmentApi.assessmentsControllerGetUserAssessments({
            page,
            limit,
            status: [
              AssessmentsControllerGetUserAssessmentsStatusEnum.Completed,
              AssessmentsControllerGetUserAssessmentsStatusEnum.InProgress,
            ],
          });

        if (response?.data?.assessments) {
          setTests(response.data.assessments);
          setHasMore(
            !!(
              response.data.pagination?.totalPages &&
              response.data.pagination.totalPages > page
            ),
          );
        } else {
          setTests([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching completed tests:', error);
        toast.error('Failed to load completed tests');
        setTests([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const {
    isLoading,
    hasMore,
    items: completedTests,
    page,
    limit,
  } = useInfiniteScroll(fetchCompletedTests, scrollRef, 6);

  const handleViewResults = async (testId: string) => {
    try {
      setLoading(true);
      const response =
        await assessmentApi.assessmentsControllerGetUserAssessmentCompleteData({
          userAssessmentId: testId,
        });

      if (response?.data) {
        const assessmentData = response.data;

        // Check if it's MCQ type - show results immediately
        if (assessmentData.assessment.type?.toLowerCase() === 'mcq') {
          setSelectedTest(assessmentData);
          setViewingResults(true);
          return;
        }

        // For subjective assessments, check if it's assessed
        if (assessmentData.assessment.type?.toLowerCase() === 'subjective') {
          if (assessmentData.is_assessed) {
            setSelectedTest(assessmentData);
            setViewingResults(true);
          } else {
            toast.info(
              'Your subjective assessment is being evaluated. Results will be available soon.',
            );
          }
        } else {
          // For other types, show results
          setSelectedTest(assessmentData);
          setViewingResults(true);
        }
      } else {
        toast.error('No assessment data found');
      }
    } catch (error) {
      console.error('Error fetching assessment data:', error);
      toast.error('Failed to load assessment results');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedTest(null);
    setViewingResults(false);
  };

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
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show detailed results for selected test
  if (viewingResults && selectedTest) {
    const correctAnswers = selectedTest.questions.filter(
      (q: any) => q.user_answers?.is_correct,
    ).length;
    const totalQuestions = selectedTest.questions.length;

    return (
      <DashboardLayout role="student" currentPath="/dashboard/student/results">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={handleBackToList}
                className="mb-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Results
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Test Results</h1>
              <p className="text-gray-600">{selectedTest.assessment.name}</p>
            </div>
          </div>

          {/* Score Summary */}
          <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-lg shadow-sm">
            <div className="p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold">
                <span className={getScoreColor(selectedTest.percentage_score)}>
                  {selectedTest.percentage_score}%
                </span>
              </h2>
              <p className="text-lg text-gray-600">
                {selectedTest.total_score} out of {totalQuestions * 4} points
              </p>
            </div>
            <div className="p-6">
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
            </div>
          </div>

          {/* Assessment Details */}
          <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-lg shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Assessment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">
                    {selectedTest.assessment.total_questions} Questions
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">
                    {selectedTest.assessment.duration_minutes} Minutes
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                        selectedTest.assessment.difficulty,
                      )}`}
                    >
                      {selectedTest.assessment.difficulty}
                    </span>
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Trophy className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBadgeColor(
                        selectedTest.percentage_score,
                      )}`}
                    >
                      {selectedTest.percentage_score}% Score
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Subjective Assessment Feedback - Only show for subjective assessments */}
          {selectedTest.assessment.type?.toLowerCase() === 'subjective' &&
            selectedTest.is_assessed && (
              <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-lg shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Assessment Feedback
                  </h3>

                  {/* Strong Areas */}
                  {selectedTest.strong_areas &&
                    selectedTest.strong_areas.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-md font-medium text-green-700 mb-3 flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Strong Areas
                        </h4>
                        <div className="bg-green-50 rounded-lg p-4">
                          <ul className="space-y-2">
                            {selectedTest.strong_areas.map(
                              (area: string, index: number) => (
                                <li
                                  key={index}
                                  className="flex items-start space-x-2"
                                >
                                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-green-800">{area}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>
                    )}

                  {/* Weak Areas */}
                  {selectedTest.weak_areas &&
                    selectedTest.weak_areas.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-md font-medium text-red-700 mb-3 flex items-center">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          Areas for Improvement
                        </h4>
                        <div className="bg-red-50 rounded-lg p-4">
                          <ul className="space-y-2">
                            {selectedTest.weak_areas.map(
                              (area: string, index: number) => (
                                <li
                                  key={index}
                                  className="flex items-start space-x-2"
                                >
                                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-red-800">{area}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>
                    )}

                  {/* General Feedback */}
                  {selectedTest.feedback && (
                    <div>
                      <h4 className="text-md font-medium text-blue-700 mb-3 flex items-center">
                        <BookOpen className="h-5 w-5 mr-2" />
                        General Feedback
                      </h4>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-blue-800 leading-relaxed">
                          {selectedTest.feedback}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* Question Review */}
          <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-lg shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Question Review
              </h3>
              <p className="text-gray-600 mb-6">
                Review your answers and see the correct solutions
              </p>
              <div className="space-y-6">
                {selectedTest.questions.map((question: any, index: number) => (
                  <div
                    key={question.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-500">
                          Question {index + 1}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                            question.difficulty,
                          )}`}
                        >
                          {question.difficulty}
                        </span>
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

                    <h4 className="text-lg font-medium text-gray-800 mb-4">
                      {question.question_text}
                    </h4>

                    {question.options && (
                      <div className="space-y-2 mb-4">
                        {question.options.map(
                          (option: string, optionIndex: number) => (
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
                          ),
                        )}
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
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show list of completed tests
  return (
    <DashboardLayout role="student" currentPath="/dashboard/student/results">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => router.push('/dashboard/student/test')}
              className="mb-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tests
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Test Results</h1>
            <p className="text-gray-600">
              View your completed assessments and results
            </p>
          </div>
        </div>

        {completedTests.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-lg shadow-sm p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No Completed Tests
            </h2>
            <p className="text-gray-600 mb-4">
              You haven&apos;t completed any assessments yet.
            </p>
            <button
              onClick={() => router.push('/dashboard/student/test')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Take a Test
            </button>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[600px]"
          >
            {completedTests.map((test) => (
              <div
                key={test.id}
                className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {test.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {test.description || 'No description available'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {test.max_score} points
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Difficulty:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                          test.difficulty,
                        )}`}
                      >
                        {test.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Questions:</span>
                      <span className="font-medium">
                        {test.total_questions}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">
                        {test.duration_minutes} min
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">
                        {new Date(test.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {!test.user_assessment.is_assessed && (
                    <div className="text-sm text-gray-600 mb-3">
                      <span className="font-medium text-red-500 text-center flex items-center justify-center">
                        Evaluation in progress...
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => handleViewResults(test.user_assessment.id)}
                    disabled={!test.user_assessment.is_assessed}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Results
                  </button>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="col-span-full flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
