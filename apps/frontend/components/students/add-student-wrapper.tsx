'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  Eye,
  Edit,
  Trash2,
  UserX,
  UserCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Upload,
  RefreshCw,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { UserListItemDto } from '@mockai/sdk';
import {
  addStudentsAction,
  toggleStudentStatusAction,
  deleteStudentAction,
} from '@/app/dashboard/admin/students/_actions';

export default function AddStudentWrapper({
  availableStudents,
}: {
  availableStudents: UserListItemDto[] | undefined;
}) {
  const [students, setStudents] = useState<UserListItemDto[]>(
    availableStudents || [],
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailList, setEmailList] = useState('');

  // Filter students based on search and status
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && student.is_active) ||
      (statusFilter === 'inactive' && !student.is_active);
    return matchesSearch && matchesStatus;
  });

  const handleAddStudents = async () => {
    if (!emailList.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter at least one email address',
        variant: 'destructive',
      });
      return;
    }

    const emails = emailList
      .split('\n')
      .map((email) => email.trim())
      .filter((email) => email && email.includes('@'));

    if (emails.length === 0) {
      toast({
        title: 'Error',
        description: 'Please enter valid email addresses',
        variant: 'destructive',
      });
      return;
    }

    if (emails.length > 10) {
      toast({
        title: 'Error',
        description: 'You can only add up to 10 students at a time',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await addStudentsAction(emails);

      if (result.success) {
        // Refresh the page to get updated data
        window.location.reload();

        toast({
          title: 'Success',
          description: `Added ${emails.length} student(s) successfully`,
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to add students',
          variant: 'destructive',
        });
      }

      setEmailList('');
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add students. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (studentId: string, newStatus: boolean) => {
    try {
      const result = await toggleStudentStatusAction(studentId, newStatus);

      if (result.success) {
        // Refresh the page to get updated data
        window.location.reload();

        toast({
          title: 'Success',
          description: `Student ${
            newStatus ? 'activated' : 'deactivated'
          } successfully`,
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update student status',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update student status',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      const result = await deleteStudentAction(studentId);

      if (result.success) {
        // Refresh the page to get updated data
        window.location.reload();

        toast({
          title: 'Success',
          description: 'Student deleted successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete student',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete student',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getVerificationIcon = (isVerified: boolean) => {
    return isVerified ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <DashboardLayout role="admin" currentPath="/dashboard/admin/students">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Student Management</h1>
              <p className="text-blue-100">
                Manage student accounts, view performance, and control access
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="text-center sm:text-right">
                <p className="text-sm text-blue-100">Total Students</p>
                <p className="text-3xl font-bold">{students.length}</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white/20 hover:bg-white/30 border-white/30">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Students
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Students</DialogTitle>
                    <DialogDescription>
                      Add up to 10 students by entering their email addresses
                      (one per line)
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="emails">Email Addresses</Label>
                      <Textarea
                        id="emails"
                        placeholder="student1@example.com&#10;student2@example.com&#10;student3@example.com"
                        value={emailList}
                        onChange={(e) => setEmailList(e.target.value)}
                        className="min-h-[120px]"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {
                          emailList.split('\n').filter((email) => email.trim())
                            .length
                        }
                        /10 students
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddStudents} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Add Students'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
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
                  <p className="text-sm font-medium text-gray-600">
                    Active Students
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {students.filter((s) => s.is_active).length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Inactive Students
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {students.filter((s) => !s.is_active).length}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <UserX className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Email Verified
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {students.filter((s) => s.is_email_verified).length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Phone Verified
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {students.filter((s) => s.is_phone_verified).length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Phone className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'active' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('active')}
              size="sm"
            >
              Active
            </Button>
            <Button
              variant={statusFilter === 'inactive' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('inactive')}
              size="sm"
            >
              Inactive
            </Button>
          </div>
        </motion.div>

        {/* Students List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-white/70 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Students ({filteredStudents.length})</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No students found</p>
                  </div>
                ) : (
                  filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-gray-50/50 rounded-lg hover:bg-gray-50/70 transition-colors"
                    >
                      <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={`/placeholder-avatar-${student.id}.jpg`}
                          />
                          <AvatarFallback>
                            {student.full_name
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('') || student.email[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-800 truncate">
                              {student.full_name || 'No Name'}
                            </h4>
                            <Badge
                              className={getStatusColor(student.is_active)}
                            >
                              {student.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {student.email}
                            </span>
                            {student.phone_number && (
                              <span className="flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {student.country_code} {student.phone_number}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>
                              Joined:{' '}
                              {formatDate(student.created_at.toString())}
                            </span>
                            <span>
                              {student.enrolled_courses_count} courses
                            </span>
                            <span>0 tests</span>
                            {/* <span>Avg: {student.avg_score}%</span> */}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {getVerificationIcon(student.is_email_verified)}
                          {getVerificationIcon(student.is_phone_verified)}
                        </div>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant={
                                student.is_active ? 'outline' : 'default'
                              }
                              size="sm"
                              className={
                                student.is_active
                                  ? 'text-red-600 hover:text-red-700'
                                  : 'text-green-600 hover:text-green-700'
                              }
                            >
                              {student.is_active ? (
                                <>
                                  <UserX className="h-4 w-4 mr-1" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Activate
                                </>
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {student.is_active
                                  ? 'Deactivate Student'
                                  : 'Activate Student'}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to{' '}
                                {student.is_active ? 'deactivate' : 'activate'}{' '}
                                {student.full_name || student.email}?
                                {student.is_active
                                  ? ' They will not be able to access the platform until reactivated.'
                                  : ' They will regain access to the platform.'}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleToggleStatus(
                                    student.id,
                                    !student.is_active,
                                  )
                                }
                                className={
                                  student.is_active
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-green-600 hover:bg-green-700'
                                }
                              >
                                {student.is_active ? 'Deactivate' : 'Activate'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Student
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete{' '}
                                {student.full_name || student.email}? This
                                action cannot be undone and will permanently
                                remove all their data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteStudent(student.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
