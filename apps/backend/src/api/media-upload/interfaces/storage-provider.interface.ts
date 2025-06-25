import { DataDto } from '@media-upload/dto/data.dto';
import { DeleteMediaResponseDto } from '@media-upload/dto/delete-media-response.dto';
import { GetMediaResponseDto } from '@media-upload/dto/get-media-response.dto';
import { ListMediaResponseDto } from '@media-upload/dto/list-media-response.dto';
import { UploadMediaResponseDto } from '@media-upload/dto/upload-media-response.dto';

/**
 * Interface representing a storage provider for media files.
 */
export interface StorageProvider {
  /**
   * Uploads a file to the storage.
   * @param file - The file to be uploaded.
   * @returns A promise that resolves to the response containing upload details.
   */
  upload(
    file: Express.Multer.File,
    isPrivate?: boolean,
  ): Promise<UploadMediaResponseDto<DataDto>>;

  /**
   * Retrieves a signed URL for accessing a file.
   * @param fileName - The name of the file for which to get the signed URL.
   * @returns A promise that resolves to the signed URL as a string.
   */
  getSignedUrl?(fileName: string): Promise<string>;

  /**
   * Deletes a file from the storage.
   * @param fileName - The name of the file to be deleted.
   * @returns A promise that resolves to the response confirming deletion.
   */
  delete(fileName: string): Promise<DeleteMediaResponseDto<DataDto>>;

  /**
   * Lists files in the storage with an optional prefix.
   * @param prefix - An optional prefix to filter the list of files.
   * @returns A promise that resolves to the response containing the list of files.
   */
  list(prefix?: string): Promise<ListMediaResponseDto<DataDto>>;

  /**
   * Retrieves a file from the storage.
   * @param fileName - The name of the file to be retrieved.
   * @returns A promise that resolves to the response containing the file details.
   */
  get(fileName: string): Promise<GetMediaResponseDto>;

  /**
   * Gets a presigned URL for uploading a file.
   * @param fileName - The name of the file to be uploaded.
   * @param fileType - The type of the file to be uploaded.
   * @returns A promise that resolves to the response containing the upload url.
   */
  uploadPresignedUrl(fileName: string, fileType: string): Promise<string>;

  /**
   * Gets the content of a PDF or DOCX file.
   * @param key - The key of the file to be retrieved.
   * @returns A promise that resolves to the content of the file as a string.
   */
  getPDForDocxFileContent(key: string): Promise<string>;

  /**
   * Copies a media file from one key to another.
   * @param actualKey - The key of the file to be copied.
   * @param copyKey - The key of the file to be copied to.
   * @returns A promise that resolves to the response confirming the copy operation.
   */
  copyMedia(actualKey: string, copyKey: string): Promise<string>;

  /**
   * Gets presigned URLs for a list of filenames.
   * @param filenames - The list of filenames for which to get presigned URLs.
   * @returns A promise that resolves to a map of filenames to presigned URLs.
   */
  getPresignedUrls(filenames: string[]): Promise<Map<string, string>>;

  /**
   * Lists all objects in the storage with an optional prefix.
   * @param prefix - An optional prefix to filter the list of objects.
   * @returns A promise that resolves to the list of objects.
   */
  listAllObjects(prefix: string): Promise<{ Key: string, LastModified?: Date }[]>;

  /**
   * Deletes a list of objects from the storage.
   * @param keys - The list of keys to be deleted.
   * @returns A promise that resolves to the response confirming the deletion.
   */
  deleteObjects(keys: string[]): Promise<void>;
}
