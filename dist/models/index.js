"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _user = _interopRequireDefault(require("./user.model"));
var _session = _interopRequireDefault(require("./session.model"));
var _order = _interopRequireDefault(require("./order.model"));
var _product = _interopRequireDefault(require("./product.model"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_mongoose.default.Promise = global.Promise;
const db = {};
db.mongoose = _mongoose.default;
db.user = _user.default;
db.session = _session.default;
db.order = _order.default;
db.product = _product.default;
var _default = db;
exports.default = _default;