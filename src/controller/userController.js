const userModel = require("../model/userModel");
const emailValidator = require("email-validator");
const validUrl = require("valid-url");
const bcrypt = require("bcrypt");
const awsConfig = require("../validations/AWS");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");


const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

//<<<<<<<<<<====================================Register API= ================================================>>>>>>>>>>
const registerUser = async function (req, res) {
    try {
        let data = req.body;
        let files = req.files;
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Request Body cannot be Empty...!" })
        } else {
            if (!data.fname) {
                return res.status(400).send({ status: false, message: "fName Required" })
            } else {
                if (typeof data.fname == "string") {
                    const fname = data.fname.split(" ").join("").length;
                    if (fname == 0) {
                        return res.status(400).send({ status: false, message: "Invalid fName" })
                    }
                } else {
                    return res.status(400).send({ status: false, message: "Invalid fName" })
                }
            }
            if (!data.lname) {
                return res.status(400).send({ status: false, message: "lname Required" })
            } else {
                if (typeof data.lname == "string") {
                    const lname = data.lname.split(" ").join("").length
                    if (lname == 0) {
                        return res.status(400).send({ status: false, message: "Invalid lname" })
                    }
                } else {
                    return res.status(400).send({ status: false, message: "Invalid lName" })
                }
            }
            if (data.email) {
                if (!emailValidator.validate(data.email)) {
                    return res.status(400).send({ status: false, message: "Invalid email" })
                }
            } else {
                return res.status(400).send({ status: false, message: "Required Email" })
            }
            if (data.profileImage) {
                if (!validUrl.isUri(data.profileImage)) {
                    return res.status(400).send({ status: false, message: "invalid Link for profile image" })
                }
            }
            if (data.phone) {
                const indianPhone = data.phone;
                const check = Number(indianPhone);
                if (isNaN(check)) {
                    return res.status(400).send({ status: false, message: "Invalid Number" })
                }
                if (data.phone.length == 10) {
                    let firstN = indianPhone[0];
                    let check2 = "12345".split("");
                    const validationForIndianNum = (arr) => {
                        for (var element of arr) {
                            if (firstN == element) return true   // phone is not valid
                        }
                    }
                    if (validationForIndianNum(check2)) {
                        return res.status(400).send({ status: false, message: "invalid Phone No." })
                    }
                } else {
                    return res.status(400).send({ status: false, message: "Invalid phone no." })
                }
            } else {
                return res.status(400).send({ status: false, message: "Required phone" })
            }
            if (data.password) {
                if (typeof data.password == "string") {
                    if (data.password.length < 8 || data.password.length > 15) {
                        return res.status(400).send({ status: false, message: "Invalid Password Length" })
                    }
                } else {
                    return res.status(400).send({ status: false, message: "Invalid Password" })
                }
            } else {
                return res.status(400).send({ status: false, message: "Required Password" })
            }
            if (!data.address) {
                return res.status(404).send({ status: false, message: "address required" });
            } else {
                if (!data.address.shipping.street) {
                    return res.status(404).send({ status: false, message: "Shipping Street required" });
                } else {
                    if (typeof data.address.shipping.street == "string") {
                        const Street = data.address.shipping.street.split(" ").join("").length;
                        if (Street == 0) {
                            return res.status(404).send({ status: false, message: "Mandatory field Cannot be empty" });
                        }
                    } else {
                        return res.status(404).send({ status: false, message: "Invalid street Name" });
                    }
                }
                if (!data.address.shipping.city) {
                    return res.status(404).send({ status: false, message: "Shipping City required" });
                } else {
                    if (typeof data.address.shipping.city == "string") {
                        const city = data.address.shipping.city.split(" ").join("").length;
                        if (city == 0) {
                            return res.status(404).send({ status: false, message: "Mandatory field Cannot be empty" });
                        }
                    } else {
                        return res.status(404).send({ status: false, message: "Invalid city Name" });
                    }
                }
                if (!data.address.shipping.pincode) {
                    return res.status(404).send({ status: false, message: "Shipping Pincode Required" });
                } else {
                    const pincode = Number(data.address.shipping.pincode);
                    if (isNaN(pincode)) {
                        return res.status(404).send({ status: false, message: "Invalid shipping Pincode" });
                    }
                }
                if (!data.address.billing.street) {
                    return res.status(404).send({ status: false, message: "billing Street required" });
                } else {
                    if (typeof data.address.billing.street == "string") {
                        const street = data.address.billing.street.split(" ").join("").length;
                        if (street == 0) {
                            return res.status(404).send({ status: false, message: "Mandatory field Cannot be empty" });
                        }
                    } else {
                        return res.status(404).send({ status: false, message: "Invalid street Name" });
                    }
                }
                if (!data.address.billing.city) {
                    return res.status(404).send({ status: false, message: "biling city required" });
                } else {
                    if (typeof data.address.billing.city == "string") {
                        const city = data.address.billing.city.split(" ").join("").length;
                        if (city == 0) {
                            return res.status(404).send({ status: false, message: "Mandatory field Cannot be empty" });
                        }
                    } else {
                        return res.status(404).send({ status: false, message: "Invalid city Name" });
                    }
                }
                if (!data.address.billing.pincode) {
                    return res.status(404).send({ status: false, message: "billing pincode required" });
                } else {
                    const pincode = Number(data.address.billing.pincode);
                    if (isNaN(pincode)) {
                        return res.status(400).send({ status: false, message: "Invalid Billing Pincode" })
                    }
                }
            }
        }
        const encryptedPassword = await bcrypt.hash(data.password, 10);  // saving password in encrypted form 
        // hashpassword = encryptedPassword;
        const awsProfileImage = await awsConfig.uploadFile(files[0]);
        const resultData = {
            fname: data.fname,
            lname: data.lname,
            email: data.email,
            profileImage: awsProfileImage,
            phone: data.phone,
            password: encryptedPassword,//here 
            address: data.address
        }

        let saveData = await userModel.create(resultData);
        res.status(201).send({ status: true, message: "Data Successfully Created..", data: saveData });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: false, message: err });
    }

}
//<<<<<<<<<<========================================  Login API ==============================================>>>>>>>>>>
const userLogin = async function (req, res) {
    try {
        let { email, password } = req.body;
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Provide user Credentials..!!" });
        }
        if (!email || !password) {
            return res.status(400).send({ status: false, message: "Missing Credentials..!!" });
        }
        else {
            if (!emailValidator.validate(email)) {
                return res.status(400).send({ status: false, message: "Invalid Email Credentials..!!" });
            }
            let findData = await userModel.findOne({ email: email });  // Redis Can be Used Here...
            if (!findData) {
                return res.status(404).send({ status: false, message: "No Account found, Register first" });
            }
            const decryptPassword = await bcrypt.compare(password, findData.password);
            if (!decryptPassword) {
                return res.status(400).send({ status: false, message: "Incorrect Password" });
            }
            else {
                let payload = { userId: findData._id };
                const tokenData = jwt.sign(payload, "secretKey", { expiresIn: "10h" });
                if (tokenData) {
                    res.status(200).send({ status: true, message: "User Successfully LoggedIn", userId: findData._id, token: tokenData });
                }
                else {
                    return res.status(400).send({ status: false, message: "JWT Error" });
                }
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: false, message: err });
    }
}

