/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Tag` table. All the data in the column will be lost.
  - The primary key for the `TagsOnTransactions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `TagsOnTransactions` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `TagsOnTransactions` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `TagsOnTransactions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `TagsOnTransactions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `User` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag_id` to the `TagsOnTransactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_id` to the `TagsOnTransactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `TagsOnTransactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_Tag" ("id", "name") SELECT "id", "name" FROM "Tag";
DROP TABLE "Tag";
ALTER TABLE "new_Tag" RENAME TO "Tag";
CREATE TABLE "new_TagsOnTransactions" (
    "transaction_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,

    PRIMARY KEY ("transaction_id", "tag_id"),
    CONSTRAINT "TagsOnTransactions_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TagsOnTransactions_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
DROP TABLE "TagsOnTransactions";
ALTER TABLE "new_TagsOnTransactions" RENAME TO "TagsOnTransactions";
CREATE INDEX "TagsOnTransactions_transaction_id_idx" ON "TagsOnTransactions"("transaction_id");
CREATE INDEX "TagsOnTransactions_tag_id_idx" ON "TagsOnTransactions"("tag_id");
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("amount", "date", "description", "id") SELECT "amount", "date", "description", "id" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE INDEX "Transaction_user_id_idx" ON "Transaction"("user_id");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_User" ("email", "id", "password") SELECT "email", "id", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
