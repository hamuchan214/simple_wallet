import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  getTransactions,
  patchTransaction,
} from "../controllers/transaction";

const router = express.Router();

router.get("/", getTransactions);
router.get("/:id", getTransaction);
router.post("/", createTransaction);
router.patch("/:id", patchTransaction);
router.delete("/:id", deleteTransaction);

export default router;
