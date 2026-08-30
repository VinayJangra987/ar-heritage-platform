// const express            = require("express");
// const router             = express.Router();
// const favoriteController = require("../controllers/favoriteController");
// const { protect }        = require("../middleware/authMiddleware");

// router.get("/",                protect, favoriteController.getFavorites);
// router.post("/toggle/:siteId", protect, favoriteController.toggleFavorite);

// module.exports = router;



import express from "express";
import favoriteController from "../controllers/favoriteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ============ GET ALL FAVORITES ============
router.get("/", protect, favoriteController.getFavorites);

// ============ TOGGLE FAVORITE ============
router.post("/toggle/:siteId", protect, favoriteController.toggleFavorite);

export default router;