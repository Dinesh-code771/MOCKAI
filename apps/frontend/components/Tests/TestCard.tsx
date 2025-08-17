'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Play } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const getDifficultyColor = (difficulty: string) => {
  console.log(difficulty, 'difficulty');
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'Hard':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function TestCard({
  test,
  index,
}: {
  test: any;
  index: number;
}) {
  const router = useRouter();

  const startTest = (categoryId: string) => {
    router.push(
      `/dashboard/student/test/${categoryId}?noQuestion=${test.total_questions}&time=${test.duration_minutes}&score=${test.max_score}`,
    );
  };

  const viewResults = (userAssessmentId: string) => {
    router.push(`/dashboard/student/results?testId=${userAssessmentId}`);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div
              className={`w-3 h-3 rounded-full  ${getDifficultyColor(
                test.difficulty,
              )}`}
            />
            <h3 className="font-semibold text-gray-800">{test.name}</h3>
            <Badge
              className={`text-xs ${getDifficultyColor(
                test.difficulty,
              )} bg-yellow-100`}
            >
              {test.difficulty}
            </Badge>
            {/* status */}
            <Badge
              className={`text-xs ${getDifficultyColor(
                test.status,
              )} bg-yellow-100`}
            >
              {test?.user_assessment?.status}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-3">{test.description}</p>

          <div className="flex flex-wrap gap-2 mb-3">
            {/* {test.course.map((course: any) => (
              <Badge key={course.id} variant="outline" className="text-xs">
                {course.name}
              </Badge>
            ))} */}
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              {test?.total_questions} questions
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {test?.duration_minutes} minutes
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {/* {test.participants.toLocaleString()} taken */}
            </div>
          </div>
        </div>

        {test?.user_assessment?.status === 'completed' ? (
          <Button
            onClick={() => viewResults(test.user_assessment.id)}
            className="ml-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <Play className="h-4 w-4 mr-2" />
            View Results
          </Button>
        ) : (
          <Button
            onClick={() => startTest(test.id)}
            className="ml-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Test
          </Button>
        )}
      </div>
    </div>
  );
}
