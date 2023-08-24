import mongoose, { Schema } from "mongoose";

const Order = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
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
        cart: [
            {
                _id: false,
                item: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                },
                amount: {
                    type: Number
                }
            }
        ],
        formData: {
            fullname: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            phone: {
                type: String,
                required: true,
            },
            address: {
                type: String,
                required: true
            },
        }
    },
    {
        timestamps: true,
    }

);

Order.statics = {
    countOrder() {
        return this.countDocuments({});
    },
    createNewOrder(item) {
        return this.create(item)
    },
    getOrderById(id) {
        return this.findById(id).populate("user").populate("cart.item");
    },
    getAllOrders(condition, skip, limit) {
        return this.find(condition ? condition : {}).populate("user").populate("cart.item").sort({ createdAt: -1 }).skip(skip).limit(limit);
    },
    updateOrder(id, params) {
        return this.findByIdAndUpdate(id, params, { new: true });
    },
    deleteOrder(id) {
        return this.findByIdAndRemove(id);
    },
};

export default mongoose.model("Order", Order);