//<<<<<<<<<<=================================== Get Profile API ==============================================>>>>>>>>>>

const getDetail = async function (req, res) {
    try {
        let userId = req.params.userId;
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid Params" });
        }
        if (userId != req.ValidateUser) {  //Authorize User
            return res.status(401).send({ status: false, message: "not AUthorize" });
        } else {
            let findData = await userModel.findById(userId);
            if (!findData) {
                return res.status(404).send({ status: false, message: "No user Found" });
            } else {
                const finalData = {
                    address: findData.address,
                    _id: findData._id,
                    fname: findData.fname,
                    lname: findData.lname,
                    email: findData.email,
                    profileImage: findData.profileImage,
                    phone: findData.phone,
                    password: findData.password,
                    createdAt: findData.createdAt,
                    updatedAt: findData.updatedAt,
                }
                return res.status(200).send({ status: true, message: "User Profile Details...", data: finalData })
            }
        }

    } catch (err) {
        console.log(err);
        res.status(500).send({ status: false, message: err });
    }
}

//<<<<<<<<<<========================================Update API ===============================================>>>>>>>>>>

const updateUserDetail = async function (req, res) {
    try {
        let userId = req.params.userId;
        let files = req.files;
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid Params" });
        }
        if (userId != req.ValidateUser) {
            return res.status(400).send({ status: false, message: "Not Authorize to Update" });
        }
        let dataToUpdate = req.body;
        if (Object.keys(dataToUpdate).length == 0) {
            return res.status(400).send({ status: false, message: "Provide Data to update" });
        } else {
            const UserData = await userModel.findById(userId);
            if (!UserData) {
                return res.status(404).send({ status: false, message: "No user Found" })
            }
            if (dataToUpdate.fname) {
                if (typeof dataToUpdate.fname != "string") {
                    return res.status(400).send({ status: false, message: "Invalid Name" });
                }
                const ValidatefName = dataToUpdate.fname.split(" ").join("");
                if (ValidatefName.length == 0) {
                    return res.status(400).send({ status: false, message: "Required Name!" });
                } else {
                    UserData.fname = dataToUpdate.fname;
                }
            }
            if (dataToUpdate.lname) {
                if (typeof dataToUpdate.lname != "string") {
                    return res.status(400).send({ status: false, message: "Invalid Name" });
                }
                const ValidatelName = dataToUpdate.lname.split(" ").join("");
                if (ValidatelName.length == 0) {
                    return res.status(400).send({ status: false, message: "Required Name!" });
                } else {
                    UserData.lname = dataToUpdate.lname;
                }
            }
            if (dataToUpdate.email) {
                if (UserData.email == dataToUpdate.email) {
                    return res.status(400).send({ status: false, message: "Email already Exist" });
                }
                const ValidateEmail = emailValidator.validate(dataToUpdate.email);
                if (!ValidateEmail) {
                    return res.statsu(400).send({ status: false, message: "Invalid Email" });
                }
                UserData.email = dataToUpdate.email
            }
            // if (dataToUpdate.profileImage) {
            //     // if (!validUrl.isUri(dataToUpdate.profileImage)) {
            //     //     return res.status(400).send({ status: false, message: "invalid Link for profile image" })
            //     // }
            //     const awsProfileImage = await awsConfig.uploadFile(files[0]);
            //     console.log(awsProfileImage)
            // }
            if (dataToUpdate.phone) {
                const indianPhone = dataToUpdate.phone;
                const check = Number(indianPhone);
                if (isNaN(check)) {
                    return res.status(400).send({ status: false, message: "Invalid Number" })
                }
                if (dataToUpdate.phone.length == 10) {
                    let firstN = indianPhone[0];
                    let check2 = "12345".split("");
                    const validationForIndianNum = (arr) => {
                        for (var element of arr) {
                            if (firstN == element) return true   // phone is not valid
                        }
                    }
                    if (validationForIndianNum(check2)) {
                        return res.status(400).send({ status: false, message: "invalid Phone No." })
                    }
                } else {
                    return res.status(400).send({ status: false, message: "Invalid phone no." })
                }
                UserData.phone = dataToUpdate.phone;
            }
            if (dataToUpdate.password) {
                if (typeof dataToUpdate.password == "string") {
                    if (dataToUpdate.password.length < 8 || dataToUpdate.password.length > 15) {
                        return res.status(400).send({ status: false, message: "Invalid Password Length" })
                    }
                } else {
                    return res.status(400).send({ status: false, message: "Invalid Password" })
                }
                const encryptedPassword = await bcrypt.hash(dataToUpdate.password, 10);
                UserData.password = encryptedPassword;
            }
            if (dataToUpdate.address) {
                if (dataToUpdate.address.shipping) {
                    if (dataToUpdate.address.shipping.street) {
                        if (typeof dataToUpdate.address.shipping.street == "string") {
                            const Street = dataToUpdate.address.shipping.street.split(" ").join("").length;
                            if (Street == 0) {
                                return res.status(404).send({ status: false, message: "Mandatory field Cannot be empty" });
                            }
                        } else {
                            return res.status(404).send({ status: false, message: "Invalid street Name" });
                        }
                        UserData.address.shipping.street = dataToUpdate.address.shipping.street;
                    }
                    if (dataToUpdate.address.shipping.city) {
                        if (typeof dataToUpdate.address.shipping.city == "string") {
                            const city = dataToUpdate.address.shipping.city.split(" ").join("").length;
                            if (city == 0) {
                                return res.status(404).send({ status: false, message: "Mandatory field Cannot be empty" });
                            }
                        } else {
                            return res.status(404).send({ status: false, message: "Invalid city Name" });
                        }
                        UserData.address.shipping.city = dataToUpdate.address.shipping.city;
                    }
                    if (dataToUpdate.address.shipping.pincode) {
                        if (typeof dataToUpdate.address.shipping.pincode != "number") {
                            return res.status(404).send({ status: false, message: "Invalid pincode" });
                        }
                        UserData.address.shipping.pincode = dataToUpdate.address.shipping.pincode;
                    }
                }
                if (dataToUpdate.address.billing) {
                    if (dataToUpdate.address.billing.street) {
                        if (typeof dataToUpdate.address.billing.street == "string") {
                            const Street = dataToUpdate.address.billing.street.split(" ").join("").length;
                            if (Street == 0) {
                                return res.status(404).send({ status: false, message: "Mandatory field Cannot be empty" });
                            }
                        } else {
                            return res.status(404).send({ status: false, message: "Invalid street Name" });
                        }
                        UserData.address.billing.street = dataToUpdate.address.billing.street;
                    }
                    if (dataToUpdate.address.billing.city) {
                        if (typeof dataToUpdate.address.billing.city == "string") {
                            const city = dataToUpdate.address.billing.city.split(" ").join("").length;
                            if (city == 0) {
                                return res.status(404).send({ status: false, message: "Mandatory field Cannot be empty" });
                            }
                        } else {
                            return res.status(404).send({ status: false, message: "Invalid city Name" });
                        }
                        UserData.address.billing.city = dataToUpdate.address.billing.city;
                    }
                    if (dataToUpdate.address.billing.pincode) {
                        if (typeof dataToUpdate.address.billing.pincode != "number") {
                            return res.status(404).send({ status: false, message: "Invalid pincode" });
                        }
                        UserData.address.billing.pincode = dataToUpdate.address.billing.pincode;
                    }

                }
            }
            if(dataToUpdate.profileImage){
            if(files){
                const awsProfileImage = await awsConfig.uploadFile(files[0]);
                UserData.profileImage=awsProfileImage
            }
        }
            // UserData.isUpdated = true
            UserData.save(); 
            res.status(200).send({ status: true, message: "Data Successfully Updated", data: UserData });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: false, message: err });
    }
}

module.exports = { registerUser, userLogin, getDetail, updateUserDetail };



