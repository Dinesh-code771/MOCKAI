import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { AssessmentsDBService } from '@db/assessments/assessments-db.service';
import { AssessmentsTransform } from '@assessments/assessments.transform';
import {
  AssessmentListQuery,
  AssessmentListResponseDto,
  DraftAssessmentFilter,
  UserAssessmentListQueryDto,
} from '@assessments/dto/assessment-list.dto';
import {
  calculateSkipAndTake,
  getPaginatedData,
} from '@common/helpers/pagination.utils';
import {
  UserAnswerDto,
  UserAssessmentResponseDto,
} from '@assessments/dto/start-assessment.dto';
import {
  UpsertAssessmentDto,
  UpsertAssessmentResponseDto,
  UpsertQuestionDto,
} from '@assessments/dto/upsert-assessment.dto';
import { APP_STRINGS } from '@common/strings';
import { AssessmentStatus } from '@assessments/enum/assessment-status.enum';
import { QuestionType } from '@assessments/enum/question-type.enum';
import { UserInfo } from '@common/types/auth.types';
import { RoleType } from '@common/enums/auth-type.enum';
import { AssessmentType } from '@assessments/enum/assessment-type.enum';
import { BackgroundServiceManager } from '@bg/background-service-manager';
import { AiService } from '@ai/ai.service';
import { UserAssessmentQueryDto } from '@assessments/dto/user-assessment-list.dto';

@Injectable()
export class AssessmentsService {
  constructor(
    private readonly assessmentsDBService: AssessmentsDBService,
    private readonly assessmentsTransform: AssessmentsTransform,
    private readonly backgroundServiceManager: BackgroundServiceManager,
    private readonly aiService: AiService,
  ) {}

  async getAssessmentsList(
    query: AssessmentListQuery,
    user: UserInfo,
  ): Promise<AssessmentListResponseDto> {
    const { skip, take } = calculateSkipAndTake(query.page, query.limit);
    let userId;

    if (user.roles.some((role) => role.name === RoleType.STUDENT)) {
      userId = user.id;
      query.draft_assessment = undefined;
    }

    const { assessments, totalCount } =
      await this.assessmentsDBService.getAssessmentsList({
        type: query.type,
        course_id: query.course_id,
        difficulty: query.difficulty,
        userId,
        skip,
        take,
        draft_assessment: query.draft_assessment ? query.draft_assessment === DraftAssessmentFilter.TRUE : undefined,
      });

    const pagination = {
      pageNo: query.page || 1,
      pageSize: take,
      totalCount,
      ...getPaginatedData(totalCount, query.page, query.limit),
    };

    return this.assessmentsTransform.transformToAssessmentListResponse(
      assessments,
      pagination,
    );
  }

