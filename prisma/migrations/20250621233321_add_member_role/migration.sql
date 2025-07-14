/*
  Warnings:

  - You are about to drop the `CollaboratorInvite` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "CollaboratorRole" ADD VALUE 'MEMBER';

-- DropTable
DROP TABLE "CollaboratorInvite";
