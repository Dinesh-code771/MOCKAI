'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
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
  Award,
  Loader2,
  AlertCircle,
  Sparkles,
  Zap,
  Flame,
} from 'lucide-react';
import getLeaderboardData from '@/lib/leaderboard/get-leaderboard-data';
import { UserRankingDto } from '@mockai/sdk';

interface LeaderboardData {
  rankings: UserRankingDto[];
}

const achievements = [
  {
    title: 'First Place',
    description: 'Reached #1 on leaderboard',
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

const getBadgeColor = (score: number) => {
  if (score >= 90) return 'bg-purple-100 text-purple-800';
  if (score >= 80) return 'bg-blue-100 text-blue-800';
  if (score >= 70) return 'bg-green-100 text-green-800';
  return 'bg-gray-100 text-gray-800';
};

const getBadgeText = (score: number) => {
  if (score >= 90) return 'Expert';
  if (score >= 80) return 'Advanced';
  if (score >= 70) return 'Intermediate';
  return 'Beginner';
};

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    {/* Header */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Leaderboard</h1>
      <p className="text-gray-600">See how you rank against other students</p>
    </motion.div>

    {/* Your Rank Card */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="rounded-lg border bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded-full border-4 border-white/20 shadow-lg">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white/20 text-white text-lg font-bold">
                  U
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold">You</h2>
                <p className="text-blue-100 flex items-center">
                  <Flame className="h-4 w-4 mr-1" />
                  Start your journey to climb the leaderboard!
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">--</div>
              <div className="flex items-center justify-end mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">0 tests completed</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">0%</p>
              <p className="text-blue-100 text-sm">Avg Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">0</p>
              <p className="text-blue-100 text-sm">Tests Taken</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">0</p>
              <p className="text-blue-100 text-sm">Upcoming</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-2"
      >
        <div className="rounded-lg border bg-white/70 backdrop-blur-lg border-white/20 shadow-xl">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="flex items-center text-xl font-semibold leading-none tracking-tight">
                  <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
                  Rankings
                </h3>
                <p className="text-sm text-muted-foreground">
                  Top performers based on average scores
                </p>
              </div>
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white/50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
          <div className="p-6 pt-0">
            <div className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1 mb-4">
              <button className="px-3 py-2 text-sm font-medium rounded-md transition-colors bg-white shadow-sm">
                All Time
              </button>
              <button className="px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 hover:text-gray-900">
                This Week
              </button>
            </div>

            {/* Table Header */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8">
                    <span className="text-sm font-bold text-gray-600">#</span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Student</p>
                    <p className="text-xs text-gray-500">Rank & Badge</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">Score</p>
                  <p className="text-xs text-gray-500">Performance</p>
                </div>
              </div>
            </div>

            {/* Empty State */}
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No data yet
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Start taking assessments to see how you rank against other
                students.
              </p>
              <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-md transition-colors">
                <Zap className="h-4 w-4 mr-2" />
                Take Your First Test
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-6"
      >
        <div className="rounded-lg border bg-white/70 backdrop-blur-lg border-white/20 shadow-xl">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="flex items-center text-xl font-semibold leading-none tracking-tight">
              <Award className="h-6 w-6 mr-2 text-purple-500" />
              Achievements
            </h3>
            <p className="text-sm text-muted-foreground">
              Unlock badges as you progress
            </p>
          </div>
          <div className="p-6 pt-0 space-y-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 hover:shadow-sm ${
                    achievement.earned
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-full ${
                        achievement.earned ? 'bg-green-100' : 'bg-gray-100'
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          achievement.earned
                            ? achievement.color
                            : 'text-gray-400'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-medium ${
                          achievement.earned
                            ? 'text-green-800'
                            : 'text-gray-600'
                        }`}
                      >
                        {achievement.title}
                      </h4>
                      <p
                        className={`text-sm ${
                          achievement.earned
                            ? 'text-green-600'
                            : 'text-gray-500'
                        }`}
                      >
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        Earned
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="rounded-lg border bg-white/70 backdrop-blur-lg border-white/20 shadow-xl">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="flex items-center text-xl font-semibold leading-none tracking-tight">
              <Users className="h-6 w-6 mr-2 text-blue-500" />
              Community Stats
            </h3>
          </div>
          <div className="p-6 pt-0 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Users</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Score</span>
              <span className="font-medium">0%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Top Score</span>
              <span className="font-medium">0%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Tests</span>
              <span className="font-medium">0</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </motion.div>
);

const LoadingState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-12"
  >
    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
    <p className="text-gray-500">Loading leaderboard data...</p>
  </motion.div>
);

const ErrorState = ({ error }: { error: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-12"
  >
    <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <AlertCircle className="h-12 w-12 text-red-500" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Unable to Load Leaderboard
    </h3>
    <p className="text-gray-500 mb-6 max-w-md mx-auto">{error}</p>
    <button
      className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
      onClick={() => window.location.reload()}
    >
      Try Again
    </button>
  </motion.div>
);

export default function Leaderboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('global');
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const response = await getLeaderboardData();
        console.log('leaderboardData', response);
        setLeaderboardData(response.data || null);
      } catch (err: any) {
        console.error('Error fetching leaderboard data:', err);
        setError(err.message || 'Failed to load leaderboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboardData();
  }, []);

  const rankings = leaderboardData?.rankings || [];
  const currentUser = rankings.find((user, index) => index === 0); // Assuming first user is current user

  if (loading) {
    return (
      <DashboardLayout
        role="student"
        currentPath="/dashboard/student/leaderboard"
      >
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout
        role="student"
        currentPath="/dashboard/student/leaderboard"
      >
        <ErrorState error={error} />
      </DashboardLayout>
    );
  }

  if (!rankings.length) {
    return (
      <DashboardLayout
        role="student"
        currentPath="/dashboard/student/leaderboard"
      >
        <EmptyState />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      role="student"
      currentPath="/dashboard/student/leaderboard"
    >
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Leaderboard</h1>
          <p className="text-gray-600">
            See how you rank against {rankings.length} other students
          </p>
        </motion.div>

        {/* Your Rank Card */}
        {currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="rounded-lg border bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded-full border-4 border-white/20 shadow-lg">
                      {currentUser.avatar ? (
                        <img
                          src={currentUser.avatar}
                          alt="Avatar"
                          className="aspect-square h-full w-full"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-white/20 text-white text-lg font-bold">
                          {currentUser.full_name
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('') || 'U'}
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        {currentUser.full_name || 'You'}
                      </h2>
                      <p className="text-blue-100 flex items-center">
                        <Flame className="h-4 w-4 mr-1" />
                        Keep pushing to climb higher!
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold">
                      #{currentUser.rank || 'N/A'}
                    </div>
                    <div className="flex items-center justify-end mt-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {currentUser.given_assessments || 0} tests completed
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {currentUser.average_score || 0}%
                    </p>
                    <p className="text-blue-100 text-sm">Avg Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {currentUser.given_assessments || 0}
                    </p>
                    <p className="text-blue-100 text-sm">Tests Taken</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {currentUser.upcoming_assessments || 0}
                    </p>
                    <p className="text-blue-100 text-sm">Upcoming</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="rounded-lg border bg-white/70 backdrop-blur-lg border-white/20 shadow-xl">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="flex items-center text-xl font-semibold leading-none tracking-tight">
                      <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
                      Rankings
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Top performers based on average scores
                    </p>
                  </div>
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white/50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </button>
                </div>
              </div>
              <div className="p-6 pt-0">
                <div className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1 mb-4">
                  <button
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      selectedPeriod === 'global'
                        ? 'bg-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setSelectedPeriod('global')}
                  >
                    All Time
                  </button>
                  <button
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      selectedPeriod === 'weekly'
                        ? 'bg-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setSelectedPeriod('weekly')}
                  >
                    This Week
                  </button>
                </div>

                {selectedPeriod === 'global' && (
                  <div className="space-y-4 mt-4">
                    {rankings.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:shadow-md ${
                          index === 0
                            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200'
                            : 'bg-gray-50/50 hover:bg-gray-100/50'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-8 h-8">
                            {getRankIcon(user.rank || index + 1)}
                          </div>
                          <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full shadow-sm">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt="Avatar"
                                className="aspect-square h-full w-full"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                                {user.full_name
                                  ?.split(' ')
                                  .map((n) => n[0])
                                  .join('') || 'U'}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {user.full_name || user.email}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getBadgeColor(
                                  user.average_score || 0,
                                )}`}
                              >
                                {getBadgeText(user.average_score || 0)}
                              </span>
                              <span className="text-xs text-gray-500">
                                {user.given_assessments || 0} tests
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-lg">
                            {user.average_score || 0}%
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="mr-2">
                              Rank {user.rank || index + 1}
                            </span>
                            {index === 0 && (
                              <div className="flex items-center text-yellow-600">
                                <Sparkles className="h-3 w-3 mr-1" />
                                <span>Top</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {selectedPeriod === 'weekly' && (
                  <div className="space-y-4 mt-4">
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Weekly rankings coming soon!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="rounded-lg border bg-white/70 backdrop-blur-lg border-white/20 shadow-xl">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="flex items-center text-xl font-semibold leading-none tracking-tight">
                  <Award className="h-6 w-6 mr-2 text-purple-500" />
                  Achievements
                </h3>
                <p className="text-sm text-muted-foreground">
                  Unlock badges as you progress
                </p>
              </div>
              <div className="p-6 pt-0 space-y-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <motion.div
                      key={achievement.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 hover:shadow-sm ${
                        achievement.earned
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-full ${
                            achievement.earned ? 'bg-green-100' : 'bg-gray-100'
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 ${
                              achievement.earned
                                ? achievement.color
                                : 'text-gray-400'
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <h4
                            className={`font-medium ${
                              achievement.earned
                                ? 'text-green-800'
                                : 'text-gray-600'
                            }`}
                          >
                            {achievement.title}
                          </h4>
                          <p
                            className={`text-sm ${
                              achievement.earned
                                ? 'text-green-600'
                                : 'text-gray-500'
                            }`}
                          >
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.earned && (
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                            Earned
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-lg border bg-white/70 backdrop-blur-lg border-white/20 shadow-xl">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="flex items-center text-xl font-semibold leading-none tracking-tight">
                  <Users className="h-6 w-6 mr-2 text-blue-500" />
                  Community Stats
                </h3>
              </div>
              <div className="p-6 pt-0 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Users</span>
                  <span className="font-medium">{rankings.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Score</span>
                  <span className="font-medium">
                    {Math.round(
                      rankings.reduce(
                        (acc, user) => acc + (user.average_score || 0),
                        0,
                      ) / rankings.length,
                    )}
                    %
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Top Score</span>
                  <span className="font-medium">
                    {Math.max(
                      ...rankings.map((user) => user.average_score || 0),
                    )}
                    %
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Tests</span>
                  <span className="font-medium">
                    {rankings.reduce(
                      (acc, user) => acc + (user.given_assessments || 0),
                      0,
                    )}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
