'use client';

import { useState, useEffect } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  FileText,
  Clock,
  Target,
  Users,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

import { AssessmentsControllerGetAssessmentsListTypeEnum } from '@mockai/sdk';
import { AssessmentsControllerGetAssessmentsListDifficultyEnum } from '@mockai/sdk';
import { AssessmentsControllerGetAssessmentsListDraftAssessmentEnum } from '@mockai/sdk';
import { assessmentApi } from '@/lib/api-client';
interface Assessment {
  id: string;
  name: string;
  type: string;
  difficulty: string;
  duration_minutes: number;
  description: string;
  max_score: number;
  total_questions: number;
  is_published: boolean;
  created_at: string;
  course?: {
    id: string;
    name: string;
  };
}

export default function AssessmentsList() {
  const [subjectiveAssessments, setSubjectiveAssessments] = useState<
    Assessment[]
  >([]);
  const [mcqAssessments, setMcqAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchAssessments() {
      await fetchSubjectiveAssessments();
      await fetchMcqAssessments();
    }
    fetchAssessments();
  }, []);

  //fetch subjective assessments
  const fetchSubjectiveAssessments = async () => {
    try {
      setLoading(true);

      const response =
        await assessmentApi.assessmentsControllerGetAssessmentsList({
          type: AssessmentsControllerGetAssessmentsListTypeEnum.Subjective,
          difficulty:
            AssessmentsControllerGetAssessmentsListDifficultyEnum.Intermediate,
          page: 1,
          limit: 20,
          draftAssessment:
            AssessmentsControllerGetAssessmentsListDraftAssessmentEnum.True,
        });


      if (response.data?.assessments) {
        setSubjectiveAssessments(
          response.data.assessments as unknown as Assessment[],
        );
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
      toast.error('Failed to load available interviews');
    } finally {
      setLoading(false);
    }
  };

  //fetch mcq assessments
  const fetchMcqAssessments = async () => {
    const response =
      await assessmentApi.assessmentsControllerGetAssessmentsList({
        type: AssessmentsControllerGetAssessmentsListTypeEnum.Mcq,
        draftAssessment:
          AssessmentsControllerGetAssessmentsListDraftAssessmentEnum.True,
      });

    if (response.data?.assessments) {
      setMcqAssessments(response.data.assessments as unknown as Assessment[]);
    }
  };

  const handlePublishAssessment = async (assessmentId: string) => {
    try {
      await assessmentApi.assessmentsControllerPublishAssessment({
        assessmentId: assessmentId,
      });

      toast.success('Assessment published successfully!');

      // Refresh the assessments list to update the published status
      await fetchSubjectiveAssessments();
      await fetchMcqAssessments();
    } catch (error) {
      console.error('Error publishing assessment:', error);
      toast.error('Failed to publish assessment');
    }
  };

  const filteredAssessments = subjectiveAssessments
    .concat(mcqAssessments)
    .filter(
      (assessment) =>
        assessment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        assessment.course?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'mcq':
        return 'bg-blue-100 text-blue-800';
      case 'coding':
        return 'bg-purple-100 text-purple-800';
      case 'interview':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="admin" currentPath="/dashboard/admin/assessments">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading assessments...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin" currentPath="/dashboard/admin/assessments">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
            <p className="text-gray-600">
              Manage and create assessments for students
            </p>
          </div>
          <Button
            onClick={() =>
              (window.location.href = '/dashboard/admin/assessments/create')
            }
            className="bg-gradient-to-r from-purple-500 to-pink-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Assessment
          </Button>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center space-x-4"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search assessments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Badge variant="outline" className="text-sm">
            {filteredAssessments.length} assessments
          </Badge>
        </motion.div>

        {/* Assessments Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAssessments.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No assessments found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'Get started by creating your first assessment'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() =>
                    (window.location.href =
                      '/dashboard/admin/assessments/create')
                  }
                  className="bg-gradient-to-r from-purple-500 to-pink-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assessment
                </Button>
              )}
            </div>
          ) : (
            filteredAssessments.map((assessment, index) => (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {assessment.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getTypeColor(assessment.type)}>
                            {assessment.type.toUpperCase()}
                          </Badge>
                          <Badge
                            className={getDifficultyColor(
                              assessment.difficulty,
                            )}
                          >
                            {assessment.difficulty}
                          </Badge>
                          {assessment.is_published && (
                            <Badge className="bg-green-100 text-green-800">
                              Published
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {assessment.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          {assessment.duration_minutes} min
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          {assessment.max_score} pts
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          {assessment.total_questions} questions
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">0 taken</span>
                      </div>
                    </div>

                    {assessment.course && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Course:</span>{' '}
                          {assessment.course.name}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(assessment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <button
                          onClick={() => handlePublishAssessment(assessment.id)}
                          disabled={assessment.is_published}
                          className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 ${
                            assessment.is_published
                              ? 'bg-green-100 text-green-800 border-green-200 cursor-not-allowed'
                              : 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
                          }`}
                        >
                          {assessment.is_published ? 'Published' : 'Publish'}
                        </button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
