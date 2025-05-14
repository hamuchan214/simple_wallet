-- CreateTable
CREATE TABLE "budget" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "budget_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "budget_category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "budget_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "budget_category_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "budget" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "budget_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "custom_tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "budget_user_id_idx" ON "budget"("user_id");

-- CreateIndex
CREATE INDEX "budget_category_budget_id_idx" ON "budget_category"("budget_id");

-- CreateIndex
CREATE INDEX "budget_category_category_id_idx" ON "budget_category"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "budget_category_budget_id_category_id_key" ON "budget_category"("budget_id", "category_id");
