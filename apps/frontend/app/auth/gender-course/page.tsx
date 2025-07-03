import UserGenderAndCourse from '@/components/user/userGenderAndCourse';
import { getUserProfile, verifySession } from '../actions';
import { redirect } from 'next/navigation';
import React from 'react';
import { getCourses } from '../actions';

export default async function GenderCoursePage() {
  const { data, error } = await getUserProfile();
  const courses = await getCourses();
  if (data?.profile?.gender && data?.profile?.enrolled_courses) {
    redirect('/dashboard/student');
  }

  return React.createElement(UserGenderAndCourse, { courses });
}
