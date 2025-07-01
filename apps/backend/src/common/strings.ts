import { strategies } from "passport";

export const APP_STRINGS = {
  redis: {
    health: {
      redis_check_failed: 'Redis check failed',
    },
  },
  common: {
    pipes: {
      validation_failed: 'Validation failed (numeric string is expected)',
    },
    cannot_access_this_resource: 'Cannot access this resource',
  },
  background: {
    cron: {
      processor: {
        unknown_job_name: (jobName) => `Unknown job name ${jobName}`,
      },
    },
    queue: {
      unknown_job_name: (jobName) => `Unknown job name ${jobName}`,
    },
  },
  api_responses: {
    email: {
      providers: {
        sendgrid: {
          email_sent_successfully: 'Email sent successfully',
        },
      },
    },
    metrics: {
      http_request_counter_incremented_successfully:
        'HTTP request counter incremented',
      active_users_gauge_set: 'Active users gauge set',
    },
    media_upload: {
      provider: {
        aws: {
          file_uploaded_successfully: 'File uploaded successfully',
          file_deleted_successfully: 'File deleted successfully',
          file_listed_successfully: 'File listed successfully',
          file_retrieved_successfully: 'File retrieved successfully',
        },
      },
    },
  },
  api_errors: {
    gloabal: {
      something_went_wrong: 'Something went wrong.',
      forbidden: 'Forbidden.',
      invalid_details: 'Invalid Details',
      this_account_has_been_deleted: 'This account has been deleted',
      access_denied_admin_app:
        'Access denied: You do not have the required permissions to access the Admin app.',
      access_denied_user_app:
        'Access denied: You do not have the required permissions to access the User app.',
      invalid_request: 'Invalid request',
      foreign_key_constraint_error: (entity: string) =>
        `Invalid ${entity} provided`,
      mobile_app_only: 'This feature is only available on the mobile app.',
    },
    email: {
      Email_address_is_required: 'Email address is required',
      invalid_template_id: 'Invalid Template ID',
      failed_to_send_email: 'Failed to send email',
      failed_to_send_verification_email: (message: string) =>
        `Failed to send verification email: ${message}`,
      failed_to_send_contact_update_verification_email: (message: string) =>
        `Failed to send contact update verification email: ${message}`,
      providers: {
        sendgrid: {
          the_from_address_does_not_match_a_verified_sender_identity:
            'The from address does not match a verified Sender Identity. Mail cannot be sent until this error is resolved. Visit https://sendgrid.com/docs/for-developers/sending-email/sender-identity/ to see the Sender Identity requirements',
          the_provided_authorization_grant_is_invalid_expired_or_revoked:
            'The provided authorization grant is invalid, expired, or revoked',
          error_sending_email: (message: string) =>
            `Error sending email: ${message}`,
        },
      },
    },
    auth: {
      verification_code_expired: 'Verification code expired',
      user_not_found: 'User not found',
      invalid_code: 'Invalid code',
      strategies: {
        authentication: {
          roles: {
            roles_are_not_an_array: 'Roles are not an array',
          },
        }
      },
      too_many_attempts: 'Too many attempts',
      too_many_attempts_after_1_minute: 'Too many attempts after 1 minute',
      invalid_password: 'Invalid password',
    },
    media_upload: {
      file_required: 'File is required',
      an_error_occurred_during_file_upload:
        'An error occurred during file upload',
      an_error_occurred_during_file_deletion:
        'An error occurred during file deletion',
      an_error_occurred_while_listing_media:
        'An error occurred while listing media',
      an_error_occurred_while_retrieving_media:
        'An error occurred while retrieving media',
      file_name_is_required: 'File name is required',

      provider: {
        aws: {
          object_does_not_exist: 'Object does not exist in S3',
          failed_to_create_presigned_url_for_upload:
            'Failed to create presigned url for_upload',
          file_not_provided_or_is_undefined:
            'File not provided or is undefined',
          failed_to_upload_file_to_s3: 'Failed to upload file to S3',
          file_name_not_provided: 'File name not provided',
          file_not_found: 'File not found',
          failed_to_delete_file_from_s3: 'Failed to delete file from S3',
          no_files_found_in_s3: 'No files found in S3',
          failed_to_list_files_in_s3: 'Failed to list files in S3',
          failed_to_get_file_from_s3: 'Failed to get file from S3',
          failed_to_copy_file_in_s3: 'Failed to copy file in S3',
        },
      },
    },
    users: {
      country_code_required: 'Country code is required when phone number is provided',
      invalid_phone_number: (ids: string[]) => `Invalid course IDs: ${ids.join(', ')}`,
    },
    metrics: {
      failed_to_retrieve_metrics: 'Failed to retrieve metrics',
    },
  },
};
