import express from "express"
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { body } from "express-validator";

import { checkAuth } from "../middlewares/checkAuth";
import { checkRole } from "../middlewares/checkRole"
import productController from "../controllers/product.controller"


const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public');
    },
    filename: function (req, file, cb) {
        const image = uuidv4() + "-" + Date.now() + '-' + file.originalname;
        cb(null, image);
    }
})

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
})

router.post("/create", [checkAuth, checkRole], upload.array('images', 5), [
    body('name')
        .trim()
        .isLength({ min: 4 }),
    body('category')
        .notEmpty(),
    body('stock')
        .trim()
        .isLength({ min: 1 }),
    body('price')
        .trim()
        .isLength({ min: 4 }),
    body('shortDesc')
        .trim()
        .isLength({ min: 4 }),
    body('longDesc')
        .trim()
        .isLength({ min: 4 })
], productController.create);

router.get("/all", productController.findAll);

router.get("/search", productController.search);

router.get("/detail/:id", productController.findOne);

router.get("/category", productController.findByCategory);

router.delete("/:id", [checkAuth, checkRole], productController.deleteOne);

router.put("/update-product/:id", [checkAuth, checkRole], productController.updateOne);


export default router