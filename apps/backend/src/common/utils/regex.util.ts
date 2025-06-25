export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  COUNTRY_CODE: /^\+(91|61|64)$/,
  PHONE: /^\d+$/,
  USERNAME: /^(?=.*[a-zA-Z])[a-zA-Z0-9_]+$/,
  EMAIL_OR_PHONE: /^(?:[^\s@]+@[^\s@]+\.[^\s@]+|\d+)$/,
  USERNAME_OR_EMAIL_OR_PHONE:
    /^(?:[^\s@]+@[^\s@]+\.[^\s@]+|\d+|[a-zA-Z0-9_]+)$/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
  SOCIAL_MEDIA:
    /(@\w+|https?:\/\/(www\.)?(facebook|instagram|twitter|linkedin|whatsapp|telegram)\.com\/\w+)/gi,
  WEBSITES: /https?:\/\/[^\s]+/gi,
  MENTION: /@(\w+)/g,
  PHONE_NUMBER: {
    IN: /^\d{10}$/, // India
    AU: /^\d{10}$/, // Australia
    NZ: /^\d{9}$/, // New Zealand
  },
  TRANSACTION_ID: /^TXN\d{14}$/,
  FLAG_NUMBER: /^FLAG-\d+$/,
  REFUND_ID: /^REF\d{14}$/,
  PAYOUT_ID: /^PAY\d{14}$/,
};
