-- Add note features (read:note, create:note, update:note) to all existing members.
-- Preserves existing features and avoids duplicates.
UPDATE "members"
SET "features" = (
  SELECT array_agg("f")
  FROM (
    SELECT DISTINCT unnest("features" || ARRAY['read:note', 'create:note', 'update:note']::text[]) AS "f"
  ) AS "distinct_features"
)
WHERE "deleted_at" IS NULL;
