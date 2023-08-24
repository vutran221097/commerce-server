import authController from "../controllers/auth.controller"
import express from "express"

const router = express.Router()

router.post("/sign-in", authController.signIn);

router.post("/sign-up", authController.signUp);

export default router