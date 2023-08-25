"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _user = _interopRequireDefault(require("./user.route"));
var _auth = _interopRequireDefault(require("./auth.route"));
var _product = _interopRequireDefault(require("./product.route"));
var _order = _interopRequireDefault(require("./order.route"));
var _dashboard = _interopRequireDefault(require("./dashboard.routes"));
var _session = _interopRequireDefault(require("./session.route"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = _express.default.Router();
router.use('/user', _user.default);
router.use('/auth', _auth.default);
router.use('/product', _product.default);
router.use('/order', _order.default);
router.use('/dashboard', _dashboard.default);
router.use('/session', _session.default);
var _default = router;
exports.default = _default;