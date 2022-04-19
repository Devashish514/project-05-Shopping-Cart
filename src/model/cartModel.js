const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const cartSchema = new mongoose.Schema({
    userId: {
        type: objectId,
        ref: "userModel"
    },
    items: [{
        productId: {
            type: objectId,
            ref: "productModel"
        },
        quantity: {
            type: Number
        }
    },{default:"Empty Cart, Add product..!!"}],
    totalPrice: {
        type: Number,
        // comment: "Holds total price of all the items in the cart"
    },
    totalItems: {
        type: Number,
        // comment: "Holds total number of items in the cart"
    }
}, { timestamps: true });

module.exports = mongoose.model("cartModel", cartSchema);