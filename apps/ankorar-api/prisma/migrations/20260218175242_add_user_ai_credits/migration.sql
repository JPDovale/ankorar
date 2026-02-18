-- AlterTable
ALTER TABLE "users" ADD COLUMN     "ai_credits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ai_credits_reset_at" TIMESTAMP(3);
