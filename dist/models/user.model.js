"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireWildcard(require("mongoose"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const User = new _mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'counselor'],
    required: true
  }
}, {
  timestamps: true
});
User.statics = {
  countUser() {
    return this.countDocuments({});
  },
  createNewUser(item) {
    return this.create(item);
  },
  getUserById(id) {
    return this.findById(id).select(['-createdAt', '-updatedAt', '-__v', '-password']);
  },
  getUser(condition) {
    return this.findOne(condition);
  },
  getAllUsers(condition, skip, limit) {
    return this.find(condition ? condition : {}).sort({
      createdAt: -1
    }).skip(skip).limit(limit);
  },
  updateUser(id, params) {
    return this.findByIdAndUpdate(id, params, {
      new: true
    });
  },
  deleteUser(id) {
    return this.findByIdAndRemove(id);
  }
};
var _default = _mongoose.default.model("User", User);
exports.default = _default;