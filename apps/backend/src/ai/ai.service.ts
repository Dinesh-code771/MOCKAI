import { Injectable } from '@nestjs/common';
import { GeminiProvider } from '@ai/provider/gemini.provider';

@Injectable()
export class AiService {
  constructor(private readonly geminiProvider: GeminiProvider) {}

  async assessInterview(responses: QuestionResponse[], maxScore: number): Promise<AssessmentResult> {
    return this.geminiProvider.assessInterview(responses, maxScore);
  }
}