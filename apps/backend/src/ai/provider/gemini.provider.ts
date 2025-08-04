import { Injectable, Logger } from '@nestjs/common';
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '@config/env.config';

@Injectable()
export class GeminiProvider {
  private readonly model: GenerativeModel;

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    const genAI = new GoogleGenerativeAI(
      this.configService.get('GEMINI_API_KEY'),
    );
    this.model = genAI.getGenerativeModel({
      model: 'gemini-2.5-pro',
    });
  }

  async assessInterview(
    responses: QuestionResponse[],
    maxScore: number,
  ): Promise<AssessmentResult> {
    const maxQuestionScore = Math.floor(maxScore / responses.length);

    const prompt = `
      You are an expert interview assessor with extensive experience in evaluating candidates across various domains. Your task is to comprehensively assess the following interview responses and provide detailed feedback.

      **ASSESSMENT CRITERIA:**
      - Technical accuracy and depth of knowledge
      - Communication clarity and structure
      - Problem-solving approach and methodology
      - Practical experience and real-world application
      - Critical thinking and analytical skills
      - Completeness and relevance of answers

      **INTERVIEW RESPONSES TO ASSESS:**
      ${responses
        .map(
          (response, index) => `
      Question ${index + 1} (ID: ${response.questionId}):
      Question: "${response.questionText}"
      Candidate's Answer: "${response.userAnswer ?? 'No answer provided'}"
      `,
        )
        .join('\n')}

      **SCORING GUIDELINES:**
      - Maximum total score: ${maxScore}
      - Maximum score per question: ${maxQuestionScore}
      - Score each question based on accuracy, depth, clarity, and relevance
      - Be fair but thorough in your evaluation

      **REQUIRED OUTPUT FORMAT (JSON):**
      Please provide your assessment in the following JSON format:

      {
        "overallScore": [total score achieved],
        "maxScore": ${maxScore},
        "percentage": [percentage score rounded to 1 decimal],
        "overallFeedback": "[comprehensive 2-3 sentence summary of overall performance]",
        "questionAssessments": [
          {
            "questionId": "[question ID]",
            "questionText": "[original question]",
            "userAnswer": "[user's answer]",
            "score": [score for this question out of ${maxQuestionScore}],
            "maxQuestionScore": ${maxQuestionScore},
            "feedback": "[detailed feedback for this specific answer - what was good, what was missing, suggestions for improvement]"
          }
        ],
        "strongAreas": [
          "[specific strength area 1 - be specific, e.g., 'Strong understanding of database optimization techniques']",
          "[specific strength area 2]",
          "[specific strength area 3]"
        ],
        "weakAreas": [
          "[specific weakness area 1 - be constructive, e.g., 'Limited knowledge of cloud architecture patterns']",
          "[specific weakness area 2]",
          "[specific weakness area 3]"
        ]
      }

      **IMPORTANT INSTRUCTIONS:**
      1. Be objective and constructive in your feedback
      2. Provide specific examples from the answers when giving feedback
      3. Include both positive reinforcement and areas for improvement
      4. Make recommendations actionable and specific
      5. Ensure the JSON is valid and properly formatted
      6. If an answer is completely off-topic or nonsensical, score it accordingly but still provide constructive feedback
      7. Consider the context and complexity of each question when scoring
      8. Strong areas should highlight what the candidate did well across multiple questions
      9. Weak areas should identify patterns of knowledge gaps or communication issues
      10. If any question is not answered, we sent you a placeholder as "No answer provided". Treat it as an incomplete response and score it 0.
      11. Return ONLY the JSON response, no additional text or formatting

      Begin your assessment:`;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();

      // Parse the JSON response
      const assessment: AssessmentResult = JSON.parse(responseText);

      // Validate and sanitize the response
      return this.validateAndSanitizeAssessment(
        assessment,
        maxScore,
        responses.length,
      );
    } catch (error) {
      Logger.error('Error assessing interview:', error);
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
