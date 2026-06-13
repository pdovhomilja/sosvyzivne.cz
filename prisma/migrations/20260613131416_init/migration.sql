-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('BLOG_POST', 'FAQ', 'PAGE');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "UserAuditAction" AS ENUM ('INVITED', 'PROMOTED', 'DEMOTED', 'DEACTIVATED', 'REACTIVATED', 'RENAMED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "type" "ContentType" NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "locale" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "translationKey" TEXT,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "body" TEXT NOT NULL,
    "coverImage" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "ogImage" TEXT,
    "data" JSONB,
    "publishedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "mimeType" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAuditLog" (
    "id" TEXT NOT NULL,
    "action" "UserAuditAction" NOT NULL,
    "targetId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContentToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ContentToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_isAdmin_isActive_idx" ON "User"("isAdmin", "isActive");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_providerId_accountId_key" ON "Account"("providerId", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_token_idx" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Verification_identifier_idx" ON "Verification"("identifier");

-- CreateIndex
CREATE INDEX "Content_type_status_publishedAt_idx" ON "Content"("type", "status", "publishedAt");

-- CreateIndex
CREATE INDEX "Content_translationKey_idx" ON "Content"("translationKey");

-- CreateIndex
CREATE INDEX "Content_authorId_idx" ON "Content"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Content_type_locale_slug_key" ON "Content"("type", "locale", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "MediaAsset_uploadedById_idx" ON "MediaAsset"("uploadedById");

-- CreateIndex
CREATE INDEX "UserAuditLog_targetId_createdAt_idx" ON "UserAuditLog"("targetId", "createdAt");

-- CreateIndex
CREATE INDEX "UserAuditLog_actorId_createdAt_idx" ON "UserAuditLog"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "UserAuditLog_action_createdAt_idx" ON "UserAuditLog"("action", "createdAt");

-- CreateIndex
CREATE INDEX "_ContentToTag_B_index" ON "_ContentToTag"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAuditLog" ADD CONSTRAINT "UserAuditLog_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAuditLog" ADD CONSTRAINT "UserAuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentToTag" ADD CONSTRAINT "_ContentToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentToTag" ADD CONSTRAINT "_ContentToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
