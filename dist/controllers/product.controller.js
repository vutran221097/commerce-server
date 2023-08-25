"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = _interopRequireDefault(require("../models"));
var _httpStatus = _interopRequireDefault(require("http-status"));
var _fs = _interopRequireDefault(require("fs"));
var _util = require("util");
var _expressValidator = require("express-validator");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const unlinkAsync = (0, _util.promisify)(_fs.default.unlink);
const Product = _models.default.product;
const productController = {};
const initSort = {
  createdAt: -1
};
productController.create = async (req, res, next) => {
  try {
    // Create a product

    const errors = (0, _expressValidator.validationResult)(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = _httpStatus.default.UNPROCESSABLE_ENTITY;
      throw error;
    }
    const imagesName = req.files.map(item => item.filename);
    const product = new Product({
      name: req.body.name,
      category: req.body.category,
      stock: req.body.stock,
      price: req.body.price,
      shortDesc: req.body.shortDesc,
      longDesc: req.body.longDesc,
      images: imagesName
    });
    const data = await Product.createNewProduct(product);
    if (data) {
      res.status(200).send(data);
    }
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = _httpStatus.default.INTERNAL_SERVER_ERROR;
      e.message = "Error when creating products.";
    }
    console.log(e);
    next(e);
  }
  ;
};
productController.findAll = async (req, res, next) => {
  try {
    const totalProduct = await Product.countProduct();
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 9;
    let sort;
    if (!req.query.sortByPrice) {
      sort = initSort;
    } else if (parseInt(req.query.sortByPrice) === 1) {
      sort = {
        price: 1
      };
    } else {
      sort = {
        price: -1
      };
    }
    const skip = (page - 1) * pageSize;
    const totalPage = Math.ceil(totalProduct / pageSize);
    const data = await Product.getAllProducts({}, sort, skip, pageSize);
    if (!data.length) {
      res.status(200).send({
        results: [],
        total_pages: 0
      });
    }
    if (page > totalPage) {
      const error = new Error(`Page not found!`);
      error.statusCode = _httpStatus.default.NOT_FOUND;
      throw error;
    }
    if (data) {
      res.status(200).send({
        results: data,
        total_pages: totalPage
      });
    }
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = _httpStatus.default.INTERNAL_SERVER_ERROR;
      e.message = "Error when getting products.";
    }
    next(e);
  }
};
productController.findOne = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.getProductById(id);
    if (product) {
      res.status(200).send(product);
    } else {
      const error = new Error('Product not found!');
      error.statusCode = _httpStatus.default.NOT_FOUND;
      throw error;
    }
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = _httpStatus.default.INTERNAL_SERVER_ERROR;
      e.message = "Error when getting product.";
    }
    next(e);
  }
};
productController.search = async (req, res, next) => {
  const search = req.query.search;
  try {
    const totalProduct = await Product.countProduct();
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * pageSize;
    const totalPage = Math.ceil(totalProduct / pageSize);
    const data = await Product.getAllProducts({
      name: {
        $regex: new RegExp(search),
        $options: 'i'
      }
    }, initSort, skip, pageSize);
    if (!data.length) {
      res.status(200).send({
        results: [],
        total_pages: 0
      });
    }
    if (page > totalPage) {
      const error = new Error(`Page not found!`);
      error.statusCode = _httpStatus.default.NOT_FOUND;
      throw error;
    }
    if (data) {
      res.status(200).send({
        results: data,
        total_pages: totalPage
      });
    }
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = _httpStatus.default.INTERNAL_SERVER_ERROR;
      e.message = `Could not get products}!`;
    }
    next(e);
  }
};
productController.findByCategory = async (req, res, next) => {
  try {
    const type = req.query.type;
    const totalProducts = await Product.getAllProducts({
      category: type
    });
    const totalProduct = totalProducts.length;
    let sort;
    if (!req.query.sortByPrice) {
      sort = initSort;
    } else if (parseInt(req.query.sortByPrice) === 1) {
      sort = {
        price: 1
      };
    } else {
      sort = {
        price: -1
      };
    }
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * pageSize;
    const totalPage = Math.ceil(totalProduct / pageSize);
    const data = await Product.getAllProducts({
      category: type
    }, sort, skip, pageSize);
    if (!data.length) {
      res.status(200).send({
        results: [],
        total_pages: 0
      });
    }
    if (!totalProduct) {
      res.status(200).send({
        results: data,
        total_pages: totalPage
      });
    }
    if (page > totalPage) {
      const error = new Error(`Page not found!`);
      error.statusCode = _httpStatus.default.NOT_FOUND;
      throw error;
    }
    if (data) {
      res.status(200).send({
        results: data,
        total_pages: totalPage
      });
    }
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = _httpStatus.default.INTERNAL_SERVER_ERROR;
      e.message = "Error when getting products by type.";
    }
    next(e);
  }
};
productController.updateOne = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.updateProduct(id, req.body);
    if (product) {
      res.status(200).send({
        message: "Update product successed!"
      });
    } else {
      const error = new Error('Product not found!');
      error.statusCode = _httpStatus.default.NOT_FOUND;
      throw error;
    }
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = _httpStatus.default.INTERNAL_SERVER_ERROR;
      e.message = "Error when changing pass word.";
    }
    next(e);
  }
};
productController.deleteOne = async (req, res, next) => {
  const id = req.params.id;
  try {
    const prod = await Product.getProductById(id);
    if (!prod) {
      const error = new Error('Product not found!');
      error.statusCode = _httpStatus.default.NOT_FOUND;
      throw error;
    }
    if (prod) {
      await Promise.all(prod.images.map(async item => {
        await unlinkAsync(`./public/${item}`);
      }));
      const data = await Product.deleteProduct(id);
      if (data) {
        res.status(200).send({
          message: `Delete success product id ${id}`
        });
      }
    }
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = _httpStatus.default.INTERNAL_SERVER_ERROR;
      e.message = `Could not delete product id ${id}!`;
    }
    next(e);
  }
};
var _default = productController;
exports.default = _default;