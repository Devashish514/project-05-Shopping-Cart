const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    currencyId: {
        type: String
    },
    currencyFormat: {
        type: String
    },
    isFreeShipping: {
        type: Boolean,
        default: false
    },
    productImage: {
        type: String
    },  // s3 link
    style: {
        type: String
    },
    availableSizes: [{type: String,enum: ["S", "XS", "M", "X", "L", "XXL", "XL"]}],
    installments: {
        type: Number
    },
    deletedAt: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("productModel", productSchema);