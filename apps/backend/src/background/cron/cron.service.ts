import { AssessmentsService } from '@assessments/assessments.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly assessmentsService: AssessmentsService,
  ) {}

  async AssessPendingAssessments() {
    try {
      await this.assessmentsService.getCompletedAssessmentsNotAssessed();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
