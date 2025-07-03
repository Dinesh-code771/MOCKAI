import { Injectable, NotFoundException } from '@nestjs/common';
import { DBService } from '@db/db.service';
import { AssessmentType } from '@assessments/enum/assessment-type.enum';
import { Difficulty } from '@assessments/enum/difficulty.enum';
import { Prisma } from '@prisma/client';
import { APP_STRINGS } from '@common/strings';
import { UserAssessmentListQueryDto } from '@assessments/dto/assessment-list.dto';

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
}
