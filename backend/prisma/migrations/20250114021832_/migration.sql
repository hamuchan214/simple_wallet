/*
  Warnings:

  - You are about to drop the `tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags_on_transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "tag";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "tags_on_transaction";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "system_tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "custom_tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "custom_tag_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "system_tags_on_transaction" (
    "transaction_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,

    PRIMARY KEY ("transaction_id", "tag_id"),
    CONSTRAINT "system_tags_on_transaction_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "system_tags_on_transaction_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "system_tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "custom_tags_on_transaction" (
    "transaction_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,

    PRIMARY KEY ("transaction_id", "tag_id"),
    CONSTRAINT "custom_tags_on_transaction_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "custom_tags_on_transaction_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "custom_tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "system_tag_name_key" ON "system_tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "custom_tag_name_key" ON "custom_tag"("name");

-- CreateIndex
CREATE INDEX "custom_tag_user_id_idx" ON "custom_tag"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "custom_tag_name_user_id_key" ON "custom_tag"("name", "user_id");

-- CreateIndex
CREATE INDEX "system_tags_on_transaction_transaction_id_idx" ON "system_tags_on_transaction"("transaction_id");

-- CreateIndex
CREATE INDEX "system_tags_on_transaction_tag_id_idx" ON "system_tags_on_transaction"("tag_id");

-- CreateIndex
CREATE INDEX "custom_tags_on_transaction_transaction_id_idx" ON "custom_tags_on_transaction"("transaction_id");

-- CreateIndex
CREATE INDEX "custom_tags_on_transaction_tag_id_idx" ON "custom_tags_on_transaction"("tag_id");
