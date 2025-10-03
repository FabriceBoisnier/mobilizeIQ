import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.get("/health", (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(`✅ Backend running on http://localhost:${port}`)
);
