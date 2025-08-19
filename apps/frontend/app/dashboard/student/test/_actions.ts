'use server';

import { getAuthenticatedAssessmentsApi } from '@/lib/api-client';
import { getToken } from '@/app/auth/actions';
import {
  AssessmentsControllerGetUserAssessmentsStatusEnum,
  AssessmentsControllerGetUserAssessmentsTypeEnum,
  AssessmentsControllerGetAssessmentsListTypeEnum,
  AssessmentsControllerGetAssessmentsListDifficultyEnum,
  AssessmentsControllerGetAssessmentsListDraftAssessmentEnum,
} from '@mockai/sdk';

enum AssessmentTypeEnum {
  MSQ = 'msq',
  SAQ = 'saq',
  SAQ_WITH_TEXT = 'saq_with_text  ',
}

export const getTests = async (
  type: AssessmentsControllerGetAssessmentsListTypeEnum,
) => {
  try {
    const authenticatedApi = getAuthenticatedAssessmentsApi();
    const response =
      await authenticatedApi.assessmentsControllerGetAssessmentsList({
        type: type,
        page: 1,
        limit: 10,
        draftAssessment:
          AssessmentsControllerGetAssessmentsListDraftAssessmentEnum.False,
      });
    return response.data;
  } catch (error) {
    console.error('Error fetching tests:', error);
    // Return proper structure as fallback
    return {
      assessments: [],
      pagination: {
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
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
    console.log(response, 'response start test');
    return response.data;
  } catch (error) {
    console.error('Error fetching test by id:', error);
    return null;
  }
};

export const getInProgressTests = async (
  type: AssessmentsControllerGetUserAssessmentsTypeEnum,
) => {
  try {
    const authenticatedApi = getAuthenticatedAssessmentsApi();
    const response =
      await authenticatedApi.assessmentsControllerGetUserAssessments({
        type: type,
        page: 1,
        limit: 20,
        status: AssessmentsControllerGetUserAssessmentsStatusEnum.InProgress,
      });
    return response.data;
  } catch (error) {
    console.error('Error fetching in-progress tests:', error);
    // Return proper structure as fallback
    return {
      assessments: [],
      pagination: {
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
};

export const getScheduledTests = async (
  type: AssessmentsControllerGetUserAssessmentsTypeEnum,
) => {
  try {
    const authenticatedApi = getAuthenticatedAssessmentsApi();
    const response =
      await authenticatedApi.assessmentsControllerGetUserAssessments({
        type: type,
        page: 1,
        limit: 20,
        status: [
          AssessmentsControllerGetUserAssessmentsStatusEnum.Scheduled,
          AssessmentsControllerGetUserAssessmentsStatusEnum.InProgress,
        ],
      });
    return response.data;
  } catch (error) {
    console.error('Error fetching scheduled tests:', error);
    // Return proper structure as fallback
    return {
      assessments: [],
      pagination: {
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
};
