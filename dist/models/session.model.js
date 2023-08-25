"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireWildcard(require("mongoose"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const Session = new _mongoose.Schema({
  roomId: {
    type: String,
    required: true
  },
  messages: [{
    text: {
      type: String,
      required: true
    },
    senderId: {
      type: String,
      required: true
    }
  }],
  users: Array,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});
Session.statics = {
  createNewSession(item) {
    return this.create(item);
  },
  getAllSessions(condition) {
    return this.find(condition ? condition : {}).sort({
      updatedAt: -1
    });
  },
  updateMessage(roomId, messages) {
    return this.findOneAndUpdate({
      roomId: roomId
    }, {
      $push: {
        messages: messages
      }
    });
  },
  endChat(roomId) {
    return this.findOneAndUpdate({
      roomId: roomId
    }, {
      isActive: false
    }, {
      new: true
    });
  }
};
var _default = _mongoose.default.model("Session", Session);
exports.default = _default;