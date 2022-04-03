const path = require("path");
const fs = require("fs");

const { validationResult } = require("express-validator");

const Product = require("../models/Product");

exports.getAllProducts = async (req, res, next) => {
  try {
    let products = await Product.find();
    if (!products) {
      res.status(500).json({ message: "Couldn't found products. Try again." });
    }
    res.status(200).json({ message: "all products", products: products });
  } catch (err) {
    res.status(500).json({ message: "Couldn't fetch products. Try again." });
  }
};

exports.addProduct = async (req, res, next) => {
  console.log("req: ", req.body);
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: errors.array()[0].msg });
    }

    const { pName, pPrice } = req.body;
    if (!req.file) {
      return res.status(422).res({ json: "Product image not found!" });
    }
    let imagePath = "";
    imagePath = req.file.path.replace(/\\/g, "/");
    console.log("image: ", imagePath);
    const product = new Product({
      pName: pName,
      pPrice: pPrice,
      pImage: imagePath,
    });
    await product.save();
    res.status(201).json({
      message: "added a product successfully.",
      product: product,
    });
  } catch (err) {
    res.status(500).json({ message: "Couldn't add product. Try again." });
  }
};

exports.updateProduct = async (req, res, next) => {
  const pId = req.params.pId;
  const { pName, pPrice } = req.body;
  console.log(pId);
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: errors.array()[0].msg });
    }
    let product = await Product.findById(pId);
    if (!product) {
      return res.status(422).res({ json: "Product couldn't found!" });
    }
    let imageUrl = req.body.pImage;
    if (req.file) {
      clearImage(product.pImage);
      imageUrl = req.file.path.replace(/\\/g, "/");
    }
    product.pName = pName;
    product.pImage = imageUrl;
    product.pPrice = pPrice;
    await product.save();

    res.status(201).json({
      message: " updated product successfully.",
      product: product,
    });
  } catch (err) {
    res.status(500).json({ message: "Couldn't update products. Try again." });
  }
};

exports.deleteProduct = async (req, res, next) => {
  const pId = req.params.pId;
  try {
    let product = await Product.findById(pId);
    if (!product) {
      return res.status(422).res({ json: "Product couldn't found!" });
    }
    clearImage(product.pImage);
    await Product.findByIdAndDelete(pId);
    res.status(201).json({ message: "product delete successfully." });
  } catch (err) {
    res.status(500).json({ message: "Couldn't delete products. Try again." });
  }
};

const clearImage = (ImgPath) => {
  ImgPath = path.join(__dirname, "..", ImgPath);
  fs.unlink(ImgPath, (err) => {
    //console.log("delete done! ", err);
  });
};
