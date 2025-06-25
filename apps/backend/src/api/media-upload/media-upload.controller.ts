import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Req,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MediaUploadService } from '@media-upload/media-upload.service';
import { Request } from 'express';
import { RouteNames } from '@common/route-names';
import { APP_STRINGS } from '@common/strings';
import { AuthType } from '@common/enums/auth-type.enum';
import { GetMediaResponseDto } from '@media-upload/dto/get-media-response.dto';
import { DeleteMediaApiResponseDto } from '@media-upload/dto/delete-media-response.dto';

/**
 * MediaUploadController handles media file uploads, deletions, and retrievals.
 * It provides endpoints for uploading, deleting, listing, and getting media files.
 */
@Controller(RouteNames.MEDIA_UPLOAD)
@ApiTags('Media')
export class MediaUploadController {
  constructor(private readonly mediaUploadService: MediaUploadService) {}

  /**
   * Uploads a media file.
   * @param req - The request object.
   * @param file - The uploaded file.
   * @throws BadRequestException if no file is provided.
   */
  @Post(RouteNames.MEDIA_UPLOAD_UPLOAD)
  @ApiExcludeEndpoint()
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 1024 * 1024 * 10 } }),
  )
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadMedia(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        APP_STRINGS.api_errors.media_upload.file_required,
      );
    }
    try {
      return await this.mediaUploadService.uploadMedia({ file });
    } catch (error) {
      Logger.error('Error in uploadMedia:', error);
      throw new BadRequestException(
        error.message ||
          APP_STRINGS.api_errors.media_upload
            .an_error_occurred_during_file_upload,
      );
    }
  }

  /**
   * Deletes a media file by its name.
   * @param fileName - The name of the file to delete.
   * @throws BadRequestException if the file name is not provided.
   */
  @Delete(RouteNames.MEDIA_UPLOAD_DELETE)  
  @ApiBearerAuth()
  @ApiQuery({ name: 'fileName', required: true })
  @ApiOperation({ summary: 'Delete media file by name' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Media file deleted successfully',
    type: DeleteMediaApiResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Media file not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  async deleteMedia(@Query('fileName') fileName: string) {
    if (!fileName) {
      throw new BadRequestException(
        APP_STRINGS.api_errors.media_upload.file_name_is_required,
      );
    }
    try {
      return await this.mediaUploadService.deleteMedia(fileName);
    } catch (error) {
      Logger.error('Error in deleteMedia:', error);
      throw new BadRequestException(
        error.message ||
          APP_STRINGS.api_errors.media_upload
            .an_error_occurred_during_file_deletion,
      );
    }
  }

  /**
   * Lists media files, optionally filtered by a prefix.
   * @param prefix - An optional prefix to filter the list of media files.
   */
  @Get(RouteNames.MEDIA_UPLOAD_LIST)
  @ApiExcludeEndpoint() 
  @ApiBearerAuth()
  @ApiQuery({ name: 'prefix', required: false })
  @ApiOperation({ summary: 'List media files' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Media files retrieved successfully',
  })
  async listMedia(@Query('prefix') prefix?: string) {
    try {
      return await this.mediaUploadService.listMedia(prefix);
    } catch (error) {
      Logger.error('Error in listMedia:', error);
      throw new BadRequestException(
        error.message ||
          APP_STRINGS.api_errors.media_upload
            .an_error_occurred_while_listing_media,
      );
    }
  }

  /**
   * Retrieves a media file by its name.
   * @param fileName - The name of the file to retrieve.
   * @throws BadRequestException if the file name is not provided.
   */
  @Get(RouteNames.MEDIA_UPLOAD_GET)
  @ApiBearerAuth()
  @ApiQuery({ name: 'fileName', required: true })
  @ApiOperation({ summary: 'Get media file by name' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Media file retrieved successfully',
    type: GetMediaResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Media file not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  async getMedia(@Query('fileName') fileName: string) {
    if (!fileName) {
      throw new BadRequestException(
        APP_STRINGS.api_errors.media_upload.file_name_is_required,
      );
    }
    try {
      return await this.mediaUploadService.getMedia(fileName);
    } catch (error) {
      Logger.error('Error in getMedia:', error);
      throw new BadRequestException(
        error.message ||
          APP_STRINGS.api_errors.media_upload
            .an_error_occurred_while_retrieving_media,
      );
    }
  }
}
