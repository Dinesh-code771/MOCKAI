'use client';

import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Users,
  FileText,
  Calendar,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Target,
  Star,
  Plus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const performanceData = [
  { month: 'Jan', students: 120, avgScore: 75 },
  { month: 'Feb', students: 145, avgScore: 78 },
  { month: 'Mar', students: 168, avgScore: 82 },
  { month: 'Apr', students: 192, avgScore: 79 },
  { month: 'May', students: 234, avgScore: 85 },
  { month: 'Jun', students: 267, avgScore: 88 },
];

const subjectData = [
  { subject: 'JavaScript', avgScore: 85, students: 234 },
  { subject: 'React', avgScore: 78, students: 189 },
  { subject: 'Node.js', avgScore: 72, students: 156 },
  { subject: 'Python', avgScore: 80, students: 198 },
  { subject: 'Algorithms', avgScore: 68, students: 145 },
];

const recentStudents = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: '/placeholder-avatar.jpg',
    testsCompleted: 12,
    avgScore: 88,
    lastActive: '2 hours ago',
    status: 'active',
    strengths: ['JavaScript', 'React'],
    weaknesses: ['Algorithms'],
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    avatar: '/placeholder-avatar.jpg',
    testsCompleted: 8,
    avgScore: 75,
    lastActive: '1 day ago',
    status: 'inactive',
    strengths: ['Python', 'Database'],
    weaknesses: ['System Design'],
  },
  {
    id: 3,
    name: 'Carol Davis',
    email: 'carol@example.com',
    avatar: '/placeholder-avatar.jpg',
    testsCompleted: 15,
    avgScore: 92,
    lastActive: '30 minutes ago',
    status: 'active',
    strengths: ['Algorithms', 'Data Structures'],
    weaknesses: ['Frontend'],
  },
];

const upcomingInterviews = [
  {
    id: 1,
    student: 'John Doe',
    type: 'Technical',
    date: '2024-01-16',
    time: '10:00 AM',
    interviewer: 'Sarah Johnson',
    status: 'scheduled',
  },
  {
    id: 2,
    student: 'Jane Smith',
    type: 'Behavioral',
    date: '2024-01-16',
    time: '2:00 PM',
    interviewer: 'Michael Chen',
    status: 'confirmed',
  },
  {
    id: 3,
    student: 'Mike Wilson',
    type: 'System Design',
    date: '2024-01-17',
    time: '11:00 AM',
    interviewer: 'Alex Rivera',
    status: 'pending',
  },
];

export default function AdminDashboard() {
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
              <p className="text-purple-100">Manage students, questions, and assessments</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-purple-100">Total Students</p>
              <p className="text-3xl font-bold">267</p>
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
                  <p className="text-sm font-medium text-gray-600">Active Students</p>
                  <p className="text-2xl font-bold text-gray-900">234</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
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
                  <p className="text-sm font-medium text-gray-600">Total Questions</p>
                  <p className="text-2xl font-bold text-gray-900">1,247</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Plus className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">45 added this week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Interviews</p>
                  <p className="text-2xl font-bold text-gray-900">89</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Clock className="h-4 w-4 text-purple-500 mr-1" />
                <span className="text-sm text-purple-600">12 scheduled today</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Score</p>
                  <p className="text-2xl font-bold text-gray-900">84%</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+3% improvement</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle>Student Performance Trends</CardTitle>
                <CardDescription>Monthly student activity and average scores</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="students" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      name="Students"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avgScore" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      name="Avg Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Subject Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Average scores by subject area</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={subjectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgScore" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Students */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Student Profiles
                    </CardTitle>
                    <CardDescription>Recent student activity and performance</CardDescription>
                  </div>
                  <Button size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-800">{student.name}</h4>
                          <Badge 
                            variant={student.status === 'active' ? 'default' : 'secondary'}
                            className={student.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {student.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500">{student.testsCompleted} tests</span>
                          <span className="text-xs text-gray-500">{student.lastActive}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-1">Strong:</span>
                            {student.strengths.map((strength) => (
                              <Badge key={strength} variant="outline" className="text-xs mr-1 bg-green-50 text-green-700">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-1">Weak:</span>
                            {student.weaknesses.map((weakness) => (
                              <Badge key={weakness} variant="outline" className="text-xs mr-1 bg-red-50 text-red-700">
                                {weakness}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{student.avgScore}%</div>
                      <Progress value={student.avgScore} className="w-20 h-2 mt-1" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Interviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Interviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingInterviews.map((interview) => (
                  <div key={interview.id} className="p-3 bg-gray-50/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm text-gray-800">{interview.student}</h4>
                      <Badge 
                        variant="outline" 
                        className={
                          interview.status === 'confirmed' 
                            ? 'bg-green-50 text-green-700' 
                            : interview.status === 'pending'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-blue-50 text-blue-700'
                        }
                      >
                        {interview.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{interview.type} Interview</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{interview.date}</span>
                      <span>{interview.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">with {interview.interviewer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

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
    </DashboardLayout>
  );
}