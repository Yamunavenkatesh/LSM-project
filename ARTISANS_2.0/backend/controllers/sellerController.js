const productModel = require("../models/product");
const sellerModel = require("../models/seller");

// Add Product Controller
const addProductController = async (req, res) => {
    try {
        // Fetch the seller's account details
        const seller = await sellerModel.findOne({ userId: req.body.userId });
        if (!seller) {
            return res.status(404).send({ success: false, message: 'Seller not found' });
        }

        // Create the product with seller account details
        const product = new productModel({ 
            ...req.body, 
            sellerId: req.body.userId,
            sellerAccount: seller.accountDetails // Attach account details
        });

        await product.save();
        res.status(201).send({ success: true, message: 'Created new product', product });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error adding product', error });
    }
}

// Get All Seller Products Controller
const getAllSellerproductsController = async (req, res) => {
    try {
        const products = await productModel.find({ sellerId: req.body.userId });
        res.status(200).send({ success: true, message: `All new products of the seller:${req.body.userId}`, products });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error fetching all products', error });
    }
}

// Delete Product Controller
const deleteProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ _id: req.body.productId });
        if (!product) {
            return res.status(404).send({ success: false, message: 'Product not found' });
        }

        // Ensure that the seller is authorized to delete the product
        if (product.sellerId !== req.body.userId) {
            return res.status(401).send({ success: false, message: 'Not authorized to delete this product' });
        }

        await productModel.findByIdAndDelete({ _id: req.body.productId });
        res.status(200).send({ success: true, message: 'Deleted product' });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error deleting product', error });
    }
}

// Edit Product Controller
const editProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ _id: req.body.productId });
        if (!product) {
            return res.status(404).send({ success: false, message: 'Product not found' });
        }

        // Ensure that the seller is authorized to edit the product
        if (product.sellerId !== req.body.userId) {
            return res.status(401).send({ success: false, message: 'Not authorized to edit this product' });
        }

        // Fetch the seller account details again to make sure it's updated in case of any changes
        const seller = await sellerModel.findOne({ userId: req.body.userId });
        if (!seller) {
            return res.status(404).send({ success: false, message: 'Seller not found' });
        }

        // Update the product and attach seller account details
        await productModel.findByIdAndUpdate(
            { _id: req.body.productId }, 
            { 
                ...req.body.productData,
                sellerAccount: seller.accountDetails // Attach account details
            }
        );

        res.status(200).send({ success: true, message: 'Product updated' });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error updating product', error });
    }
}

module.exports = {
    addProductController,
    getAllSellerproductsController,
    deleteProductController,
    editProductController
}
