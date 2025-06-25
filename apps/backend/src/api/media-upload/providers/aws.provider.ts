import {
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { EnvConfig } from '@config/env.config';
import { DataDto } from '@media-upload/dto/data.dto';
import { DeleteMediaResponseDto } from '@media-upload/dto/delete-media-response.dto';
import { GetMediaResponseDto } from '@media-upload/dto/get-media-response.dto';
import { ListMediaResponseDto } from '@media-upload/dto/list-media-response.dto';
import { UploadMediaResponseDto } from '@media-upload/dto/upload-media-response.dto';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageProvider } from '@media-upload/interfaces/storage-provider.interface';
import * as pdf from 'pdf-parse';
import * as mammoth from 'mammoth';
import { REDIS_CLIENT } from '@redis/redis.provider';
import Redis from 'ioredis';
import { APP_STRINGS } from '@common/strings';

@Injectable()
export class AwsProvider implements StorageProvider {
  private readonly s3Client: S3Client;
  private readonly imageExpiration: number;

  constructor(
    private readonly configService: ConfigService<EnvConfig>,
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.imageExpiration = this.configService.get('PRIVATE_IMAGE_EXPIRATION');
  }

  async createPresignedUrl(fileName: string): Promise<string> {
    try {
      // Check if the object exists
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Key: fileName,
        }),
      );

      // If the object exists, proceed to create a presigned URL
      const command = new GetObjectCommand({
        Bucket: this.configService.get('AWS_BUCKET_NAME'),
        Key: fileName,
      });

      const presignedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      });

      return presignedUrl;
    } catch (error) {
      if (error.name === 'NotFound') {
        throw new NotFoundException(
          APP_STRINGS.api_errors.media_upload.provider.aws.object_does_not_exist,
        );
      } else {
        Logger.error(
          `Error creating presigned URL for upload: ${error.message}`,
        );
      }
      throw new Error(
        APP_STRINGS.api_errors.media_upload.provider.aws.failed_to_create_presigned_url_for_upload,
      );
    }
  }

  async uploadPresignedUrl(
    fileName: string,
    fileType: string,
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.configService.get('AWS_BUCKET_NAME'),
        Key: fileName,
        ContentType: fileType,
      });

      const presignedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      });

      return presignedUrl;
    } catch (error) {
      Logger.error(`Error uploading file: ${error.message}`);
      throw error;
    }
  }

  async upload(
    file: Express.Multer.File,
    isPrivate?: boolean,
  ): Promise<UploadMediaResponseDto<DataDto>> {
    if (!file) {
      throw new BadRequestException(
        APP_STRINGS.api_errors.media_upload.provider.aws.file_not_provided_or_is_undefined,
      );
    }
    try {
      const response = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Key: file.originalname,
          Body: file.buffer,
          ContentType: file.mimetype,
          ContentLength: file.size,
          ...(!isPrivate && { ACL: 'public-read' }),
        }),
      );

      if (response.$metadata.httpStatusCode !== 200) {
        throw new BadRequestException(
          APP_STRINGS.api_errors.media_upload.provider.aws.failed_to_upload_file_to_s3,
        );
      }

      // const url = await this.createPresignedUrl(file.originalname);

      //If we don't want presigned url, use this.
      const encodedObjectKey = encodeURIComponent(file.originalname);
      const url = `https://${this.configService.get('AWS_BUCKET_NAME')}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${encodedObjectKey}`;
      return {
        statusCode: response.$metadata.httpStatusCode,
        message:
          APP_STRINGS.api_responses.media_upload.provider.aws
            .file_uploaded_successfully,
        data: {
          fileName: file.originalname,
          etag: response.ETag.replaceAll('"', ''),
          url: url,
        },
      };
    } catch (error) {
      Logger.error(`Error uploading file: ${error.message}`);
      throw new Error(
        APP_STRINGS.api_errors.media_upload.provider.aws.failed_to_upload_file_to_s3,
      );
    }
  }

  async delete(fileName: string): Promise<DeleteMediaResponseDto<DataDto>> {
    if (fileName === undefined || !fileName.trim().length) {
      throw new BadRequestException(
        APP_STRINGS.api_errors.media_upload.provider.aws.file_name_not_provided,
      );
    }
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Key: fileName,
        }),
      );

      const response = await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Key: fileName,
        }),
      );

      return {
        statusCode: response.$metadata.httpStatusCode,
        message:
          APP_STRINGS.api_responses.media_upload.provider.aws
            .file_deleted_successfully,
        data: null,
      };
    } catch (error) {
      if (error.name === 'NotFound') {
        throw new NotFoundException(
          APP_STRINGS.api_errors.media_upload.provider.aws.file_not_found,
        );
      } else {
        Logger.error(`Error deleting file: ${error.message}`);
      }
      throw new Error(
        APP_STRINGS.api_errors.media_upload.provider.aws.failed_to_delete_file_from_s3,
      );
    }
  }

  async list(prefix?: string): Promise<ListMediaResponseDto<DataDto>> {
    try {
      const response = await this.s3Client.send(
        new ListObjectsV2Command({
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Prefix: prefix,
        }),
      );

      if (!response.Contents || !response.Contents.length) {
        throw new NotFoundException(
          APP_STRINGS.api_errors.media_upload.provider.aws.no_files_found_in_s3,
        );
      }

      const data = response.Contents.map((file) => {
        return {
          etag: file.ETag.replaceAll('"', ''),
          url: file.Key,
        };
      });

      return {
        statusCode: response.$metadata.httpStatusCode,
        message:
          APP_STRINGS.api_responses.media_upload.provider.aws
            .file_listed_successfully,
        data: data,
      };
    } catch (error) {
      Logger.error(`Error listing files: ${error.message}`);
      throw new Error(
        APP_STRINGS.api_errors.media_upload.provider.aws.failed_to_list_files_in_s3,
      );
    }
  }

  async get(fileName: string): Promise<GetMediaResponseDto> {
    if (fileName === undefined || !fileName.trim().length) {
      throw new BadRequestException(
        APP_STRINGS.api_errors.media_upload.provider.aws.file_name_not_provided,
      );
    }
    try {
      const response = await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Key: fileName,
        }),
      );

      const presignedUrl = await this.createPresignedUrl(fileName);

      return {
        statusCode: response.$metadata.httpStatusCode,
        message:
          APP_STRINGS.api_responses.media_upload.provider.aws
            .file_retrieved_successfully,
        data: {
          fileName,
          etag: response.ETag.replaceAll('"', ''),
          url: presignedUrl,
        },
      };
    } catch (error) {
      if (error.name === 'NotFound') {
        throw new NotFoundException(
          APP_STRINGS.api_errors.media_upload.provider.aws.file_not_found,
        );
      } else {
        Logger.error(`Error getting file: ${error.message}`);
      }
      throw new Error(
        APP_STRINGS.api_errors.media_upload.provider.aws.failed_to_get_file_from_s3,
      );
    }
  }

  async getPDForDocxFileContent(key: string): Promise<string | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.configService.get('AWS_BUCKET_NAME'),
        Key: key,
      });
      const response = await this.s3Client.send(command);

      if (!response.Body) {
        Logger.error('Empty file response from S3.');
        return null;
      }

      const fileBuffer = await response.Body.transformToByteArray();
      if (!fileBuffer) return null;

      if (key.endsWith('.pdf')) {
        const pdfData = await pdf(fileBuffer);
        return pdfData.text.trim();
      } else if (key.endsWith('.docx')) {
        const docxData = await mammoth.extractRawText({
          buffer: Buffer.from(fileBuffer),
        });
        return docxData.value.trim();
      } else {
        Logger.warn('Unsupported file type:', key);
        return null;
      }
    } catch (error) {
      Logger.error('Error fetching file from S3:', error);
      return null;
    }
  }

  async copyMedia(actualKey: string, copyKey: string): Promise<string> {
    try {
      const command = new CopyObjectCommand({
        Bucket: this.configService.get('AWS_BUCKET_NAME'),
        CopySource: `${this.configService.get('AWS_BUCKET_NAME')}/${actualKey}`,
        Key: copyKey,
      });
      await this.s3Client.send(command);
      const encodedObjectKey = encodeURIComponent(copyKey);
      const url = `https://${this.configService.get('AWS_BUCKET_NAME')}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${encodedObjectKey}`;
      return url;
    } catch (error) {
      Logger.error(`Error copying file: ${error.message}`);
      throw new Error(
        APP_STRINGS.api_errors.media_upload.provider.aws.failed_to_copy_file_in_s3,
      );
    }
  }

  async getPresignedUrls(filenames: string[]): Promise<Map<string, string>> {
    const presignedUrls = new Map<string, string>();

    await Promise.allSettled(
      filenames.map(async (filename) => {
        const key = `media:presigned-url:${filename}`;

        const cachedUrl = await this.redisClient.get(key);

        if (cachedUrl) {
          presignedUrls.set(filename, cachedUrl);
          return;
        }

        const command = new GetObjectCommand({
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Key: filename,
        });
        const presignedUrl = await getSignedUrl(this.s3Client, command, {
          expiresIn: this.configService.get('PRIVATE_IMAGE_EXPIRATION'),
        });
        presignedUrls.set(filename, presignedUrl);
        await this.redisClient.setex(key, this.imageExpiration, presignedUrl);
      }),
    );

    return presignedUrls;
  }

  async listAllObjects(prefix: string) {
    let continuationToken: string | undefined = undefined;
    const allObjects: { Key: string, LastModified?: Date }[] = [];

    do {
      const res = await this.s3Client.send(
        new ListObjectsV2Command({
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Prefix: prefix,
          ContinuationToken: continuationToken,
        })
      )
      const keys = res.Contents?.map(obj => ({ Key: obj.Key!, LastModified: obj.LastModified! })) || [];
      allObjects.push(...keys);

      continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;;
    } while (continuationToken);

    return allObjects;
  }

  async deleteObjects(keys: string[]) {
    try {
      await this.s3Client.send(
        new DeleteObjectsCommand({
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Delete: {
            Objects: keys.map((key) => ({ Key: key })),
          },
        }),
      );
    } catch (error) {
      Logger.error(`Error deleting objects: ${error.message}`);
    }
  }
}
