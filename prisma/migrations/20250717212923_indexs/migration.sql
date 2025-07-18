-- DropIndex
DROP INDEX "User_email_idx";

-- CreateIndex
CREATE INDEX "Collaborator_userId_idx" ON "Collaborator"("userId");

-- CreateIndex
CREATE INDEX "Collaborator_status_idx" ON "Collaborator"("status");