  async startAssessment(
    userId: string,
    assessmentId: string,
    scheduleAt?: Date,
  ): Promise<UserAssessmentResponseDto> {
    const assessment =
      await this.assessmentsDBService.findAssessmentById(assessmentId);

    if (!assessment) {
      throw new NotFoundException(
        APP_STRINGS.api_errors.assessments.assessment_not_found,
      );
    }

    let userAssessment =
      await this.assessmentsDBService.findUserAssessmentByUserAndAssessment(
        userId,
        assessmentId,
      );

    if (!userAssessment) {
      let status: AssessmentStatus;
      if (scheduleAt) {
        status = AssessmentStatus.SCHEDULED;
      } else {
        status = AssessmentStatus.IN_PROGRESS;
      }
      console.log('status', status);
      userAssessment = await this.assessmentsDBService.createUserAssessment(
        userId,
        assessmentId,
        status,
        scheduleAt,
      );

      if (assessment.type === AssessmentType.SUBJECTIVE && !scheduleAt) {
        throw new BadRequestException(
          APP_STRINGS.api_errors.assessments.subjective_assessment_requires_schedule,
        );
      } else {
        scheduleAt = new Date();
      }

      // delayed job to start the interview
      console.log('userAssessment.started_at', userAssessment.started_at);
      const delay = userAssessment.started_at.getTime() - new Date().getTime() - 1000 * 30;
      console.log('delay', delay);
      if (assessment.type === AssessmentType.SUBJECTIVE) {
        this.backgroundServiceManager.assessmentStartJob(
          `assessment-start:${userAssessment.id}`,
          delay,
        );
      }

      this.backgroundServiceManager.assessmentEndJob(
        `assessment-end:${userAssessment.id}`,
        scheduleAt.getTime() -
          new Date().getTime() +
          userAssessment.assessments.duration_minutes * 60 * 1000 +
          1000 * 30,
      );

      if (assessment.type === AssessmentType.SUBJECTIVE) {
        return this.assessmentsTransform.transformToStartAssessmentResponse({
          userAssessment,
          questions: [],
          remainingTimeSeconds: null,
          newSchedule: true,
        });
      }
    }

    if (userAssessment.status !== AssessmentStatus.IN_PROGRESS) {
      throw new BadRequestException(
        APP_STRINGS.api_errors.assessments.cannot_start_assessment(
          userAssessment.status as AssessmentStatus,
        ),
      );
    }
    
    const now = new Date();
    const startedAt = new Date(userAssessment.started_at);
    const durationMinutes = userAssessment.assessments.duration_minutes || 60;
    const elapsedMinutes = (now.getTime() - startedAt.getTime()) / (1000 * 60);
    
    if (elapsedMinutes >= durationMinutes) {
      // update status to completed
      await this.assessmentsDBService.updateUserAssessmentStatus(
        userAssessment.id,
        AssessmentStatus.COMPLETED,
        undefined,
        undefined,
        now,
      );
      throw new BadRequestException(
        APP_STRINGS.api_errors.assessments.assessment_time_expired,
      );
    }
    const remainingTime = durationMinutes * 60 * 1000 - (now.getTime() - startedAt.getTime());

    // Only schedule if there's remaining time
    if (remainingTime > 0) {
      await this.backgroundServiceManager.assessmentEndJob(
        `assessment-end:${userAssessment.id}`,
        remainingTime,
      );
    }
    
    // Get the questions for this assessment (with user submitted answers)
    const questions =
      await this.assessmentsDBService.findQuestionsByAssessmentId(
        userAssessment.assessment_id,
        userAssessment.id,
      );

    // Calculate remaining time
    let remainingTimeSeconds = null;
    if (userAssessment.started_at) {
      const now = new Date();
      const startedAt = new Date(userAssessment.started_at);
      const durationMinutes = userAssessment.assessments.duration_minutes || 60;
      const elapsedSeconds = (now.getTime() - startedAt.getTime()) / 1000;
      const totalSeconds = durationMinutes * 60;
      remainingTimeSeconds = Math.max(
        0,
        Math.floor(totalSeconds - elapsedSeconds),
      );
    }

    const responseData = {
      userAssessment,
      questions,
      remainingTimeSeconds,
      newSchedule: false,
    };

    return this.assessmentsTransform.transformToStartAssessmentResponse(
      responseData,
    );
  }

  async storeUserAnswers(
    userAssessmentId: string,
    questionId: string,
    answer: string,
  ): Promise<UserAnswerDto> {
    let isCorrect: boolean;
    let pointsEarned: number;
    let totalScore: number;
    let percentageScore: number;

    const userAssessment =
      await this.assessmentsDBService.getQuestionWithUserAssignment(
        userAssessmentId,
        questionId,
      );

    if (!userAssessment) {
      throw new NotFoundException(
        APP_STRINGS.api_errors.assessments.user_assessment_not_found,
      );
    }

    if (userAssessment.status !== AssessmentStatus.IN_PROGRESS) {
      throw new BadRequestException(
        APP_STRINGS.api_errors.assessments.cannot_start_assessment(
          userAssessment.status as AssessmentStatus,
        ),
      );
    }

    if (!userAssessment.assessments.questions.length) {
      throw new NotFoundException(
        APP_STRINGS.api_errors.assessments.question_not_found,
      );
    }

    if (userAssessment.user_answers.length) {
      throw new BadRequestException(
        APP_STRINGS.api_errors.assessments.question_already_answered,
      );
    }

    // Handle MCQ type assessments
    if (userAssessment.assessments.type === AssessmentType.MCQ) {
      const question = userAssessment.assessments.questions[0];
      isCorrect = question.correct_answer === answer;
      pointsEarned = isCorrect
        ? Number(userAssessment.assessments.max_score) /
          Number(userAssessment.assessments.total_questions)
        : 0;
      totalScore = 0;
      percentageScore = 0;

      totalScore = (userAssessment.total_score?.toNumber() || 0) + pointsEarned;
      percentageScore =
        (totalScore /
          Number(userAssessment.assessments?.max_score?.toNumber() || 0)) *
        100;
    }

    const userAnswer = await this.assessmentsDBService.storeUserAnswers(
      userAssessmentId,
      questionId,
      answer,
      isCorrect,
      pointsEarned,
      totalScore,
      percentageScore,
    );

    return this.assessmentsTransform.transformToUserAnswerResponse(
      userAnswer.user_answers[0],
    );
  }

