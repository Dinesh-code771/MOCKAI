import { Module } from '@nestjs/common';
import { AssessmentsController } from '@assessments/assessments.controller';
import { AssessmentsService } from '@assessments/assessments.service';
import { AssessmentsTransform } from '@assessments/assessments.transform';
import { DBModule } from '@db/db.module';

@Module({
  imports: [DBModule],
  controllers: [AssessmentsController],
  providers: [AssessmentsService, AssessmentsTransform],
  exports: [AssessmentsService],
})
export class AssessmentsModule {}
