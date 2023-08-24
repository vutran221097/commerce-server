import mongoose, { Schema } from "mongoose";

const User = new Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['admin', 'user', 'counselor'],
            required: true
        },
    },
    {
        timestamps: true,
    }

);

User.statics = {
    countUser() {
        return this.countDocuments({});
    },
    createNewUser(item) {
        return this.create(item);
    },
    getUserById(id) {
        return this.findById(id).select(['-createdAt', '-updatedAt', '-__v', '-password']);
    },
    getUser(condition) {
        return this.findOne(condition);
    },
    getAllUsers(condition, skip, limit) {
        return this.find(condition ? condition : {}).sort({ createdAt: -1 }).skip(skip).limit(limit);
    },
    updateUser(id, params) {
        return this.findByIdAndUpdate(id, params, { new: true });
    },
    deleteUser(id) {
        return this.findByIdAndRemove(id);
    },
};

export default mongoose.model("User", User);