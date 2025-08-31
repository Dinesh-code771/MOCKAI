'use client';

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
import {
  AssessmentsControllerGetAssessmentsListTypeEnum,
  AssessmentsControllerGetUserAssessmentsTypeEnum,
} from '@mockai/sdk';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';

// Type assertions to bypass TypeScript compatibility issues
const CardComponent = Card as any;
const CardHeaderComponent = CardHeader as any;
const CardTitleComponent = CardTitle as any;
const CardDescriptionComponent = CardDescription as any;
const CardContentComponent = CardContent as any;
const ButtonComponent = Button as any;
const BadgeComponent = Badge as any;
const ProgressComponent = Progress as any;
const TestCardComponent = TestCard as any;
const TestStatsComponent = TestStats as any;

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

export default function TakeTest() {
  const [inProgressTests, setInProgressTests] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fetchData = useCallback(
    async (
      setTests: (tests: any) => void,
      page: number,
      limit: number,
      setHasMore: (hasMore: boolean) => void,
    ) => {
      try {
        //tests which are not taken by the user
        const testsData = await getTests(
          AssessmentsControllerGetAssessmentsListTypeEnum.Mcq,
          page,
          limit,
        );

        //in-progress tests
        const inProgressData = await getInProgressTests(
          AssessmentsControllerGetUserAssessmentsTypeEnum.Mcq,
          page,
          limit,
        );
        setTests([
          ...(testsData?.assessments || []),
          ...(inProgressData?.assessments || []),
        ]);
        setInProgressTests(inProgressData);
        setHasMore(
          !!(
            (testsData?.pagination?.totalPages &&
              testsData?.pagination?.totalPages > page) ||
            (inProgressData?.pagination?.totalPages &&
              inProgressData?.pagination?.totalPages > page)
          ),
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const {
    isLoading,
    hasMore,
    items: tests,
    page,
    limit,
  } = useInfiniteScroll(fetchData, scrollRef, 4);


  if (loading) {
    return (
      <DashboardLayout role="student" currentPath="/dashboard/student/test">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Practice Tests
          </h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

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
        <TestStatsComponent />

        <div className="flex  gap-6">
          {/* Available Tests */}

          <CardComponent className="bg-white/70 flex-[2] backdrop-blur-lg border-white/20">
            <CardHeaderComponent>
              <CardTitleComponent>Available Tests</CardTitleComponent>
              <CardDescriptionComponent>
                Choose from our comprehensive test library
              </CardDescriptionComponent>
            </CardHeaderComponent>
            <CardContentComponent className="p-0">
              <div
                ref={scrollRef}
                className="space-y-4 overflow-y-auto max-h-[500px] p-6"
              >
                {tests?.map((test: any, index: number) => (
                  <TestCardComponent key={test.id} test={test} index={index} />
                ))}
                {isLoading && (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
            </CardContentComponent>
          </CardComponent>

          {/* Recent Attempts */}

          <div className="flex flex-col flex-[1] gap-6 sticky top-0 ">
            <CardComponent className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardHeaderComponent>
                <CardTitleComponent className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Attempts
                </CardTitleComponent>
              </CardHeaderComponent>
              <CardContentComponent className="space-y-4">
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
                      <BadgeComponent variant="secondary" className="text-xs">
                        Rank #{attempt.rank}
                      </BadgeComponent>
                    </div>
                    <ProgressComponent
                      value={attempt.score}
                      className="h-2 mb-2"
                    />
                    <p className="text-xs text-gray-500">{attempt.date}</p>
                  </div>
                ))}
              </CardContentComponent>
            </CardComponent>
            <CardComponent className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardHeaderComponent>
                <CardTitleComponent className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Recommended
                </CardTitleComponent>
              </CardHeaderComponent>
              <CardContentComponent>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <h4 className="font-medium text-sm text-gray-800 mb-1">
                      React Development
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      Based on your JavaScript score
                    </p>
                    <ButtonComponent
                      size="sm"
                      variant="outline"
                      className="w-full"
                      // onClick={() => startTest('react')}
                    >
                      Start Test
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </ButtonComponent>
                  </div>
                </div>
              </CardContentComponent>
            </CardComponent>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
