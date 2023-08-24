import mongoose from "mongoose"
import User from "./user.model"
import Session from "./session.model"
import Order from "./order.model"
import Product from "./product.model"
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.user = User;
db.session = Session;
db.order = Order;
db.product = Product;

export default db