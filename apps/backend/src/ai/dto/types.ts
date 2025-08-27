type QuestionResponse = {
  questionId: string;
  questionText: string;
  userAnswer: string;
};

type AssessmentResult = {
  overallScore: number;
  maxScore: number;
  percentage: number;
  overallFeedback: string;
  questionAssessments: Array<{
    questionId: string;
    questionText: string;
    userAnswer: string;
    score: number;
    maxQuestionScore: number;
    feedback: string;
  }>;
  strongAreas: string[];
  weakAreas: string[];
};
