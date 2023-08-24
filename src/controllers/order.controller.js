import db from "../models"
import httpStatus from "http-status";
import nodemailer from "nodemailer"
import { formatPrice } from "../utils/utils";

const Order = db.order;
const Product = db.product;

const orderController = {};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS_APP
    }
});


orderController.create = async (req, res, next) => {
    try {
        // Create a order
        const order = new Order({
            userId: req.body.userId,
            payment: req.body.payment,
            totalPrice: req.body.totalPrice,
            cart: req.body.cart,
            formData: req.body.formData
        });

        const data = await Order.createNewOrder(order);
        if (data) {
            const newData = await Order.getOrderById(data._id)

            await Promise.all(newData.cart.map(async (item) => {
                const product = await Product.getProductById(item.item._id)
                if (product) {
                    if (Number(item.amount) > Number(product.stock)) {
                        await Order.deleteOrder(newData._id)
                        const error = new Error(`The product amount is larger than product stock!`);
                        error.statusCode = httpStatus.BAD_REQUEST;
                        throw error;
                    }
                    const newAmount = Number(product.stock) - Number(item.amount)
                    await Product.findOneAndUpdate(product.id, { stock: newAmount })
                }
            }))

            transporter.sendMail({
                to: req.body.formData.email,
                from: 'vutxfx23138@funix.edu.vn',
                subject: 'You have new place order!',
                html: ` 
                            <h2>Xin Chào User ${newData.formData.fullname}</h2>
                            <p>Phone: ${newData.formData.phone}</p>
                            <p>Adress: ${newData.formData.address}</p>
                            <table style="border: 1px solid black; border-collapse: collapse;">
                                <tbody>
                                <tr>
                                <th style="border: 1px solid black; border-collapse: collapse; padding: 10px;">Tên sản phẩm</th>
                                <th style="border: 1px solid black; border-collapse: collapse; padding: 10px;">Hình ảnh</th>
                                <th style="border: 1px solid black; border-collapse: collapse; padding: 10px;">Giá</th>
                                <th style="border: 1px solid black; border-collapse: collapse; padding: 10px;">Số lượng</th>
                                <th style="border: 1px solid black; border-collapse: collapse; padding: 10px;">Thành tiền</th>
                                </tr>

                                ${newData.cart.map((item) => {
                    const image = `${process.env.HOST}/public/${item.item.images[0]}`
                    return `
                                    <tr>
                                        <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">${item.item.name}</td>
                                        <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;"><img src=${image} alt="pic" width="300" height="400"/></td>
                                        <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">${formatPrice(item.item.price)}</td>
                                        <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">${item.amount}</td>
                                        <td style="border: 1px solid black; border-collapse: collapse; padding: 10px;">${formatPrice(Number(item.item.price) * Number(item.amount))}</td>
                                    </tr>
                                    `
                })}                   
                                </tbody>
                            </table>
                            <h2>Tổng thanh toán</h2>
                            <h2>${formatPrice(newData.totalPrice)}</h2>

                            <p>Hình thức thanh toán: ${newData.payment}</p>
                            <br />
                            <h2>Cảm ơn bạn!</h2>`
            })

            res.status(200).send(newData);
        }
    } catch (e) {
        if (!e.statusCode) {
            e.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            e.message = "Error when creating order."
        }
        next(e);
    };
}

orderController.getOrderById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await Order.getOrderById(id);
        if (data) {
            res.status(200).send(data);
        }
    } catch (e) {
        if (!e.statusCode) {
            e.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            e.message = "Error when getting order."
        }
        next(e);
    };
}

orderController.getAllOrders = async (req, res, next) => {
    try {
        const totalOrder = await Order.countOrder()
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * pageSize;
        const totalPage = Math.ceil(totalOrder / pageSize);
        const data = await Order.getAllOrders({}, skip, pageSize)

        if (!data.length) {
            res.status(200).send({ results: [], total_pages: 0 });
        }

        if (page > totalPage) {
            const error = new Error(`Page not found!`);
            error.statusCode = httpStatus.NOT_FOUND;
            throw error;
        }

        if (data) {
            res.status(200).send({ results: data, total_pages: totalPage });
        }
    } catch (e) {
        if (!e.statusCode) {
            e.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            e.message = "Error when getting order."
        }
        next(e);
    };
}


orderController.getOrderByUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const allOrder = await Order.getAllOrders({ userId: userId })
        if (!allOrder.length) {
            res.status(200).send({ results: [], total_pages: 0 });
        }
        const totalOrder = allOrder.length
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * pageSize;
        const totalPage = Math.ceil(totalOrder / pageSize);

        const data = await Order.getAllOrders({ userId: userId }, skip, pageSize)
        if (page > totalPage) {
            const error = new Error(`Page not found!`);
            error.statusCode = httpStatus.NOT_FOUND;
            throw error;
        }

        if (data) {
            res.status(200).send({ results: data, total_pages: totalPage });
        }
    } catch (e) {
        if (!e.statusCode) {
            e.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            e.message = "Error when getting order list."
        }
        next(e);
    };
}

orderController.updateStatusOrder = async (req, res, next) => {
    try {
        const id = req.params.id;
        const order = await Order.updateOrder(id, req.body)
        if (order) {
            res.status(200).send({ message: "Update order successed!" })
        } else {
            const error = new Error('Order not found!');
            error.statusCode = httpStatus.NOT_FOUND;
            throw error;
        }

    } catch (e) {
        if (!e.statusCode) {
            e.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            e.message = "Error when changing pass word."
        }
        next(e);
    }
}

export default orderController