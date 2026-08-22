import cors from "cors";
import express from "express";
import { env } from "./env.js";
import router from "./router.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "AnoPoint" });
});

app.use("/api/:restaurantSlug", router);

app.listen(env.PORT, "0.0.0.0", () => {
  console.log(
    `🚀🚀🚀 AnoPoint backend is running on http://localhost:${env.PORT}`
  );
});
