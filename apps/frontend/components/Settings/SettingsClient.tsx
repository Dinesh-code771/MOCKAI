'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  User,
  Mail,
  Phone,
  BookOpen,
  Users,
  Camera,
  Save,
  Edit3,
  X,
} from 'lucide-react';
import { updateUserProfileAction } from '@/app/auth/actions';
import { useToast } from '@/hooks/use-toast';
import { UserProfileDto } from '@mockai/sdk';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  enrolled_courses?: string[];
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
}

export default function SettingsClient({
  userProfile,
}: {
  userProfile: UserProfileDto | undefined | null;
}) {
  const [profile, setProfile] = useState<UserProfileDto | null | undefined>(
    userProfile,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfileDto | null>(
    null,
  );

  const { toast } = useToast();
  console.log(profile, 'profile');

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile || null);
  };

  const handleCancel = () => {
    setEditedProfile(profile || null);
    setIsEditing(false);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Create FormData for server action
      const formData = new FormData();
      if (editedProfile) {
        formData.append('full_name', editedProfile.full_name || '');
        formData.append('email', editedProfile.email || '');
        if (editedProfile.phone_number)
          formData.append('phone_number', editedProfile.phone_number);
        if (
          editedProfile.enrolled_courses &&
          editedProfile.enrolled_courses.length > 0
        ) {
          // Extract course IDs from CourseDto objects
          const courseIds = editedProfile.enrolled_courses.map((course) =>
            typeof course === 'string' ? course : course.id,
          );
          formData.append('enrolled_courses', courseIds[0]);
        }
        if (editedProfile.gender)
          formData.append('gender', editedProfile.gender);
      }

      const result = await updateUserProfileAction(formData);

      if (result.success) {
        setProfile(editedProfile);
        setIsEditing(false);

        toast({
          title: 'Success',
          description: result.message || 'Profile updated successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to update profile',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserProfileDto, value: string) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [field]: value,
      });
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editedProfile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditedProfile({
          ...editedProfile,
          avatar: e.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Account Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your profile and preferences
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="backdrop-blur-lg bg-white/70 border-white/20 shadow-xl">
              <CardHeader className="text-center pb-4 flex flex-row  gap-6 items-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-white shadow-lg">
                    <AvatarImage src={editedProfile?.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl">
                      {editedProfile?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div className="flex flex-col gap-2 items-start justify-center">
                  <CardTitle className="text-xl">
                    {profile?.full_name}
                  </CardTitle>
                  <p className="text-gray-500 text-sm">{profile?.email}</p>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Settings Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Information */}
            <Card className="backdrop-blur-lg bg-white/70 border-white/20 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <CardTitle>Personal Information</CardTitle>
                  </div>
                  {!isEditing ? (
                    <Button
                      onClick={handleEdit}
                      variant="outline"
                      size="sm"
                      className="bg-white/50 hover:bg-white/70"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                        className="bg-white/50 hover:bg-white/70"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        value={editedProfile?.full_name || ''}
                        onChange={(e) =>
                          handleInputChange('full_name', e.target.value)
                        }
                        disabled={!isEditing}
                        className="pl-10 bg-white/50 border-gray-200"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={profile?.email || ''}
                        onChange={(e) =>
                          handleInputChange('email', e.target.value)
                        }
                        disabled={!isEditing}
                        className="pl-10 bg-white/50 border-gray-200"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={editedProfile?.phone_number || ''}
                        onChange={(e) =>
                          handleInputChange('phone_number', e.target.value)
                        }
                        disabled={!isEditing}
                        className="pl-10 bg-white/50 border-gray-200"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  {/* Course */}
                  <div className="space-y-2">
                    <Label htmlFor="course" className="text-sm font-medium">
                      Course Enrolled
                    </Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Select
                        value={editedProfile?.enrolled_courses?.[0]?.id || ''}
                        onValueChange={(value) => {
                          if (editedProfile) {
                            setEditedProfile({
                              ...editedProfile,
                              enrolled_courses: [{ id: value, name: '' }],
                            });
                          }
                        }}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="pl-10 bg-white/50 border-gray-200">
                          <SelectValue placeholder="Select your course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Computer Science">
                            Computer Science
                          </SelectItem>
                          <SelectItem value="Engineering">
                            Engineering
                          </SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Arts">Arts</SelectItem>
                          <SelectItem value="Medicine">Medicine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium">
                      Gender
                    </Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Select
                        value={profile?.gender || ''}
                        onValueChange={(value) =>
                          handleInputChange('gender', value)
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="pl-10 bg-white/50 border-gray-200">
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
