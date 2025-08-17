'use server';

import { getAuthenticatedAssessmentsApi } from '@/lib/api-client';
import { AssessmentsControllerUpsertAssessmentRequest, UpsertAssessmentDto } from '@mockai/sdk';

export async function createAssessmentAction(
  assessment: UpsertAssessmentDto,
) {
  console.log('Creating assessment:', assessment, typeof assessment);
  const authenticatedApi = getAuthenticatedAssessmentsApi();
  const response = await authenticatedApi.assessmentsControllerUpsertAssessment(
    {
      upsertAssessmentDto: assessment,
    },  
  );
  return response.data;
}
