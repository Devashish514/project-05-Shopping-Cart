const express = require('express');
const router = express.Router();
const userController = require("../controller/userController");
const productController = require("../controller/productController");
const cartController = require("../controller/cartController");
const orderController = require("../controller/orderController");
const middleware = require("../validations/auth");

router.post("/register", userController.registerUser);
router.post("/login", userController.userLogin);

router.get("/user/:userId/profile", middleware.auth, userController.getDetail);  //protected Route
router.put("/user/:userId/profile", middleware.auth, userController.updateUserDetail); //protected Route

router.post("/products", productController.createProduct);
router.get("/products", productController.getProduct);

router.get("/products/:productId", productController.getProductById);
router.put("/products/:productId", productController.updateProduct);    
router.delete("/products/:productId", productController.deleteProduct);

router.post("/users/:userId/cart", middleware.auth, cartController.createCart);  //protected Route
router.put("/users/:userId/cart", middleware.auth, cartController.updateCart);  //protected Route
router.get("/users/:userId/cart", middleware.auth, cartController.getCart);   //protected Route
router.delete("/users/:userId/cart", middleware.auth, cartController.deleteCart);  //protected Route

router.post("/users/:userID/orders", middleware.auth, orderController.createOrder);   //protected Route
router.put("/users/:userId/orders", middleware.auth, orderController.updateOrder);  //protected Route



module.exports = router;