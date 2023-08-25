"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkAuth = void 0;
var _httpStatus = _interopRequireDefault(require("http-status"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _models = _interopRequireDefault(require("../models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const User = _models.default.user;
const checkAuth = async (req, res, next) => {
  const headerToken = req.headers["x-access-token"];
  if (!headerToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = _httpStatus.default.UNAUTHORIZED;
    throw error;
  }
  try {
    const decoded = _jsonwebtoken.default.verify(headerToken, process.env.SECRET_TOKEN);
    const {
      id
    } = decoded;
    const user = await User.getUserById(id);
    if (!user) {
      const error = new Error('Unauthorization');
      error.statusCode = _httpStatus.default.UNAUTHORIZED;
      throw error;
    }
    req.user = user;
    next();
  } catch (err) {
    err.statusCode = _httpStatus.default.UNAUTHORIZED;
    next(err);
  }
};
exports.checkAuth = checkAuth;