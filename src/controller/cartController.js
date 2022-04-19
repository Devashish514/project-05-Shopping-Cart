const cartModel = require("../model/cartModel");
const userModel = require("../model/userModel");
const productModel = require("../model/productModel");
const mongoose = require("mongoose")


const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const createCart = async function (req, res) {
    let userId = req.params.userId;
    // if (userId != req.validateUser) {
    //     return res.status(401).send({ status: false, message: "Not Authorize..!!" });
    // }
    let data = req.body;
    if (Object.keys(data).length == 0) {
        return res.status(400).send({ status: false, message: "No Body Found..!!" });
    } else {
        if (!data.userId) {
            return res.status(400).send({ status: false, message: "Required UserId..!!" });
        } else {
            if (!isValidObjectId(userId)) {
                return res.status(400).send({ status: false, message: "Invalid UserId..!!" });
            }
            if (userId != data.userId) {
                return res.status(401).send({ status: false, message: "Not Authorize..!!" });
            }
        }
        const findUser = await cartModel.findOne({ userId: userId });
        if (!findUser) {
            data.items = [];
            if (data.productId && data.quantity) {
                const productId = data.productId.split(",");
                const quantityArr = data.quantity.split(",");
                let totalPrice = 0;
                //checking for duplicate productId in Request.
                const checkProducts = function (arr1, arr2) {
                    for (let i = 0; i < arr1.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[i].productId == arr2[j]) {
                                return true
                            }
                        }
                    }
                }
                if (checkProducts(data.items, productId)) {
                    return res.status(400).send({ status: false, message: "product already in cart, Update Quantity..!" });
                }
                if (productId.length == quantityArr.length) {
                    for (let i = 0; i < productId.length; i++) {
                        if (!isValidObjectId(productId[i])) {
                            return res.status(400).send({ status: false, message: "Invalid ProductId input..!!" });
                        }
                        if (isNaN(Number(quantityArr[i]))) {
                            return res.status(400).send({ status: false, message: "Invalid Quantity Input..!!" });
                        }
                        const findProduct = await productModel.findById(productId[i]).select({ price: 1, _id: 0 });
                        totalPrice = totalPrice + (findProduct.price * quantityArr[i]);

                        data.items.push({ productId: productId[i], quantity: quantityArr[i] });
                    }
                    data.totalPrice = Math.floor(totalPrice);
                    data.totalItems = data.items.length;
                    let createData = await cartModel.create(data);
                    res.status(201).send({ status: true, message: "cart Successfully Created..", data: createData });
                } else {
                    return res.status(400).send({ Status: false, message: "Missing Input..!!" });
                }
            } else {
                return res.status(400).send({ status: false, message: "Missing items..!!" });
            }
        } else {
            const userItems = findUser.items;
            if (data.productId && data.quantity) {
                const productId = data.productId.split(",");
                const quantityArr = data.quantity.split(",");
                let totalPrice = findUser.totalPrice;
                // checking for duplicate productId in Request.
                const checkProducts = function (arr1, arr2) {
                    for (let i = 0; i < arr1.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[i].productId == arr2[j]) {
                                return true
                            }
                        }
                    }
                }
                if (checkProducts(userItems, productId)) {
                    return res.status(400).send({ status: false, message: "product already in cart, Update Quantity..!" });
                }
                if (productId.length == quantityArr.length) {
                    for (let i = 0; i < productId.length; i++) {
                        if (!isValidObjectId(productId[i])) {
                            return res.status(400).send({ status: false, message: "Invalid ProductId input..!!" });
                        }
                        if (isNaN(Number(quantityArr[i]))) {
                            return res.status(400).send({ status: false, message: "Invalid Quantity Input..!!" });
                        }
                        const findProduct = await productModel.findById(productId[i]).select({ price: 1, _id: 0 });
                        totalPrice = totalPrice + (findProduct.price * quantityArr[i]);
                        userItems.push({ productId: productId[i], quantity: quantityArr[i] });
                    }
                    findUser.items = userItems;
                    findUser.totalPrice = totalPrice;
                    findUser.totalItems = userItems.length
                    findUser.save();
                    res.status(200).send({ status: true, message: "cart Updated..", data: findUser });
                } else {
                    return res.status(400).send({ Status: false, message: "Missing Input..!!" });
                }
            } else {
                return res.status(400).send({ status: false, message: "Missing items..!!" });
            }
        }
    }
}


