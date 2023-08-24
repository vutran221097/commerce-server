import httpStatus from "http-status";

export const checkRole = (req, res, next) => {
    const roleUser = req.user.role;
    if (roleUser === "admin") {
        return next();
    }
    const error = new Error('Invalid Role!');
    error.statusCode = httpStatus.UNAUTHORIZED;
    throw error;
};
