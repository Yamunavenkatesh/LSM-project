const sellerModel = require('../models/seller');
const userModel = require('../models/user');

// Get all sellers
const getAllSellersController = async (req, res) => {
    try {
        const sellers = await sellerModel.find({});
        res.status(200).send({ success: true, message: "Sellers data", data: sellers });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error fetching sellers data", error });
    }
}

// Get all users
const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.status(200).send({ success: true, message: "Users data", data: users });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error fetching users data", error });
    }
}

// Create a new seller
const createSellerController = async (req, res) => {
    try {
        const sellerData = req.body;
        const newSeller = new sellerModel(sellerData);
        await newSeller.save();
        res.status(201).send({ success: true, message: "Seller created", data: newSeller });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error creating seller", error });
    }
}

// Create a new user
const createUserController = async (req, res) => {
    try {
        const userData = req.body;
        const newUser = new userModel(userData);
        await newUser.save();
        res.status(201).send({ success: true, message: "User created", data: newUser });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error creating user", error });
    }
}

// Update seller details
const updateSellerController = async (req, res) => {
    try {
        const { sellerId, sellerData } = req.body;
        const updatedSeller = await sellerModel.findByIdAndUpdate(sellerId, sellerData, { new: true });
        if (!updatedSeller) {
            return res.status(404).send({ success: false, message: "Seller not found" });
        }
        res.status(200).send({ success: true, message: "Seller updated", data: updatedSeller });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error updating seller", error });
    }
}

// Update user details
const updateUserController = async (req, res) => {
    try {
        const { userId, userData } = req.body;
        const updatedUser = await userModel.findByIdAndUpdate(userId, userData, { new: true });
        if (!updatedUser) {
            return res.status(404).send({ success: false, message: "User not found" });
        }
        res.status(200).send({ success: true, message: "User updated", data: updatedUser });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error updating user", error });
    }
}

// Delete seller
const deleteSellerController = async (req, res) => {
    try {
        const { sellerId } = req.body;
        const deletedSeller = await sellerModel.findByIdAndDelete(sellerId);
        if (!deletedSeller) {
            return res.status(404).send({ success: false, message: "Seller not found" });
        }
        res.status(200).send({ success: true, message: "Seller deleted", data: deletedSeller });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error deleting seller", error });
    }
}

// Delete user
const deleteUserController = async (req, res) => {
    try {
        const { userId } = req.body;
        const deletedUser = await userModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).send({ success: false, message: "User not found" });
        }
        res.status(200).send({ success: true, message: "User deleted", data: deletedUser });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error deleting user", error });
    }
}

// Change account status (approve/reject seller account)
const changeAccountStatusController = async (req, res) => {
    try {
        const { sellerId, status } = req.body;
        const seller = await sellerModel.findByIdAndUpdate(sellerId, { status }, { new: true });
        if (!seller) {
            return res.status(404).send({ success: false, message: "Seller not found" });
        }

        const user = await userModel.findOne({ _id: seller.userId });
        const notification = user.notification || [];
        notification.push({
            type: `seller account request ${status === 'approved' ? 'approved' : 'rejected'}`,
            message: `Your seller account request has been ${status}`,
            onClickPath: '/notification'
        });

        user.role = status === 'approved' ? 'seller' : 'user';
        user.notification = notification;
        await user.save();

        res.status(201).send({ success: true, message: "Account status updated", data: seller });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error changing account status", error });
    }
}

module.exports = {
    getAllSellersController,
    getAllUsersController,
    createSellerController,
    createUserController,
    updateSellerController,
    updateUserController,
    deleteSellerController,
    deleteUserController,
    changeAccountStatusController
};