const updateCart = async function (req, res) {
    let userId = req.params.userId;
    if (!isValidObjectId(userId)) {
        return res.status(400).send({ status: false, message: "Invalid UserId" });
    }
    if (req.validateUser != userId) {
        return res.status(400).send({ status: false, messsage: "Not Authorize..!!" });
    }
    let dataToUpdate = req.body;
    if (Object.keys(dataToUpdate).length == 0) {
        return res.status(400).send({ status: false, message: "Body Empty.!!" });
    }
    const { cartId, productId, removeProduct } = dataToUpdate;
    if (!isValidObjectId(cartId)) {
        return res.status(400).send({ status: false, message: "Invalid UserId" });
    }
    let findCart = await cartModel.findById(cartId);
    if (!findCart) {
        return res.status(400).send({ status: false, message: "No cart..!!" });
    } else {
        if (findCart.userId != userId) {
            return res.status(400).send({ status: false, message: "No cart for user.. Create One!!" });
        }
        const userItems = findCart.items;
        // console.log(userItems,productId);
        for (var i in userItems) {
            // console.log(elements)
            const findProduct = await productModel.findOne({ _id: userItems[i].productId }).select({ price: 1 });
            if (findProduct.isDeleted == true) {
                return res.status(400).send({ status: false, message: "Product Does not exist." })
            }
            if (userItems[i].productId == productId) {
                if (removeProduct == 0) {
                    userItems.splice(i, 1);
                    findCart.totalItems -= 1;
                    findCart.totalPrice -= findProduct.price;
                    findCart.save()
                }
                if (removeProduct == 1) {
                    userItems[i].quantity -= 1;
                    findCart.totalPrice -= findProduct.price;
                    findCart.save();
                }
            }
        }
    }
    res.status(200).send({ status: true, message: "cart Successfully Updated..", data: findCart });
}

const getCart = async function (req, res) {
    let userId = req.params.userId;
    if (!isValidObjectId(userId)) {
        return res.status(400).send({ status: false, message: "Invalid userId" });
    }

    if (req.validateUser != userId) {
        return res.status(401).send({ status: false, message: "not Authorize..!!" })
    }
    let findCart = await cartModel.findOne({ userId: userId });
    if (!findCart) {
        return res.status(400).send({ status: false, message: "No cart" });
    } else {
        res.status(200).send({ status: true, data: findCart });
    }
}

const deleteCart = async function (req, res) {
    let userId = req.params.userId;
    if (!isValidObjectId(userId)) {
        return res.status(400).send({ statsu: false, message: "Invalid UserId" });
    }
    //Authorization
    // if (req.validateUser != userId) {
    //     return res.status(401).send({ status: false, message: "Not Authorize" })
    // }
    let findCart = await cartModel.findOne({ userId: userId });
    if (!findCart) {
        return res.status(400).send({ status: false, message: "No cart" });
    } else {
        if (findCart.isDeleted == true) {
            return res.status(400).send({ status: false, message: "cart Already Deleted" });
        } else {
            const userItems = findCart.items;
            for (var i in userItems) {
                userItems.splice(i);
                findCart.totalItems = 0;
                findCart.totalPrice = 0;
            }
            isDeleted = true;
            findCart.save();
            res.status(200).send({ status: true, message: "data successfully deleted", data: findCart });
        }
    }

}
module.exports = { createCart, updateCart, getCart, deleteCart };