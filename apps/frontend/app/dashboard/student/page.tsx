'use client';

import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  BookOpen,
  Trophy,
  Users,
  Clock,
  Target,
  TrendingUp,
  Star,
  Award,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const upcomingInterviews = [
  {
    id: 1,
    title: 'Frontend Developer Interview',
    company: 'TechCorp',
    date: '2024-01-15',
    time: '10:00 AM',
    type: 'Technical',
  },
  {
    id: 2,
    title: 'Product Manager Interview',
    company: 'StartupXYZ',
    date: '2024-01-18',
    time: '2:00 PM',
    type: 'Behavioral',
  },
];

const recentTests = [
  {
    id: 1,
    subject: 'JavaScript Fundamentals',
    score: 85,
    maxScore: 100,
    date: '2024-01-10',
    duration: '45 mins',
  },
  {
    id: 2,
    subject: 'System Design',
    score: 78,
    maxScore: 100,
    date: '2024-01-08',
    duration: '60 mins',
  },
];

const achievements = [
  { icon: Star, title: 'First Test Completed', color: 'text-yellow-500' },
  { icon: Award, title: 'Top 10%', color: 'text-purple-500' },
  { icon: Target, title: '5 Tests Completed', color: 'text-blue-500' },
];

export default function StudentDashboard() {
  const router = useRouter();

  const cards = [
    {
      title: 'Schedule Interview',
      description: 'Book your next mock interview session',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      href: '/dashboard/student/schedule',
    },
    {
      title: 'Take Test',
      description: 'Practice with MCQ tests and assessments',
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      href: '/dashboard/student/test',
    },
    {
      title: 'View Results',
      description: 'Check your performance and progress',
      icon: Trophy,
      color: 'from-pink-500 to-pink-600',
      href: '/dashboard/student/results',
    },
    {
      title: 'Leaderboard',
      description: 'See how you rank against others',
      icon: Users,
      color: 'from-green-500 to-green-600',
      href: '/dashboard/student/leaderboard',
    },
  ];

  return (
    <DashboardLayout role="student" currentPath="/dashboard/student">
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-4 border-white/20">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-white/20 text-white text-lg">JD</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Welcome back, John!</h1>
                <p className="text-blue-100">Ready to practice and improve your skills?</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Current Streak</p>
              <p className="text-3xl font-bold">7 days</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
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
                  <p className="text-sm font-medium text-gray-600">Tests Taken</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12% this week</span>
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
              <div className="mt-4">
                <Progress value={82} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Interviews</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Clock className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">2 scheduled</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rank</p>
                  <p className="text-2xl font-bold text-gray-900">#15</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Badge variant="secondary" className="text-xs">Top 25%</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="bg-white/70 backdrop-blur-lg border-white/20 cursor-pointer hover:shadow-lg transition-all duration-300"
                    onClick={() => router.push(card.href)}
                  >
                    <CardContent className="p-6">
                      <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${card.color} mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">{card.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>Get started</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Interviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Interviews
                </CardTitle>
                <CardDescription>Your scheduled mock interviews</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingInterviews.map((interview) => (
                  <div key={interview.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{interview.title}</h4>
                      <p className="text-sm text-gray-600">{interview.company}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-xs text-gray-500">{interview.date}</span>
                        <span className="text-xs text-gray-500">{interview.time}</span>
                        <Badge variant="outline" className="text-xs">{interview.type}</Badge>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Join
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Recent Tests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentTests.map((test) => (
                  <div key={test.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-gray-800">{test.subject}</h4>
                      <span className="text-sm font-medium text-gray-600">
                        {test.score}/{test.maxScore}
                      </span>
                    </div>
                    <Progress value={(test.score / test.maxScore) * 100} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{test.date}</span>
                      <span>{test.duration}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Recent Achievements
              </CardTitle>
              <CardDescription>Your latest milestones and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50/50 rounded-lg">
                      <Icon className={`h-5 w-5 ${achievement.color}`} />
                      <span className="text-sm font-medium text-gray-700">{achievement.title}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}