  async completeAssessment(userAssessmentId: string) {
    const userAssessmentData =
      await this.assessmentsDBService.getUserAssessmentCompleteData(
        userAssessmentId,
      );

    if (!userAssessmentData) {
      throw new NotFoundException(
        APP_STRINGS.api_errors.assessments.user_assessment_not_found,
      );
    }

    let userAssessment =
      await this.assessmentsDBService.updateUserAssessmentStatus(
        userAssessmentId,
        AssessmentStatus.COMPLETED,
        userAssessmentData.assessments.type === AssessmentType.MCQ ? true : undefined,
        null,
        new Date(),
      );
    let questions = await this.assessmentsDBService.findQuestionsByAssessmentId(
      userAssessment.assessment_id,
      userAssessmentId,
      true,
    );

    const responseData = {
      userAssessment,
      questions,
    };

    return this.assessmentsTransform.transformToCompleteAssessmentResponse(
      responseData,
    );
  }

  async getUserAssessmentCompleteData(userAssessmentId: string) {
    const userAssessment =
      await this.assessmentsDBService.getUserAssessmentCompleteData(
        userAssessmentId,
      );
    const responseData = {
      userAssessment,
      questions: userAssessment.assessments.questions,
    };

    return this.assessmentsTransform.transformToCompleteAssessmentResponse(
      responseData,
    );
  }

  async getUserAssessments(userId: string, query: UserAssessmentQueryDto) {
    const { skip, take } = calculateSkipAndTake(query.page, query.limit);

    const { assessments, totalCount } =
      await this.assessmentsDBService.getUserAssessmentsList(
        query,
        userId,
        skip,
        take,
      );

    const pagination = {
      pageNo: query.page || 1,
      pageSize: take,
      totalCount,
      ...getPaginatedData(totalCount, query.page, query.limit),
    };

    return this.assessmentsTransform.transformToUserAssessmentResponse(
      assessments,
      pagination,
    );
  }

  async upsertAssessment(
    upsertAssessmentDto: UpsertAssessmentDto,
  ): Promise<UpsertAssessmentResponseDto> {
    // Validate questions
    this.validateQuestions(upsertAssessmentDto.questions);

    // Validate question count limits
    if (
      upsertAssessmentDto.questions.length > upsertAssessmentDto.max_questions
    ) {
      throw new BadRequestException(
        'Assessment cannot have more than 100 questions',
      );
    }

    // Transform DTO to database format
    const assessmentData = {
      id: upsertAssessmentDto.id,
      course_id: upsertAssessmentDto.course_id,
      name: upsertAssessmentDto.name,
      type: upsertAssessmentDto.type,
      difficulty: upsertAssessmentDto.difficulty,
      duration_minutes: upsertAssessmentDto.duration_minutes,
      description: upsertAssessmentDto.description,
      max_score: upsertAssessmentDto.max_score,
      max_questions: upsertAssessmentDto.max_questions,
      questions: upsertAssessmentDto.questions.map((question) => ({
        id: question.id,
        question_text: question.question_text,
        question_type: question.question_type,
        options: question.options,
        correct_answer: question.correct_answer,
        difficulty: question.difficulty,
        order_sequence: question.order_sequence,
      })),
    };

    const { assessment, questions } =
      await this.assessmentsDBService.upsertAssessmentWithQuestions(
        assessmentData,
      );

    return this.assessmentsTransform.transformToUpsertAssessmentResponse(
      assessment,
      questions,
    );
  }

  private validateQuestions(questions: UpsertQuestionDto[]) {
    for (const question of questions) {
      // Validate MCQ questions
      if (question.question_type === QuestionType.MCQ) {
        if (!question.options || !Array.isArray(question.options)) {
          throw new BadRequestException(
            `MCQ question "${question.question_text}" must have options`,
          );
        }

        if (question.options.length < 2) {
          throw new BadRequestException(
            APP_STRINGS.api_errors.assessments.mcq_question_must_have_at_least_2_options(
              question.question_text,
            ),
          );
        }

        if (question.options.length > 6) {
          throw new BadRequestException(
            APP_STRINGS.api_errors.assessments.mcq_question_can_have_at_most_6_options(
              question.question_text,
            ),
          );
        }

        if (!question.correct_answer) {
          throw new BadRequestException(
            APP_STRINGS.api_errors.assessments.correct_answer_must_be_one_of_the_provided_options(
              question.question_text,
            ),
          );
        }

        if (!question.options.includes(question.correct_answer)) {
          throw new BadRequestException(
            APP_STRINGS.api_errors.assessments.correct_answer_must_be_one_of_the_provided_options(
              question.question_text,
            ),
          );
        }
      }

      // Validate subjective questions
      if (question.question_type === QuestionType.SUBJECTIVE) {
        if (question.options && question.options.length > 0) {
          throw new BadRequestException(
            APP_STRINGS.api_errors.assessments.subjective_question_should_not_have_options(
              question.question_text,
            ),
          );
        }
      }
    }

    // Validate unique order sequences
    const orderSequences = questions.map((q) => q.order_sequence);
    const uniqueOrderSequences = new Set(orderSequences);

    if (orderSequences.length !== uniqueOrderSequences.size) {
      throw new BadRequestException(
        APP_STRINGS.api_errors.assessments.question_order_sequences_must_be_unique,
      );
    }

    // Validate order sequences are sequential starting from 1
    const sortedSequences = [...orderSequences].sort((a, b) => a - b);
    for (let i = 0; i < sortedSequences.length; i++) {
      if (sortedSequences[i] !== i + 1) {
        throw new BadRequestException(
          APP_STRINGS.api_errors.assessments.question_order_sequences_must_be_sequential,
        );
      }
    }
  }

