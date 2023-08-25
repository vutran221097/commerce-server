"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _auth = _interopRequireDefault(require("../controllers/auth.controller"));
var _express = _interopRequireDefault(require("express"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = _express.default.Router();
router.post("/sign-in", _auth.default.signIn);
router.post("/sign-up", _auth.default.signUp);
var _default = router;
exports.default = _default;