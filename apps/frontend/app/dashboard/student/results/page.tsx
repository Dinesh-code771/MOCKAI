'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Trophy,
  TrendingUp,
  Clock,
  Target,
  Star,
  Calendar,
  Download,
  Share2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface InterviewResult {
  id: string;
  questions: Array<{
    id: number;
    text: string;
    category: string;
    answer: string;
    isAnswered: boolean;
  }>;
  completedAt: string;
  totalQuestions: number;
  answeredQuestions: number;
  createdAt: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<InterviewResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockResults: InterviewResult[] = [
      {
        id: '1',
        questions: [
          {
            id: 1,
            text: 'Tell me about yourself and your background.',
            category: 'Introduction',
            answer:
              'I am a passionate software developer with 3 years of experience in web development.',
            isAnswered: true,
          },
          {
            id: 2,
            text: 'What are your greatest strengths?',
            category: 'Self-Assessment',
            answer:
              'My greatest strengths include problem-solving, attention to detail, and strong communication skills.',
            isAnswered: true,
          },
        ],
        completedAt: '2024-01-15T10:30:00Z',
        totalQuestions: 25,
        answeredQuestions: 20,
        createdAt: '2024-01-15T10:00:00Z',
      },
    ];

    setTimeout(() => {
      setResults(mockResults);
      setLoading(false);
    }, 1000);
  }, []);

  const calculateScore = (result: InterviewResult) => {
    return Math.round((result.answeredQuestions / result.totalQuestions) * 100);
  };

  const getCategoryStats = (result: InterviewResult) => {
    const categories = result.questions.reduce((acc, q) => {
      if (!acc[q.category]) {
        acc[q.category] = 0;
      }
      acc[q.category]++;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / result.answeredQuestions) * 100),
    }));
  };

  if (loading) {
    return (
      <DashboardLayout role="student" currentPath="/dashboard/student/results">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading results...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student" currentPath="/dashboard/student/results">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Interview Results
            </h1>
            <p className="text-gray-600 mt-2">
              Review your performance and track your progress
            </p>
          </div>
          <Button onClick={() => router.push('/dashboard/student/interview')}>
            <Calendar className="h-4 w-4 mr-2" />
            Start New Interview
          </Button>
        </motion.div>

        {results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              No Results Yet
            </h2>
            <p className="text-gray-500 mb-6">
              Complete your first interview to see your results here.
            </p>
            <Button onClick={() => router.push('/dashboard/student/interview')}>
              Start Your First Interview
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/70 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                          Interview #{result.id}
                        </CardTitle>
                        <CardDescription>
                          Completed on{' '}
                          {new Date(result.completedAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {calculateScore(result)}%
                        </div>
                        <div className="text-sm text-gray-500">
                          {result.answeredQuestions}/{result.totalQuestions}{' '}
                          questions
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Overall Progress */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-800">
                        Overall Performance
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <Target className="h-5 w-5 text-blue-600 mr-2" />
                            <span className="font-medium text-blue-800">
                              Completion Rate
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-blue-600 mt-2">
                            {Math.round(
                              (result.answeredQuestions /
                                result.totalQuestions) *
                                100,
                            )}
                            %
                          </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 text-green-600 mr-2" />
                            <span className="font-medium text-green-800">
                              Duration
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-green-600 mt-2">
                            ~45 min
                          </div>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <Star className="h-5 w-5 text-purple-600 mr-2" />
                            <span className="font-medium text-purple-800">
                              Score
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-purple-600 mt-2">
                            {calculateScore(result)}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-800">
                        Category Breakdown
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {getCategoryStats(result).map((stat) => (
                          <div
                            key={stat.category}
                            className="bg-gray-50 p-4 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-800">
                                {stat.category}
                              </span>
                              <Badge variant="secondary">
                                {stat.count} questions
                              </Badge>
                            </div>
                            <Progress value={stat.percentage} className="h-2" />
                            <div className="text-sm text-gray-500 mt-1">
                              {stat.percentage}% of your answers
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sample Questions */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-800">
                        Sample Questions & Answers
                      </h3>
                      <div className="space-y-4">
                        {result.questions.slice(0, 3).map((question) => (
                          <div
                            key={question.id}
                            className="bg-gray-50 p-4 rounded-lg"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-800">
                                {question.text}
                              </h4>
                              <Badge variant="outline" className="text-xs">
                                {question.category}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm">
                              {question.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download Report
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Results
                        </Button>
                      </div>
                      <Button
                        onClick={() =>
                          router.push('/dashboard/student/interview')
                        }
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Practice Again
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
