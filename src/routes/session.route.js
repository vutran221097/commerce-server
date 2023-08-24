import express from "express"
import sessionController from "../controllers/session.controller";

const router = express.Router()

router.post("/addmsg", sessionController.addMessage);

router.post("/getmsg", sessionController.getMessages);

router.post("/endmsg", sessionController.endChat);

router.get("/get-room", sessionController.getRoom);

export default router