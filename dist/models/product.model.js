"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireWildcard(require("mongoose"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const Product = new _mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["iphone", "ipad", "watch", "airpods", "mac", "mouse", "keyboard", "other"],
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  images: [{
    type: String
  }],
  shortDesc: {
    type: String,
    required: true
  },
  longDesc: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
Product.statics = {
  countProduct() {
    return this.countDocuments({});
  },
  createNewProduct(item) {
    return this.create(item);
  },
  getProductById(id) {
    return this.findById(id);
  },
  getAllProducts(condition, sort, skip, limit) {
    return this.find(condition ? condition : {}).sort(sort).skip(skip).limit(limit);
  },
  updateProduct(id, params) {
    return this.findByIdAndUpdate(id, params, {
      new: true
    });
  },
  deleteProduct(id) {
    return this.findByIdAndRemove(id);
  }
};
var _default = _mongoose.default.model("Product", Product);
exports.default = _default;