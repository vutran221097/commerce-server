import express from "express"

import { checkAuth } from "../middlewares/checkAuth";
import { checkRole } from "../middlewares/checkRole"
import userController from "../controllers/user.controller"

const router = express.Router()

router.post("/create", userController.create);

router.get("/all", [checkAuth, checkRole], userController.findAll);

router.get("/detail/:id", [checkAuth, checkRole], userController.findOne);

router.put("/update-user/:id", checkAuth, userController.updateUser);

router.put("/change-password/:id", checkAuth, userController.changePassword);

router.delete("/:id", [checkAuth, checkRole], userController.deleteOne);

export default router