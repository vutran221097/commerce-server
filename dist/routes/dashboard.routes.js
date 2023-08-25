"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _dashboard = _interopRequireDefault(require("../controllers/dashboard.controller"));
var _checkAuth = require("../middlewares/checkAuth");
var _checkRole = require("../middlewares/checkRole");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = _express.default.Router();
router.get("/", [_checkAuth.checkAuth, _checkRole.checkRole], _dashboard.default.getDashboard);
var _default = router;
exports.default = _default;