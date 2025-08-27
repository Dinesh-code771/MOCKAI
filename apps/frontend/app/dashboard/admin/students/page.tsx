import AddStudentWrapper from '@/components/students/add-student-wrapper';
import { getStudentsList } from '@/lib/api-utils';

// Mock data - replace with actual API calls

export default async function StudentsManagementPage() {
  const students = await getStudentsList();

  return <AddStudentWrapper availableStudents={students} />;
}
