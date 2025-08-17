SELECT
  ua.id,
  ua.user_id,
  u.full_name,
  u.email,
  u.avatar,
  ua.total_percentage_score AS average_score,
  ua.given_assessments,
  ua.upcoming_assessments,
  ua.test_taken_at,
  rank() OVER (
    ORDER BY
      ua.total_percentage_score DESC
  ) AS rank,
  (
    percent_rank() OVER (
      ORDER BY
        ua.total_percentage_score DESC
    ) * (100) :: double precision
  ) AS percentile,
  ua.created_at,
  ua.updated_at
FROM
  (
    user_analytics ua
    JOIN users u ON ((ua.user_id = u.id))
  )
WHERE
  (ua.total_percentage_score IS NOT NULL);