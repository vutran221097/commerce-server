"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = _interopRequireDefault(require("../models"));
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _httpStatus = _interopRequireDefault(require("http-status"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const User = _models.default.user;
const userController = {};
userController.create = async (req, res, next) => {
  try {
    // Create a user
    const user = new User({
      fullname: req.body.fullname,
      email: req.body.email,
      password: _bcryptjs.default.hashSync(req.body.password, 8),
      phone: req.body.phone,
      role: req.body.role ? req.body.role : 'user'
    });
    const checkDuplicate = await User.getUser({
      email: req.body.email
    });
    if (checkDuplicate) {
      const error = new Error('Email is duplicate.');
      error.statusCode = _httpStatus.default.BAD_REQUEST;
      throw error;
    }
    const data = await User.createNewUser(user);
    if (data) {
      const newData = {
        ...data._doc
      };
      delete newData["password"];
      res.status(200).send(newData);
    }
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = _httpStatus.default.INTERNAL_SERVER_ERROR;
      e.message = "Error when creating user.";
    }
    next(e);
  }
  ;
};
userController.findAll = async (req, res, next) => {
  try {
    const totalUser = await User.countUser();
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * pageSize;
    const totalPage = Math.ceil(totalUser / pageSize);
    const data = await User.getAllUsers({}, skip, pageSize);
    if (!data.length) {
      res.status(200).send({
        results: [],
        total_pages: 0
      });
    }
    if (page > totalPage) {
      const error = new Error(`Page not found!`);
      error.statusCode = _httpStatus.default.NOT_FOUND;
      throw error;
    }
    if (data) {
      res.status(200).send({
        results: data,
        total_pages: totalPage
      });
    }
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = _httpStatus.default.INTERNAL_SERVER_ERROR;
      e.message = "Error when getting users.";
    }
    next(e);
  }
};
userController.findOne = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.getUserById(id);
    if (user) {
      res.status(200).send(user);
    } else {
      const error = new Error('User not found!');
      error.statusCode = _httpStatus.default.NOT_FOUND;
      throw error;
    }
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = _httpStatus.default.INTERNAL_SERVER_ERROR;
      e.message = "Error when getting user.";
    }
    next(e);
  }
};
userController.updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.getUserById(id);
    if (user) {
      const param = {
        ...req.body
      };
      delete param['email'];
      delete param['_id'];
      const status = await User.updateUser(id, param);
      if (status) {
        res.status(200).send({
          message: "Update user successed!"
        });
      }
    } else {
      const error = new Error('User not found!');
      error.statusCode = _httpStatus.default.NOT_FOUND;
      throw error;
    }
  } catch (e) {
    console.log(e);
    if (!e.statusCode) {
      e.statusCode = _httpStatus.default.INTERNAL_SERVER_ERROR;
      e.message = "Error when update user.";
    }
    next(e);
  }
};
userController.changePassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.getUserById(id);
    if (user) {
      const newPassword = _bcryptjs.default.hashSync(req.body.password);
      const status = await User.updateUser(id, {
        password: newPassword
      });
      if (status) {
        res.status(200).send({
          message: "Change password success!"
        });
      }
    } else {
      const error = new Error('User not found!');
      error.statusCode = _httpStatus.default.NOT_FOUND;
      throw error;
    }
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = _httpStatus.default.INTERNAL_SERVER_ERROR;
      e.message = "Error when changing password.";
    }
    next(e);
  }
};
userController.deleteOne = async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await User.deleteUser(id);
    if (data.role === "admin") {
      const error = new Error('You can not delete another admin!');
      error.statusCode = _httpStatus.default.BAD_REQUEST;
      throw error;
    }
    if (!data) {
      const error = new Error('User not found!');
      error.statusCode = _httpStatus.default.NOT_FOUND;
      throw error;
    } else {
      res.status(200).send({
        message: `Delete successed user id ${id}`
      });
    }
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = _httpStatus.default.INTERNAL_SERVER_ERROR;
      e.message = `Could not delete user id ${id}!`;
    }
    next(e);
  }
};
var _default = userController;
exports.default = _default;