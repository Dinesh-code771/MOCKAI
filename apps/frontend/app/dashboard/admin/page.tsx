'use client';

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

import {
  Users,
  FileText,
  Calendar,
  Award,
  BookOpen,
  Plus,
  Trophy,
  Medal,
  Crown,
  X,
  GraduationCap,
} from 'lucide-react';

import { useEffect, useState, useCallback } from 'react';
import studentsAnalaticForAdmin from '@/lib/admin/students-analatic-for-admin';
import getLeaderboardData from '@/lib/leaderboard/get-leaderboard-data';
import { UserRankingDto } from '@mockai/sdk';
import { staticDataApi } from '@/lib/api-client';
import { toast } from 'sonner';

interface LeaderboardData {
  rankings: UserRankingDto[];
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardData | null>(null);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [addingCourse, setAddingCourse] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsAnalytics = await studentsAnalaticForAdmin();
        console.log(studentsAnalytics, 'studentsAnalytics');
        setAnalytics(studentsAnalytics.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const response = await getLeaderboardData();
        console.log('leaderboardData', response);
        setLeaderboardData(response.data || null);
      } catch (err: any) {
        console.error('Error fetching leaderboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    fetchLeaderboardData();
    fetchCourses();
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      const response =
        await staticDataApi.staticDataControllerGetActiveCourses();
      if (response?.data?.courses) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }, []);

  const handleAddCourse = async () => {
    if (!courseName.trim()) {
      toast.error('Please enter a course name');
      return;
    }

    try {
      setAddingCourse(true);
      // TODO: Fix API call - method name might be different
      await staticDataApi.staticDataControllerAddCourse({
        addCourseRequestDto: {
          course: courseName.trim(),
        },
      });

      // Temporary placeholder - replace with actual API call
      toast.success('Course added successfully!');
      setCourseName('');
      setShowAddCourseModal(false);
      fetchCourses(); // Refresh the courses list
    } catch (error: any) {
      console.error('Error adding course:', error);
      toast.error(error?.message || 'Failed to add course');
    } finally {
      setAddingCourse(false);
    }
  };

