import { Module } from '@nestjs/common';
import { AiService } from '@ai/ai.service';
import { GeminiProvider } from '@ai/provider/gemini.provider';

@Module({
  providers: [AiService, GeminiProvider],
  exports: [AiService],
})
export class AiModule {}