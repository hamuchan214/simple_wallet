-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_custom_tags_on_transaction" (
    "transaction_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,

    PRIMARY KEY ("transaction_id", "tag_id"),
    CONSTRAINT "custom_tags_on_transaction_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transaction" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "custom_tags_on_transaction_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "custom_tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_custom_tags_on_transaction" ("created_at", "tag_id", "transaction_id", "updated_at") SELECT "created_at", "tag_id", "transaction_id", "updated_at" FROM "custom_tags_on_transaction";
DROP TABLE "custom_tags_on_transaction";
ALTER TABLE "new_custom_tags_on_transaction" RENAME TO "custom_tags_on_transaction";
CREATE INDEX "custom_tags_on_transaction_transaction_id_idx" ON "custom_tags_on_transaction"("transaction_id");
CREATE INDEX "custom_tags_on_transaction_tag_id_idx" ON "custom_tags_on_transaction"("tag_id");
CREATE TABLE "new_system_tags_on_transaction" (
    "transaction_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,

    PRIMARY KEY ("transaction_id", "tag_id"),
    CONSTRAINT "system_tags_on_transaction_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transaction" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "system_tags_on_transaction_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "system_tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_system_tags_on_transaction" ("created_at", "tag_id", "transaction_id", "updated_at") SELECT "created_at", "tag_id", "transaction_id", "updated_at" FROM "system_tags_on_transaction";
DROP TABLE "system_tags_on_transaction";
ALTER TABLE "new_system_tags_on_transaction" RENAME TO "system_tags_on_transaction";
CREATE INDEX "system_tags_on_transaction_transaction_id_idx" ON "system_tags_on_transaction"("transaction_id");
CREATE INDEX "system_tags_on_transaction_tag_id_idx" ON "system_tags_on_transaction"("tag_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
