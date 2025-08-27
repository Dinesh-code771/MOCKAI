import { Injectable, Logger } from '@nestjs/common';
import { GenerativeModel, GoogleGenerativeAI, Schema, SchemaType } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '@config/env.config';

@Injectable()
export class GeminiProvider {
  private readonly model: GenerativeModel;

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    const assessmentSchema: Schema = {
      type: SchemaType.OBJECT,
      properties: {
        overallScore: { type: SchemaType.NUMBER },
        maxScore: { type: SchemaType.NUMBER },
        percentage: { type: SchemaType.NUMBER },
        overallFeedback: { type: SchemaType.STRING },
        questionAssessments: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              questionId: { type: SchemaType.STRING },
              questionText: { type: SchemaType.STRING },
              userAnswer: { type: SchemaType.STRING },
              score: { type: SchemaType.NUMBER },
              maxQuestionScore: { type: SchemaType.NUMBER },
              feedback: { type: SchemaType.STRING },
            },
          },
        },
        strongAreas: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        weakAreas: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
      },
    };

    const genAI = new GoogleGenerativeAI(
      this.configService.get('GEMINI_API_KEY'),
    );
    this.model = genAI.getGenerativeModel({
      model: 'gemini-2.5-pro',
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: assessmentSchema,
      }
    });
  }

  async assessInterview(
    responses: QuestionResponse[],
    maxScore: number,
  ): Promise<AssessmentResult> {
    const maxQuestionScore = Math.floor(maxScore / responses.length);

    Logger.log('Assessing interview responses');

    const prompt = `You are an expert interview assessor. Assess the following interview responses and provide structured feedback.

    **INTERVIEW DATA:**
    ${responses
      .map(
        (response, index) => `
    Q${index + 1} (ID: ${response.questionId}):
    Question: ${JSON.stringify(response.questionText)}
    Answer: ${JSON.stringify(response.userAnswer ?? 'No answer provided')}
    `,
      )
      .join('\n')}
    
    **SCORING:**
    - Total possible score: ${maxScore}
    - Score per question: ${maxQuestionScore}
    
    **ASSESSMENT RULES:**
    1. Score based on technical accuracy, clarity, problem-solving approach, and completeness
    2. "No answer provided" responses get 0 points
    3. Provide constructive, specific feedback
    4. Keep feedback concise but actionable
    5. Identify 2-4 strong areas and 2-4 weak areas
    
    **OUTPUT REQUIREMENTS:**
    Return ONLY valid JSON. Keep all text fields under 200 characters to prevent truncation.
    
    {
      "overallScore": [number],
      "maxScore": ${maxScore},
      "percentage": [number with 1 decimal],
      "overallFeedback": "[concise 1-2 sentence summary]",
      "questionAssessments": [
        {
          "questionId": "[question ID]",
          "questionText": "[truncate if >100 chars]",
          "userAnswer": "[truncate if >100 chars]",
          "score": [number],
          "maxQuestionScore": ${maxQuestionScore},
          "feedback": "[specific feedback under 150 chars]"
        }
      ],
      "strongAreas": [
        "[strength 1 - under 80 chars]",
        "[strength 2 - under 80 chars]"
      ],
      "weakAreas": [
        "[weakness 1 - under 80 chars]",
        "[weakness 2 - under 80 chars]"
      ]
    }
    
    CRITICAL: Return only the JSON object above. No additional text.`;

      
    try {      
      console.log(prompt,"prompt");
      const result = await this.model.generateContent(prompt);
      console.log(JSON.stringify(result,null,2),"result");
      Logger.log(`Gemini response: ${result.response.text()}`);
      const responseText = result.response.text();

      // Parse the JSON response
      const rawAssessment: AssessmentResult = JSON.parse(responseText);
      console.log(JSON.stringify(rawAssessment,null,2),"rawAssessment");
      const assessment: AssessmentResult = {
        overallScore: rawAssessment.overallScore || 0,
        maxScore: maxScore,
        percentage: Number(((rawAssessment.overallScore || 0) / maxScore * 100)?.toFixed(1)),
        overallFeedback: rawAssessment.overallFeedback || 'Assessment completed.',
        questionAssessments: rawAssessment.questionAssessments,
        strongAreas: rawAssessment.strongAreas || [],
        weakAreas: rawAssessment.weakAreas || []
      };
  

      // Validate and sanitize the response
      return this.validateAndSanitizeAssessment(
        assessment,
        maxScore,
        responses.length,
      );
    } catch (error) {
      Logger.error('Error assessing interview:', error);
      console.log(error,"Errorr");
      throw new Error('Failed to assess interview responses');
    }
  }

  private validateAndSanitizeAssessment(
    assessment: AssessmentResult,
    maxScore: number,
    questionCount: number,
  ): AssessmentResult {
    // Ensure scores are within valid ranges
    assessment.overallScore = Math.min(
      Math.max(0, assessment.overallScore),
      maxScore,
    );
    assessment.maxScore = maxScore;
    assessment.percentage =
      Math.round((assessment.overallScore / maxScore) * 1000) / 100;

    // Validate question assessments
    if (assessment.questionAssessments) {
      const maxQuestionScore = Math.floor(maxScore / questionCount);
      assessment.questionAssessments = assessment.questionAssessments.map(
        (qa) => ({
          ...qa,
          score: Math.min(Math.max(0, qa.score), maxQuestionScore),
          maxQuestionScore,
        }),
      );
    }

    // Ensure arrays exist
    assessment.strongAreas = assessment.strongAreas || [];
    assessment.weakAreas = assessment.weakAreas || [];

    return assessment;
  }
}
