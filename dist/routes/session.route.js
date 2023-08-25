"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _session = _interopRequireDefault(require("../controllers/session.controller"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = _express.default.Router();
router.post("/addmsg", _session.default.addMessage);
router.post("/getmsg", _session.default.getMessages);
router.post("/endmsg", _session.default.endChat);
router.get("/get-room", _session.default.getRoom);
var _default = router;
exports.default = _default;