import express from 'express'
import bodyParser from 'body-parser'
import logger from 'morgan';
import cors from 'cors'
import socketIo from 'socket.io';
import 'dotenv/config'

import db from './models/index.js'
import routes from './routes/index.js'
import { adminItem } from './constants/admin.js';

const User = db.user;

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@server.ukormm7.mongodb.net/commerce-web`;

const app = express()

db.mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(async () => {
        console.log("Connected to the MongoDB!");
        try {
            const checkAdmin = await User.getUser({ email: adminItem.email });
            if (checkAdmin) return;
            else {
                await User.createNewUser(adminItem);
                return true;
            }
        } catch (e) {
            console.error(e);
        }

    })
    .catch(err => {
        console.log("Cannot connect to the MongoDB!", err);
        process.exit();
    });

app.use(cors());
app.use('/public', express.static('public'));
app.use(bodyParser.json({ limit: '25mb' }));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '25mb'
}));
app.use(logger('dev'));

app.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

app.get('/', function (req, res) {
    res.send('Server is running.')
})

//routes
app.use(routes);

const PORT = process.env.PORT || 9080;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

const io = socketIo(server, {
    cors: {
        origins: [process.env.CLIENT_HOST, process.env.CLIENT_ADMIN_HOST],
        credentials: true,
    },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        console.log(data);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.msg);
            socket.to(sendUserSocket).emit("room-id", data.roomId);
        }
    });
});



export default server;