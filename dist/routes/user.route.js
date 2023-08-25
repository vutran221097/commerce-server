"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _checkAuth = require("../middlewares/checkAuth");
var _checkRole = require("../middlewares/checkRole");
var _user = _interopRequireDefault(require("../controllers/user.controller"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = _express.default.Router();
router.post("/create", _user.default.create);
router.get("/all", [_checkAuth.checkAuth, _checkRole.checkRole], _user.default.findAll);
router.get("/detail/:id", [_checkAuth.checkAuth, _checkRole.checkRole], _user.default.findOne);
router.put("/update-user/:id", _checkAuth.checkAuth, _user.default.updateUser);
router.put("/change-password/:id", _checkAuth.checkAuth, _user.default.changePassword);
router.delete("/:id", [_checkAuth.checkAuth, _checkRole.checkRole], _user.default.deleteOne);
var _default = router;
exports.default = _default;