import cors from "cors";
import express, { Request, Response } from "express";
import { API_PREFIX, PORT } from "./configs/api";
import { authMiddleware } from "./middlewares/authMiddleware";
import { loggerMiddleware } from "./middlewares/loggerMiddleware";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";
import authRoutes from "./routes/auth";
import transactionRoutes from "./routes/transactions";

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);
app.use(errorHandlingMiddleware);

if (API_PREFIX) {
  app.get(`/`, async (req: Request, res: Response) => {
    res.json({ status: `working with prefix ${API_PREFIX}` });
  });
}
app.get(`${API_PREFIX}/`, async (req: Request, res: Response) => {
  res.json({ status: "working." });
});

// APIのプレフィックスを追加
app.use(`${API_PREFIX}/`, authRoutes);
// app.use(`${API_PREFIX}/transactions`, authMiddleware, transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  if (API_PREFIX)
    console.log(`API is available at http://localhost:${PORT}${API_PREFIX}`);
});
