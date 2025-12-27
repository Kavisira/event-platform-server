import express from "express";
import { authGuard } from "../middlewares/auth.middleware.js";
import {
  createEvent,
  getEvents,
  deleteEvent,
  updateEvent
} from "../controller/event.controller.js";

const router = express.Router();

router.post("/", authGuard, createEvent);
router.get("/", authGuard, getEvents);
router.delete("/:id", authGuard, deleteEvent);
router.put("/:id", authGuard, updateEvent);

export default router;
