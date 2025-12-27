import express from "express";
import { authGuard } from "../middlewares/auth.middleware.js";
import { exportCsv } from "../controller/export.conroller.js";

const router = express.Router();
router.get("/csv/:eventId", authGuard, exportCsv);
export default router;
