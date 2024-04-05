const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
  },
  desc: {
    type: String,
    required: [true, "Please enter product Description"],
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: [true, "Please enter product color"],
    trim: true,
    default: "black",
  },
  brand: {
    type: String,
    required: [true, "Please enter product brand"],
    trim: true,
  },

  category: {
    type: String,
    required: [true, "Please enter category"],
  },

  inStock: { type: Boolean, default: true },
 
  image: String,
 

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
