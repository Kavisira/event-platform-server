import express from "express";
import { authGuard } from "../middlewares/auth.middleware.js";
import { getSubmissions } from "../controller/submission.controller.js";

const router = express.Router();

router.get("/:eventId", authGuard, getSubmissions);

export default router;
