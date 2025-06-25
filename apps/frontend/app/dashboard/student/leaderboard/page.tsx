'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  Users,
  Target,
  Filter,
  Star,
  Calendar,
  Award
} from 'lucide-react';

const globalLeaderboard = [
  {
    rank: 1,
    name: 'Alex Chen',
    avatar: '/placeholder-avatar.jpg',
    score: 2458,
    testsCompleted: 48,
    avgScore: 94,
    streak: 15,
    badge: 'Expert',
    change: 2,
  },
  {
    rank: 2,
    name: 'Sarah Johnson',
    avatar: '/placeholder-avatar.jpg',
    score: 2401,
    testsCompleted: 52,
    avgScore: 91,
    streak: 12,
    badge: 'Expert',
    change: -1,
  },
  {
    rank: 3,
    name: 'Michael Rodriguez',
    avatar: '/placeholder-avatar.jpg',
    score: 2389,
    testsCompleted: 45,
    avgScore: 89,
    streak: 8,
    badge: 'Advanced',
    change: 1,
  },
  {
    rank: 4,
    name: 'Emily Davis',
    avatar: '/placeholder-avatar.jpg',
    score: 2356,
    testsCompleted: 41,
    avgScore: 87,
    streak: 6,
    badge: 'Advanced',
    change: 0,
  },
  {
    rank: 5,
    name: 'James Wilson',
    avatar: '/placeholder-avatar.jpg',
    score: 2298,
    testsCompleted: 39,
    avgScore: 85,
    streak: 10,
    badge: 'Advanced',
    change: 3,
  },
  {
    rank: 15,
    name: 'John Doe (You)',
    avatar: '/placeholder-avatar.jpg',
    score: 1987,
    testsCompleted: 24,
    avgScore: 82,
    streak: 7,
    badge: 'Intermediate',
    change: 2,
    isCurrentUser: true,
  },
];

const weeklyLeaderboard = [
  {
    rank: 1,
    name: 'Lisa Park',
    avatar: '/placeholder-avatar.jpg',
    score: 456,
    testsCompleted: 8,
    avgScore: 92,
    change: 5,
  },
  {
    rank: 2,
    name: 'David Kim',
    avatar: '/placeholder-avatar.jpg',
    score: 432,
    testsCompleted: 7,
    avgScore: 89,
    change: -2,
  },
  {
    rank: 3,
    name: 'Anna Brown',
    avatar: '/placeholder-avatar.jpg',
    score: 418,
    testsCompleted: 6,
    avgScore: 87,
    change: 1,
  },
  {
    rank: 8,
    name: 'John Doe (You)',
    avatar: '/placeholder-avatar.jpg',
    score: 367,
    testsCompleted: 5,
    avgScore: 82,
    change: 3,
    isCurrentUser: true,
  },
];

const achievements = [
  {
    title: 'First Place',
    description: 'Reached #1 on weekly leaderboard',
    icon: Crown,
    color: 'text-yellow-500',
    earned: false,
  },
  {
    title: 'Perfect Score',
    description: 'Achieved 100% on any test',
    icon: Target,
    color: 'text-green-500',
    earned: true,
  },
  {
    title: 'Consistency King',
    description: 'Maintain 10-day streak',
    icon: Calendar,
    color: 'text-blue-500',
    earned: false,
  },
  {
    title: 'Top Performer',
    description: 'Stay in top 10 for a week',
    icon: Star,
    color: 'text-purple-500',
    earned: false,
  },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Medal className="h-5 w-5 text-amber-600" />;
    default:
      return <span className="text-sm font-bold text-gray-600">#{rank}</span>;
  }
};

const getBadgeColor = (badge: string) => {
  switch (badge) {
    case 'Expert':
      return 'bg-purple-100 text-purple-800';
    case 'Advanced':
      return 'bg-blue-100 text-blue-800';
    case 'Intermediate':
      return 'bg-green-100 text-green-800';
    case 'Beginner':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function Leaderboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('global');

  const currentUserRank = globalLeaderboard.find(user => user.isCurrentUser);

  return (
    <DashboardLayout role="student" currentPath="/dashboard/student/leaderboard">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Leaderboard</h1>
          <p className="text-gray-600">See how you rank against other students</p>
        </motion.div>

        {/* Your Rank Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 border-4 border-white/20">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="bg-white/20 text-white text-lg">JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">Your Current Rank</h2>
                    <p className="text-blue-100">Keep pushing to climb higher!</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">#{currentUserRank?.rank}</div>
                  <div className="flex items-center justify-end mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">+{currentUserRank?.change} this week</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{currentUserRank?.score}</p>
                  <p className="text-blue-100 text-sm">Total Points</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{currentUserRank?.avgScore}%</p>
                  <p className="text-blue-100 text-sm">Avg Score</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{currentUserRank?.streak}</p>
                  <p className="text-blue-100 text-sm">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Trophy className="h-5 w-5 mr-2" />
                      Rankings
                    </CardTitle>
                    <CardDescription>Top performers across all categories</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="global">All Time</TabsTrigger>
                    <TabsTrigger value="weekly">This Week</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="global" className="space-y-4 mt-4">
                    {globalLeaderboard.map((user, index) => (
                      <motion.div
                        key={user.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
                          user.isCurrentUser 
                            ? 'bg-blue-50 border-2 border-blue-200' 
                            : 'bg-gray-50/50 hover:bg-gray-100/50'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-8 h-8">
                            {getRankIcon(user.rank)}
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-800">{user.name}</p>
                            <div className="flex items-center space-x-2">
                              <Badge className={getBadgeColor(user.badge)}>
                                {user.badge}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {user.testsCompleted} tests
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{user.score}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="mr-2">{user.avgScore}% avg</span>
                            {user.change > 0 && (
                              <div className="flex items-center text-green-600">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                <span>{user.change}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="weekly" className="space-y-4 mt-4">
                    {weeklyLeaderboard.map((user, index) => (
                      <motion.div
                        key={user.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
                          user.isCurrentUser 
                            ? 'bg-blue-50 border-2 border-blue-200' 
                            : 'bg-gray-50/50 hover:bg-gray-100/50'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-8 h-8">
                            {getRankIcon(user.rank)}
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-800">{user.name}</p>
                            <span className="text-xs text-gray-500">
                              {user.testsCompleted} tests this week
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{user.score}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="mr-2">{user.avgScore}% avg</span>
                            {user.change > 0 && (
                              <div className="flex items-center text-green-600">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                <span>{user.change}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <Card className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Achievements
                </CardTitle>
                <CardDescription>Unlock badges as you progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={achievement.title}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        achievement.earned
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          achievement.earned ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`h-4 w-4 ${
                            achievement.earned ? achievement.color : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            achievement.earned ? 'text-green-800' : 'text-gray-600'
                          }`}>
                            {achievement.title}
                          </h4>
                          <p className={`text-sm ${
                            achievement.earned ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.earned && (
                          <Badge className="bg-green-100 text-green-800">
                            Earned
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Users</span>
                  <span className="font-medium">2,847</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active This Week</span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Score</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Top Score</span>
                  <span className="font-medium">98%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}