-- CreateTable
CREATE TABLE "savings_goal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "target_amount" INTEGER NOT NULL,
    "current_amount" INTEGER NOT NULL DEFAULT 0,
    "deadline" DATETIME,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "savings_goal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "savings_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "goal_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT,
    "date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "savings_history_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "savings_goal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "savings_goal_user_id_idx" ON "savings_goal"("user_id");

-- CreateIndex
CREATE INDEX "savings_history_goal_id_idx" ON "savings_history"("goal_id");
