const express = require("express");
const router = express.Router();
const {
    getAllSellersController,
    getAllUsersController,
    createSellerController,
    createUserController,
    updateSellerController,
    updateUserController,
    deleteSellerController,
    deleteUserController,
    changeAccountStatusController
} = require("../controllers/adminController");

const verifyAdmin = require("../middlewares/adminMiddleware");

// Admin routes for managing sellers and users
router.get('/get-all-sellers', verifyAdmin, getAllSellersController);
router.get('/get-all-users', verifyAdmin, getAllUsersController);

// Admin routes to create new sellers and users
router.post('/create-seller', verifyAdmin, createSellerController);
router.post('/create-user', verifyAdmin, createUserController);

// Admin routes to update sellers and users
router.put('/update-seller', verifyAdmin, updateSellerController);
router.put('/update-user', verifyAdmin, updateUserController);

// Admin routes to delete sellers and users
router.delete('/delete-seller', verifyAdmin, deleteSellerController);
router.delete('/delete-user', verifyAdmin, deleteUserController);

// Admin route to change account status (approve/reject seller)
router.post('/change-account-status', verifyAdmin, changeAccountStatusController);

module.exports = router;
