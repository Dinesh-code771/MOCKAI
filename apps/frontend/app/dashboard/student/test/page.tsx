'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen,
  Clock,
  Users,
  Trophy,
  Play,
  Star,
  Target,
  Zap,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const testCategories = [
  {
    id: 'javascript',
    title: 'JavaScript Fundamentals',
    description: 'Test your core JavaScript knowledge',
    questions: 25,
    duration: 30,
    difficulty: 'Intermediate',
    participants: 1234,
    averageScore: 78,
    color: 'from-yellow-500 to-orange-500',
    topics: ['Variables', 'Functions', 'Objects', 'Async/Await'],
  },
  {
    id: 'react',
    title: 'React Development',
    description: 'Components, hooks, and state management',
    questions: 30,
    duration: 45,
    difficulty: 'Advanced',
    participants: 892,
    averageScore: 72,
    color: 'from-blue-500 to-cyan-500',
    topics: ['Components', 'Hooks', 'State', 'Props'],
  },
  {
    id: 'algorithms',
    title: 'Data Structures & Algorithms',
    description: 'Problem-solving and algorithmic thinking',
    questions: 20,
    duration: 60,
    difficulty: 'Expert',
    participants: 567,
    averageScore: 65,
    color: 'from-purple-500 to-pink-500',
    topics: ['Arrays', 'Trees', 'Graphs', 'Sorting'],
  },
  {
    id: 'system-design',
    title: 'System Design Basics',
    description: 'Scalability and architecture concepts',
    questions: 15,
    duration: 40,
    difficulty: 'Advanced',
    participants: 423,
    averageScore: 69,
    color: 'from-green-500 to-teal-500',
    topics: ['Scalability', 'Databases', 'Caching', 'APIs'],
  },
  {
    id: 'nodejs',
    title: 'Node.js Backend',
    description: 'Server-side JavaScript development',
    questions: 25,
    duration: 35,
    difficulty: 'Intermediate',
    participants: 756,
    averageScore: 74,
    color: 'from-emerald-500 to-green-600',
    topics: ['Express', 'APIs', 'Middleware', 'Database'],
  },
  {
    id: 'database',
    title: 'Database Design',
    description: 'SQL, NoSQL, and database optimization',
    questions: 20,
    duration: 30,
    difficulty: 'Intermediate',
    participants: 689,
    averageScore: 76,
    color: 'from-indigo-500 to-purple-600',
    topics: ['SQL', 'NoSQL', 'Indexing', 'Normalization'],
  },
];

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

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-green-100 text-green-800';
    case 'Intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'Advanced':
      return 'bg-orange-100 text-orange-800';
    case 'Expert':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function TakeTest() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const router = useRouter();

  const startTest = (categoryId: string) => {
    router.push(`/dashboard/student/test/${categoryId}`);
  };

  return (
    <DashboardLayout role="student" currentPath="/dashboard/student/test">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Practice Tests</h1>
          <p className="text-gray-600">Challenge yourself with comprehensive skill assessments</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tests Completed</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Best Score</p>
                  <p className="text-2xl font-bold text-gray-900">95%</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">82%</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Time Saved</p>
                  <p className="text-2xl font-bold text-gray-900">15min</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Zap className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Available Tests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle>Available Tests</CardTitle>
                <CardDescription>Choose from our comprehensive test library</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {testCategories.map((test, index) => (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${test.color}`} />
                          <h3 className="font-semibold text-gray-800">{test.title}</h3>
                          <Badge className={getDifficultyColor(test.difficulty)}>
                            {test.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {test.topics.map((topic) => (
                            <Badge key={topic} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            {test.questions} questions
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {test.duration} minutes
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {test.participants.toLocaleString()} taken
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Average Score</span>
                            <span className="font-medium">{test.averageScore}%</span>
                          </div>
                          <Progress value={test.averageScore} className="h-2" />
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => startTest(test.id)}
                        className="ml-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Test
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Attempts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            <Card className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Attempts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAttempts.map((attempt) => (
                  <div key={attempt.id} className="p-3 bg-gray-50/50 rounded-lg">
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
                    <Button size="sm" variant="outline" className="w-full" onClick={() => startTest('react')}>
                      Start Test
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
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