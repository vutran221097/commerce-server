import mongoose, { Schema } from "mongoose";

const Session = new Schema(
    {
        roomId: {
            type: String, required: true
        },
        messages: [{
            text: { type: String, required: true },
            senderId: {
                type: String,
                required: true,
            },
        }],
        users: Array,
        isActive: { type: Boolean, default: true }
    },
    {
        timestamps: true,
    }
);

Session.statics = {
    createNewSession(item) {
        return this.create(item);
    },
    getAllSessions(condition) {
        return this.find(condition ? condition : {}).sort({ updatedAt: -1 });
    },
    updateMessage(roomId, messages) {
        return this.findOneAndUpdate({ roomId: roomId }, { $push: { messages: messages } })
    },
    endChat(roomId) {
        return this.findOneAndUpdate({ roomId: roomId }, { isActive: false }, { new: true })
    }
};

export default mongoose.model("Session", Session);