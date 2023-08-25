"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var dotenv = _interopRequireWildcard(require("dotenv"));
var _models = _interopRequireDefault(require("../models"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _httpStatus = _interopRequireDefault(require("http-status"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
dotenv.config();
const User = _models.default.user;
const authController = {};
authController.signIn = async (req, res, next) => {
  try {
    const user = await User.getUser({
      email: req.body.email
    });
    if (!user) {
      const error = new Error('Email not found!.');
      error.statusCode = _httpStatus.default.NOT_FOUND;
      throw error;
    }
    const passwordIsValid = _bcryptjs.default.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      const error = new Error('Wrong password!.');
      error.statusCode = _httpStatus.default.UNAUTHORIZED;
      throw error;
    }
    const token = _jsonwebtoken.default.sign({
      id: user.id,
      email: user.email
    }, process.env.SECRET_TOKEN, {
      expiresIn: 86400 // 24 hours
    });

    res.status(200).send({
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      accessToken: token
    });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = _httpStatus.default.INTERNAL_SERVER_ERROR;
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
      e.message = "Error when sign up.";
    }
    next(e);
  }
  ;
};
var _default = authController;
exports.default = _default;