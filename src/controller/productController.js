const productModel = require("../model/productModel");
const awsConfig = require("../validations/AWS");
const mongoose = require("mongoose");
const moment = require("moment")

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const createProduct = async function (req, res) {
    try {
        let data = req.body;
        let files = req.files;
        if (Object.keys(data).length == 0) {
            return res.status(404).send({ status: false, message: "Require Data to Create..!!" });
        } else {
            if (data.title) {
                if (typeof data.title != "string") {
                    return res.status(400).send({ status: false, message: "Invalid title..!!" });
                }
                let find = await productModel.findOne({ title: data.title });
                if (find) {
                    return res.status(400).send({ status: false, message: "product exist with same title..!!" });
                }
                const title = data.title.split(" ").join("");
                if (title.length == 0) {
                    return res.status(403).send({ status: false, message: "Cannot be Empty--> Title !!" });
                }
            } else {
                return res.status(400).send({ status: false, message: "Require  title !!" });
            }
            if (data.description) {
                if (typeof data.description != "string") {
                    return res.status(400).send({ status: false, message: "Invalid description..!!" });
                } else {
                    const description = data.description.split(" ").join("");
                    if (description.length == 0) {
                        return res.status(400).send({ status: false, message: "Cannot be Empty--> description..!!" });
                    }
                }
            } else {
                return res.status(400).send({ status: false, message: "Required description..!!" });
            }
            if (data.price) {
                const price = Number(data.price);
                if (isNaN(price)) {
                    return res.status(400).send({ status: false, message: "Invalid price...!!" });
                } else {
                    if (price < 1) {
                        return res.status(400).send({ status: false, message: "price cannot be 0 or -ve!!" });
                    }
                }
            } else {
                return res.status(400).send({ status: false, message: "require price !!" });
            }
            if (data.currencyId) {
                if (typeof data.currencyId != "string") {
                    return res.status(400).send({ status: false, message: "Invalid currencyId..!!" });
                } else {
                    const currencyId = data.currencyId.split(" ").join("");
                    if (currencyId.length == 0) {
                        return res.status(400).send({ status: false, message: "cannot be empty-->'currencyId'..!!" });
                    } else {
                        if (currencyId != "INR") {
                            return res.status(400).send({ status: false, message: "Invalid currencyId(use--> INR)..!!" });
                        }
                    }
                }
            } else {
                return res.status(400).send({ status: false, message: "require currencyId..!!" });
            }
            if (data.currencyFormat) {
                if (typeof data.currencyFormat != "string") {
                    return res.status(400).send({ status: false, message: "Invalid currencyFormat..!!" });
                } else {
                    const currencyFormat = data.currencyFormat.split(" ").join("");
                    if (currencyFormat.length == 0) {
                        return res.status(400).send({ status: false, message: "cannot be empty--'currencyFormat'.!!" });
                    } else {
                        if (currencyFormat != "₹") {
                            return res.status(400).send({ status: false, message: "Invalid Currency format !!" });
                        }
                    }
                }
            } else {
                return res.status(400).send({ status: false, message: "require-->'currencyFormat'.!!" });
            }
            if (!data.availableSizes) {
                return res.status(400).send({ status: false, message: "please provide Available Size...!!" });
            } else {
                const availableSizes = data.availableSizes.split(",");
                data.availableSizes = availableSizes;
            }
        }
        if (files) {
            const awsProfileImage = await awsConfig.uploadFile(files[0]);
            data.productImage = awsProfileImage;
        } else {
            return res.status(400).send({ status: false, message: "ProductImage is Required..!!" });
        }
        let createData = await productModel.create(data);
        res.status(201).send({ status: true, message: "Data Successfully created", data: createData });
    } catch (err) {
        console.log(err);
        res.status(500).sned({ status: false, message: err });
    }
}

const getProduct = async function (req, res) {
    try {
        let filters = req.query;
        let condiions = { isDeleted: false };
        if (filters) {
            if (filters.size) {
                const size = filters.size.toUpperCase();
                // let arr = ["S", "XS", "L", "M", "XXL", "XL"]
                // const checkSize = arr.find(element => element == size);
                // if (!checkSize) {
                //     return res.status(400).send({ status: false, message: "Invalid Size input..!!" });
                // }
                let findSize = filters.size.toUpperCase().split(",");
                let findData = await productModel.find({ condiions, availableSizes: findSize });
                if (findData.length == 0) {
                    return res.status(404).send({ status: false, Message: "No Product Found!!" });
                } else {
                    return res.status(200).send({ status: true, data: findData });
                }
            }
            if (filters.name) {
                if (typeof filters.name != "string") {
                    return res.status(400).send({ status: false, message: "Invalid name input..!!" });
                } else {
                    let name = filters.name.split(" ").join("");
                    if (name.length == 0) {
                        return res.status(400).send({ status: false, message: "Invalid name input..!!" });
                    }
                }
                let findData3 = await productModel.find({ condiions, title: filters.name });
                return res.status(200).send({ status: true, data: findData3 });
            }
            if (filters.priceGreaterThan) {
                let findData = await productModel.find({ condiions, price: { $gte: `${filters.priceGreaterThan}` } });
                if (findData.length == 0) {
                    return res.status(404).send({ status: false, Message: "No Product Found!!" });
                } else {
                    return res.status(200).send({ status: true, data: findData });
                }
            }
            if (filters.priceLessThan) {
                let findData2 = await productModel.find({ condiions, price: { $lte: `${filters.priceLessThan}` } });
                if (findData2.length == 0) {
                    return res.status(404).send({ status: false, Message: "No Product Found!!" });
                } else {
                    return res.status(200).send({ status: true, data: findData2 });
                }
            }
        }
        let result = await productModel.find({ condiions });
        result.sort(function (a, b) {
            const priceA = a.price
            const priceB = b.price
            if (priceA < priceB) {
                return -1;
            }
            if (priceA > priceB) {
                return 1;
            }
            return 0;
        });
        console.log(condiions)
        res.status(200).send({ status: true, message: "Successfull Request", data: result });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: false, message: err });
    }
}

