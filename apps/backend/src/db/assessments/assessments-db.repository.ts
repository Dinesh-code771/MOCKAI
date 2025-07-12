import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DBService } from '@db/db.service';
import { AssessmentType } from '@assessments/enum/assessment-type.enum';
import { Difficulty } from '@assessments/enum/difficulty.enum';
import { Prisma } from '@prisma/client';
import { APP_STRINGS } from '@common/strings';
import { UserAssessmentListQueryDto } from '@assessments/dto/assessment-list.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AssessmentsDBRepository {
  constructor(private readonly prisma: DBService) {}

  async getAssessmentsList(filters: {
    type?: AssessmentType;
    course_id?: string;
    difficulty?: Difficulty;
    userId?: string;
    skip: number;
    take: number;
  }) {
    const whereCondition: Prisma.assessmentsWhereInput = {
      is_active: true,
      is_published: true,
    };

    if (filters.type) {
      whereCondition.type = filters.type;
    }

    if (filters.course_id) {
      whereCondition.course_id = filters.course_id;
    }

    if (filters.difficulty) {
      whereCondition.difficulty = filters.difficulty;
    }

    // if user is student, then only show assessments that user has not taken
    if (filters.userId) {
      whereCondition.user_assessments = {
        none: {
          user_id: filters.userId,
        },
      };
    }

    const [assessments, totalCount] = await Promise.all([
      this.prisma.assessments.findMany({
        where: whereCondition,
        include: {
          courses: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: filters.skip,
        take: filters.take,
      }),
      this.prisma.assessments.count({
        where: whereCondition,
      }),
    ]);

    return { assessments, totalCount };
  }

  async getUserAssessmentsList(
    query: UserAssessmentListQueryDto,
    userId: string,
    skip: number,
    take: number,
  ) {
    const whereCondition: Prisma.assessmentsWhereInput = {
      is_active: true,
    };

    if (query.type) {
      whereCondition.type = query.type;
    }

    if (query.course_id) {
      whereCondition.course_id = query.course_id;
    }

    if (query.difficulty) {
      whereCondition.difficulty = query.difficulty;
    }

    // if user is student, then only show assessments that user has not taken
    whereCondition.user_assessments = {
      some: {
        user_id: userId,
        ...(query.status && { status: query.status }),
      },
    };

    const [assessments, totalCount] = await Promise.all([
      this.prisma.assessments.findMany({
        where: whereCondition,
        include: {
          courses: {
            select: {
              id: true,
              name: true,
            },
          },
          user_assessments: {
            where: {
              user_id: userId,
              ...(query.status && { status: query.status }),
            },
            select: {
              id: true,
              user_id: true,
              status: true,
              scheduled_at: true,
              total_score: true,
              percentage_score: true,
              feedback: true,
              completed_at: true,
              started_at: true,
              weak_areas: true,
              strong_areas: true,
              created_at: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: skip,
        take: take,
      }),
      this.prisma.assessments.count({
        where: whereCondition,
      }),
    ]);

    return { assessments, totalCount };
  }

  async findUserAssessmentById(userAssessmentId: string) {
    return this.prisma.user_assessments.findUnique({
      where: { id: userAssessmentId },
      include: {
        assessments: {
          include: {
            courses: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findAssessmentById(assessmentId: string) {
    return this.prisma.assessments.findUnique({
      where: { id: assessmentId },
      include: {
        courses: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findUserAssessmentByUserAndAssessment(
    userId: string,
    assessmentId: string,
  ) {
    return this.prisma.user_assessments.findFirst({
      where: {
        user_id: userId,
        assessment_id: assessmentId,
      },
      include: {
        assessments: {
          include: {
            courses: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async updateUserAssessmentStatus(
    userAssessmentId: string,
    status: string,
    startedAt?: Date,
    completedAt?: Date,
  ) {
    try {
      const updateData: any = { status };

      if (startedAt) {
        updateData.started_at = startedAt;
      }

      if (completedAt) {
        updateData.completed_at = completedAt;
      }

      return this.prisma.user_assessments.update({
        where: { id: userAssessmentId },
        data: updateData,
        include: {
          assessments: {
            include: {
              courses: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      // if user assessment not found, throw error
      if (error.code === 'P2025') {
        throw new NotFoundException(
          APP_STRINGS.api_errors.assessments.user_assessment_not_found,
        );
      }
      throw error;
    }
  }

  async createUserAssessment(userId: string, assessmentId: string) {
    return this.prisma.user_assessments.create({
      data: {
        user_id: userId,
        assessment_id: assessmentId,
        scheduled_at: new Date(),
        status: 'in_progress',
        started_at: new Date(),
      },
      include: {
        assessments: {
          include: {
            courses: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findQuestionsByAssessmentId(
    assessmentId: string,
    userAssessmentId: string,
    withUserAnswers: boolean = false,
  ) {
    return this.prisma.questions.findMany({
      where: {
        assessment_id: assessmentId,
        is_active: true,
      },
      select: {
        id: true,
        question_text: true,
        question_type: true,
        options: true,
        difficulty: true,
        order_sequence: true,
        ...(withUserAnswers && {
          correct_answer: true,
        }),
        user_answers: {
          where: {
            user_assessment_id: userAssessmentId,
          },
          select: {
            id: true,
            answer: true,
            is_correct: true,
            points_earned: true,
          },
        },
      },
      orderBy: {
        order_sequence: 'asc',
      },
    });
  }

  async getQuestionWithUserAssignment(
    userAssessmentId: string,
    questionId: string,
  ) {
    return this.prisma.user_assessments.findFirst({
      where: {
        id: userAssessmentId,
      },
      select: {
        id: true,
        status: true,
        total_score: true,
        percentage_score: true,
        user_answers: {
          where: {
            question_id: questionId,
          },
          select: {
            id: true,
            answer: true,
            is_correct: true,
            points_earned: true,
          },
        },
        assessments: {
          select: {
            id: true,
            max_score: true,
            total_questions: true,
            questions: {
              where: {
                id: questionId,
              },
              select: {
                id: true,
                correct_answer: true,
              },
            },
          },
        },
      },
    });
  }

  async storeUserAnswers(
    userAssessmentId: string,
    questionId: string,
    answer: string,
    isCorrect: boolean,
    pointsEarned: number,
    totalScore: number,
    percentageScore: number,
  ) {
    return this.prisma.user_assessments.update({
      where: {
        id: userAssessmentId,
      },
      data: {
        total_score: totalScore,
        percentage_score: percentageScore,
        user_answers: {
          create: {
            question_id: questionId,
            answer: answer,
            is_correct: isCorrect,
            points_earned: pointsEarned,
          },
        },
      },
      select: {
        user_answers: {
          where: {
            question_id: questionId,
          },
          select: {
            id: true,
            answer: true,
            is_correct: true,
            points_earned: true,
          },
        },
      },
    });
  }

  async getUserAssessmentCompleteData(userAssessmentId: string) {
    return this.prisma.user_assessments.findUnique({
      where: {
        id: userAssessmentId,
      },
      include: {
        assessments: {
          include: {
            courses: {
              select: {
                id: true,
                name: true,
              },
            },
            questions: {
              select: {
                id: true,
                question_text: true,
                question_type: true,
                options: true,
                difficulty: true,
                order_sequence: true,
                correct_answer: true,
                user_answers: {
                  where: {
                    user_assessment_id: userAssessmentId,
                  },
                  select: {
                    id: true,
                    answer: true,
                    is_correct: true,
                    points_earned: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async upsertAssessmentWithQuestions(data: {
    id?: string;
    course_id?: string;
    name: string;
    type: string;
    difficulty: string;
    duration_minutes?: number;
    description?: string;
    max_score: number;
    max_questions: number;
    questions: Array<{
      id?: string;
      question_text: string;
      question_type: string;
      options?: string[];
      correct_answer?: string;
      difficulty: string;
      order_sequence: number;
    }>;
  }) {
    // If updating, check if assessment is published
    if (data.id) {
      const existingAssessment = await this.prisma.assessments.findUnique({
        where: { id: data.id },
        select: { is_published: true, is_active: true },
      });

      if (!existingAssessment) {
        throw new NotFoundException(
          APP_STRINGS.api_errors.assessments.assessment_not_found,
        );
      }

      if (existingAssessment.is_published) {
        throw new BadRequestException(
          APP_STRINGS.api_errors.assessments.cannot_update_published_assessment,
        )
      }

      if (!existingAssessment.is_active) {
        throw new BadRequestException(
          APP_STRINGS.api_errors.assessments.cannot_update_inactive_assessment,
        )
      }
    }

    // Validate course exists if provided
    if (data.course_id) {
      const course = await this.prisma.courses.findUnique({
        where: { id: data.course_id, is_active: true },
      });

      if (!course) {
        throw new NotFoundException(
          APP_STRINGS.api_errors.assessments.course_not_found,
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      // Upsert assessment
      const assessment = await tx.assessments.upsert({
        where: { id: data.id || uuidv4() },
        create: {
          course_id: data.course_id,
          name: data.name,
          type: data.type as any,
          difficulty: data.difficulty as any,
          duration_minutes: data.duration_minutes || 60,
          description: data.description,
          max_score: data.max_score,
          total_questions: data.max_questions,
          is_active: true,
          is_published: false,
        },
        update: {
          course_id: data.course_id,
          name: data.name,
          type: data.type as any,
          difficulty: data.difficulty as any,
          duration_minutes: data.duration_minutes || 60,
          description: data.description,
          max_score: data.max_score || 100,
          total_questions: data.questions.length,
          updated_at: new Date(),
        },
        include: {
          courses: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // If updating, delete existing questions that are not in the new set
      if (data.id) {
        const questionIds = data.questions
          .filter((q) => q.id)
          .map((q) => q.id!);

        await tx.questions.deleteMany({
          where: {
            assessment_id: assessment.id,
            id: {
              notIn: questionIds,
            },
          },
        });
      }

      // Upsert questions
      for (const questionData of data.questions) {
        await tx.questions.upsert({
          where: { id: questionData.id || uuidv4() },
          create: {
            assessment_id: assessment.id,
            question_text: questionData.question_text,
            question_type: questionData.question_type as any,
            options: questionData.options || null,
            correct_answer: questionData.correct_answer,
            difficulty: questionData.difficulty as any,
            order_sequence: questionData.order_sequence,
            is_active: true,
          },
          update: {
            question_text: questionData.question_text,
            question_type: questionData.question_type as any,
            options: questionData.options || null,
            correct_answer: questionData.correct_answer,
            difficulty: questionData.difficulty as any,
            order_sequence: questionData.order_sequence,
            updated_at: new Date(),
          },
        });
      }

      const questions = await tx.questions.findMany({
        where: {
          assessment_id: assessment.id,
        },
      });

      return {
        assessment,
        questions,
      };
    });
  }
}