  async publishAssessment(assessmentId: string) {
    const assessment =
      await this.assessmentsDBService.getAssessmentWithQuestionsCount(
        assessmentId,
      );

    if (!assessment) {
      throw new NotFoundException(
        APP_STRINGS.api_errors.assessments.assessment_not_found,
      );
    }

    if (assessment.is_published) {
      throw new BadRequestException(
        APP_STRINGS.api_errors.assessments.assessment_already_published,
      );
    }

    if (assessment.total_questions !== assessment.questions.length) {
      throw new BadRequestException(
        APP_STRINGS.api_errors.assessments.assessment_total_questions_mismatch,
      );
    }

    await this.assessmentsDBService.publishAssessment(assessmentId);
  }

  async getAssessmentDetails(assessmentId: string) {
    const assessment =
      await this.assessmentsDBService.getAssessmentDetails(assessmentId);

    if (!assessment) {
      throw new NotFoundException(
        APP_STRINGS.api_errors.assessments.assessment_not_found,
      );
    }

    return this.assessmentsTransform.transformToUpsertAssessmentResponse(
      assessment,
      assessment.questions,
    );
  }

  async startInterview(userAssessmentId: string) {
    console.log('here startInterview job');
    const userAssessment =
      await this.assessmentsDBService.getUserAssessmentCompleteData(
        userAssessmentId,
      );

    if (!userAssessment) {
      Logger.warn(
        `User assessment with ID ${userAssessmentId} not found. Cannot start the interview status.`,
        'AssessmentsService',
      );
      return;
    }

    if (userAssessment.status === AssessmentStatus.IN_PROGRESS) {
      Logger.warn(
        `User assessment with ID ${userAssessmentId} is already in progress. Cannot start the interview.`,
        'AssessmentsService',
      );
      return;
    }

    if (userAssessment.status === AssessmentStatus.CANCELLED) {
      Logger.warn(
        `User assessment with ID ${userAssessmentId} is cancelled. Cannot start the interview.`,
        'AssessmentsService',
      );
      return;
    }

    await this.assessmentsDBService.updateUserAssessmentStatus(
      userAssessmentId,
      AssessmentStatus.IN_PROGRESS,
    );
  }

  async endInterview(userAssessmentId: string) {
    const userAssessment =
      await this.assessmentsDBService.getUserAssessmentCompleteData(
        userAssessmentId,
      );

    if (!userAssessment) {
      Logger.warn(
        `User assessment with ID ${userAssessmentId} not found. Cannot end the interview status.`,
        'AssessmentsService',
      );
      return;
    }

    if (userAssessment.status !== AssessmentStatus.IN_PROGRESS) {
      Logger.warn(
        `User assessment with ID ${userAssessmentId} is not in progress. Cannot end the interview.`,
        'AssessmentsService',
      );
      return;
    }

    await this.assessmentsDBService.updateUserAssessmentStatus(
      userAssessmentId,
      AssessmentStatus.COMPLETED,
      userAssessment.assessments.type === AssessmentType.MCQ ? true : undefined,
      null,
      new Date(),
    );

    // AI will assess the interview and then update the status
    this.backgroundServiceManager.assessInterviewJob(userAssessmentId);
  }

  async assessInterview(userAssessmentId: string, type?: AssessmentType) {
    if (type) {
      await this.assessmentsDBService.updateUserAssessmentStatus(
        userAssessmentId,
        AssessmentStatus.COMPLETED,
        type === AssessmentType.MCQ ? true : undefined,
        null,
        new Date(),
      );
  
      if (type !== AssessmentType.SUBJECTIVE) {
        return;
      }
    }

    const { userAnswers, maxScore } = await this.assessmentsDBService.getUserAnswers(userAssessmentId);

    const response = await this.aiService.assessInterview(userAnswers, maxScore.toNumber());

    await this.assessmentsDBService.updateInterviewScore(
      response,
      userAssessmentId,
    );
  }

  async getCompletedAssessmentsNotAssessed() {
    const assessments = await this.assessmentsDBService.getCompletedAssessmentsNotAssessed();
    console.log('pending assessments', assessments);
    for (const assessment of assessments) {
      await this.assessInterview(assessment.id, assessment.assessments.type as AssessmentType);
    }
  }
}