  return (
    <DashboardLayout role="admin" currentPath="/dashboard/admin">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-purple-100">
                Manage students, questions, and assessments
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() =>
                    (window.location.href = '/dashboard/admin/assessments')
                  }
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Assessments
                </Button>
                <Button
                  onClick={() =>
                    (window.location.href =
                      '/dashboard/admin/assessments/create')
                  }
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assessment
                </Button>
              </div>
              <div className="text-right">
                <p className="text-sm text-purple-100">Total Users</p>
                <p className="text-3xl font-bold">
                  {loading ? '...' : analytics?.totalUsers || 0}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : analytics?.totalUsers || 0}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-gray-500">Registered users</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Assessments
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : analytics?.totalAssessments || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-gray-500">
                  Available assessments
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Questions
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : analytics?.totalQuestions || 0}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-gray-500">
                  Questions in database
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Students Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Students Leaderboard
              </CardTitle>
              <CardDescription>
                Top performing students based on average scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : leaderboardData?.rankings &&
                leaderboardData.rankings.length > 0 ? (
                <div className="space-y-4">
                  {/* Top 3 Students */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* 2nd Place */}
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <div className="relative mb-3">
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                          {leaderboardData.rankings[1]?.avatar ? (
                            <img
                              src={leaderboardData.rankings[1].avatar}
                              alt="Avatar"
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <Users className="h-8 w-8 text-gray-600" />
                          )}
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            2
                          </span>
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-800 text-center">
                        {leaderboardData.rankings[1]?.full_name ||
                          'Second Place'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {leaderboardData.rankings[1]?.average_score || 0}% avg
                        score
                      </p>
                    </div>

                    {/* 1st Place */}
                    <div className="flex flex-col items-center p-4 bg-gradient-to-b from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200">
                      <div className="relative mb-3">
                        <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center">
                          {leaderboardData.rankings[0]?.avatar ? (
                            <img
                              src={leaderboardData.rankings[0].avatar}
                              alt="Avatar"
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <Crown className="h-10 w-10 text-white" />
                          )}
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            1
                          </span>
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-800 text-center">
                        {leaderboardData.rankings[0]?.full_name ||
                          'Top Performer'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {leaderboardData.rankings[0]?.average_score || 0}% avg
                        score
                      </p>
                    </div>

                    {/* 3rd Place */}
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <div className="relative mb-3">
                        <div className="w-16 h-16 bg-amber-300 rounded-full flex items-center justify-center">
                          {leaderboardData.rankings[2]?.avatar ? (
                            <img
                              src={leaderboardData.rankings[2].avatar}
                              alt="Avatar"
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <Medal className="h-8 w-8 text-white" />
                          )}
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            3
                          </span>
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-800 text-center">
                        {leaderboardData.rankings[2]?.full_name ||
                          'Third Place'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {leaderboardData.rankings[2]?.average_score || 0}% avg
                        score
                      </p>
                    </div>
                  </div>

                  {/* Leaderboard Table */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-800">
                        Recent Rankings
                      </h4>
                      <Button
                        onClick={() =>
                          (window.location.href = '/dashboard/admin/students')
                        }
                        variant="outline"
                        size="sm"
                      >
                        View All Students
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {leaderboardData.rankings
                        .slice(0, 5)
                        .map((user, index) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-8 h-8">
                                {index === 0 ? (
                                  <Crown className="h-5 w-5 text-yellow-500" />
                                ) : index === 1 ? (
                                  <Medal className="h-5 w-5 text-gray-400" />
                                ) : index === 2 ? (
                                  <Medal className="h-5 w-5 text-amber-600" />
                                ) : (
                                  <span className="text-sm font-bold text-gray-600">
                                    #{index + 1}
                                  </span>
                                )}
                              </div>
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                {user.avatar ? (
                                  <img
                                    src={user.avatar}
                                    alt="Avatar"
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <Users className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">
                                  {user.full_name ||
                                    user.email ||
                                    `Student ${index + 1}`}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Rank #{user.rank || index + 1} •{' '}
                                  {user.given_assessments || 0} tests
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">
                                {user.average_score || 0}%
                              </p>
                              <p className="text-xs text-gray-500">Avg Score</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <Trophy className="h-16 w-16 text-gray-400" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No Leaderboard Data
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Students need to take assessments to appear on the
                        leaderboard.
                      </p>
                      <Button
                        onClick={() =>
                          (window.location.href = '/dashboard/admin/students')
                        }
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        View Students
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* No Data Message */}
        {!loading && analytics?.totalUsers === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <Users className="h-16 w-16 text-gray-400" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No Users Yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Start by adding users to see analytics and performance
                      data.
                    </p>
                    <Button
                      onClick={() =>
                        (window.location.href = '/dashboard/admin/students')
                      }
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Users
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Courses Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Course Management
                  </CardTitle>
                  <CardDescription>
                    Manage available courses for students
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setShowAddCourseModal(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 border border-gray-200 rounded-lg bg-gray-50/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-full">
                            <GraduationCap className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {course.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Active Course
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No Courses Available
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Start by adding courses for students to enroll in.
                  </p>
                  <Button
                    onClick={() => setShowAddCourseModal(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Course
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600">
                  <FileText className="h-6 w-6 mb-2" />
                  Add Questions
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-purple-600">
                  <Users className="h-6 w-6 mb-2" />
                  Manage Students
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center bg-gradient-to-r from-green-500 to-green-600">
                  <Calendar className="h-6 w-6 mb-2" />
                  Schedule Interview
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center bg-gradient-to-r from-pink-500 to-pink-600">
                  <Award className="h-6 w-6 mb-2" />
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Add New Course
              </h2>
              <button
                onClick={() => {
                  setShowAddCourseModal(false);
                  setCourseName('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="courseName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Course Name
                </label>
                <input
                  type="text"
                  id="courseName"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="Enter course name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  maxLength={255}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  onClick={() => {
                    setShowAddCourseModal(false);
                    setCourseName('');
                  }}
                  variant="outline"
                  disabled={addingCourse}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCourse}
                  disabled={addingCourse || !courseName.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {addingCourse ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    'Add Course'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
