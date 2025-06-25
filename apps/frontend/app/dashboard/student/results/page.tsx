'use client';

import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Trophy,
  BookOpen,
  Star,
  Calendar,
  Award,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';

const performanceData = [
  { month: 'Jan', score: 65 },
  { month: 'Feb', score: 72 },
  { month: 'Mar', score: 78 },
  { month: 'Apr', score: 85 },
  { month: 'May', score: 82 },
  { month: 'Jun', score: 88 },
];

const skillsData = [
  { skill: 'JavaScript', score: 85 },
  { skill: 'React', score: 78 },
  { skill: 'Node.js', score: 72 },
  { skill: 'Algorithms', score: 68 },
  { skill: 'System Design', score: 65 },
  { skill: 'Databases', score: 75 },
];

const categoryData = [
  { name: 'Frontend', value: 35, color: '#3B82F6' },
  { name: 'Backend', value: 25, color: '#8B5CF6' },
  { name: 'Algorithms', value: 20, color: '#10B981' },
  { name: 'System Design', value: 20, color: '#F59E0B' },
];

const recentResults = [
  {
    id: 1,
    test: 'JavaScript Fundamentals',
    score: 85,
    maxScore: 100,
    date: '2024-01-15',
    duration: '28 mins',
    questions: 25,
    rank: 45,
    improvement: 12,
    subjects: ['Variables', 'Functions', 'Objects', 'Async'],
  },
  {
    id: 2,
    test: 'React Development',
    score: 78,
    maxScore: 100,
    date: '2024-01-12',
    duration: '42 mins',
    questions: 30,
    rank: 67,
    improvement: -3,
    subjects: ['Components', 'Hooks', 'State', 'Props'],
  },
  {
    id: 3,
    test: 'Node.js Backend',
    score: 82,
    maxScore: 100,
    date: '2024-01-08',
    duration: '35 mins',
    questions: 25,
    rank: 32,
    improvement: 8,
    subjects: ['Express', 'APIs', 'Database', 'Auth'],
  },
];

const interviewResults = [
  {
    id: 1,
    type: 'Technical Interview',
    interviewer: 'Sarah Johnson',
    date: '2024-01-10',
    duration: '55 mins',
    rating: 4.2,
    feedback: 'Strong problem-solving skills, good communication',
    strengths: ['Problem Solving', 'Communication', 'Code Quality'],
    improvements: ['Time Management', 'Edge Cases'],
  },
  {
    id: 2,
    type: 'Behavioral Interview',
    interviewer: 'Michael Chen',
    date: '2024-01-05',
    duration: '45 mins',
    rating: 4.5,
    feedback: 'Excellent examples, clear articulation of experiences',
    strengths: ['Leadership', 'Team Work', 'Communication'],
    improvements: ['Specific Metrics', 'Follow-up Questions'],
  },
];

export default function Results() {
  return (
    <DashboardLayout role="student" currentPath="/dashboard/student/results">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Performance Results</h1>
          <p className="text-gray-600">Track your progress and identify areas for improvement</p>
        </motion.div>

        {/* Overview Stats */}
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
                  <p className="text-sm font-medium text-gray-600">Overall Average</p>
                  <p className="text-2xl font-bold text-gray-900">82%</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+5% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tests Completed</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Calendar className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">8 this month</span>
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
              <div className="mt-4 flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm text-gray-600">JavaScript Test</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Time Saved</p>
                  <p className="text-2xl font-bold text-gray-900">32min</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">Improving efficiency</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="tests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tests">Test Results</TabsTrigger>
            <TabsTrigger value="interviews">Interview Feedback</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="tests" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-white/70 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Performance Trend
                    </CardTitle>
                    <CardDescription>Your score progression over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#3B82F6" 
                          strokeWidth={3}
                          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Skills Radar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="bg-white/70 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Skills Assessment
                    </CardTitle>
                    <CardDescription>Your performance across different areas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <RadarChart data={skillsData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="skill" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                          name="Score"
                          dataKey="score"
                          stroke="#8B5CF6"
                          fill="#8B5CF6"
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Test Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-white/70 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle>Recent Test Results</CardTitle>
                  <CardDescription>Your latest test performances and feedback</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentResults.map((result) => (
                    <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-1">{result.test}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{result.date}</span>
                            <span>{result.duration}</span>
                            <span>{result.questions} questions</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {result.score}%
                          </div>
                          <div className="flex items-center">
                            {result.improvement > 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                            )}
                            <span className={`text-sm ${result.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {result.improvement > 0 ? '+' : ''}{result.improvement}%
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Score</span>
                          <span className="font-medium">Rank #{result.rank}</span>
                        </div>
                        <Progress value={result.score} className="h-2" />
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {result.subjects.map((subject) => (
                          <Badge key={subject} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="interviews" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white/70 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle>Interview Feedback</CardTitle>
                  <CardDescription>Detailed feedback from your mock interviews</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {interviewResults.map((interview) => (
                    <div key={interview.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-1">{interview.type}</h3>
                          <p className="text-sm text-gray-600">with {interview.interviewer}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>{interview.date}</span>
                            <span>{interview.duration}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            <Star className="h-5 w-5 text-yellow-500 fill-current mr-1" />
                            <span className="text-lg font-bold">{interview.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50/50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700 italic">"{interview.feedback}"</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-green-700 mb-2 flex items-center">
                            <Award className="h-4 w-4 mr-1" />
                            Strengths
                          </h4>
                          <div className="space-y-1">
                            {interview.strengths.map((strength) => (
                              <Badge key={strength} variant="secondary" className="mr-1 mb-1 bg-green-100 text-green-800">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-orange-700 mb-2 flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            Areas for Improvement
                          </h4>
                          <div className="space-y-1">
                            {interview.improvements.map((improvement) => (
                              <Badge key={improvement} variant="secondary" className="mr-1 mb-1 bg-orange-100 text-orange-800">
                                {improvement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-white/70 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle>Test Categories</CardTitle>
                    <CardDescription>Distribution of your test attempts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {categoryData.map((category) => (
                        <div key={category.name} className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-sm text-gray-600">{category.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Detailed Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="bg-white/70 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle>Detailed Statistics</CardTitle>
                    <CardDescription>Comprehensive performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">15h</p>
                        <p className="text-sm text-gray-600">Total Study Time</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">7</p>
                        <p className="text-sm text-gray-600">Day Streak</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">450</p>
                        <p className="text-sm text-gray-600">Questions Solved</p>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">92%</p>
                        <p className="text-sm text-gray-600">Accuracy Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}