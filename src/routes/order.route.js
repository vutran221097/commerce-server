import express from "express"

import orderController from "../controllers/order.controller"
import { checkAuth } from "../middlewares/checkAuth";
import { checkRole } from "../middlewares/checkRole";

const router = express.Router()

router.post("/create", checkAuth, orderController.create);

router.get("/all", checkAuth, orderController.getAllOrders);

router.get("/detail/:id", checkAuth, orderController.getOrderById);

router.get("/user/:userId", checkAuth, orderController.getOrderByUser);

router.put("/status/:id", [checkAuth, checkRole], orderController.updateStatusOrder);

export default router