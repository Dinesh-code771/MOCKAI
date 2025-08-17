-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to tables with updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_social_accounts_updated_at BEFORE UPDATE ON user_social_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_assessments_updated_at BEFORE UPDATE ON user_assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_analytics_updated_at BEFORE UPDATE ON user_analytics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION create_user_analytics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_analytics (user_id) VALUES (NEW.user_id)
    ON CONFLICT (user_id) DO NOTHING;  -- Added missing semicolon
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER create_user_analytics_trigger
    BEFORE INSERT ON user_assessments
    FOR EACH ROW
    EXECUTE FUNCTION create_user_analytics();

CREATE OR REPLACE FUNCTION update_user_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user_analytics (record should already exist from create trigger)
    UPDATE user_analytics SET
        test_taken_at = NEW.completed_at,
        total_percentage_score = (
            -- Calculate average of all completed assessments including this one
            SELECT AVG(percentage_score)
            FROM user_assessments
            WHERE user_id = NEW.user_id
            AND is_assessed = TRUE
            AND percentage_score IS NOT NULL
        ),
        given_assessments = (
            -- Count total completed assessments including this one
            SELECT COUNT(*)
            FROM user_assessments
            WHERE user_id = NEW.user_id
            AND is_assessed = TRUE
        ),
        upcoming_assessments = (
            -- Count upcoming assessments
            SELECT COUNT(*)
            FROM user_assessments
            WHERE user_id = NEW.user_id
            AND is_assessed = FALSE
            AND status = 'scheduled'
            AND scheduled_at > CURRENT_TIMESTAMP
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = NEW.user_id;
    
    -- If no record exists (shouldn't happen with create trigger), insert it
    IF NOT FOUND THEN
        INSERT INTO user_analytics (
            user_id,
            test_taken_at,
            total_percentage_score,
            given_assessments,
            upcoming_assessments,
            updated_at
        ) VALUES (
            NEW.user_id,
            NEW.completed_at,
            NEW.percentage_score,
            1,
            (
                SELECT COUNT(*)
                FROM user_assessments
                WHERE user_id = NEW.user_id
                AND is_assessed = FALSE
                AND status = 'scheduled'
                AND scheduled_at > CURRENT_TIMESTAMP
            ),
            CURRENT_TIMESTAMP
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER user_assessment_update_trigger
    AFTER UPDATE ON user_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_user_analytics();

CREATE OR REPLACE TRIGGER user_assessment_insert_trigger
    AFTER INSERT ON user_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_user_analytics();