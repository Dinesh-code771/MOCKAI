'use client';

import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Building,
  Users,
  ShieldCheck,
  TrendingUp,
  Globe,
  Server,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Plus,
  Eye
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const systemData = [
  { month: 'Jan', users: 1200, workspaces: 45 },
  { month: 'Feb', users: 1450, workspaces: 52 },
  { month: 'Mar', users: 1680, workspaces: 58 },
  { month: 'Apr', users: 1920, workspaces: 64 },
  { month: 'May', users: 2340, workspaces: 71 },
  { month: 'Jun', users: 2670, workspaces: 78 },
];

const workspaceData = [
  { name: 'Active', value: 65, color: '#10B981' },
  { name: 'Inactive', value: 20, color: '#F59E0B' },
  { name: 'Suspended', value: 10, color: '#EF4444' },
  { name: 'Trial', value: 5, color: '#8B5CF6' },
];

const workspaces = [
  {
    id: 1,
    name: 'TechCorp University',
    domain: 'techcorp.edu',
    students: 1234,
    admins: 8,
    status: 'active',
    plan: 'Enterprise',
    lastActive: '2 hours ago',
    usage: 85,
  },
  {
    id: 2,
    name: 'StartupXYZ Academy',
    domain: 'startupxyz.com',
    students: 567,
    admins: 3,
    status: 'active',
    plan: 'Professional',
    lastActive: '1 day ago',
    usage: 62,
  },
  {
    id: 3,
    name: 'Global Institute',
    domain: 'global-inst.org',
    students: 2341,
    admins: 15,
    status: 'active',
    plan: 'Enterprise',
    lastActive: '30 minutes ago',
    usage: 94,
  },
  {
    id: 4,
    name: 'Local College',
    domain: 'localcollege.edu',
    students: 234,
    admins: 2,
    status: 'trial',
    plan: 'Trial',
    lastActive: '3 days ago',
    usage: 23,
  },
];

const systemAlerts = [
  {
    id: 1,
    type: 'warning',
    title: 'High CPU Usage',
    description: 'Server load is above 80%',
    time: '5 minutes ago',
  },
  {
    id: 2,
    type: 'info',
    title: 'New Workspace Created',
    description: 'DevBootcamp Academy joined the platform',
    time: '2 hours ago',
  },
  {
    id: 3,
    type: 'success',
    title: 'Backup Completed',
    description: 'Daily database backup successful',
    time: '6 hours ago',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    case 'suspended':
      return 'bg-red-100 text-red-800';
    case 'trial':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'info':
      return <Activity className="h-4 w-4 text-blue-500" />;
    default:
      return <Activity className="h-4 w-4 text-gray-500" />;
  }
};

export default function SuperAdminDashboard() {
  return (
    <DashboardLayout role="superadmin" currentPath="/dashboard/superadmin">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
              <p className="text-indigo-100">Manage workspaces, users, and system health</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-indigo-100">Total Workspaces</p>
              <p className="text-3xl font-bold">78</p>
            </div>
          </div>
        </motion.div>

        {/* System Stats */}
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
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">2,670</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+14% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Workspaces</p>
                  <p className="text-2xl font-bold text-gray-900">65</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Building className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Globe className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">83% uptime</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Health</p>
                  <p className="text-2xl font-bold text-gray-900">98%</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Server className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">All systems operational</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Storage Used</p>
                  <p className="text-2xl font-bold text-gray-900">2.4TB</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Database className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={68} className="h-2" />
                <span className="text-sm text-gray-600">68% of 3.5TB</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Growth Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle>Platform Growth</CardTitle>
                <CardDescription>Users and workspaces over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={systemData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      name="Users"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="workspaces" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      name="Workspaces"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Workspace Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle>Workspace Status</CardTitle>
                <CardDescription>Distribution of workspace states</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={workspaceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {workspaceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-4">
                  {workspaceData.map((item) => (
                    <div key={item.name} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-600">{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workspaces */}
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
                      <Building className="h-5 w-5 mr-2" />
                      Workspaces
                    </CardTitle>
                    <CardDescription>Manage institutional workspaces</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Workspace
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {workspaces.map((workspace) => (
                  <div key={workspace.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`/placeholder-workspace-${workspace.id}.jpg`} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          {workspace.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-800">{workspace.name}</h4>
                          <Badge className={getStatusColor(workspace.status)}>
                            {workspace.status}
                          </Badge>
                          <Badge variant="outline">{workspace.plan}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{workspace.domain}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500">{workspace.students} students</span>
                          <span className="text-xs text-gray-500">{workspace.admins} admins</span>
                          <span className="text-xs text-gray-500">{workspace.lastActive}</span>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-600">Usage</span>
                            <span className="font-medium">{workspace.usage}%</span>
                          </div>
                          <Progress value={workspace.usage} className="h-1" />
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* System Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="bg-white/70 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShieldCheck className="h-5 w-5 mr-2" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50/50 rounded-lg">
                    <div className="mt-0.5">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-800">{alert.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
                      <div className="flex items-center mt-2">
                        <Clock className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">{alert.time}</span>
                      </div>
                    </div>
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
              <CardTitle>System Management</CardTitle>
              <CardDescription>Administrative tools and system controls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600">
                  <Building className="h-6 w-6 mb-2" />
                  Manage Workspaces
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-purple-600">
                  <Users className="h-6 w-6 mb-2" />
                  User Management
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center bg-gradient-to-r from-green-500 to-green-600">
                  <Server className="h-6 w-6 mb-2" />
                  System Health
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center bg-gradient-to-r from-red-500 to-red-600">
                  <ShieldCheck className="h-6 w-6 mb-2" />
                  Security Center
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}