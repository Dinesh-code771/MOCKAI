import {
  Controller,
  Get,
  Query,
  HttpStatus,
  Post,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RouteNames } from '@common/route-names';
import { ResponseUtil } from '@common/helpers/response.utils';
import { AssessmentsService } from '@assessments/assessments.service';
import { Auth } from '@auth/decorator/auth.decorator';
import { AuthType, RoleType } from '@common/enums/auth-type.enum';
import { User } from '@common/decorators/user.decorator';
import {
  AssessmentListQueryDto,
  AssessmentListApiResponse,
  UserAssessmentListQueryDto,
} from '@assessments/dto/assessment-list.dto';
import {
  UserAssessmentListApiResponse,
  UserAssessmentQueryDto,
} from '@assessments/dto/user-assessment-list.dto';
import {
  StartAssessmentBodyDto,
  StartAssessmentApiResponse,
  CompleteAssessmentApiResponse,
  UserAnswerResponseDto,
} from '@assessments/dto/start-assessment.dto';
import { UserInfo } from '@common/types/auth.types';
import { StoreAnswerDto } from '@assessments/dto/store-answer.dto';
import { Roles } from '@auth/decorator/roles.decorator';
import {
  UpsertAssessmentDto,
  UpsertAssessmentApiResponse,
} from '@assessments/dto/upsert-assessment.dto';

@Controller(RouteNames.ASSESSMENTS)
@ApiTags('Assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Get(RouteNames.ASSESSMENTS_LIST)
  @ApiOperation({
    summary: 'Get list of assessments with filtering and pagination',
    description:
      'Retrieve assessments with optional filters for type, course_id, and difficulty. Supports pagination.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Assessments retrieved successfully',
    type: AssessmentListApiResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid query parameters provided.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async getAssessmentsList(
    @Query() query: AssessmentListQueryDto,
    @User() user: UserInfo,
  ): Promise<AssessmentListApiResponse> {
    const response = await this.assessmentsService.getAssessmentsList(
      query,
      user,
    );
    return ResponseUtil.success(
      response,
      'Assessments retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Post(RouteNames.ASSESSMENTS_START)
  @Auth(AuthType.JWT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Start an assessment',
    description:
      'If userAssessmentId is provided, checks existing assessment and returns questions if within duration. If assessmentId is provided, creates new user assessment with status in_progress and returns questions.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Assessment started successfully',
    type: StartAssessmentApiResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User assessment or assessment not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Assessment cannot be started (time expired, already completed, etc.) or missing required fields',
  })
  async startAssessment(
    @Body() body: StartAssessmentBodyDto,
    @User('id') userId: string,
  ): Promise<StartAssessmentApiResponse> {
    const response = await this.assessmentsService.startAssessment(
      userId,
      body.assessmentId,
    );
    return ResponseUtil.success(
      response,
      'Assessment started successfully',
      HttpStatus.OK,
    );
  }

  @Post(RouteNames.ASSESSMENTS_STORE_USER_ANSWERS)
  @Auth(AuthType.JWT)
  @Roles(RoleType.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Store user answers',
    description: 'Store user answers for a question',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User answers stored successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request body',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User assessment or question not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async storeUserAnswers(
    @Body() body: StoreAnswerDto,
    @Param('userAssessmentId') userAssessmentId: string,
    @Param('questionId') questionId: string,
  ) {
    const response = await this.assessmentsService.storeUserAnswers(
      userAssessmentId,
      questionId,
      body.answer,
    );
    return ResponseUtil.success(
      response,
      'User answers stored successfully',
      HttpStatus.OK,
    );
  }

  @Post(RouteNames.ASSESSMENTS_COMPLETE)
  @Auth(AuthType.JWT)
  @Roles(RoleType.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Complete an assessment',
    description: 'Mark an assessment as completed and calculate final results',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Assessment completed successfully',
    type: CompleteAssessmentApiResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User assessment not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Assessment cannot be completed (already completed, etc.)',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async completeAssessment(
    @Param('userAssessmentId') userAssessmentId: string,
  ): Promise<CompleteAssessmentApiResponse> {
    const response =
      await this.assessmentsService.completeAssessment(userAssessmentId);
    return ResponseUtil.success(
      response,
      'Assessment completed successfully',
      HttpStatus.OK,
    );
  }

  @Get(RouteNames.ASSESSMENTS_GET_COMPLETE_DATA)
  @Auth(AuthType.JWT)
  @Roles(RoleType.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get completed assessment data',
    description:
      'Retrieve complete assessment data including results and answers',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Assessment data retrieved successfully',
    type: CompleteAssessmentApiResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User assessment not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Assessment is not completed',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async getUserAssessmentCompleteData(
    @Param('userAssessmentId') userAssessmentId: string,
  ): Promise<CompleteAssessmentApiResponse> {
    const response =
      await this.assessmentsService.getUserAssessmentCompleteData(
        userAssessmentId,
      );
    return ResponseUtil.success(
      response,
      'Assessment data retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get(RouteNames.ASSESSMENTS_USER_LIST)
  @Auth(AuthType.JWT)
  @Roles(RoleType.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'API to get user assessments list with filtering and pagination',
    description:
      'Get paginated list of user assessments with optional filtering by type, course, difficulty, and status.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User assessments list retrieved successfully',
    type: UserAssessmentListApiResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid query parameters.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Student access required.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async getUserAssessments(
    @User('id') userId: string,
    @Query() query: UserAssessmentQueryDto,
  ): Promise<UserAssessmentListApiResponse> {
    const response = await this.assessmentsService.getUserAssessments(
      userId,
      query,
    );
    return ResponseUtil.success(
      response,
      'User assessments list retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Post(RouteNames.ASSESSMENTS_UPSERT)
  @Auth(AuthType.JWT)
  @Roles(RoleType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'API to create or update assessment with questions (Admin only)',
    description:
      'Create a new assessment or update an existing unpublished assessment with questions. Only unpublished assessments can be updated.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Assessment upserted successfully',
    type: UpsertAssessmentApiResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Invalid assessment data, published assessment update attempt, or validation errors.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Assessment or course not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid access token.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Admin access required.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async upsertAssessment(
    @Body() upsertAssessmentDto: UpsertAssessmentDto,
  ): Promise<UpsertAssessmentApiResponse> {
    const response =
      await this.assessmentsService.upsertAssessment(upsertAssessmentDto);
    return ResponseUtil.success(
      response,
      'Assessment upserted successfully',
      HttpStatus.OK,
    );
  }
}
