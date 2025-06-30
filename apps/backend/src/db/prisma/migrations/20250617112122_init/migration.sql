-- Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Enums
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
CREATE TYPE interview_type_enum AS ENUM ('mcq', 'subjective');
CREATE TYPE difficulty_enum AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE question_type_enum AS ENUM ('mcq', 'subjective');
CREATE TYPE interview_status_enum AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE social_provider_enum AS ENUM ('google');

-- Create Tables
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar TEXT,
    phone_number VARCHAR(20),
    country_code VARCHAR(5),
    gender gender_enum,
    password_hash VARCHAR(255), -- nullable for social login users
    date_of_birth DATE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_temp BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User OTP Table
CREATE TABLE IF NOT EXISTS user_otps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    otp_value VARCHAR(255) NOT NULL,
    attempts INTEGER DEFAULT 0, -- invalid otp attempts
    resend_attempts INTEGER DEFAULT 0, -- resend otp attempts
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resend_at TIMESTAMPTZ, -- last resend time
    locked_at TIMESTAMPTZ
);

-- OAUTH Identities Table
CREATE TABLE IF NOT EXISTS user_social_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    provider_name social_provider_enum NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (provider_name, provider_id),
    UNIQUE (user_id, provider_name)
);

-- Roles table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User roles table
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, role_id)
);

-- Courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Users Courses table
CREATE TABLE user_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, course_id)
);

-- Interviews table
CREATE TABLE interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    type interview_type_enum NOT NULL,
    difficulty difficulty_enum NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    description TEXT,
    max_score DECIMAL(5,2) DEFAULT 100,
    total_questions INTEGER DEFAULT 25,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users Interviews table
CREATE TABLE user_interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    status interview_status_enum DEFAULT 'scheduled',
    total_score DECIMAL(5,2),
    percentage_score DECIMAL(5,2),
    feedback TEXT,
    strong_areas TEXT[],
    weak_areas TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type question_type_enum NOT NULL,
    options JSONB, -- For MCQ options
    correct_answer TEXT,
    difficulty difficulty_enum,
    order_sequence INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User answers table
CREATE TABLE user_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_interview_id UUID NOT NULL REFERENCES user_interviews(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    answer TEXT,
    is_correct BOOLEAN,
    points_earned DECIMAL(5,2) DEFAULT 0.00, -- for subjective questions
    UNIQUE(user_interview_id, question_id)
);

-- User analytics table
CREATE TABLE user_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    test_taken_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    total_percentage_score DECIMAL(5,2),
    given_interviews INTEGER DEFAULT 0,
    upcoming_interviews INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone_number, country_code);
CREATE INDEX idx_users_active ON users(is_active, is_deleted);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE INDEX idx_social_accounts_provider ON user_social_accounts(provider_name, provider_id);
CREATE INDEX idx_social_accounts_user ON user_social_accounts(user_id);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);

CREATE INDEX idx_user_courses_user ON user_courses(user_id);
CREATE INDEX idx_user_courses_course ON user_courses(course_id);
CREATE INDEX idx_user_courses_active ON user_courses(is_active);

CREATE INDEX idx_interviews_course ON interviews(course_id);
CREATE INDEX idx_interviews_type ON interviews(type);
CREATE INDEX idx_interviews_difficulty ON interviews(difficulty);

CREATE INDEX idx_user_interviews_user ON user_interviews(user_id);
CREATE INDEX idx_user_interviews_interview ON user_interviews(interview_id);
CREATE INDEX idx_user_interviews_status ON user_interviews(status);
CREATE INDEX idx_user_interviews_scheduled ON user_interviews(scheduled_at);

CREATE INDEX idx_questions_interview ON questions(interview_id);
CREATE INDEX idx_questions_type ON questions(question_type);
CREATE INDEX idx_questions_order ON questions(order_sequence);

CREATE INDEX idx_user_answers_user_interview ON user_answers(user_interview_id);
CREATE INDEX idx_user_answers_question ON user_answers(question_id);

CREATE INDEX idx_user_analytics_user ON user_analytics(user_id);
