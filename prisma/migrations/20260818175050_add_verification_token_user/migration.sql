-- CreateTable
CREATE TABLE "PasswordResetTokenUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetTokenUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PasswordResetTokenUser_email_idx" ON "PasswordResetTokenUser"("email");

-- CreateIndex
CREATE INDEX "PasswordResetTokenUser_tokenHash_idx" ON "PasswordResetTokenUser"("tokenHash");
