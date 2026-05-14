ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "emailVerificationOtpHash" TEXT,
  ADD COLUMN IF NOT EXISTS "emailVerificationOtpExpiresAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "emailVerificationLastSentAt" TIMESTAMP(3);

UPDATE "User"
SET "emailVerified" = true
WHERE "role" <> 'CUSTOMER' OR "email" IN ('customer@example.com');