const getProductById = async function (req, res) {
    try {
        let productId = req.params.productId;
        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "Invalid ProductId.!!" });
        }
        let getData = await productModel.find({ _id: productId });
        if (getData.length == 0) {
            return res.status(400).send({ status: false, message: "No product found..!!" });
        }
        res.status(200).send({ status: true, data: getData });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: false, message: err });
    }
}

const updateProduct = async function (req, res) {
    try {
        // let dataToUpdate = req.body;
        const { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage, style, availableSizes, installments } = req.body;
        let productId = req.params.productId;
        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "Invalid ProductId..!!" });
        }
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "require Body to Update..!!" });
        } else {
            let productData = await productModel.findById(productId);
            if (!productData) {
                return res.status(400).send({ status: false, message: "No product with Id..!!" });
            }
            if (productData.isDeleted == true) {
                return res.status(400).send({ status: false, message: "Product No longer Available.!!" });
            }
            if (title) {
                if (typeof title != "string") {
                    return res.status(400).send({ status: false, message: "Invalid title type..!!" });
                } else {
                    const checkTitle = title.split(" ").join("");
                    if (checkTitle.length == 0) {
                        return res.status(400).send({ status: false, message: "cannot be Empty-->'title'..!!" });
                    } else {
                        if (productData.title == title) {
                            return res.status(400).send({ status: false, message: "product with the same title exist..!!" });
                        }
                    }
                }
                productData.title = title;
            }
            if (description) {
                if (typeof description != "string") {
                    return res.status(400).send({ status: false, message: "Invalid description type..!!" });
                } else {
                    const checkdescription = description.split(" ").join("");
                    if (checkdescription.length == 0) {
                        return res.status(400).send({ status: false, message: "cannot be Empty-->'description'..!!" });
                    }
                }
                productData.description = description;
            }
            if (price) {
                const convertPrice = Number(price);
                if (isNaN(convertPrice)) {
                    return res.status(400).sned({ status: false, message: "iNVALID price..!!" });
                } else {
                    if (convertPrice < 1) {
                        return res.status(400).sned({ status: false, message: "iNVALID price..!!" });
                    }
                }
                productData.price = price;
            }
            if (currencyId) {
                return res.status(400).send({ status: false, message: "Cannot Change currencyId..!" });
            }
            if (currencyFormat) {
                return res.status(400).send({ status: false, message: "Cannot Change currencyFormat..!" });
            }
            if (isFreeShipping) {
                if (isFreeShipping == "true" || isFreeShipping == "false") {
                    productData.isFreeShipping = isFreeShipping;
                } else {
                    return res.status(400).send({ status: false, message: "Invalid value for FreeShipping key..!!" });
                }
            }
            if (productImage) {
                if (files) {
                    const awsProductImage = await awsConfig.uploadFile(files[0]);
                    productData.productImage = awsProductImage;
                }
            }
            if (style) {
                if (typeof style != "string") {
                    return res.status(400).send({ status: false, message: "Invalid Style value" });
                } else {
                    productData.style = style
                }
            }
            if (availableSizes) {
                if (typeof availableSizes == "string") {
                    productData.availableSizes.push(availableSizes);
                }
            }
            if (installments) {
                const check = Number(installments);
                if (isNaN(check)) {
                    return res.status(400).send({ status: false, message: "Invalid Installment Input...!!" });
                }
                productData.installments = installments;
            }
            productData.save();
            res.status(200).send({ status: true, message: "Product successfully Updated..", data: productData });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: false, message: err });
    }
}

const deleteProduct = async function (req, res) {
    try {
        let productId = req.params.productId;
        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "Invalid ProductId..!!" });
        }
        let findProduct = await productModel.findById(productId);
        if (!findProduct) {
            return res.status(400).send({ status: false, message: "No dOCUMNETS with ProductId..!!" });
        } else {
            if (findProduct.isDeleted == true) {
                return res.status(400).send({ status: false, message: "Product Already Deleted..!!" });
            } else {
                findProduct.isDeleted = true;
                findProduct.deletedAt = moment().format("DD-MM-YYYY");
                findProduct.save();
                res.status(200).send({ status: true, message: "Product Successfully Deleted...", data: findProduct });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: false, message: err });
    }
}
module.exports = { createProduct, getProduct, getProductById, updateProduct, deleteProduct };