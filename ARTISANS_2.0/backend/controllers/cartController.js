const Cart = require('../models/cart');
const productModel = require('../models/product');

const addProductToCartController = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Check if product exists
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).send({ success: false, message: 'Product not found' });
        }

        // Find the user's cart
        let cart = await Cart.findOne({ userId });
        
        if (!cart) {
            // If no cart exists for the user, create a new one
            cart = new Cart({
                userId,
                products: [{ productId, quantity }],
                totalAmount: product.price * quantity
            });
            await cart.save();
        } else {
            // If cart exists, check if the product is already in the cart
            const existingProduct = cart.products.find(item => item.productId.toString() === productId);
            if (existingProduct) {
                // Update the quantity if product already exists in the cart
                existingProduct.quantity += quantity;
            } else {
                // Add the product to the cart
                cart.products.push({ productId, quantity });
            }

            // Update total amount
            cart.totalAmount += product.price * quantity;

            await cart.save();
        }

        res.status(200).send({ success: true, message: 'Product added to cart', cart });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error adding product to cart', error });
    }
};

const removeProductFromCartController = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Find the user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).send({ success: false, message: 'Cart not found' });
        }

        // Find the product in the cart and remove it
        const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).send({ success: false, message: 'Product not found in cart' });
        }

        // Remove the product and adjust total amount
        const product = await productModel.findById(productId);
        const productPrice = product.price;
        const productQuantity = cart.products[productIndex].quantity;
        
        // Update total amount
        cart.totalAmount -= productPrice * productQuantity;

        // Remove the product
        cart.products.splice(productIndex, 1);

        await cart.save();

        res.status(200).send({ success: true, message: 'Product removed from cart', cart });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error removing product from cart', error });
    }
};

const updateProductQuantityController = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).send({ success: false, message: 'Quantity must be greater than 0' });
        }

        // Find the user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).send({ success: false, message: 'Cart not found' });
        }

        // Find the product in the cart
        const existingProduct = cart.products.find(item => item.productId.toString() === productId);
        if (!existingProduct) {
            return res.status(404).send({ success: false, message: 'Product not found in cart' });
        }

        // Find the product details
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).send({ success: false, message: 'Product not found' });
        }

        // Update the total amount by subtracting the old quantity and adding the new one
        const oldQuantity = existingProduct.quantity;
        cart.totalAmount -= product.price * oldQuantity;
        existingProduct.quantity = quantity;
        cart.totalAmount += product.price * quantity;

        await cart.save();

        res.status(200).send({ success: true, message: 'Product quantity updated', cart });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error updating product quantity', error });
    }
};

const viewCartController = async (req, res) => {
    try {
        const { userId } = req.body;

        // Find the user's cart
        const cart = await Cart.findOne({ userId }).populate('products.productId');
        if (!cart) {
            return res.status(404).send({ success: false, message: 'Cart not found' });
        }

        res.status(200).send({ success: true, message: 'Cart fetched successfully', cart });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error fetching cart', error });
    }
};

module.exports = {
    addProductToCartController,
    removeProductFromCartController,
    updateProductQuantityController,
    viewCartController
};
