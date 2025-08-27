import { forwardRef, Module } from '@nestjs/common';
import { AssessmentsController } from '@assessments/assessments.controller';
import { AssessmentsService } from '@assessments/assessments.service';
import { AssessmentsTransform } from '@assessments/assessments.transform';
import { DBModule } from '@db/db.module';
import { AiModule } from '@ai/ai.module';
import { BackgroundModule } from '@bg/background.module';

@Module({
  imports: [DBModule, AiModule, forwardRef(() => BackgroundModule)],
  controllers: [AssessmentsController],
  providers: [AssessmentsService, AssessmentsTransform],
  exports: [AssessmentsService],
})
export class AssessmentsModule {}
