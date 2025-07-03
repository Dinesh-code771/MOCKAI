import { Injectable } from '@nestjs/common';
import {
  AssessmentResponseDto,
  AssessmentListResponseDto,
} from '@assessments/dto/assessment-list.dto';
import {
  UserAssessmentListResponseDto,
  UserAssessmentItemDto,
} from '@assessments/dto/user-assessment-list.dto';
import {
  CompleteAssessmentResponseDto,
  UserAnswerDto,
  UserAssessmentResponseDto,
} from '@assessments/dto/start-assessment.dto';
import { PaginationDetailsDto } from '@common/dto/pagination.dto';
import { AssessmentStatus } from '@assessments/enum/assessment-status.enum';

@Injectable()
export class AssessmentsTransform {
  transformToAssessmentResponse(assessment: any): AssessmentResponseDto {
    return {
      id: assessment.id,
      name: assessment.name,
      type: assessment.type,
      difficulty: assessment.difficulty,
      duration_minutes: assessment.duration_minutes,
      description: assessment.description,
      max_score: Number(assessment.max_score),
      total_questions: assessment.total_questions,
      course: assessment.courses
        ? {
            id: assessment.courses.id,
            name: assessment.courses.name,
          }
        : null,
      created_at: assessment.created_at,
    };
  }

  transformToAssessmentListResponse(
    assessments: any[],
    pagination: PaginationDetailsDto,
  ): AssessmentListResponseDto {
    return {
      assessments: assessments.map((assessment) =>
        this.transformToAssessmentResponse(assessment),
      ),
      pagination,
    };
  }

  transformToUserAssessmentListResponse(
    assessments: any[],
    pagination: PaginationDetailsDto,
  ): UserAssessmentListResponseDto {
    const userAssessments = assessments.map((assessment) =>
      this.transformToUserAssessmentItem(assessment),
    );

    return {
      assessments: userAssessments,
      pagination,
    };
  }

  private transformToUserAssessmentItem(
    assessment: any,
  ): UserAssessmentItemDto {
    const userAssessment = assessment.user_assessments[0];
    const shouldShowScores =
      userAssessment.status === AssessmentStatus.COMPLETED;

    return {
      id: assessment.id,
      name: assessment.name,
      type: assessment.type,
      difficulty: assessment.difficulty,
      duration_minutes: assessment.duration_minutes,
      description: assessment.description,
      max_score: Number(assessment.max_score),
      total_questions: assessment.total_questions,
      created_at: assessment.created_at,
      user_assessment: {
        id: userAssessment.id,
        status: userAssessment.status,
        started_at: userAssessment.started_at,
        completed_at: userAssessment.completed_at,
        total_score: shouldShowScores ? userAssessment.total_score : null,
        percentage_score: shouldShowScores
          ? userAssessment.percentage_score
          : null,
        feedback: userAssessment.feedback,
        scheduled_at: userAssessment.scheduled_at,
        weak_areas: userAssessment.weak_areas,
        strong_areas: userAssessment.strong_areas,
        created_at: userAssessment.created_at,
      },
      course: assessment.courses
        ? {
            id: assessment.courses.id,
            name: assessment.courses.name,
          }
        : null,
    };
  }

