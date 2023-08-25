"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _multer = _interopRequireDefault(require("multer"));
var _uuid = require("uuid");
var _expressValidator = require("express-validator");
var _checkAuth = require("../middlewares/checkAuth");
var _checkRole = require("../middlewares/checkRole");
var _product = _interopRequireDefault(require("../controllers/product.controller"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = _express.default.Router();
const storage = _multer.default.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public');
  },
  filename: function (req, file, cb) {
    const image = (0, _uuid.v4)() + "-" + Date.now() + '-' + file.originalname;
    cb(null, image);
  }
});
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = (0, _multer.default)({
  storage: storage,
  fileFilter: fileFilter
});
router.post("/create", [_checkAuth.checkAuth, _checkRole.checkRole], upload.array('images', 5), [(0, _expressValidator.body)('name').trim().isLength({
  min: 1
}), (0, _expressValidator.body)('category').notEmpty(), (0, _expressValidator.body)('stock').trim().isLength({
  min: 1
}), (0, _expressValidator.body)('price').trim().isLength({
  min: 1
}), (0, _expressValidator.body)('shortDesc').trim().isLength({
  min: 1
}), (0, _expressValidator.body)('longDesc').trim().isLength({
  min: 1
})], _product.default.create);
router.get("/all", _product.default.findAll);
router.get("/search", _product.default.search);
router.get("/detail/:id", _product.default.findOne);
router.get("/category", _product.default.findByCategory);
router.delete("/:id", [_checkAuth.checkAuth, _checkRole.checkRole], _product.default.deleteOne);
router.put("/update-product/:id", [_checkAuth.checkAuth, _checkRole.checkRole], _product.default.updateOne);
var _default = router;
exports.default = _default;