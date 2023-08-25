"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adminItem = void 0;
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const adminItem = {
  fullname: "admin",
  email: "admin@gmail.com",
  phone: "0987216425",
  password: _bcryptjs.default.hashSync('123456'),
  role: 'admin'
};
exports.adminItem = adminItem;