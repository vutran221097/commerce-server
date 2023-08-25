"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _morgan = _interopRequireDefault(require("morgan"));
var _cors = _interopRequireDefault(require("cors"));
var _socket = _interopRequireDefault(require("socket.io"));
require("dotenv/config");
var _index = _interopRequireDefault(require("./models/index.js"));
var _index2 = _interopRequireDefault(require("./routes/index.js"));
var _admin = require("./constants/admin.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const User = _index.default.user;
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_SERVER}/commerce-web`;
const app = (0, _express.default)();
_index.default.mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(async () => {
  console.log("Connected to the MongoDB!");
  try {
    const checkAdmin = await User.getUser({
      email: _admin.adminItem.email
    });
    if (checkAdmin) return;else {
      await User.createNewUser(_admin.adminItem);
      return true;
    }
  } catch (e) {
    console.error(e);
  }
}).catch(err => {
  console.log("Cannot connect to the MongoDB!", err);
  process.exit();
});
app.use((0, _cors.default)());
app.use('/public', _express.default.static('public'));
app.use(_bodyParser.default.json({
  limit: '25mb'
}));
app.use(_bodyParser.default.urlencoded({
  extended: true,
  limit: '25mb'
}));
app.use((0, _morgan.default)('dev'));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
  next();
});
app.get('/', function (req, res) {
  res.send('Server is running.');
});

//routes
app.use(_index2.default);
const PORT = process.env.PORT || 9080;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
const io = (0, _socket.default)(server, {
  cors: {
    origins: [process.env.CLIENT_HOST, process.env.CLIENT_ADMIN_HOST],
    credentials: true
  }
});
global.onlineUsers = new Map();
io.on("connection", socket => {
  global.chatSocket = socket;
  socket.on("add-user", userId => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", data => {
    const sendUserSocket = onlineUsers.get(data.to);
    console.log(data);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      socket.to(sendUserSocket).emit("room-id", data.roomId);
    }
  });
});
var _default = server;
exports.default = _default;