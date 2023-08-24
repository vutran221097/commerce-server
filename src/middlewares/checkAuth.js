import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import db from "../models";

const User = db.user

export const checkAuth = async (req, res, next) => {
    const headerToken = req.headers["x-access-token"];
    if (!headerToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = httpStatus.UNAUTHORIZED;
        throw error;
    }
    try {
        const decoded = jwt.verify(headerToken, process.env.SECRET_TOKEN);
        const { id } = decoded;
        const user = await User.getUserById(id);
        if (!user) {
            const error = new Error('Unauthorization');
            error.statusCode = httpStatus.UNAUTHORIZED;
            throw error;
        }
        req.user = user;

        next();
    } catch (err) {
        err.statusCode = httpStatus.UNAUTHORIZED;
        next(err);
    }
};
