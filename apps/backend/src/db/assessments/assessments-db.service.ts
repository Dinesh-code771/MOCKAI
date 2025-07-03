import { Injectable } from '@nestjs/common';
import { AssessmentsDBRepository } from '@db/assessments/assessments-db.repository';
import { AssessmentType } from '@assessments/enum/assessment-type.enum';
import { Difficulty } from '@assessments/enum/difficulty.enum';
import { UserAssessmentListQueryDto } from '@assessments/dto/assessment-list.dto';

@Injectable()
export class AssessmentsDBService {
  constructor(
    private readonly assessmentsRepository: AssessmentsDBRepository,
  ) {}

  async getAssessmentsList(filters: {
    type?: AssessmentType;
    course_id?: string;
    difficulty?: Difficulty;
    userId?: string;
    skip: number;
    take: number;
  }) {
    return this.assessmentsRepository.getAssessmentsList(filters);
  }

  async getUserAssessmentsList(
    query: UserAssessmentListQueryDto,
    userId: string,
    skip: number,
    take: number,
  ) {
    return this.assessmentsRepository.getUserAssessmentsList(
      query,
      userId,
      skip,
      take,
    );
  }

  async findUserAssessmentById(userAssessmentId: string) {
    return this.assessmentsRepository.findUserAssessmentById(userAssessmentId);
  }

  async findAssessmentById(assessmentId: string) {
    return this.assessmentsRepository.findAssessmentById(assessmentId);
  }

  async findUserAssessmentByUserAndAssessment(
    userId: string,
    assessmentId: string,
  ) {
    return this.assessmentsRepository.findUserAssessmentByUserAndAssessment(
      userId,
      assessmentId,
    );
  }

  async updateUserAssessmentStatus(
    userAssessmentId: string,
    status: string,
    startedAt?: Date,
    completedAt?: Date,
  ) {
    return this.assessmentsRepository.updateUserAssessmentStatus(
      userAssessmentId,
      status,
      startedAt,
      completedAt,
    );
  }

  async createUserAssessment(userId: string, assessmentId: string) {
    return this.assessmentsRepository.createUserAssessment(
      userId,
      assessmentId,
    );
  }

  async findQuestionsByAssessmentId(
    assessmentId: string,
    userAssessmentId: string,
    withUserAnswers?: boolean,
  ) {
    return this.assessmentsRepository.findQuestionsByAssessmentId(
      assessmentId,
      userAssessmentId,
      withUserAnswers,
    );
  }

  async getQuestionWithUserAssignment(
    userAssessmentId: string,
    questionId: string,
  ) {
    return this.assessmentsRepository.getQuestionWithUserAssignment(
      userAssessmentId,
      questionId,
    );
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
    return this.assessmentsRepository.storeUserAnswers(
      userAssessmentId,
      questionId,
      answer,
      isCorrect,
      pointsEarned,
      totalScore,
      percentageScore,
    );
  }

  async getUserAssessmentCompleteData(userAssessmentId: string) {
    return this.assessmentsRepository.getUserAssessmentCompleteData(
      userAssessmentId,
    );
  }
}
