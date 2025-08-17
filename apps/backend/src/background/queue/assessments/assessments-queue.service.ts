import { AssessmentsService } from '@assessments/assessments.service';
import { AssessmentType } from '@assessments/enum/assessment-type.enum';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssessmentQueueService {
  private readonly logger = new Logger(AssessmentQueueService.name);

  constructor(
    private readonly assessmentsService: AssessmentsService,
  ) {}

  async AssessmentStartJob(id: string) {
    try {
      this.logger.debug(
        `Adding Assessment status update job for listing auction start ${id}`,
        'AssessmentQueueService',
      );
      await this.assessmentsService.startInterview(id);
    } catch (error) {
      this.logger.error(
        `Error adding listing status update job for listing auction start ${id}: ${error.message}`,
        error.stack,
        'AssessmentQueueService',
      );
      throw error;
    }
  }

  async AssessmentEndJob(id: string) {
    try {
      this.logger.debug(
        `Adding Assessment status update job for listing auction end ${id}`,
        'AssessmentQueueService',
      );
      await this.assessmentsService.endInterview(id);
    } catch (error) {
      this.logger.error(
        `Error adding listing status update job for listing auction end ${id}: ${error.message}`,
        error.stack,
        'AssessmentQueueService',
      );
      throw error;
    }
  }

  async AssessInterview(id: string, type?: AssessmentType) {
    try {
      this.logger.debug(
        `Adding Assessment interview job for id ${id}`,
        'AssessmentQueueService',
      );
      await this.assessmentsService.assessInterview(id, type);
    } catch (error) {
      this.logger.error(
        `Error adding assessment interview job for id ${id}: ${error.message}`,
        error.stack,
        'AssessmentQueueService',
      );
      throw error;
    }
  }
}
