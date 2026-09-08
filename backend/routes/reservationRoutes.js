import express from "express";

import {
  createReservation,
  getMyReservations,
  cancelReservation,
  exportReservations 
} from "../controllers/ReservationController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/export/excel", protect, adminOnly, exportReservations);  

router.post("/", protect, createReservation);

router.get("/my-reservations", protect, getMyReservations);

router.patch("/:id/cancel", protect, cancelReservation);

export default router;