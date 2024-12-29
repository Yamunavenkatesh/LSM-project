const express = require('express');
const router = express.Router();
const {
    addProductToCartController,
    removeProductFromCartController,
    updateProductQuantityController,
    viewCartController
} = require('../controllers/cartController');

router.post("/add-to-cart", addProductToCartController);
router.post("/remove-from-cart", removeProductFromCartController);
router.post("/update-quantity", updateProductQuantityController);
router.post("/view-cart", viewCartController);

module.exports = router;
