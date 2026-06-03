    // ════════════════════════════════════════════════════════════════
    // routes/authRoutes.js
    // ════════════════════════════════════════════════════════════════
    const express        = require("express");
    const router         = express.Router();
    const authController = require("../controllers/AuthController");
    const { protect }    = require("../middleware/authMiddleware");

    router.post("/signup",         authController.signup);
    router.post("/login",          authController.login);
    router.get("/me",   protect,   authController.getMe);
    router.patch("/update-profile", protect, authController.updateProfile);

    module.exports = router;    