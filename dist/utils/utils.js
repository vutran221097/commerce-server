"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatPrice = void 0;
const formatPrice = price => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(price).replace("₫", "VND");
};
exports.formatPrice = formatPrice;