  transformToStartAssessmentResponse(data: any): UserAssessmentResponseDto {
    const { userAssessment, questions, remainingTimeSeconds } = data;

    return {
      id: userAssessment.id,
      user_id: userAssessment.user_id,
      assessment_id: userAssessment.assessment_id,
      scheduled_at: userAssessment.scheduled_at,
      started_at: userAssessment.started_at,
      status: userAssessment.status,
      assessment: {
        id: userAssessment.assessments.id,
        name: userAssessment.assessments.name,
        type: userAssessment.assessments.type,
        difficulty: userAssessment.assessments.difficulty,
        duration_minutes: userAssessment.assessments.duration_minutes,
        description: userAssessment.assessments.description,
        max_score: userAssessment.assessments.max_score
          ? Number(userAssessment.assessments.max_score)
          : 100,
        total_questions: userAssessment.assessments.total_questions,
        course: userAssessment.assessments.courses
          ? {
              id: userAssessment.assessments.courses.id,
              name: userAssessment.assessments.courses.name,
            }
          : null,
      },
      questions: questions.map((q: any) => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: Array.isArray(q.options) ? (q.options as string[]) : null,
        difficulty: q.difficulty,
        order_sequence: q.order_sequence,
        user_answers: q.user_answers?.length
          ? {
              id: q.user_answers[0].id,
              answer: q.user_answers[0].answer,
              is_correct: q.user_answers[0].is_correct,
              points_earned: q.user_answers[0].points_earned,
            }
          : null,
      })),
      remaining_time_seconds: remainingTimeSeconds,
    };
  }

  transformToUserAnswerResponse(userAnswer: any): UserAnswerDto {
    return {
      id: userAnswer.id,
      answer: userAnswer.answer,
      is_correct: userAnswer.is_correct,
      points_earned: Number(userAnswer?.points_earned || 0),
    };
  }

  transformToCompleteAssessmentResponse(
    data: any,
  ): CompleteAssessmentResponseDto {
    const { userAssessment, questions } = data;

    return {
      id: userAssessment.id,
      user_id: userAssessment.user_id,
      assessment_id: userAssessment.assessment_id,
      scheduled_at: userAssessment.scheduled_at,
      started_at: userAssessment.started_at,
      status: userAssessment.status,
      total_score: Number(userAssessment?.total_score || 0),
      percentage_score: Number(userAssessment?.percentage_score || 0),
      assessment: {
        id: userAssessment.assessments.id,
        name: userAssessment.assessments.name,
        type: userAssessment.assessments.type,
        difficulty: userAssessment.assessments.difficulty,
        duration_minutes: userAssessment.assessments.duration_minutes,
        description: userAssessment.assessments.description,
        max_score: userAssessment.assessments.max_score
          ? Number(userAssessment.assessments.max_score)
          : 100,
        total_questions: userAssessment.assessments.total_questions,
        course: userAssessment.assessments.courses
          ? {
              id: userAssessment.assessments.courses.id,
              name: userAssessment.assessments.courses.name,
            }
          : null,
      },
      questions: questions.map((q: any) => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: Array.isArray(q.options) ? (q.options as string[]) : null,
        difficulty: q.difficulty,
        order_sequence: q.order_sequence,
        correct_answer: q.correct_answer,
        user_answers: q.user_answers?.length
          ? {
              id: q.user_answers[0].id,
              answer: q.user_answers[0].answer,
              is_correct: q.user_answers[0].is_correct,
              points_earned: q.user_answers[0].points_earned,
            }
          : null,
      })),
    };
  }

  transformToUserAssessmentResponse(
    assessments: any[],
    pagination: PaginationDetailsDto,
  ): UserAssessmentListResponseDto {
    return {
      assessments: assessments.map((assessment) => {
        return {
          id: assessment.id,
          name: assessment.name,
          type: assessment.type,
          difficulty: assessment.difficulty,
          duration_minutes: assessment.duration_minutes,
          description: assessment.description,
          max_score: Number(assessment.max_score),
          total_questions: assessment.total_questions,
          created_at: assessment.created_at,
          user_assessment: {
            id: assessment.user_assessments[0].id,
            status: assessment.user_assessments[0].status,
            started_at: assessment.user_assessments[0].started_at,
            completed_at: assessment.user_assessments[0].completed_at,
            total_score:
              assessment.user_assessments[0].status === 'scheduled' ||
              assessment.user_assessments[0].status === 'in_progress'
                ? null
                : assessment.user_assessments[0].total_score,
            percentage_score:
              assessment.user_assessments[0].status === 'scheduled' ||
              assessment.user_assessments[0].status === 'in_progress'
                ? null
                : assessment.user_assessments[0].percentage_score,
            feedback: assessment.user_assessments[0].feedback,
            scheduled_at: assessment.user_assessments[0].scheduled_at,
            weak_areas: assessment.user_assessments[0].weak_areas,
            strong_areas: assessment.user_assessments[0].strong_areas,
            created_at: assessment.user_assessments[0].created_at,
          },
          course: assessment.courses
            ? {
                id: assessment.courses.id,
                name: assessment.courses.name,
              }
            : null,
        };
      }),
      pagination,
    };
  }
}
