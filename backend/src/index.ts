import cors from "cors";
import express, { Request, Response } from "express";
import { API_PREFIX, PORT } from "./configs/api";
import { authMiddleware } from "./middlewares/authMiddleware";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware";
import { loggerMiddleware } from "./middlewares/loggerMiddleware";
import authRoutes from "./routes/auth";
import transactionRoutes from "./routes/transactions";
import statisticsRoutes from "./routes/statistics";

const app = express();

app.use(cors());
app.use(express.json());
app.use(errorHandlerMiddleware);
app.use(loggerMiddleware);

if (API_PREFIX) {
  app.get(`/`, async (req: Request, res: Response) => {
    res.json({ status: `working with prefix ${API_PREFIX}` });
  });
}
app.get(`${API_PREFIX}/`, async (req: Request, res: Response) => {
  res.json({ status: "working." });
});

app.use(`${API_PREFIX}/`, authRoutes);
app.use(`${API_PREFIX}/transactions`, authMiddleware, transactionRoutes);
app.use(`${API_PREFIX}/statistics`, authMiddleware, statisticsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  if (API_PREFIX)
    console.log(`API is available at http://localhost:${PORT}${API_PREFIX}`);
});
