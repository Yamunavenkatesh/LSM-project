const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    firstName: {
        type: String,
        required: [true, "firstName is required"]
    },
    lastName: {
        type: String,
        required: [true, "last name is required"]
    },
    phone: {
        type: String,
        required: [true, "phone is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"]
    },
    website: {
        type: String,
        required: [true, "website is required"]
    },
    address: {
        type: String,
        required: [true, "address is required"]
    },
    status: {
        type: String,
        default: 'pending'
    },
    // Account details
    accountDetails: {
        accountName: {
            type: String,
            required: [true, "account name is required"]
        },
        bankName: {
            type: String,
            required: [true, "bank name is required"]
        },
        ifsc: {
            type: String,
            required: [true, "IFSC code is required"]
        },
        accountNumber: {
            type: String,
            required: [true, "account number is required"]
        }
    }
}, { timestamps: true });

const sellerModel = mongoose.model('seller', sellerSchema);
module.exports = sellerModel;
