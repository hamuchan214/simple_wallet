import express from "express";
import {
    createSavingsGoal,
    getSavingsGoals,
    updateSavingsGoal,
    deleteSavingsGoal,
    addSavingHistory,
} from "../controllers/saving"

const router = express.Router();

// GET /savings
router.get("/", getSavingsGoals);

// POST /savings
router.post("/", createSavingsGoal);

// PUT /savings/goals/:id
router.put("/goals/:id", updateSavingsGoal);

// DELETE /savings/goals/:id
router.delete("/goals/:id", deleteSavingsGoal);

// POST /savings/history
// router.post("/history", addSavingHistory);

export default router;