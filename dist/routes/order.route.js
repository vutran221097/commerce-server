"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _order = _interopRequireDefault(require("../controllers/order.controller"));
var _checkAuth = require("../middlewares/checkAuth");
var _checkRole = require("../middlewares/checkRole");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = _express.default.Router();
router.post("/create", _checkAuth.checkAuth, _order.default.create);
router.get("/all", _checkAuth.checkAuth, _order.default.getAllOrders);
router.get("/detail/:id", _checkAuth.checkAuth, _order.default.getOrderById);
router.get("/user/:userId", _checkAuth.checkAuth, _order.default.getOrderByUser);
router.put("/status/:id", [_checkAuth.checkAuth, _checkRole.checkRole], _order.default.updateStatusOrder);
var _default = router;
exports.default = _default;