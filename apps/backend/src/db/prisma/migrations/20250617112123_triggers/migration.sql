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

CREATE OR REPLACE FUNCTION update_user_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- Only proceed if is_assessed changed from false to true
    IF NEW.is_assessed = TRUE AND (OLD.is_assessed = FALSE OR OLD.is_assessed IS NULL) THEN
        
        -- Insert or update user_analytics using UPSERT (ON CONFLICT)
        INSERT INTO user_analytics (
            user_id,
            test_taken_at,
            total_percentage_score,
            given_assessments,
            upcoming_assessments,
            updated_at
        )
        VALUES (
            NEW.user_id,
            NEW.completed_at,
            NEW.percentage_score,
            1, -- This assessment just completed
            (
                -- Count upcoming assessments for this user
                SELECT COUNT(*)
                FROM user_assessments
                WHERE user_id = NEW.user_id
                AND is_assessed = FALSE
                AND scheduled_at > CURRENT_TIMESTAMP
            ),
            CURRENT_TIMESTAMP
        )
        ON CONFLICT (user_id) DO UPDATE SET
            test_taken_at = EXCLUDED.test_taken_at,
            total_percentage_score = CASE
                -- Calculate average of all completed assessments
                WHEN (
                    SELECT COUNT(*)
                    FROM user_assessments
                    WHERE user_id = NEW.user_id
                    AND is_assessed = TRUE
                    AND percentage_score IS NOT NULL
                ) > 0 THEN (
                    SELECT AVG(percentage_score)
                    FROM user_assessments
                    WHERE user_id = NEW.user_id
                    AND is_assessed = TRUE
                    AND percentage_score IS NOT NULL
                )
                ELSE EXCLUDED.total_percentage_score
            END,
            given_assessments = (
                -- Count total completed assessments
                SELECT COUNT(*)
                FROM user_assessments
                WHERE user_id = NEW.user_id
                AND is_assessed = TRUE
            ),
            upcoming_assessments = EXCLUDED.upcoming_assessments,
            updated_at = CURRENT_TIMESTAMP;
            
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER user_assessment_completed_trigger
AFTER UPDATE ON user_assessments
FOR EACH ROW
EXECUTE FUNCTION update_user_analytics();
