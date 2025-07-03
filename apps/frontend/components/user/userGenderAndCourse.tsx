'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, GraduationCap, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { usersApi } from '@/lib/api-client';
import {
  CoursesResponseDto,
  UpdateUserProfileDtoGenderEnum,
} from '@mockai/sdk';
import cookieUtils from '@/lib/cookie-utils';
export default function UserGenderAndCourse({
  courses,
}: {
  courses: CoursesResponseDto | undefined | null;
}) {
  const [gender, setGender] = useState('');
  const [course, setCourse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!gender) {
      toast.error('Please select your gender');
      return;
    }

    if (!course) {
      toast.error('Please select your enrolled course');
      return;
    }

    setIsLoading(true);

    setIsCompleted(true);
    toast.success('Profile completed successfully!');

    const response = await usersApi.usersControllerUpdateUserProfile({
      updateUserProfileDto: {
        gender: gender as UpdateUserProfileDtoGenderEnum,
        enrolled_courses: [course],
      },
    });

    console.log(response, 'response');

    // Navigate to student dashboard after a brief delay
    setTimeout(() => {
      router.push('/dashboard/student');
    }, 1500);

    setIsLoading(false);
  };

  const handleBackToOtp = () => {
    router.push('/auth/otp');
  };

  console.log(courses, 'courses');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Complete Your Profile
          </h1>
          <p className="text-gray-600 mt-2">
            Help us personalize your experience
          </p>
        </div>

        <Card className="backdrop-blur-lg bg-white/70 border-white/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle>Profile Setup</CardTitle>
            <CardDescription>Tell us a bit about yourself</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isCompleted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h3 className="text-lg font-semibold text-green-600">
                  Profile Completed!
                </h3>
                <p className="text-gray-600">
                  Redirecting to your dashboard...
                </p>
              </motion.div>
            ) : (
              <>
                <div className="space-y-4">
                  <Label className="text-base font-medium">Gender</Label>
                  <RadioGroup
                    value={gender}
                    onValueChange={setGender}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="text-sm font-normal">
                        Male
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="text-sm font-normal">
                        Female
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other" className="text-sm font-normal">
                        Other
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="course" className="text-base font-medium">
                    Enrolled Course
                  </Label>
                  <Select value={course} onValueChange={setCourse}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses?.courses?.map((courseOption) => (
                        <SelectItem
                          key={courseOption.id}
                          value={courseOption.id}
                        >
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="w-4 h-4" />
                            <span>{courseOption.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 pt-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || !gender || !course}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {isLoading ? 'Completing Profile...' : 'Complete Profile'}
                  </Button>

                  <Button
                    onClick={handleBackToOtp}
                    variant="ghost"
                    className="w-full text-gray-600 hover:text-gray-800"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to OTP
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
