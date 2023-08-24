import * as dotenv from "dotenv";
dotenv.config();
import db from "../models";
const User = db.user;

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";

const authController = {};

authController.signIn = async (req, res, next) => {
  try {
    const user = await User.getUser({ email: req.body.email })
    if (!user) {
      const error = new Error('Email not found!.');
      error.statusCode = httpStatus.NOT_FOUND;
      throw error;
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      const error = new Error('Wrong password!.');
      error.statusCode = httpStatus.UNAUTHORIZED;
      throw error;
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.SECRET_TOKEN,
      {
        expiresIn: 86400, // 24 hours
      }
    );

    res.status(200).send({
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      accessToken: token,
    });

  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }
    next(e);
  }
};

authController.signUp = async (req, res, next) => {
  try {
    // Create a user
    const user = new User({
      fullname: req.body.fullname,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      phone: req.body.phone,
      role: req.body.role ? req.body.role : 'user'
    });

    const checkDuplicate = await User.getUser({ email: req.body.email });
    if (checkDuplicate) {
      const error = new Error('Email is duplicate.');
      error.statusCode = httpStatus.BAD_REQUEST;
      throw error;
    }

    const data = await User.createNewUser(user);
    if (data) {
      const newData = { ...data._doc }
      delete newData["password"]
      res.status(200).send(newData);
    }
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      e.message = "Error when sign up."
    }
    next(e);
  };
}

export default authController;