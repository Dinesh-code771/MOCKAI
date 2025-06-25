export const APP_STRINGS = {
  notifications: {
    auction_updates: 'Auction Updates',
    auction_list: 'Auction List',
    listing_deleted_by_admin:
      'Your listing has been deleted from salemate-team.',
    admin_deleted_listings: (adminName: string) =>
      `${adminName} has deleted a listing.`,
    you_deleted_a_listings: 'You deleted a listing.',
    boosting_plan: 'Boosting Plan',
    service_request: 'Service Request',
    service_cancelled: 'Service Cancelled',
    service_completed: 'Service Completed',
    document_verification: 'Document Verification',
    a_listing_has_been_deleted_by_admin: 'Listing has been deleted by admin',
    transaction_alert: 'Transaction Alert',
    support_alert: 'New Support Ticket Request',
    flag_alert: 'Flag Alert',
    listing_deleted: 'Listing Deleted.',
    public_post_deleted: 'Public Post Deleted.',
    public_post_comment_deleted: 'Public Post Comment Deleted.',
    chat_message_deleted: 'Chat Message Deleted.',
    user_deleted: 'User Deleted.',
    listing_comment_deleted: 'Listing Comment Deleted.',
    policy_update: 'Policy Update',
    listing_update: 'Listing Updated',
    boosting_paused: 'Boosting Paused',
    boosting_resumed: 'Boosting Resumed',
    boosting_cancelled: 'Boosting Cancelled',
    recurring_payment_reminder: 'Recurring Payment Reminder',
    refund_done: (amount: number, item: string, success: boolean) =>
      `A refund of $${amount} was made for ${item} ${
        success ? 'successfully' : 'failed'
      }`,
    listing_status_updated: (enable: boolean) =>
      `Listing ${enable ? 'Enabled' : 'Disabled'}`,
    user_account_status_updated: (status: boolean) =>
      `User Account ${status ? 'Enabled' : 'Disabled'}.`,
    notification_messages: {
      auction_bid_withdrawn: 'Your bid has been withdrawn, Refund will be initiated',
      new_transaction_for_boosting: (amount: number) =>
        amount === 0
          ? 'A new free trial was started for a boosting plan'
          : `A new transaction of $${amount} was made for a boosting plan`,
      transaction_for_boosting_plan_upgrade: (amount: number) =>
        `A transaction of $${amount} was made for a boosting plan upgrade`,
      recurring_transaction_for_boosting: (amount: number) =>
        `A recurring transaction of $${amount} was made for a boosting plan`,
      transaction_for_auction_bid: (amount: number) =>
        `A transaction of $${amount} was made for a auction bid`,
      transaction_for_service_request: (amount: number) =>
        `A transaction of $${amount} was made for a service request`,
      your_listing_has_updated_successfully:
        'Your listing has been updated successfully',
      admin_update_listing: 'Admin has updated your listing',
      auction_bid_won: 'You won the auction',
      auction_bid_rejected: 'Your bid was rejected by the seller',
      your_listing_is_now_live: 'Your listing is now live!',
      you_are_added_as_a_co_seller_to_a_listing:
        'You are added as a co-seller to a listing',
      service_confirmed: (businessName: string) =>
        `Your booking for <b>${businessName}</b> Services is confirmed.`,
      service_cancelled: (businessName: string, shouldSendRefund: boolean) =>
        `Your booking for <b>${businessName}</b> Services has been cancelled. ${shouldSendRefund ? 'Refund will be initiated for your booking.' : ''}`,
      service_completed: (businessName: string) =>
        `Your booking for <b>${businessName}</b> Services has been completed.`,
      service_rating_request: (businessName: string) =>
        `We’d love to hear from you! Please rate your experience with <b>${businessName}</b> to help improve our services.`,
      boosting_plan_purchased:
        'You have successfully purchased a boosting plan for your listing.',
      boosting_plan_updated: 'Your boosting plan has been updated.',
      boosting_payment_failed:
        'Failed to process your boosting payment. Please check your payment method.',
      seller_not_accepted_your_bid: 'Your bid was rejected by the seller',
      seller_accepted_your_bid: 'Your bid was accepted by the seller',
      owner_auction_updates:
        'Auction Closed !! You can now accept the highest bid if reserve price is not met',
      auction_closed: 'Auction has been closed',
      listing_owner_auction_updates:
        'Auction Ended !! You can now accept the highest bid if reserve price is not met',
      listing_auction_ended: 'Auction Ended',
      bidder_auction_updates: (highestBidId: string, bidId: string) =>
        `Auction Ended !! ${highestBidId === bidId ? 'You won the auction' : 'Your bid was outbid by a higher bid'}`,
      you_were_mentioned_in_a_comment: (comment?: string) =>
        `You were mentioned in a comment${comment ? `: ${comment}` : ''}`,
      you_password_has_been_successfully_updated:
        'Your password has been successfully updated.',
      welcome_to_salemate_your_all_in_one_destination_for_buying:
        'Welcome to SaleMate! Your all-in-one destination for buying, selling, and managing real estate.',
      your_username_has_been_successfully_updated:
        'Your username has been successfully updated.',
      your_password_has_been_successfully_updated:
        'Your password has been successfully updated.',
      participant_has_removed_you_from_a_group_chat: (fullName: string) =>
        `${fullName} has removed you from a group chat`,
      user_has_accepted_your_request: (fullName) =>
        `${fullName} has accepted your request to start a chat`,
      user_has_reject_your_request: (fullName) =>
        `${fullName} has rejected your request to start a chat`,
      post_comment_mention: (comment?: string, fullName?: string) =>
        `<b>${fullName}</b> mentioned you in a comment${comment ? `: ${comment}` : ''}`,
      post_comment: (comment?: string, fullName?: string) =>
        `<b>${fullName}</b> commented${comment ? `: ${comment}` : ''}`,
      listing_comment_mention: (comment?: string, fullName?: string) =>
        `<b>${fullName}</b> mentioned you in a comment${comment ? `: ${comment}` : ''}`,
      listing_comment: (comment?: string, fullName?: string) =>
        `<b>${fullName}</b> commented${comment ? `: ${comment}` : ''}`,
      document_verification_success:
        'Your document has been verified successfully.',
      document_verification_rejected: (reason: string) =>
        `Your document verification was rejected. Reason: ${reason}`,
      document_verification_revoked: (reason: string) =>
        `Your document verification has been revoked. Reason: ${reason}`,
      user_has_uploaded_a_verification_document: (fullName: string) =>
        `${fullName} has uploaded a verification document`,
      please_take_a_moment_to_review_our_updated_terms_of_use_privacy_policy: (
        consentType: string,
      ) => `Please take a moment to review our updated ${consentType}.`,
      user_accepted_request_to_start_chat: (fullName: string) =>
        `${fullName} has accepted your request to start a chat`,
      user_rejected_request_to_start_chat: (fullName: string) =>
        `${fullName} has accepted your rejected request to start a chat`,
      your_message_has_been_deleted_due_to_a_violation_of_our_content_policy:
        'Your message has been deleted due to a violation of our content policy',
      removed_from_group_chat: (fullName: string) =>
        `${fullName} has removed you from a group chat`,
      new_support_ticket_created: (fullName: string) =>
        `${fullName} has created a new support ticket`,
      new_flag_created: (contentType: string, fullName: string) =>
        `A new report has been submitted by ${fullName} for ${contentType}.`,
      user_account_status_updated: (status: boolean) =>
        `Your account has been ${status ? 'enabled' : 'disabled'} by salemate-team`,
      listing_status_updated: (enable: boolean) =>
        `Your listing has been ${enable ? 'enabled' : 'disabled'} by salemate-team`,
      listing_comment_deleted:
        'Your listing comment has been deleted by salemate-team',
      public_post_deleted:
        'Your public post has been deleted by salemate-team due to a violation of our content policy',
      public_post_comment_deleted:
        'Your public post comment has been deleted by salemate-team due to a violation of our content policy',
      auction_bid_outbid:
        'Your bid has been outbid! Someone has placed a higher bid than yours. Consider increasing your bid to stay in the auction!',
      boosting_paused: 'Your boosting has been paused by salemate-team',
      boosting_resumed: 'Your boosting has been reactivated. ',
      boosting_cancelled: 'Your boosting has been successfully cancelled',
      recurring_payment_reminder: (listingTitle: string) =>
        `Your subscription for ${listingTitle} is due. Please ensure to make payment to avoid service interruption.`,
    },
    providers: {
      aws: {
        failed_to_send_push_notification: 'Failed to send push notification',
        failed_to_send_push_notification_to_topic:
          'Failed to send push notification to topic',
      },
      firebase: {
        failed_to_send_push_notification: 'Failed to send push notification',
      },
    },
    comment_update: 'Mention comment',
    password_updated: 'Password Updated',
    welcome_to_salemate: 'Welcome to SaleMate',
    username_update: 'Username updated',
    document_verification_status: (operationType) =>
      `Document verification ${operationType === 'revoked' ? 'rejected' : 'revoked'}`,
    message_received: 'Message received',
    removed_from_group: 'Removed from group',
    user_invitaion_request: 'User invotaion request',
  },

  send_sms: {
    your_otp_for_registration: (otp: string) =>
      `Your OTP for registration is ${otp}`,
    your_otp: (otp: string) => `Your OTP is ${otp}`,
    your_otp_for_contact_update: (otp: string) =>
      `Your OTP for contact update is ${otp}`,
  },

  auth: {},

  chat: {
    buyer_to_seller_contact_request: (fullName: string) =>
      `${fullName} wants to inquire about the listing`,
    group_conversation_chat_message_join: (fullName: string) =>
      `${fullName} has joined the chat.`,
    group_conversation_chat_message_leave: (fullName: string) =>
      `${fullName} has left the chat.`,
    username_want_to_inquiry_about_listing: (fullName: string) =>
      `${fullName} wants to inquire about the listing`,
    user_has_joined_the_chat: (fullName: string) =>
      `${fullName} has joined the chat.`,
    user_has_left_the_chat: (fullName: string) =>
      `${fullName} has left the chat.`,
  },

  socket: {
    guard: {
      unauthorized_access: 'Unauthorized access',
      unauthorized: 'Unauthorized',
    },
    gateway: {
      validation_failed: 'Validation failed',
      this_is_a_documentation_endpoint_for_the_send_message_event_use_websocket_to_send_messages:
        'This is a documentation endpoint for the send-message event. Use Websocket to send messages.',
      this_is_a_documentation_endpoint_for_the_initiate_media_upload_event_use_websocket_to_initiate_media_upload:
        'This is a documentation endpoint for the initiate-media-upload event. Use Websocket to initiate media upload.',
      this_is_a_documentation_endpoint_for_the_typing_event_use_websocket_to_send_a_typing_message:
        'This is a documentation endpoint for the typing event. Use Websocket to send a typing message.',
      typing_message_sent_successfully: 'Typing message sent',
      this_is_a_documentation_endpoint_for_the_join_room_event_use_websocket_to_join_a_room:
        'This is a documentation endpoint for the join-room event. Use Websocket to join a room.',
      this_is_a_documentation_endpoint_for_the_leave_room_event_use_websocket_to_leave_a_room:
        'This is a documentation endpoint for the leave-room event. Use Websocket to leave a room.',
    },
    service: {
      no_token_provided: 'No token provided',
      message_and_files_cannot_be_empty: 'Message and files cannot be empty',
      chat_not_found: 'Chat not found',
      you_are_not_authorized_to_send_message_in_this_chat:
        'You are not authorized to send message in this chat',
      error_creating_presigned_url: (fileName: string, message: string) =>
        `Error creating presigned URL for ${fileName}: ${message}`,
      chat_is_not_activated: 'Chat is not activated',
      content_violation: (reason: string) => `Content violation: ${reason}`,
      unsupported_file_type: (fileType: string) =>
        `Unsupported file type: ${fileType}`,
      inappropriate_content: (filenames: string[]) =>
        `Inappropriate content found in these files: ${filenames.join(', ')}`,
    },
  },

  redis: {
    health: {
      redis_check_failed: 'Redis check failed',
    },
  },

  interceptors: {
    referer: {
      access_denied_invalid_referer: 'Access denied: Invalid Referer',
    },
  },

  db: {
    auth: {
      service: {
        user_not_found: 'User not found',
      },
    },
    chat: {
      repository: {
        service_request_not_found: 'Service request not found',
        support_ticket_not_found: 'Support ticket not found',
        all_provided_messages_have_already_been_marked_as_read:
          'All provided messages have already been marked as read',
        you_are_not_a_participant_in_this_chat:
          'You are not a participant in this chat',
      },
    },
    external_services: {
      service: {
        service_provider_does_not_exist: 'Service provider does not exist',
        service_provider_with_id_not_found: (serviceProviderId: string) =>
          `Service provider with id ${serviceProviderId} not found`,
        service_id_not_found: (id: string) => `Service with ID ${id} not found`,
        service_with_id_does_not_belong_to_provider: (
          serviceId: string,
          serviceProviderId: string,
        ) =>
          `Service with ID ${serviceId} does not belong to provider ${serviceProviderId}`,
        service_with_same_name_already_exists_for_this_provider: (
          serviceName: string,
        ) =>
          `Service with name '${serviceName}' already exists for this provider`,
        service_provider_not_found: 'Service provider not found',
        category_with_name_already_exists: (categoryName: string) =>
          `Category with name '${categoryName}' already exists`,
        service_provider_not_found_or_user_not_authorized:
          'Service provider not found or user not authorized',
        cannot_update_service_provider_from_different_category:
          'Cannot update service provider from a different category',
        invalid_category_please_select_a_valid_service_category:
          'Invalid category. Please select a valid service category',
        selected_category_is_not_active_please_select_an_active_category:
          'Selected category is not active. Please select an active category',
      },
    },
    listings: {
      repository: {
        property_not_found: 'Property Not Found',
        connot_add_comment_to_this_property:
          'Cannot add comment to this property',
        comment_does_not_exist: 'Comment does not exist',
        invalid_media_ids_provided: 'Invalid media ids provided',
        this_is_not_an_auction_listing: 'This is not an auction listing',
        invite_not_found: 'Invite not found',
        listing_not_found: 'Listing not found',
        invalid_amenitys: 'Invalid amenities',
        invalid_property_tags: 'Invalid property tags',
        invalid_co_sellers: 'Invalid co-sellers',
      },
    },
    property_management: {
      repository: {
        boosting_plan_doesnot_exist: 'Boosting Plan doesnot exist',
        failed_to_create_locations: 'Failed to create locations',
        failed_to_create_listings: 'Failed to create listings',
        failed_to_create_listing_tags: 'Failed to create listing tags',
        failed_to_create_listing_amenities:
          'Failed to create listing amenities',
        failed_to_create_listing_owners: 'Failed to create listing owners',
        failed_to_create_media_metadata: 'Failed to create media metadata',
        failed_to_create_listing_media: 'Failed to create listing media',
        failed_to_create_listing_subscription:
          'Failed to create listing subscription',
        failed_to_create_listing_settings: 'Failed to create listing settings',
      },
    },
    users: {
      repository: {
        user_not_found: 'User not found',
        user_is_already_enabled: 'User is already enabled',
        user_is_already_disabled: 'User is already disabled',
        user_is_already_deleted: 'User is already deleted',
        this_email_or_phone_is_already_in_use:
          'This email/phone is already in use',
        this_username_is_already_taken_by_another_user:
          'This username is already taken by another user',
        admin_users_cannot_be_disabled: 'Admin users cannot be disabled',
        user_has_active_auction_bids: 'Cannot delete user with active bid',
      },
    },
    service_requests: {
      the_selected_service_is_no_longer_available_please_choose_another_service:
        'The selected service is no longer available. Please choose another service.',
      service_name_is_already_in_your_cart: (service_name: string) =>
        `${service_name} is already in your cart.`,
      active_cart_not_found_for_this_user:
        'Active cart not found for this user',
      service_not_found_in_your_cart_it_may_have_been_already_removed:
        'Service not found in your cart. It may have been already removed.',
      service_request_not_found: 'Service request not found',
      not_authorized_to_review_this_service_request:
        'Not authorized to review this service request',
      can_only_review_service_requests_that_are_marked_as_completed:
        'Can only review service requests that are marked as completed',
      service_request_already_reviewed: 'Service request already reviewed',
      service_request_not_found_with_id: (serviceRequestId: string) =>
        `Service request not found with ID: ${serviceRequestId}`,
    },
  },
  payment: {
    stripe: {
      customer_cancelled_subscription: 'Customer cancelled subscription',
      payment_failed_subscription_cancelled:
        'Payment failed, subscription cancelled',
    },
  },

  common: {
    pipes: {
      validation_failed: 'Validation failed (numeric string is expected)',
    },
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
    withdrawal_of_bit_seller_or_buyer: (seller: boolean) =>
      `Withdrawal of bid ${seller ? 'by seller' : 'by buyer'}`,
    auction_end_refund_for_outbid_bidder:
      'Auction Ended !! Refund for outbid bid',
  },

  api_responses: {
    notifications: {
      notifications_fetched_successfully: 'Notifications fetched successfully',
      notification_read_successfully: 'Notification read successfully',
    },
    listings: {
      fetch_listing_counts_by_price_range:
        'Fetched listing counts by price range.',
      fetch_listing_counts_by_area_range:
        'Fetched listing counts by area range.',
      listing_images_uploaded_with_errors:
        'Listing images uploaded successfully with errors',
      listing_images_uploaded_successfully:
        'Listing images uploaded successfully',
      listing_images_deleted_successfully:
        'Listing images deleted successfully',
      video_link_upserted_successfully: 'Video link upserted successfully',
      listing_fetched_successfully: 'Listings fetched successfully',
      listing_details_generated_successfully:
        'Listing details generated successfully',
      listing_details_saved_successfully: 'Listing details saved successfully',
      listing_id_generated_successfully: 'Listing id generated successfully',
      payment_details_retrieved_successfully:
        'Payment details retrieved successfully',
      subscription_plan_retrived_successfully:
        'Subscription plans retrieved successfully',
      listing_favorited_successfully: (favorite: boolean) =>
        `Listing ${favorite ? 'favorited' : 'unfavorited'} successfully`,
      listing_shared_successfully: 'Listing shared successfully',
      comment_added_successfully: 'Comment added successfully',
      reacted_to_comment_successfully: 'Reacted to comment successfully',
      comment_deleted_successfully: 'Comment deleted successfully',
      comments_retrieved_successfully: 'Comments retrieved successfully',
      media_order_updated_successfully: 'Media order updated successfully',
      boosting_order_created_successfully:
        'Boosting order created successfully',
      upgrade_details_retrived_successfully:
        'Upgrade details retrieved successfully',
      boosting_order_cancelled_successfully:
        'Boosting order cancelled successfully',
      auction_bid_placed_successfully: 'Auction bid placed successfully',
      auction_bid_incremented_successfully:
        'Auction Bid Incremented successfully',
      bid_withdrawn_successfully:
        'Bid withdrawn successfully, refund will be initiated soon.',
      bid_accept_or_reject_successfully: (accept: boolean) =>
        `Bid ${accept ? 'accepted' : 'rejected'} successfully`,
      document_uploaded_successfully: 'Document uploaded successfull',
      winning_bid_details_retrived_successfully:
        'Winning bid details retrieved successfully',
      auction_closed_successfully: 'Auction closed successfully',
      auction_bids_retrieved_successfully:
        'Auction bids retrieved successfully',
      favorite_listings_retrived_successfully:
        'Favorite listings retrieved successfully',
      my_listings_retrived_successfully: 'My listings retrieved successfully',
      my_drafts_retrived_successfully: 'My drafts retrieved successfully',
      listing_disable_or_enable_successfully: (disable: boolean) =>
        `Listing ${disable ? 'disabled' : 'enabled'} successfully`,
      listing_deleted_successfully: 'Listing deleted successfully',
      my_bids_retrived_successfully: 'My bids retrieved successfully',
      home_page_listings_retrived_successfully:
        'Home page listings retrieved successfully',
      invite_accepted_successfully: 'Invite accepted successfully',
      listing_details_updated_successfully:
        'Listing details updated successfully',
      similar_listings_retrived_successfully:
        'Similar listings retrieved successfully',
      auction_extended_successfully: 'Auction extended successfully',
      my_offers_retrived_successfully: 'My offers retrieved successfully',
      listing_details_retrived_successfully:
        'Listing details retrieved successfully',
      listing_published_successfully: 'Listing published successfully',
      listing_rejected_due_to_inappropriate_media:
        'Listing rejected due to inappropriate media, Admin will verify the listing and publish it',
      subscription_will_be_upgraded_once_the_prorated_payment_is_successful:
        'Subscription will be upgraded once the prorated payment is successful',
      subscription_will_be_downgraded_at_the_end_of_the_current_billing_period:
        'Subscription will be downgraded at the end of the current billing period',
      subscription_will_be_cancelled_after_the_current_period_ends:
        'Subscription will be cancelled after the current period ends',
      listing_media_updated_successfully: 'Listing media updated successfully',
      co_seller_added_successfully: 'Co-seller added successfully',
      user_has_generated_heads_of_agreement_socket_message: (
        fullName: string,
      ) => `${fullName} has generated Heads of Agreement`,
      listing_activity_updated_successfully: (activity: boolean) =>
        `Listing activity ${activity ? 'enabled' : 'disabled'} successfully`,
      this_comment_has_been_deleted: 'This comment has been deleted.',
      listings_of_user_retrived_successfully:
        "User's listings retrieved successfully",
      listings_details_updated_successfully:
        'Listings details updated successfully',
      listing_duplicated_successfully: 'Listing duplicated successfully',
      subscription_change_request_removed_successfully:
        'Subscription change request removed successfully',
    },
    audit_logs: {
      audit_logs_fetched_successfully: 'Audit logs fetched successfully',
    },
    auth: {
      otp_sent_successfully: 'OTP sent Successfully',
      otp_verified_successfully: 'OTP verified Successfully',
      password_updated_successfully: 'Password updated Successfully',
      password_set_successfully: 'Password set Successfully',
      login_successfully: 'Login Successfully',
      authentication_successful: 'Authentication Successful',
      the_access_token_refreshed_successfully:
        'The access token has been successfully refreshed.',
      user_details_retrived_successfully: 'User details retrieved successfully',
      fetched_successfully: 'Fetched successful.',
      logout_successfully: 'Logout successful.',
      notification_token_updated_successfully:
        'Notification token updated successfully',
      your_account_is_currently_blocked:
        'Your account is currently blocked. You can view content but cannot perform actions.',
      your_account_is_active_and_in_good_standing:
        'Your account is active and in good standing.',
    },
    chat: {
      unread_chats_stats_fetched_successfully:
        'Fetched unread chats stats successfully',
      chat_created_successfully: 'Chat created successfully',
      chats_retrieved_successfully: 'Chats retrieved successfully',
      chat_participation_updated_successfully:
        'Chat participation updated successfully',
      chat_filter_retrieved_successfully: 'Chat filter retrieved successfully',
      users_retrieved_successfully: 'Users retrieved successfully',
      chat_messages_retrieved_successfully:
        'Chat messages retrieved successfully',
      chat_details_retrieved_successfully:
        'Chat details retrieved successfully',
      link_preview_retrieved_successfully:
        'Link preview retrieved successfully',
      participant_removed_from_chat_successfully:
        'Participant removed from chat successfully',
      participants_added_to_chat_successfully:
        'Participants added to chat successfully',
      messages_marked_as_read_successfully:
        'Messages marked as read successfully',
      chat_settings_updated_successfully: 'Chat settings updated successfully',
    },
    email: {
      providers: {
        sendgrid: {
          email_sent_successfully: 'Email sent successfully',
        },
      },
    },
    external_service: {
      service_providers_fetched_successfully:
        'Service providers fetched successfully',
      service_categories_fetched_successfully:
        'Service categories fetched successfully',
      admin_service_categories_fetched_successfully:
        'Admin service categories fetched successfully',
      service_provider_id_generated_successfully:
        'Service provider id generated successfully',
      service_provider_created_successfully:
        'Service provider created successfully',
      service_updated_successfully: 'Service updated successfully',
      service_created_successfully: 'Service created successfully',
      bank_details_updated_successfully: 'Bank details updated successfully',
      category_status_updated_successfully: (action: string) =>
        `Category ${action}d successfully`,
      service_provider_status_updated_successfully: (action: string) =>
        `Service provider ${action}d successfully`,
      service_status_updated_successfully: (action: string) =>
        `Service ${action}d successfully`,
      provider_services_fetched_successfully:
        'Provider services fetched successfully',
      service_provider_details_fetched_successfully:
        'Service provider details fetched successfully',
      bank_details_fetched_successfully: 'Bank details fetched successfully',
      media_uploaded_successfully: 'Media uploaded successfully',
      category_updated_successfully: 'Category updated successfully',
      category_created_successfully: 'Category created successfully',
      businesses_fetched_successfully: 'Businesses fetched successfully',
      categories_fetched_successfully: 'Categories fetched successfully',
      service_provider_deleted_successfully:
        'Service provider deleted successfully',
      category_deleted_successfully: 'Category deleted successfully',
      service_deleted_successfully: 'Service deleted successfully',
      service_tags_fetched_successfully: 'Service tags fetched successfully',
      services_fetched_successfully: 'Services fetched successfully',
    },
    metrics: {
      http_request_counter_incremented_successfully:
        'HTTP request counter incremented',
      active_users_gauge_set: 'Active users gauge set',
    },
    payment: {
      transaction_status_retrieved_successfully:
        'Transaction status retrieved successfully',
      transactions_retrieved_successfully:
        'Transactions retrieved successfully',
      transaction_invoice_retrieved_successfully:
        'Transaction invoice retrieved successfully',
      transaction_invoice_downloaded_successfully:
        'Transaction invoice downloaded successfully',
      price_update_completed_successfully:
        'Price update completed successfully',
      subscription_change_not_found_in_db:
        'Subscription change not found in the db',
      connect_account_event_processed_successfully:
        'Connect account event processed successfully',
      payment_event_processed_successfully:
        'Payment event processed successfully',
    },
    places: {
      places_fetched_successfully: 'Places fetched successfully',
      reverse_geocode_fetched_successfully:
        'Reverse geocode fetched successfully',
      place_fetched_successfully: 'Place fetched successfully',
    },
    property_management: {
      subscription_price_updated_successfully:
        'Subscription price updated successfully',
      listings_fetched_successfully: 'Listings fetched successfully',
      subscription_boosting_created_successfully:
        'Subscription boosting created successfully',
      listings_uploaded_successfully: 'Listings uploaded successfully',
      presigned_url_fetched_successfully: 'Presigned url fetched successfully',
      listing_duplicated_successfully: 'Listing duplicated successfully',
      static_data_fetched_successfully: 'Static data fetched successfully',
    },
    property_offers: {
      offer_created_successfully: 'Offer created successfully',
      counter_offer_created_successfully: 'Counter offer created successfully',
      offer_updated_successfully: 'Offer updated successfully',
      offer_accepted_or_rejected_successfully:
        'Offer accepted or rejected successfully',
      document_details_retrieved_successfully:
        'Document details retrieved successfully',
      document_uploaded_successfully: 'Document uploaded successfully',
      offer_acceptance_socket_message: (
        fullName: string,
        isAccepted: boolean,
      ) =>
        `<b>${fullName}</b> has ${isAccepted ? '' : 'not'} accepted the offer`,
      user_has_made_an_offer_socket_messag: (fullName: string) =>
        `<b>${fullName}</b> has made an offer`,
      user_has_made_a_counter_offer_socket_messag: (fullName: string) =>
        `<b>${fullName}</b> has made a counter offer`,
      user_has_generated_heads_of_agreement_socket_message: (
        fullName: string,
      ) => `<b>${fullName}</b> has generated Heads of Agreement`,
    },
    static: {
      interests_fetched_successfully: 'Interests fetched successfully',
      property_tags_fetched_successfully: 'Property tags fetched successfully',
      amenties_fetched_successfully: 'Amenties fetched successfully',
      metadata_categories_fetched_successfully:
        'Metadata categories fetched successfully',
      boosting_plans_fetched_successfully:
        'Boosting plans fetched successfully',
      public_post_categories_fetched_successfully:
        'Public post categories fetched successfully',
      public_post_cities_fetched_successfully:
        'Public post cities fetched successfully',
    },
    support: {
      support_ticket_created_successfully:
        'Support ticket created successfully',
      tickets_retrieved_successfully: 'Tickets retrieved successfully',
      ticket_retrieved_successfully: 'Ticket retrieved successfully',
      ticket_updated_successfully: ' Ticket updated successfully',
      ticket_assigned_successfully: 'Ticket assigned successfully',
    },
    users: {
      user_consent_retrieved_successfully:
        'User consent retrieved successfully',
      user_consent_accepted: 'User consent accepted successfully',
      avatar_uploaded_successfully: 'Avatar uploaded successfully',
      avatar_deleted_successfully: 'Avatar deleted successfully',
      user_details_retrieved_successfully:
        'User details retrieved successfully',
      updated_successfully: 'Updated successfully.',
      user_primary_search_preferences_retrieved_successfully:
        'User primary search preferences retrieved successfully',
      user_profile_details_retrieved_successfully:
        'User profile details retrieved successfully',
      user_preferences_retrieved_successfully:
        'User preferences retrieved successfully',
      user_ids_retrieved_successfully: 'User ids retrieved successfully',
      users_retrieved_successfully: 'Users retrieved successfully',
      user_profile_verification_details_retrieved_successfully:
        'User profile verification details retrieved successfully',
      document_verification_revoked_successfully:
        'Document verification revoked successfully',
      user_insights_retrieved_successfully:
        'User insights retrieved successfully',
      media_uploaded_successfully: 'Media uploaded successfully',
      media_deleted_successfully: 'Media deleted successfully',
      otp_sent_successfully: 'OTP sent successfully',
      contact_updated_successfully: 'Contact updated successfully',
      password_reset_successfully: 'Password reset successfully',
      user_permissions_retrieved_successfully:
        'User permissions retrieved successfully',
      user_profile_details_updated_successfully:
        'User profile details updated successfully',
      username_updated_successfully: 'Username updated successfully',
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
    service_requests: {
      payout_refund_status_checked_successfully:
        'Payout and refund status checked successfully',
      payout_retried_successfully: 'Payout retried successfully',
      service_added_successfully_to_cart: 'Service added successfully to cart',
      service_removed_successfully_from_cart:
        'Service removed successfully from cart',
      cart_details_retrieved_successfully:
        'Cart details retrieved successfully',
      booking_details_updated_successfully:
        'Booking details updated successfully',
      payment_initiated_successfully: 'Payment initiated successfully',
      service_request_cancelled_successfully:
        'Service request cancelled successfully',
      review_created_successfully: 'Review created successfully',
      user_service_requests_retrieved_successfully:
        'User service requests retrieved successfully',
      service_request_stats_fetched_successfully:
        'Service request stats fetched successfully',
      service_request_details_retrieved_successfully:
        'Service request details retrieved successfully',
      service_requests_fetched_successfully:
        'Service requests fetched successfully',
      refund_request_initiated_successfully:
        'Refund request initiated successfully',
      refund_details_fetched_successfully:
        'Refund details fetched successfully',
      service_invoice_fetched_successfully:
        'Service invoice fetched successfully',
      service_request_action_updated_successfully: (action: string) =>
        `Service request ${action}ed successfully`,
      service_request_booking_details_updated_successfully:
        'Service request booking details updated successfully',
      payment_status_retrieved_successfully:
        'Payment status retrieved successfully',
      service_request_history_fetched_successfully:
        'Service request history fetched successfully',
    },
    flag_management: {
      listing_comment_reply_reported_successfully:
        'The comment/reply has been reported successfully',
      listing_reported_successfully:
        'The listing has been reported successfully',
      report_resolved_successfully: 'Report resolved successfully',
      chat_conversation_reported_successfully:
        'The chat conversation has been reported successfully',
      chat_message_reported_successfully:
        'The chat message has been reported successfully',
      public_post_reported_successfully:
        'The public post has been reported successfully',
      public_post_comment_reported_successfully:
        'The public post comment has been reported successfully',
      user_reported_successfully: 'The user has been reported successfully',
      report_details_retrieved_successfully:
        'Report details retrieved successfully',
      all_reports_retrieved_successfully: 'All reports retrieved successfully',
      report_deleted_successfully: 'Report deleted successfully',
      report_disabled_successfully: 'Report disabled successfully',
      report_enabled_successfully: 'Report enabled successfully',
    },
    analytics: {
      analytics_details_fetched_successfully:
        'Analytics details fetched successfully',
    },
    forums: {
      posts_retrieved_successfully: 'Posts retrieved successfully',
      post_created_successfully: 'Post created successfully',
      post_retrieved_successfully: 'Post retrieved successfully',
      post_deleted_successfully: 'Post deleted successfully',
      metrics_updated_successfully: 'Metrics updated successfully',
      comment_created_successfully: 'Comment created successfully',
      comments_retrieved_successfully: 'Comments retrieved successfully',
      react_to_post_updated_successfully:
        'Reaction to post updated successfully',
      react_to_comment_updated_successfully:
        'Reaction to comment updated successfully',
      comment_deleted_successfully: 'Comment deleted successfully',
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
    ai_service: {
      provider: {
        invalid_input_type: 'Invalid input type. Expected "imageURL" or "text"',
        moderation_api_response_is_undefined:
          'Moderation API response is undefined.',
      },
    },

    audit_logs: {
      failed_to_create_audit_log: 'Failed to create audit log',
    },
    auth: {
      username_is_reserved: 'Reserved username, please try another username',
      too_many_attempts:
        'Too many attempts. Please try again after 15 minutes.',
      too_many_attempts_after_1_minute:
        'Too many attempts. Please try again after 1 minute.',
      invalid_email_or_phone_format: 'Invalid email or phone format.',
      country_code_is_required: 'Country code is required.',
      this_account_has_been_deleted_and_cannot_be_used_for_registration:
        'This account has been deleted and cannot be used for registration.',
      user_already_exists_please_login: 'User already exists, Please login.',
      verification_code_expired:
        'Verification code expired. Please request a new code.',
      invalid_code: 'Invalid Code. Please try again.',
      username_already_taken: 'Username already taken',
      user_not_found: 'User not found',
      invalid_landing_app_id: 'Invalid landing app id.',
      email_is_required_for_admin_app: 'Email is required for Admin app',
      invalid_password: 'Invalid Password',
      user_with_this_email_or_phone_or_username_does_not_exist: (
        valueType: string,
      ) => `User with this ${valueType} does not exist`,
      account_deleted_no_reset:
        'This account has been deleted and cannot be used for password reset.',
      user_with_this_email_or_phone_has_not_completed_registration: (
        valueType: string,
      ) => `User with this ${valueType} has not completed registration`,
      this_token_has_been_deleted: 'This token has been deleted',
      guard: {
        your_account_is_currently_blocked:
          'Your account is currently blocked. You can view content but cannot perform actions. Contact support for assistance.',
      },
      strategies: {
        social: {
          apple: {
            email_not_found: 'Email not found in Apple profile',
          },
          facebook: {
            email_not_found: 'Email not found in Facebook profile',
          },
        },
        authentication: {
          permissions: {
            invalid_permissions_metadata: 'Invalid permissions metadata',
            user_does_not_have_the_required_permissions:
              'User does not have the required permissions',
          },
          roles: {
            roles_are_not_an_array: 'Roles are not an array',
          },
          token_purpose: {
            unauthorized: 'Unauthorised.',
            invalid_token_purpose: (expected: string, received: string) =>
              `Invalid token purpose. Expected: ${expected}, Received: ${received}`,
          },
        },
      },
    },
    chats: {
      message_not_found: 'Message not found',
      message_required: 'Message is required',
      chat_already_exists: 'Chat already exists',
      unhandled_conversation_type: 'Unhandled conversation type',
      listing_not_found: 'Listing not found',
      unsupported_message_type_for_deletion:
        'Unsupported message type for deletion',
      unsupported_chat_type: 'Unsupported chat type.',
      did_not_find_participation_invitation_request:
        'Did not find participation invitation request for this chat.',
      chat_not_found: 'Chat not found',
      you_are_not_a_participant_of_this_chat:
        'You are not a participant of this chat. ',
      you_are_not_an_admin_of_this_chat: 'You are not an admin of this chat.',
      found_participants_that_are_already_in_the_chat:
        'Found participants that are already in the chat.',
      you_cannot_remove_yourself_from_the_chat_as_you_are_an_admin:
        'You cannot remove yourself from the chat as you are an admin.',
      you_cannot_remove_the_participant_who_is_not_in_the_chat:
        'You cannot remove the participant who is not in the chat.',
      message_ids_or_mark_all_as_read_required:
        'Message IDs or markAllAsRead is required',
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
    external_service: {
      incorrect_location_id: (locationId: string) =>
        `Incorrect location id: ${locationId}`,
      business_country_required: 'Business country is required',
      Australian_business_only: '"Currently, we only support businesses registered in Australia"',
      routing_number_required: 'BSB number is required',
      service_provider_with_same_name_already_exists: (businessName: string) =>
        `Service provider with same name ${businessName} already exists.`,
      service_provider_with_id_not_found: (providerId: string) =>
        `Service provider with ID ${providerId} not found`,
      service_provider_not_found: 'Service provider not found',
      category_not_found: 'Category not found',
      category_already_active_or_inactive: (shouldBeActive: boolean) =>
        `Category is already ${shouldBeActive ? 'active' : 'inactive'}`,
      service_provider_is_already_active_or_inactive: (
        shouldBeActive: boolean,
      ) =>
        `Service provider is already ${shouldBeActive ? 'active' : 'disabled'}`,
      service_not_found: 'Service not found',
      bank_details_not_found: 'Bank details not found',
      invalid_file_type: 'Invalid file type. Only PNG, JPG, JPEG allowed',
      id_required_for_media_upload: 'ID is required for uploading media',
      invalid_media_category: (category: any) =>
        `Invalid media category: ${category}`,
      media_not_found: 'Media not found',
      service_does_not_belong_to_provider:
        'Service does not belong to this provider',
      service_already_active_or_inactive: (shouldBeActive: boolean) =>
        `Service is already ${shouldBeActive ? 'active' : 'inactive'}`,
      invalid_category:
        'Invalid category. Please select a valid service category',
      invalid_logo_file_type:
        'Invalid logo file type. Only PNG, JPG, JPEG allowed',
      failed_to_upload_logo: 'Failed to upload logo file',
      invalid_cover_file_type:
        'Invalid cover file type. Only PNG, JPG, JPEG allowed',
      failed_to_upload_cover: 'Failed to upload cover file',
      individual_business_type_not_allowed:
        'Individual business type are not supported for now',
      business_profile_description_or_url_required:
        'Business profile description or url is required',
      business_verification_document_required:
        'Business verification document is required',
      business_verification_document_must_be_pdf:
        'Business verification document must be a PDF file',
      business_tax_id_required: 'Business tax id is required',
      business_name_required: 'Business name is required',
      connected_account_not_found: 'Connected account not found',
    },
    listing: {
      listing_is_live_cannot_disable:
        'In Live Auction, Can not be disabled',
      listing_was_boosted_by_admin_so_cannot_upgrade_subscription:
        'Listing was boosted by admin, so boosting cannot be upgraded',
      subscription_change_request_not_found:
        'Subscription change request not found',
      only_one_file_can_be_uploaded_at_a_time:
        'Only one file can be uploaded at a time.',
      only_three_files_can_be_uploaded_at_a_time:
        'Only three files can be uploaded at a time.',
      another_upload_is_in_progress_for_this_listing:
        'Another upload is in progress for this listing. Please try again later.',
      only_jpeg_and_png_images_are_allowed:
        ' Only JPEG and PNG images are allowed.',
      only_jpeg_png_and_pdf_files_are_allowed:
        'Only JPEG, PNG and PDF files are allowed.',
      only_pdf_or_docx_files_are_allowed: 'Only PDF or Docx files are allowed.',
      you_are_not_allowed_to_upload_media_for_this_listing:
        'You are not allowed to upload media for this listing',
      you_can_not_upload_media_for_a_published_listing:
        'You can not upload media for a published listing',
      you_can_not_upload_more_than_15_images_for_a_listing:
        'You can not upload more than 15 images for a listing',
      you_can_not_upload_more_than_3_floor_plans_for_a_listing:
        'You can not upload more than 3 floor plans for a listing',
      you_can_not_upload_more_than_1_file: (mediaCategory: string) =>
        `You can not upload more than 1 file for ${mediaCategory}`,
      no_files_were_uploaded_successfully:
        'No files were uploaded successfully.',
      one_or_more_files_contain_inappropriate_content:
        'One or more files contain inappropriate content.',
      media_not_found: 'Media not found',
      you_are_not_allowed_to_delete_this_media:
        'You are not allowed to delete this media',
      you_are_not_allowed_to_update_this_video_link:
        'You are not allowed to update video link',
      radius_is_not_allowed_when_location_is_not_provided:
        'Radius is not allowed when location is not provided or more than one location is provided',
      listing_id_is_required: 'Listing id is required',
      listing_not_found: 'Listing not found',
      listing_is_not_active: 'Listing is not active',
      nothing_to_refund: 'Nothing to refund',
      you_are_not_allowed_to_access_this_listing:
        'You are not allowed to access this listing',
      title_and_description_are_required: 'Title and description are required',
      cannot_publish_as_listing_is_not_in_draft:
        'Cannot publish as listing is not in draft',
      listing_must_have_at_least_one_photo:
        'Listing must have at least one photo',
      auction_start_and_end_date_must_be_in_future:
        'Auction start and end date must be in future',
      only_primary_owner_can_access_this_resource:
        'Only primary owner can access this resource',
      listing_not_published_yet: 'Listing not published yet',
      no_property_found: 'No property found',
      unable_to_fetch_listing: 'Unable to fetch listing',
      parent_comment_not_found: 'Parent comment not found',
      cannot_reply_to_a_reply:
        'Cannot reply to a reply. Reply to the main comment instead.',
      comment_not_found: 'Comment not found',
      you_are_not_allowed_to_delete_this_comment:
        'You are not allowed to delete this comment',
      only_primary_owner_can_update_media_order:
        'Only primary owner can update media order',
      active_subscription_not_found_for_this_listing:
        'Active subscription not found for the listing',
      plan_not_found: 'Plan not found',
      this_is_a_free_plan_no_need_to_purchase:
        'This is a free plan, no need to purchase',
      already_subscribed_to_a_plan_for_this_listing:
        'You have already subscribed to a plan for this listing',
      active_subscription_not_found: 'Active subscription not found',
      you_are_not_allowed_to_upgrade_subscription:
        'You are not allowed to upgrade subscription',
      you_have_pending_subscription_change:
        'You have a pending subscription change, please wait for it to complete.',
      you_are_already_on_this_plan: 'You are already on this plan',
      you_cannot_upgrade_different_billing_frequency:
        'You cannot upgrade to a different billing frequency',
      there_will_be_no_proration_for_downgrade:
        'There will be no proration for downgrade',
      you_are_not_allowed_to_cancel_subscription:
        'You are not allowed to cancel subscription',
      owners_can_not_bid_on_their_own_listing:
        'Owners can not bid on their own listing',
      listing_is_not_in_auction: 'Listing is not in auction',
      bid_amount_must_be_greater_than_the_starting_price:
        'Bid amount must be greater than the starting price',
      bid_amount_must_be_greater_than_the_current_highest_bid:
        'Bid amount must be greater than the current highest bid',
      bid_increment_must_be_multiple_of_bid_amount: (bidIncrement: number) =>
        `Bid increment must be a multiple of the bid amount. Bid increment: ${bidIncrement}`,
      only_verified_buyers_can_bid_on_this_listing:
        'Only verified buyers can bid on this listing',
      you_already_have_an_active_bid:
        'You already have an active bid. To place a new bid, please increase your current bid amount.',
      bit_not_found: 'Bid not found',
      you_are_not_allowed_to_increment_this_bid:
        'You are not allowed to increment this bid',
      your_bid_is_too_low: (minBid: number) =>
        `Your bid is too low. The minimum required bid is ${minBid}`,
      you_can_not_increment_your_bid_within_the_minimum_price_update_interval:
        'You can not increment your bid within the minimum price update interval',
      auction_has_ended_you_can_not_increment_your_bid:
        'Auction has ended, you can not increment your bid',
      bit_not_found_please_enter_correct_bid_id:
        'Bid not found, please enter correct bid id',
      you_are_not_allowed_to_withdraw_this_bid:
        'You are not allowed to withdraw this bid',
      you_can_not_withdraw_your_bid_as_it_is_the_highest_bid:
        'You can not withdraw your bid as it is the highest bid',
      only_primary_owner_can_accept_bids: 'Only primary owner can accept bids',
      auction_is_still_ongoing_you_can_not_accept_this_bid:
        'Auction is still ongoing, you can not accept this bid',
      only_primary_owner_can_upload_document_for_bid:
        'Only primary owner can upload document for bid',
      no_winning_bid_found: 'No winning bid found',
      document_already_generated: 'Document already generated',
      only_primary_owner_can_close_auction:
        'Only primary owner can close auction',
      only_primary_seller_can_accept_this_resource:
        'Only primary seller can accept this resource',
      you_are_not_allowed_to_view_auction_bids:
        'You are not allowed to view auction bids for this listing',
      you_are_not_allowed_to_delete_or_disable_this_listing:
        'You are not allowed to delete or disable this listing',
      you_are_not_allowed_to_enable_this_listing:
        'You are not allowed to enable this listing',
      listing_cannot_be_enabled_or_disabled:
        'Listing cannot be enabled or disabled',
      you_are_not_allowed_to_delete_this_listing:
        'You are not allowed to delete this listing',
      you_are_not_allowed_to_delete_draft_listing:
        'You are not allowed to delete draft listing',
      listing_cannot_be_deleted: 'Listing cannot be deleted',
      you_are_not_allowed_to_update_this_listing:
        'You are not allowed to update this listing',
      you_are_not_allowed_to_extend_this_auction:
        'You are not allowed to extend this auction',
      auction_has_already_ended: 'Auction has already ended',
      auction_has_already_started_you_cannot_change_auction_start_date:
        'Auction has already started, you cannot change auction start date',
      auction_has_ended_you_need_to_create_a_new_listing_with_same_details:
        'Auction has ended, you need to create a new listing with same details',
      auction_has_already_ended_you_cannot_change_auction_end_date:
        'Auction has already ended, you cannot change auction end date',
      auction_end_date_must_be_after_auction_start_date:
        'Auction end date must be after the auction start date',
      you_cannot_change_the_price_of_a_listing_that_is_in_auction:
        'You cannot change the price or bid_increment of a listing that is in auction',
      listing_has_violated_the_terms_of_service:
        'Listing has violated the content policy',
      file_you_are_trying_to_add_is_not_uploaded_yet:
        'File you are trying to add is not uploaded yet',
      total_number_of_photos_for_this_listing_is_15:
        'Total number of photos cannot exceed 15',
      total_number_of_floor_plans_for_this_listing_is_3:
        'Total number of floor plans cannot exceed 3',
      only_one_document_allowef_for_category: (docCategory: string) =>
        `Only one document allowed for category: ${docCategory}`,
      only_one_additional_document_is_allowed_for_each_type:
        'Only one additional document is allowed for each type',
      duplicate_file_name_are_not_allowed:
        'Duplicate file names are not allowed',
      file_already_exists: 'File already exists',
      you_are_not_allowed_to_add_a_co_seller_to_this_listing:
        'You are not allowed to add a co-seller to this listing',
      all_co_sellers_are_already_added: 'All co-sellers are already added',
      failed_to_send_co_seller_invitation_email:
        'Failed to send co-seller invitation email',
      listing_activity_is_already_enabled_or_disabled: (activity: boolean) =>
        `Listing activity is already ${activity ? 'enabled' : 'disabled'}`,
      listing_is_disabled: 'Disabled listings cannot be updated',
      listing_auction_date_cannot_be_change:
        'Listing auction date cannot be changed',
      listing_auction_date_invalid: 'Invalid auction start and end date',
      invalid_file_Id: 'Invalid file id',
      no_of_delete_item_and_remaining_item_is_not_equal:
        'No of delete item and remaining item is not equal',
      invalid_video_url:
        'The provided video URL is invalid or inaccessible. Please check the URL and try again.',
      cannot_reply_to_a_comment_from_another_listing:
        'Cannot reply to a comment from another listing',
      same_person_cannot_be_primary_owner_and_co_seller:
        'Same person cannot be primary owner and co-seller',
      listing_must_have_at_least_one_owner:
        'Listing must have at least one owner',
      generate_listing_details_in_draft_mode:
        'Generate listing details is allowed in draft mode',
      wrong_co_seller_id: 'Wrong co-seller, please add a valid co-seller',
      inactive_bid: `You cannot accept this bid as it no longer an active bid.`,
      already_winner: `Listing is already won by another bidder.`,
      content_violation: (reason: string) => `Content violation: ${reason}`,
      sellers_are_not_allowed_to_favorite_listings:
        'Sellers are not allowed to favorite own listings',
      failed_to_duplicate_listing: 'Failed to duplicate listing',
      highest_bid_accept_case: (accept: boolean) =>
        `Highest bid can be ${accept ? 'accepted' : 'rejected'} only once and cannot be modified.`,
      primary_user_can_only_accept_or_decline_bids:
        'You must be the primary owner of this listing to accept or decline bids.',
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

    payment: {
      payout_amount_is_less_than_one_dollar:
        'Payout amount is less than 1 dollar',
      payout_not_found: 'Payout not found',
      refund_not_found: 'Refund not found',
      unhandled_event: 'Unhandled event',
      cannot_request_refund_for_failed_transaction:
        'Cannot request refund for a failed transaction',
      refund_amount_cannot_be_greater_than_transaction_amount:
        'Refund amount cannot be greater than the transaction amount',
      subscription_not_found: 'Subscription not found',
      subscription_is_not_active: 'Subscription is not active',
      subscription_is_not_paused: 'Subscription is not paused',
      either_auction_bid_id_or_service_request_id_is_required:
        'Either auction bid id or service request id is required',
      bank_account_details_not_found: 'Bank account details not found',
      bank_account_is_disabled_for_payouts:
        'Bank account is disabled for payouts',
      transaction_not_found: 'Transaction not found',
      only_one_item_is_allowed_for_auction_bid_payment:
        'Only one item is allowed for auction bid payment',
      you_are_not_authorized_to_access_this_transaction:
        'You are not authorized to access this transaction',
      invalid_transaction_id: 'Invalid transaction ID format',
      invoice_not_found: 'Invoice not found',
      error_in_get_transaction_invoice: 'Error in getTransactionInvoice',
      insufficient_funds: 'Insufficient funds',
      invalid_webhook_secret_type: 'Invalid webhook secret type',
      transaction_already_being_processed:
        'Transaction is already being processed',
      payment_pending: 'Payment is pending',
      invalid_transaction_type: 'Invalid transaction type',
      checkout_session_expired: 'Checkout session expired',
      provider: {
        stripe: {
          failed_to_create_mobile_payment_intent:
            'Failed to create mobile payment intent',
          the_plan_contains_an_unsupported_billing_cycle: (
            billing_frequency: any,
          ) =>
            `The plan contains an unsupported billing cycle: ${billing_frequency}. Our team is working to fix it.`,
        },
      },
    },

    places: {
      provider: {
        google_maps: {
          google_places_api_error: (statusText: string) =>
            `Google Places API Error: ${statusText}`,
          invalid_place_details_response: (placeId: string) =>
            `Invalid place details response for placeId: ${placeId}`,
          google_maps_api_error: (statusText: string) =>
            `Google Maps API Error: ${statusText}`,
        },
      },
    },

    property_management: {
      listing_not_found: 'Listing not found',
      listing_already_has_subscription_boosting:
        'Listing already has a subscription boosting',
      some_files_are_not_uploaded:
        'Some files are not uploaded, please upload them first',
      each_additional_document_media_type_must_be_single:
        'Each additional document media type must be single',
      some_file_names_are_not_unique: 'Some fileNames are not unique',
      failed_to_check_file_uniqueness: (message: string) =>
        `Failed to check file uniqueness ${message}`,
      copy_failed_for_media: (
        fileName: string,
        copyKey: string,
        message: string,
      ) => `Copy failed for ${fileName} to ${copyKey}: ${message}`,
      media_copy_operation_failed: (message: string) =>
        `Media copy operation failed: ${message}`,
      same_plan_is_already_subscribed_for_this_listing:
        'Same plan is already subscribed for this listing',
      invalid_user_id: 'Invalid user id',
      property_category_is_required: 'Property category is required',
      invalid_property_tags: 'Invalid property tags',
      invalid_property_amenities: 'Invalid amenities',
      photos_are_required: 'Photos are required',
      files_are_required: 'Files are required',
    },

    property_offer: {
      offer_already_made_wait_response:
        'You have already made an offer on this listing, Please wait for the owner to respond.',
      seller_cannot_make_offer_on_their_own_listing: `Seller's cannot make an offer on their own listing`,
      you_can_not_make_offer_on_a_listing_that_is_not_active:
        'You cannot make an offer on a listing that is not active',
      offer_not_found: 'Offer not found',
      invalid_offer_id: 'Invalid offer id',
      you_can_not_counter_this_offer: 'You cannot counter this offer.',
      you_are_not_the_buyer_for_this_offer:
        'You are not the buyer for this offer.',
      you_can_not_counter_offer_for_a_listing_that_is_not_active:
        'You cannot counter offer for a listing that is not active',
      provide_withdraw_or_update_request:
        'You must provide either a request to withdraw the offer or a request to update the offer.',
      cannot_withdraw_and_update_offer:
        'You cannot provide both a request to withdraw the offer and a request to update the offer.',
      you_can_not_update_this_offer_listing_not_active:
        'You cannot update an offer for a listing that is not active',
      you_cannot_update_a_counter_offer: 'You cannot update a counter offer.',
      seller_cannot_update_this_offer: "Seller's cannot update this offer.",
      offer_is_no_longer_valid: 'Offer is no longer valid',
      you_cannot_accept_or_reject_this_offer_for_a_listing_that_is_not_active:
        'You cannot accept or reject an offer for a listing that is not active',
      you_cannot_accept_or_reject_this_offer:
        'You cannot accept or reject this offer.',
      you_cannot_accept_this_offer:
        'You cannot accept this offer. Only the primary seller can accept the offer.',
      you_cannot_retrieve_document_details_for_this_offer_on_a_listing_that_is_not_active:
        'You cannot retrieve document details for an offer on a listing that is not active',
      you_cannot_retrieve_document_details_for_this_offer:
        'You cannot retrieve document details for this offer',
      file_is_required: 'File is required.',
      you_cannot_upload_document_for_this_offer_thta_has_not_been_accepted:
        'You cannot upload a document for an offer that has not been accepted',
      you_cannot_upload_document_for_an_offer_on_a_listing_that_is_not_active:
        'You cannot upload a document for an offer on a listing that is not active',
      only_pdf_or_docx_files_are_allowed: 'Only PDF or Docx files are allowed.',
      billing_frequency_and_rent_duration_are_required_for_rent_listings:
        'Billing frequency and rent duration are required for rent listings',
      listing_not_found: 'Listing not found',
      only_primary_seller_can_upload_document_for_the_offer:
        'Only the primary seller can upload a document for the offer',
      only_buyer_can_upload_document_for_counter_offer:
        'Only the buyer can upload a document for a counter offer',
      only_verified_users_can_make_offer_on_a_listing:
        'Only verified users can make an offer on a listing',
      you_can_not_update_this_offer_as_this_was_countered:
        'You cannot update this offer as this was countered',
    },
    metrics: {
      failed_to_retrieve_metrics: 'Failed to retrieve metrics',
    },
    sms: {
      failed_to_send_sms_with_message: (message: string) =>
        `Failed to send SMS ${message}`,
      failed_to_send_sms: 'Failed to send SMS',

      provider: {
        twilio: {
          failed_to_send_sms: 'Failed to send SMS',
        },
      },
    },
    static: {
      no_interests_found: 'No interests found',
    },
    support: {
      failed_to_attach_ticket_attachment:
        'Failed to attach ticket attachment , please try again',
      wrong_category: 'Wrong Category, please select correct category',
      failed_to_create_support_ticket: 'Failed to create support ticket',
      ticket_not_found: 'Ticket not found',
      ticket_is_already_resolved: 'Ticket is already resolved',
      invalid_status_transition: 'Invalid status transition',
      you_are_not_authorized_to_update_this_ticket_status:
        'You are not authorized to update this ticket status',
      ticket_is_already_assigned_to_this_user:
        'Ticket is already assigned to this user',
      you_are_not_authorized_to_assign_this_ticket:
        'You are not authorized to assign this ticket',
      only_image_and_pdf_files_are_allowed:
        'Only image and pdf files are allowed to be attached to support tickets',
    },
    users: {
      inappropriate_image:
        'Inappropriate image, please upload a different image',
      user_id_is_required: 'User ID is required',
      please_provide_a_valid_reason: (reasonType: string) =>
        `Please provide a valid ${reasonType} reason`,
      reason_id_not_found: (reasonType: string, reasonText: string) =>
        `${reasonType} reason ID '${reasonText}' not found`,
      new_reason_must_contain_only_letters_and_spaces: (reasonType: string) =>
        `New ${reasonType} reason must contain only letters and spaces`,
      user_not_found: 'User not found',
      no_pending_verification_found_for_this_user:
        'No pending verification found for this user',
      no_verification_found_for_this_user:
        'No verification found for this user',
      document_is_not_in_pending_state: 'Document is not in pending state',
      only_verified_documents_can_be_revoked:
        'Only verified documents can be revoked',
      please_provide_a_rejection_reason: 'Please provide a rejection reason',
      please_provide_a_revocation_reason: 'Please provide a revocation reason',
      file_is_required: 'File is required',
      only_jpeg_and_png_images_are_allowed:
        'Only JPEG and PNG images are allowed',
      avatar_not_found: 'Avatar not found',
      avatar_deleted_successfully: 'Avatar deleted successfully',
      invalid_file_type: 'Invalid file type. Only PNG, JPG, JPEG allowed',
      invalid_verification_document_file_type:
        'Invalid file type. Only PNG, JPG, JPEG, PDF allowed',
      failed_to_update_user_media: 'Failed to update user media',
      media_not_found: 'Media not found',
      too_many_attempts:
        'Too many attempts. Please try again after 15 minutes.',
      too_many_attempts_please_try_again_after_1_minute:
        'Too many attempts. Please try again after 1 minute.',
      invalid_email_or_phone_format: 'Invalid email or phone format',
      country_code_is_required_for_phone_number:
        'Country code is required for phone number',
      no_otp_found: 'No OTP found',
      verification_code_expired:
        'Verification code expired. Please request a new code.',
      invalid_otp: 'Invalid OTP',
      regular_users_cannot_delete_other_users_accounts:
        "Regular users cannot delete other users' accounts",
      admin_users_cannot_delete_their_own_accounts:
        'Admin users cannot delete their own accounts',
      this_username_is_already_your_current_username:
        'This username is already your current username.',
      budget_max_must_be_greater_than_budget_min:
        'Budget max must be greater than budget min',
      admin_users_cannot_update_their_contact_details:
        'Admin users cannot update their contact details',
      verification_in_progress: 'Verification Already in Progress',
      verification_successful: 'Verification Already Completed',
      failed_to_revoke_document: 'Failed to revoke document',
      failed_to_verify_reject_document: (reject: boolean) =>
        `Failed to ${reject ? 'reject' : 'verify'} document`,
      document_type_required: 'Document type is required for verification',
      unhandled_consent_type: 'Unhandled consent type',
      invalid_consent_url: 'Invalid consent url',
      content_violations: (fields: string[]) =>
        `Content violations found in ${
          fields.length > 1 ? 'these fields' : 'this field'
        }: ${fields.join(', ')}`,
      inappropriate_content_uploaded: 'Inappropriate content uploaded.',
      password_is_same: 'New password cannot be the same as the old password',
      username_is_same: 'New username cannot be the same as the old username',
    },
    service_requests: {
      payout_not_required_for_this_service_request:
        'Payout not required for this service request',
      refund_reason_not_found: 'Refund reason not found',
      payout_not_found: 'Payout not found',
      refund_not_found: 'Refund not found',
      auto_refund_not_found: 'Incorrect auto refund id',
      refund_amount_is_required: 'Refund amount is required',
      payout_already_created_for_this_service_request:
        'Payout already created for this service request',
      payout_can_only_be_created_for_completed_services:
        'Payout can only be created for completed services',
      no_active_cart_found:
        'No active cart found. Add services to create a new cart.',
      cannot_update_booking_details_for_empty_cart:
        'Cannot update booking details for an empty cart. Please add services first.',
      service_provider_locations_not_found:
        'Service provider locations not found',
      please_choose_a_service_provider_closer_to_your_location:
        'Please choose a service provider closer to your location.',
      service_request_not_found: 'Service request not found',
      you_are_not_authorized_to_cancel_this_service_request:
        'You are not authorized to cancel this service request',
      cart_is_empty_please_add_services_before_checkout:
        'Cart is empty. Please add services before checkout.',
      location_is_required_to_create_a_service_request:
        'Location is required to create a service request. Please update booking details with location.',
      user_not_found: 'User not found',
      service_request_not_found_for_this_transaction:
        'Service request not found for this transaction',
      unsupported_check_type: 'Unsupported check type',
      a_refund_for_this_transaction_is_already_cannnot_initiate_a_new_refund: (
        refundStatus: string,
      ) =>
        `A refund for this transaction is already in ${refundStatus} state. Cannot initiate a new refund.`,
      refund_amount_cannot_be_greater_than_the_original_amount: (
        totalAmount: number,
        refundedAmount: number,
      ) =>
          `Refund amount exceeds the remaining refundable amount. Original Refundable: ${totalAmount}, already refunded: ${refundedAmount}, remaining refundable: ${totalAmount - refundedAmount}.`,
      no_refund_found_for_this_service_request_id: (serviceRequestId: string) =>
        `No refund found for service request ID: ${serviceRequestId}`,
      no_service_request_found_with_id: (serviceRequestId: string) =>
        `No service request found with ID: ${serviceRequestId}`,
      invalid_action: (action: string, serviceRequestAction: string) =>
        `Invalid action: ${action}. Supported actions are ${serviceRequestAction}.`,
      you_are_not_authorized_to_update_this_service_request:
        'You are not authorized to update this service request',
      only_service_requests_in_confirmed_status_can_be_updated:
        'Only service requests in confirmed status can be updated',
      cannot_update_booking_details_for_a_service_that_has_already_passed:
        'Cannot update booking details for a service that has already passed',
      cannot_update_booking_details_for_a_service_that_is_scheduled_within_the_next_3_hours:
        'Cannot update booking details for a service that is scheduled within the next 3 hours',
      new_booking_time_must_be_later_than_existing_booking_time:
        'New booking time must be later than the existing booking time',
      slot_is_required_and_must_be_in_the_future_to_create_a_service_request:
        'Slot should be in the future to create a service request',
      please_choose_a_service_provider_which_is_in_the_same_state:
        'Please choose a service provider which is in the same state',
      location_state_is_required: 'State is required in address',
      payout_not_created_because_service_provider_bank_account_details_are_not_found:
        'Payout can not be initiated, because service provider bank account details are not provided',
      refund_amount_cannot_be_less_than_the_original_amount: (
        totalAmount: number,
      ) =>
        `Refund amount cannot be less than the original amount: ${totalAmount}`,
    },
    flag_management: {
      listing_comment_not_found:
        'Comment not found, it might have been deleted',
      public_post_comment_not_found:
        'Comment not found, it might have been deleted',
      public_post_not_found: 'Post not found, it might have been deleted',
      failed_to_report_listing_comment_reply:
        'Failed to report listing comment/reply',
      listing_not_found: 'Listing not found, it might have been deleted',
      failed_to_report_listing: 'Failed to report listing',
      user_not_found: 'User not found, might have been deleted',
      failed_to_report_user: 'Failed to report user',
      flag_category_not_found: 'Flag category not found',
      cannot_report_self: 'Self report is not allowed',
      no_reports_found: 'No reports found',
      invalid_flag_number: 'Invalid flag number',
      chat_conversation_not_found: 'Chat conversation not found',
      chat_message_not_found: 'Chat message not found',
      failed_to_report_chat_conversation: 'Failed to report chat conversation',
      failed_to_report_chat_conversation_message:
        'Failed to report chat conversation message',
      failed_to_report_public_post: 'Failed to report public post',
      failed_to_report_public_post_comment:
        'Failed to report public post comment',
      already_reported_previously: 'You have already reported it previously',
      already_deleted: 'Already deleted',
      failed_to_delete_reports: 'Failed to delete reports',
      already_disabled: 'Already disabled',
      already_enabled: 'Already enabled',
      content_cannot_be_disabled: (contentType: string, disable: boolean) =>
        `${contentType} cannot be ${disable ? 'disabled' : 'enabled'}`,
    },
    analytics: {
      failed_to_fetch_analytics_details: 'Failed to fetch analytics details',
      both_start_date_and_end_date_must_be_provide:
        'Both start_date and end_date must be provided together.',
      end_date_cannot_be_before_start_date:
        'End date cannot be before start date.',
    },
    forums: {
      already_reacted: (reaction: string, resource: 'post' | 'comment') =>
        `You have already ${reaction} this ${resource}`,
      page_and_limit_must_be_greater_than_zero:
        'Page and limit must be greater than zero',
      comment_not_owned_by_user: 'Cannot delete: Comment not owned by user',
      comment_has_been_deleted: 'Comment has been deleted',
      comment_or_file_is_required: 'Comment or file is required',
      cannot_reply_to_a_reply: 'Cannot reply to a reply',
      comment_already_deleted: 'Comment already deleted',
      comment_not_found: 'Comment not found',
      only_jpeg__and_png_files_are_allowed:
        'Only JPEG and PNG files are allowed',
      only_jpeg_png_and_pdf_files_are_allowed:
        'Only JPEG, PNG and PDF files are allowed',
      city_not_found: 'City not found',
      city_id_is_required: 'City ID is required',
      some_thing_went_wrong_while_uploading_these_files: (files: string[]) =>
        `Some thing went wrong while uploading these files: ${files.join(', ')}`,
      post_not_found: 'Post not found',
      post_already_deleted: 'Post already deleted',
      post_not_owned_by_user: 'Cannot delete: Post not owned by user',
      post_deleted: 'Post has been deleted',
      content_violations: 'Content violations found',
      contact_violations: 'Contact violations found',
      inappropriate_content: (filenames: string[]) =>
        `Inappropriate content found in these files: ${filenames.join(', ')}`,
      content_text_violations: (names: string[]) =>
        `Content violations found in ${
          names.length > 1 ? 'these fields' : 'this field'
        }: ${names.join(', ')}`,
    },
  },
  send_email: {
    account_delete_reason: `Account has been deleted due to violation of our Terms of Service or Community Guidelines`,
    account_disable_reason: `Account has been temporarily disabled due to suspicious activity, potential security concerns, or multiple policy violations`,
  },
};
