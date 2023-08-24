import mongoose, { Schema } from "mongoose";

const Product = new Schema(
    {
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
        images: [
            {
                type: String
            }
        ],
        shortDesc: {
            type: String,
            required: true
        },
        longDesc: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }

);

Product.statics = {
    countProduct() {
        return this.countDocuments({});
    },
    createNewProduct(item) {
        return this.create(item);
    },
    getProductById(id) {
        return this.findById(id)
    },
    getAllProducts(condition, sort, skip, limit) {
        return this.find(condition ? condition : {}).sort(sort).skip(skip).limit(limit);
    },
    updateProduct(id, params) {
        return this.findByIdAndUpdate(id, params, { new: true });
    },
    deleteProduct(id) {
        return this.findByIdAndRemove(id);
    },
};

export default mongoose.model("Product", Product);