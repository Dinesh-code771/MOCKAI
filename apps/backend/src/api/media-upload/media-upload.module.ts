import { Module } from '@nestjs/common';
import { MediaUploadController } from '@media-upload/media-upload.controller';
import { MediaUploadService } from '@media-upload/media-upload.service';
import { AwsProvider } from '@media-upload/providers/aws.provider';
import { RedisModule } from '@redis/redis.module';
import { DBModule } from '@db/db.module';

/**
 * @class MediaUploadModule
 * @description
 * The MediaUploadModule encapsulates the media upload functionality,
 * including the controller and service for handling media files.
 */
@Module({
  imports: [
    RedisModule,
    DBModule,
  ],
  controllers: [MediaUploadController],
  providers: [
    MediaUploadService,
    {
      provide: 'StorageProvider',
      useClass: AwsProvider, // Change this based on your requirements or configuration
    },
  ],
  exports: [MediaUploadService],
})
export class MediaUploadModule {}
