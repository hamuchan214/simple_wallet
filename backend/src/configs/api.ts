import env from "dotenv";

env.config();
export const PORT = process.env.PORT || 3000;
export const API_PREFIX = process.env.API_PREFIX || "";
