import express from "express";

import {
  createReservation,
  getMyReservations,
  cancelReservation,
} from "../controllers/ReservationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReservation);

router.get("/my-reservations", protect, getMyReservations);

router.patch("/:id/cancel", protect, cancelReservation);

export default router;