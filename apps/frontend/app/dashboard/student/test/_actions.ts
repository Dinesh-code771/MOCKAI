'use server';

import { getAuthenticatedAssessmentsApi } from '@/lib/api-client';
import { getToken } from '@/app/auth/actions';
import {
  AssessmentsControllerGetUserAssessmentsStatusEnum,
  AssessmentsControllerGetUserAssessmentsTypeEnum,
} from '@mockai/sdk';

enum AssessmentTypeEnum {
  MSQ = 'msq',
  SAQ = 'saq',
  SAQ_WITH_TEXT = 'saq_with_text  ',
}

export const getTests = async () => {
  try {
    const authenticatedApi = getAuthenticatedAssessmentsApi();
    const response =
      await authenticatedApi.assessmentsControllerGetAssessmentsList();
    return response.data;
  } catch (error) {
    console.error('Error fetching tests:', error);
    // Return empty array as fallback
    return [];
  }
};

export const startTest = async (id: string) => {
  try {
    const authenticatedApi = getAuthenticatedAssessmentsApi();
    const response =
      await authenticatedApi.assessmentsControllerStartAssessment({
        startAssessmentBodyDto: {
          assessmentId: id,
        },
      });
    console.log(response, 'start test');
    return response.data;
  } catch (error) {
    console.error('Error fetching test by id:', error);
    return null;
  }
};

export const getInProgressTests = async () => {
  try {
    const authenticatedApi = getAuthenticatedAssessmentsApi();
    const response =
      await authenticatedApi.assessmentsControllerGetUserAssessments({
        type: AssessmentsControllerGetUserAssessmentsTypeEnum.Mcq,
        page: 1,
        limit: 10,
        // status: AssessmentsControllerGetUserAssessmentsStatusEnum.InProgress,
      });
    return response.data;
  } catch (error) {
    console.error('Error fetching in-progress tests:', error);
    return [];
  }
};
