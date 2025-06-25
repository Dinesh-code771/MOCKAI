import { Inject, Injectable, Logger } from '@nestjs/common';
import { DataDto } from '@media-upload/dto/data.dto';
import { DeleteMediaResponseDto } from '@media-upload/dto/delete-media-response.dto';
import { GetMediaResponseDto } from '@media-upload/dto/get-media-response.dto';
import { ListMediaResponseDto } from '@media-upload/dto/list-media-response.dto';
import { UploadMediaResponseDto } from '@media-upload/dto/upload-media-response.dto';
import { UploadMediaDto } from '@media-upload/dto/upload-media.dto';
import { StorageProvider } from '@media-upload/interfaces/storage-provider.interface';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '@config/env.config';

/**
 * Service for handling media uploads, deletions, and retrievals.
 */
@Injectable()
export class MediaUploadService {
  private readonly nodeEnv: string;

  constructor(
    @Inject('StorageProvider')
    private readonly storageProvider: StorageProvider,
    private readonly configService: ConfigService<EnvConfig>,
  ) {
    this.nodeEnv = this.configService.get('NODE_ENV');
  }

  /**
   * Uploads media file.
   * @param dto - The data transfer object containing the file to upload.
   * @returns A promise that resolves to the response DTO containing upload details.
   */
  async uploadMedia(
    dto: UploadMediaDto,
    isPrivate?: boolean,
  ): Promise<UploadMediaResponseDto<DataDto>> {
    return await this.storageProvider.upload(dto.file, isPrivate);
  }

  /**
   * Deletes a media file by its name.
   * @param fileName - The name of the file to delete.
   * @returns A promise that resolves to the response DTO confirming deletion.
   */
  async deleteMedia(
    fileName: string,
  ): Promise<DeleteMediaResponseDto<DataDto>> {
    return await this.storageProvider.delete(fileName);
  }

  /**
   * Lists media files with an optional prefix filter.
   * @param prefix - An optional prefix to filter the media files.
   * @returns A promise that resolves to the response DTO containing the list of media files.
   */
  async listMedia(prefix?: string): Promise<ListMediaResponseDto<DataDto>> {
    return await this.storageProvider.list(prefix);
  }

  /**
   * Retrieves a media file by its name.
   * @param fileName - The name of the file to retrieve.
   * @returns A promise that resolves to the response DTO containing the media file.
   */
  async getMedia(fileName: string): Promise<GetMediaResponseDto> {
    return await this.storageProvider.get(fileName);
  }

  async getPDForDocxFileContent(key: string): Promise<string | null> {
    return await this.storageProvider.getPDForDocxFileContent(key);
  }

  async uploadPresignedUrl(
    fileName: string,
    fileType: string,
  ): Promise<string> {
    return await this.storageProvider.uploadPresignedUrl(fileName, fileType);
  }

  async copyMedia(actualKey: string, copyKey: string) {
    return await this.storageProvider.copyMedia(actualKey, copyKey);
  }

  async getPresignedUrls(filenames: string[]): Promise<Map<string, string>> {
    return await this.storageProvider.getPresignedUrls(filenames);
  }
}
