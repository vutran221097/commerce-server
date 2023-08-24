import db from "../models"
import httpStatus from "http-status";

const Session = db.session;

const sessionController = {};

sessionController.getMessages = async (req, res, next) => {
    try {
        const { roomId, from, to } = req.body;

        const room = await Session.findOne({
            roomId: roomId
        })

        if (!room) {
            res.status(200).send([]);
        }

        const projectedMessages = room.messages.map((msg) => {
            return {
                fromSelf: msg.senderId.toString() === from,
                message: msg.text,
            };
        });
        res.status(200).send(projectedMessages);
    } catch (e) {
        if (!e.statusCode) {
            e.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            e.message = "Error when getting message."
        }
        next(e);
    }
}

sessionController.addMessage = async (req, res, next) => {
    try {
        const { roomId, from, to, message } = req.body;

        const checkRoom = await Session.findOne({ roomId: roomId })

        if (!checkRoom) {
            const data = await Session.createNewSession({
                roomId: roomId,
                messages: [{ text: message, senderId: from }],
                users: [from, to],
            });
            if (data) return res.status(200).send({ msg: "Message added successfully." });
        } else {
            const data = await Session.updateMessage(roomId, { text: message, senderId: from })
            if (data) return res.status(200).send({ msg: "Message added successfully." });
        }
    } catch (e) {
        if (!e.statusCode) {
            e.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            e.message = "Error when sending message."
        }
        next(e);
    }
}

sessionController.endChat = async (req, res, next) => {
    try {
        const { roomId } = req.body;
        const deActiveChat = await Session.endChat(roomId)
        if (deActiveChat) {
            res.status(200).send({ message: "DeActive room successed!" })
        }
    } catch (e) {
        if (!e.statusCode) {
            e.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            e.message = "Error when end chat."
        }
        next(e);
    }
}

sessionController.getRoom = async (req, res, next) => {
    try {
        const rooms = await Session.getAllSessions()
        if (rooms) {
            res.status(200).send(rooms)
        }
    } catch (e) {
        if (!e.statusCode) {
            e.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            e.message = "Error when end chat."
        }
        next(e);
    }
}


export default sessionController