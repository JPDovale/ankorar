-- Add target user relation for organization invites
ALTER TABLE "organization_invites"
ADD COLUMN "invited_user_id" TEXT;

-- Backfill from email snapshot
UPDATE "organization_invites" AS oi
SET "invited_user_id" = u."id"
FROM "users" AS u
WHERE lower(trim(oi."email")) = lower(trim(u."email"));

-- Remove legacy rows that cannot be linked to an existing user
DELETE FROM "organization_invites"
WHERE "invited_user_id" IS NULL;

ALTER TABLE "organization_invites"
ALTER COLUMN "invited_user_id" SET NOT NULL;

-- Replace index that used email as authoritative filter
DROP INDEX IF EXISTS "organization_invites_email_status_idx";
CREATE INDEX "organization_invites_invited_user_id_status_idx"
ON "organization_invites"("invited_user_id", "status");

ALTER TABLE "organization_invites"
ADD CONSTRAINT "organization_invites_invited_user_id_fkey"
FOREIGN KEY ("invited_user_id") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
