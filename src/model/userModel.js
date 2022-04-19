const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fname: {
        type: String
    },
    lname: {
        type: String
    },
    email: {
        type: String
    },
    profileImage: {
        type: String
    }, // s3 link
    phone: {
        type: String
    },
    password: {
        type:String
    }, // encrypted password
    address: {
        shipping: {
            street: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            pincode: {
                type:Number,
                 reuired:true
             }
        },
        billing: {
            street: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            pincode: {
                type:Number,
                 reuired:true
             }
        }
    }
},{timestamps:true})

module.exports= mongoose.model("userModel",userSchema);