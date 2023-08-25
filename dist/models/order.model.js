"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireWildcard(require("mongoose"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const Order = new _mongoose.Schema({
  userId: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  payment: {
    type: String,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'done', 'failed'],
    default: "pending"
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'done', 'failed'],
    default: "pending"
  },
  cart: [{
    _id: false,
    item: {
      type: _mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    amount: {
      type: Number
    }
  }],
  formData: {
    fullname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});
Order.statics = {
  countOrder() {
    return this.countDocuments({});
  },
  createNewOrder(item) {
    return this.create(item);
  },
  getOrderById(id) {
    return this.findById(id).populate("user").populate("cart.item");
  },
  getAllOrders(condition, skip, limit) {
    return this.find(condition ? condition : {}).populate("user").populate("cart.item").sort({
      createdAt: -1
    }).skip(skip).limit(limit);
  },
  updateOrder(id, params) {
    return this.findByIdAndUpdate(id, params, {
      new: true
    });
  },
  deleteOrder(id) {
    return this.findByIdAndRemove(id);
  }
};
var _default = _mongoose.default.model("Order", Order);
exports.default = _default;