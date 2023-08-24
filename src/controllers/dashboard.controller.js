import db from "../models"

const Order = db.order
const User = db.user

const dashboardController = {};

dashboardController.getDashboard = async (req, res, next) => {
    try {
        const totalUsers = await User.countUser()
        const orders = await Order.getAllOrders({ paymentStatus: "pending" })
        const totalOrder = orders.length
        const earning = await Order.getAllOrders()
        const orderDone = earning.filter((item) => item.paymentStatus === "done")
        const totalEarning = !orderDone.length ? 0 : orderDone.length === 1 ? orderDone[0].totalPrice : orderDone.reduce((a, b) => a.totalPrice + b.totalPrice)

        const data = {
            totalUsers,
            totalOrder,
            totalEarning,
        }
        res.status(200).send(data)
    } catch (e) {
        if (!e.statusCode) {
            e.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            e.message = `Could not delete user id ${id}!`
        }
        next(e);
    }
};


export default dashboardController