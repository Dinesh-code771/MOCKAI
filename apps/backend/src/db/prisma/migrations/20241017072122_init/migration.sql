-- Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create Enums
CREATE TYPE "file_type" AS ENUM ('pdf', 'docx', 'msword', 'png', 'jpg', 'jpeg', 'mp4', 'mov', 'mp3', 'wav');
CREATE TYPE "gender" AS ENUM ('male', 'female', 'other');

-- Create Tables
-- Media Metadata Table
CREATE TABLE IF NOT EXISTS "media_metadata" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "file_url" VARCHAR(510),
    "file_name" VARCHAR(255),
    "file_type" file_type,
    "alt_text" VARCHAR(255),
    "created_at" TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT "media_metadata_pkey" PRIMARY KEY ("id")
);

-- Users Table
CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "country_code" VARCHAR(4),
    "phone_number" VARCHAR(20),
    "email" VARCHAR(255) UNIQUE,
    "password" VARCHAR(255),
    "full_name" VARCHAR(50),
    "gender" gender,
    "date_of_birth" TIMESTAMPTZ,
    "email_verified" BOOLEAN DEFAULT false,
    "phone_number_verified" BOOLEAN DEFAULT false,
    "last_login" TIMESTAMPTZ,
    "is_online" BOOLEAN DEFAULT true,
    "avatar" UUID REFERENCES media_metadata(id) ON DELETE SET NULL ON UPDATE CASCADE,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMPTZ,
    "deleted_by" UUID REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    "is_disabled" BOOLEAN DEFAULT false,
    "disabled_at" TIMESTAMPTZ,
    "disabled_by" UUID REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "unique_phone_country" UNIQUE ("phone_number", "country_code")
);
