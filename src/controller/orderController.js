const orderModel = require("../model/orderModel");
const productModel = require("../model/productModel")
const mongoose = require("mongoose")


const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const createOrder = async function (req, res) {
    let userID = req.params.userID;
    if (!isValidObjectId(userID)) {
        return res.status(400).send({ status: false, message: "Invalid UserID..!!" });
    }
    // if (req.validateUser != userID) {
    //     return res.status(400).send({ status: false, message: "Not Authorize" });
    // }
    let data = req.body;
    if (Object.keys(data).length == 0) {
        return res.status(400).send({ status: false, message: "Body Empty.!!" });
    }
    const { userId, productId, quantity } = data;
    if (!userId) {
        return res.status(400).send({ status: false, message: "Required UserId" });
    }
    let findUserinOrder = await orderModel.findOne({ userId: userID });
    if (findUserinOrder) {
        return res.status(400).send({ status: false, message: "order already created..!!(update)" })
    }
    data.items = []
    data.totalPrice = 0
    let totalQuantity = 0
    if (productId && quantity) {
        const products = productId.split(",");
        const quant = quantity.split(",");
        const calcTotalQuantity = (arr) => {
            for (var index in arr) {
                if (arr[index] == 0) {
                    res.status(400).send({ status: false, message: "quantity cannot be 0." })
                }
                let ele = Number(arr[index]);
                totalQuantity = totalQuantity + ele;
            }
        }
        calcTotalQuantity(quant);
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
        if (products.length == quant.length) {
            for (let i = 0; i < products.length; i++) {
                if (!isValidObjectId(products[i])) {
                    return res.status(400).send({ status: false, message: "Invalid ProductId input..!!" });
                }
                if (isNaN(Number(quant[i]))) {
                    return res.status(400).send({ status: false, message: "Invalid Quantity Input..!!" });
                }
                const findProduct = await productModel.findById(products[i]).select({ price: 1, _id: 0 });
                data.totalPrice = data.totalPrice + (findProduct.price * quant[i]);
                data.items.push({ productId: products[i], quantity: quant[i] });
            }
            data.totalPrice = Math.floor(data.totalPrice);
            data.totalItems = data.items.length;
            data.totalQuantity = totalQuantity;
            let createData = await orderModel.create(data);
            res.send({ status: false, message: "Order Successfully Created..", data: createData });
        } else {
            return res.status(400).send({ status: false, message: "Missing Input" });
        }
    } else {
        return res.status(400).send({ status: false, message: "Required Field Missing..!!" })
    }
}

const updateOrder = async function (req, res) {
    let userId = req.params.userId;
    // if (req.validateUser != userId) {
    //     return res.status(401).send({ status: false, message: "Not Authorize..!!" });
    // }
    if (!isValidObjectId(userId)) {
        return res.status(400).send({ status: false, message: "invalid userId..!!" });
    }
    let datatToUpdate = req.body;
    if (Object.keys(datatToUpdate).length == 0) {
        return res.status(400).send({ status: false, message: "Body Empty..!!" });
    }
    let findUser = await orderModel.findOne({ userId: userId });
    console.log(findUser)
    if (!findUser) {
        return res.status(400).send({ status: false, message: "No Order for User" });
    } else {
        if (datatToUpdate.orderId) {
            if (!isValidObjectId(datatToUpdate.orderId)) {
                return res.status(400).send({ status: false, message: "invalid orderId..!!" });
            }
            // let findOrder= await orderModel.findById(orderId);
            if (findUser._id != datatToUpdate.orderId) {
                return res.status(401).send({ status: false, message: "not authorize" })
            } else {
                if (datatToUpdate.status) {
                    if (datatToUpdate.status == "cancelled") {
                        if (findUser.cancellable == true) {
                            findUser.status = datatToUpdate.status;
                        } else {
                            return res.status(400).send({ status: false, message: "order is not cancellable..!!" });
                        }
                    } else {
                        if (datatToUpdate.status == "completed" || datatToUpdate.status == "pending") {
                            findUser.status = datatToUpdate.status;
                        }
                    }
                }
                else {
                    return res.status(400).send({ status: false, message: "Invalid Input..!!" });
                }
            }
        }
    }
    findUser.save();
    res.status(201).send({ status: true, message: "order Successfully updated..", data: findUser });

}
module.exports = { createOrder, updateOrder };