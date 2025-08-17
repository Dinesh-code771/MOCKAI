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
import { Clock, Star, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import TestCard from '@/components/Tests/TestCard';
import { getInProgressTests, getTests } from './_actions';
import TestStats from '@/components/Tests/TestStats';
import { assessmentApi } from '@/lib/api-client';
import { AssessmentsControllerGetAssessmentsListTypeEnum, AssessmentsControllerGetUserAssessmentsTypeEnum } from '@mockai/sdk';

const recentAttempts = [
  {
    id: 1,
    test: 'JavaScript Fundamentals',
    score: 85,
    maxScore: 100,
    date: '2024-01-10',
    rank: 45,
  },
  {
    id: 2,
    test: 'React Development',
    score: 78,
    maxScore: 100,
    date: '2024-01-08',
    rank: 67,
  },
];

export default async function TakeTest() {
  //tests which are not taken by the user
  const tests = await getTests(
    AssessmentsControllerGetAssessmentsListTypeEnum.Mcq,
  );


  //in-progress tests
  const inProgressTests = await getInProgressTests(
    AssessmentsControllerGetUserAssessmentsTypeEnum.Mcq,
  );

  console.log(tests, 'tests');
  console.log(inProgressTests, 'inProgressTests');


  return (
    <DashboardLayout role="student" currentPath="/dashboard/student/test">
      <div className="space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Practice Tests
        </h1>
        <p className="text-gray-600">
          Challenge yourself with comprehensive skill assessments
        </p>

        {/* Stats */}
        <TestStats />

        <div className="flex  gap-6">
          {/* Available Tests */}

          <Card className="bg-white/70 flex-[2] backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle>Available Tests</CardTitle>
              <CardDescription>
                Choose from our comprehensive test library
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...(tests?.assessments || []), ...(inProgressTests?.assessments || [])]?.map(
                (test, index) => (
                  <TestCard key={test.id} test={test} index={index} />
                ),
              )}
            </CardContent>
          </Card>

          {/* Recent Attempts */}

          <div className="flex flex-col flex-[1] gap-6 sticky top-0 ">
            <Card className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Attempts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAttempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="p-3 bg-gray-50/50 rounded-lg"
                  >
                    <h4 className="font-medium text-sm text-gray-800 mb-1">
                      {attempt.test}
                    </h4>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-gray-900">
                        {attempt.score}%
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        Rank #{attempt.rank}
                      </Badge>
                    </div>
                    <Progress value={attempt.score} className="h-2 mb-2" />
                    <p className="text-xs text-gray-500">{attempt.date}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Recommended
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <h4 className="font-medium text-sm text-gray-800 mb-1">
                      React Development
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      Based on your JavaScript score
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      // onClick={() => startTest('react')}
                    >
                      Start Test
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
