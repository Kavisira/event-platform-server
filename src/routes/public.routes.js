import express from "express";
import { getPublicEvent, submitResponse } from "../controller/public.controller.js";

const router = express.Router();

router.get("/event/:id", getPublicEvent);
router.post("/event/:id/submit", submitResponse);

export default router;
