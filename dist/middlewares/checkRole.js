"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkRole = void 0;
var _httpStatus = _interopRequireDefault(require("http-status"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const checkRole = (req, res, next) => {
  const roleUser = req.user.role;
  if (roleUser === "admin") {
    return next();
  }
  const error = new Error('Invalid Role!');
  error.statusCode = _httpStatus.default.UNAUTHORIZED;
  throw error;
};
exports.checkRole = checkRole;