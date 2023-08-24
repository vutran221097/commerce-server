import express from "express"

import DashboardController from "../controllers/dashboard.controller"
import { checkAuth } from "../middlewares/checkAuth";
import { checkRole } from "../middlewares/checkRole";

const router = express.Router()

router.get("/", [checkAuth, checkRole], DashboardController.getDashboard);

export default router