import { Router } from "express";
import passport from "passport";
import {
  loginController,
  protectRouteController,
  registerController,
} from "../controllers/authController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  facebookMiddleware,
  googleMiddlware,
} from "../middlewares/passportMiddleware.js";

const router = Router();
router.use(passport.initialize());

// register
router.post("/register", registerController);

// login
router.post("/login", loginController);

// Protected route example
router.get("/me", requireSignIn, protectRouteController);

// Social login with Google
passport.use(googleMiddlware);

// Social login callbacks
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "api/auth/login" }),
  (req, res) => {
    // Redirect to a page or send the JWT token here
    res.redirect("/me");
  }
);

// Social login with Facebook
passport.use(facebookMiddleware);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "api/auth/login" }),
  (req, res) => {
    // Redirect to a page or send the JWT token here
    res.redirect("/me");
  }
);

export default router;
