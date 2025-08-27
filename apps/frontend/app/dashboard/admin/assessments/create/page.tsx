'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Clock,
  Target,
  FileText,
  ChevronRight,
  ChevronLeft,
  Eye,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { createAssessmentAction } from '../_actions';
import { getCourses } from '@/app/auth/actions';

interface Question {
  id: string;
  question_text: string;
  question_type: 'mcq' | 'subjective';
  options: string[];
  correct_answer: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  order_sequence: number;
}

interface AssessmentForm {
  id: string;
  course_id: string;
  name: string;
  type: 'mcq' | 'subjective';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  description: string;
  max_score: number;
  max_questions: number;
  questions: Question[];
}

const assessmentTypes = [
  {
    value: 'mcq',
    label: 'Multiple Choice Questions (MCQ)',
    description: 'Questions with predefined answer options',
  },
  {
    value: 'subjective',
    label: 'Subjective Questions',
    description: 'Open-ended questions requiring detailed answers',
  },
];

const difficulties = [
  {
    value: 'beginner',
    label: 'Beginner',
    color: 'bg-green-100 text-green-800',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    color: 'bg-yellow-100 text-yellow-800',
  },
  { value: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-800' },
];

export default function CreateAssessment() {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [courses, setCourses] = useState<any>([]);
  const [formData, setFormData] = useState<AssessmentForm>({
    id: uuidv4(),
    course_id: '',
    name: '',
    type: 'mcq',
    difficulty: 'intermediate',
    duration_minutes: 60,
    description: '',
    max_score: 100,
    max_questions: 10, // Default to 10 questions
    questions: Array.from({ length: 10 }, (_, index) => ({
      id: uuidv4(),
      question_text: '',
      question_type: 'mcq',
      options: ['', '', '', ''],
      correct_answer: '',
      difficulty: 'intermediate',
      order_sequence: index + 1,
    })),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof AssessmentForm, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const updateQuestion = (
    questionIndex: number,
    field: keyof Question,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, index) =>
        index === questionIndex ? { ...q, [field]: value } : q,
      ),
    }));
  };

  const updateQuestionOption = (
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, index) =>
        index === questionIndex
          ? {
              ...q,
              options: q.options.map((opt, optIndex) =>
                optIndex === optionIndex ? value : opt,
              ),
            }
          : q,
      ),
    }));
  };

  const updateQuestionCount = (newCount: number) => {
    setFormData((prev) => {
      const currentCount = prev.questions.length;

      if (newCount > currentCount) {
        // Add more questions
        const newQuestions = Array.from(
          { length: newCount - currentCount },
          (_, index) => ({
            id: uuidv4(),
            question_text: '',
            question_type: prev.type as 'mcq' | 'subjective',
            options: prev.type === 'mcq' ? ['', '', '', ''] : [],
            correct_answer: '',
            difficulty: 'intermediate' as const,
            order_sequence: currentCount + index + 1,
          }),
        );

        return {
          ...prev,
          max_questions: newCount,
          questions: [...prev.questions, ...newQuestions],
        };
      } else if (newCount < currentCount) {
        // Remove questions (keep the first newCount questions)
        return {
          ...prev,
          max_questions: newCount,
          questions: prev.questions.slice(0, newCount).map((q, index) => ({
            ...q,
            order_sequence: index + 1,
          })),
        };
      }

      return prev;
    });

    // Reset current question if it's now out of bounds
    if (currentQuestion > newCount) {
      setCurrentQuestion(newCount);
    }
  };

  // Update all questions when assessment type changes
  const updateAssessmentType = (newType: 'mcq' | 'subjective') => {
    setFormData((prev) => ({
      ...prev,
      type: newType,
      questions: prev.questions.map((q) => ({
        ...q,
        question_type: newType,
        options: newType === 'mcq' ? ['', '', '', ''] : [],
        correct_answer: '',
      })),
    }));
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.course_id) newErrors.course_id = 'Please select a course';
      if (!formData.name.trim()) newErrors.name = 'Assessment name is required';
      if (!formData.description.trim())
        newErrors.description = 'Description is required';
      if (formData.duration_minutes < 1)
        newErrors.duration_minutes = 'Duration must be at least 1 minute';
    }

    if (step === 2) {
      const question = formData.questions[currentQuestion - 1];
      if (!question.question_text.trim())
        newErrors.question_text = 'Question text is required';

      // Only validate options and correct answer for MCQ type
      if (formData.type === 'mcq') {
        if (question.options.some((opt) => !opt.trim()))
          newErrors.options = 'All options must be filled';
        if (!question.correct_answer)
          newErrors.correct_answer = 'Please select the correct answer';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 1) {
        setCurrentStep(2);
      } else if (currentStep === 2) {
        if (currentQuestion < formData.max_questions) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setCurrentStep(3);
        }
      }
    }
  };

  const prevStep = () => {
    if (currentStep === 2 && currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentStep === 2 && currentQuestion === 1) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
      setCurrentQuestion(formData.max_questions);
    }
  };

  const handleSubmit = async () => {
    if (validateStep(3)) {
      try {
        // Format the payload according to the required structure
        const payload = {
          // Don't send ID for new assessments - let the backend generate it
          course_id: formData.course_id,
          name: formData.name,
          type: formData.type,
          difficulty: formData.difficulty,
          duration_minutes: formData.duration_minutes,
          description: formData.description,
          max_score: formData.max_score,
          max_questions: formData.max_questions,
          questions: formData.questions.map((q) => ({
            // Don't send question IDs for new questions - let the backend generate them
            question_text: q.question_text,
            question_type: q.question_type,

            difficulty: q.difficulty,
            order_sequence: q.order_sequence,
            ...(formData.type === 'mcq'
              ? {
                  options: q.options,
                  correct_answer: q.correct_answer,
                }
              : {}),
          })),
        };

        console.log('Submitting assessment payload:', payload);

        const response = await createAssessmentAction(payload);
        console.log('Response:', response);
        if (response) {
          alert('Assessment created successfully!');
          // Redirect to assessments list
          window.location.href = '/dashboard/admin/assessments';
        } else {
          alert('Failed to create assessment');
        }
      } catch (error) {
        console.error('Error creating assessment:', error);
        alert(
          `Error creating assessment: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        );
      }
    }
  };

  const getProgressPercentage = () => {
    if (currentStep === 1) return 33;
    if (currentStep === 2)
      return 33 + ((currentQuestion - 1) / formData.max_questions) * 33;
    return 100;
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const courses = await getCourses();
      console.log('courses', courses);
      setCourses(courses?.courses);
    };
    fetchCourses();
  }, []);

  return (
    <DashboardLayout
      role="admin"
      currentPath="/dashboard/admin/assessments/create"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create Assessment
              </h1>
              <p className="text-gray-600">
                Build a comprehensive assessment with 5-25 questions
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm">
            Step {currentStep} of 3
          </Badge>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full bg-gray-200 rounded-full h-2"
        >
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    <span>Assessment Details</span>
                  </CardTitle>
                  <CardDescription>
                    Configure the basic information for your assessment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="assessment_type">Assessment Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: 'mcq' | 'subjective') =>
                        updateAssessmentType(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assessment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {assessmentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex flex-col">
                              <span className="font-medium">{type.label}</span>
                              <span className="text-sm text-gray-500">
                                {type.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="course">Course *</Label>
                      <Select
                        value={formData.course_id}
                        onValueChange={(value) =>
                          updateFormData('course_id', value)
                        }
                      >
                        <SelectTrigger
                          className={errors.course_id ? 'border-red-500' : ''}
                        >
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses &&
                            courses?.map((course: any) => (
                              <SelectItem key={course.id} value={course.id}>
                                {course.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {errors.course_id && (
                        <p className="text-sm text-red-500">
                          {errors.course_id}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty Level *</Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value: any) =>
                          updateFormData('difficulty', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {difficulties.map((diff) => (
                            <SelectItem key={diff.value} value={diff.value}>
                              <div className="flex items-center space-x-2">
                                <Badge className={diff.color}>
                                  {diff.label}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Assessment Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      placeholder="e.g., JavaScript Fundamentals Test"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        updateFormData('description', e.target.value)
                      }
                      placeholder="Describe what this assessment covers..."
                      rows={3}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes) *</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration_minutes}
                        onChange={(e) =>
                          updateFormData(
                            'duration_minutes',
                            parseInt(e.target.value),
                          )
                        }
                        min="1"
                        max="480"
                        className={
                          errors.duration_minutes ? 'border-red-500' : ''
                        }
                      />
                      {errors.duration_minutes && (
                        <p className="text-sm text-red-500">
                          {errors.duration_minutes}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max_score">Maximum Score</Label>
                      <Input
                        id="max_score"
                        type="number"
                        value={formData.max_score}
                        onChange={(e) =>
                          updateFormData('max_score', parseInt(e.target.value))
                        }
                        min="1"
                        max="100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="question_count">
                      Number of Questions *
                    </Label>
                    <Select
                      value={formData.max_questions.toString()}
                      onValueChange={(value) =>
                        updateQuestionCount(parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of questions" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.type === 'mcq'
                          ? Array.from({ length: 21 }, (_, i) => i + 5).map(
                              (num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} questions
                                </SelectItem>
                              ),
                            )
                          : Array.from({ length: 8 }, (_, i) => i + 3).map(
                              (num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} questions
                                </SelectItem>
                              ),
                            )}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500">
                      {formData.type === 'mcq'
                        ? 'Choose between 5 and 25 questions for your assessment'
                        : 'Choose between 3 and 10 questions for subjective assessment'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-purple-600" />
                        <span>
                          Question {currentQuestion} of {formData.max_questions}
                        </span>
                      </CardTitle>
                      <CardDescription>
                        {formData.type === 'mcq'
                          ? 'Create your multiple choice question'
                          : 'Create your subjective question'}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {Math.round(
                        (currentQuestion / formData.max_questions) * 100,
                      )}
                      % Complete
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="question">Question Text *</Label>
                    <Textarea
                      id="question"
                      value={
                        formData.questions[currentQuestion - 1].question_text
                      }
                      onChange={(e) =>
                        updateQuestion(
                          currentQuestion - 1,
                          'question_text',
                          e.target.value,
                        )
                      }
                      placeholder="Enter your question here..."
                      rows={3}
                      className={errors.question_text ? 'border-red-500' : ''}
                    />
                    {errors.question_text && (
                      <p className="text-sm text-red-500">
                        {errors.question_text}
                      </p>
                    )}
                  </div>

                  {formData.type === 'mcq' && (
                    <div className="space-y-2">
                      <Label>Options *</Label>
                      <div className="space-y-3">
                        {formData.questions[currentQuestion - 1].options.map(
                          (option, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3"
                            >
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                                {String.fromCharCode(65 + index)}
                              </div>
                              <Input
                                value={option}
                                onChange={(e) =>
                                  updateQuestionOption(
                                    currentQuestion - 1,
                                    index,
                                    e.target.value,
                                  )
                                }
                                placeholder={`Option ${String.fromCharCode(
                                  65 + index,
                                )}`}
                                className={
                                  errors.options ? 'border-red-500' : ''
                                }
                              />
                            </div>
                          ),
                        )}
                      </div>
                      {errors.options && (
                        <p className="text-sm text-red-500">{errors.options}</p>
                      )}
                    </div>
                  )}

                  {formData.type === 'mcq' && (
                    <div className="space-y-2">
                      <Label>Correct Answer *</Label>
                      {(() => {
                        const currentOptions =
                          formData.questions[currentQuestion - 1].options;
                        const filledOptions = currentOptions.filter(
                          (option) => option && option.trim() !== '',
                        );

                        if (filledOptions.length < 2) {
                          return (
                            <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded border">
                              Please fill in at least 2 options before selecting
                              the correct answer.
                            </div>
                          );
                        }

                        return (
                          <Select
                            value={
                              formData.questions[currentQuestion - 1]
                                .correct_answer
                            }
                            onValueChange={(value) =>
                              updateQuestion(
                                currentQuestion - 1,
                                'correct_answer',
                                value,
                              )
                            }
                          >
                            <SelectTrigger
                              className={
                                errors.correct_answer ? 'border-red-500' : ''
                              }
                            >
                              <SelectValue placeholder="Select the correct answer" />
                            </SelectTrigger>
                            <SelectContent>
                              {filledOptions.map((option, index) => {
                                const originalIndex =
                                  currentOptions.indexOf(option);
                                return (
                                  <SelectItem
                                    key={originalIndex}
                                    value={option}
                                  >
                                    {String.fromCharCode(65 + originalIndex)}:{' '}
                                    {option}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        );
                      })()}
                      {errors.correct_answer && (
                        <p className="text-sm text-red-500">
                          {errors.correct_answer}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Question Difficulty</Label>
                    <Select
                      value={formData.questions[currentQuestion - 1].difficulty}
                      onValueChange={(value: any) =>
                        updateQuestion(currentQuestion - 1, 'difficulty', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map((diff) => (
                          <SelectItem key={diff.value} value={diff.value}>
                            <Badge className={diff.color}>{diff.label}</Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Review & Create</span>
                  </CardTitle>
                  <CardDescription>
                    Review your assessment before creating it
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">
                        Assessment Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{formData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Course:</span>
                          <span className="font-medium">
                            {
                              courses.find(
                                (c: any) => c.id === formData.course_id,
                              )?.name
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Difficulty:</span>
                          <Badge
                            className={
                              difficulties.find(
                                (d) => d.value === formData.difficulty,
                              )?.color
                            }
                          >
                            {
                              difficulties.find(
                                (d) => d.value === formData.difficulty,
                              )?.label
                            }
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">
                            {formData.duration_minutes} minutes
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Questions:</span>
                          <span className="font-medium">
                            {formData.questions.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Max Score:</span>
                          <span className="font-medium">
                            {formData.max_score}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">
                        Questions Summary
                      </h3>
                      <div className="space-y-2">
                        {formData.questions.map((question, index) => (
                          <div
                            key={question.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <span className="text-sm">
                              Q{index + 1}:{' '}
                              {question.question_text.substring(0, 50)}...
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {question.difficulty}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Ready to create your assessment?
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const payload = {
                            // Don't send ID for new assessments - let the backend generate it
                            course_id: formData.course_id,
                            name: formData.name,
                            type: formData.type,
                            difficulty: formData.difficulty,
                            duration_minutes: formData.duration_minutes,
                            description: formData.description,
                            max_score: formData.max_score,
                            max_questions: formData.max_questions,
                            questions: formData.questions.map((q) => ({
                              // Don't send question IDs for new questions - let the backend generate them
                              question_text: q.question_text,
                              question_type: q.question_type,
                              options: q.options,
                              correct_answer: q.correct_answer,
                              difficulty: q.difficulty,
                              order_sequence: q.order_sequence,
                            })),
                          };
                          console.log(
                            'Assessment Payload:',
                            JSON.stringify(payload, null, 2),
                          );
                          alert(
                            'Payload logged to console. Check browser developer tools.',
                          );
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Payload
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-purple-500 to-pink-600"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Create Assessment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 && currentQuestion === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < 3 && (
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-purple-500 to-pink-600"
            >
              {currentStep === 2 && currentQuestion === 25 ? 'Review' : 'Next'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
