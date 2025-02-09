const userModel = require("../models/user");
const { hashPassword, comparePassword, generateToken } = require("../helpers/userHelper");
const dotenv = require("dotenv");
const verificationTokenModel = require("../models/verificationToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const sellerModel = require("../models/seller");
dotenv.config();
const productModel = require("../models/product");
const Razorpay = require("razorpay");

const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (name.length < 3 || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || password.length < 3) {
            return res.status(400).send({ success: false, message: 'Some fields are invalid' });
        }
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(200).send({ success: false, message: 'This email is already registered' });
        }


        const hashedPassword = await hashPassword(password);
        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const verificationToken = await new verificationTokenModel({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `http://localhost:3000/user/${user.id}/verify/${verificationToken.token}`;
        await sendEmail(user.email, "Verify Email", url);

        res.status(201).send({ success: true, message: "An email is sent to ypur account.please verify", user });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || password.length < 3) {
            return res.status(400).send({ success: false, message: 'email or password is invalid' })
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({ success: false, message: 'Invalid username or password' });
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({ success: false, message: 'Invalid username or password' });
        }
        if (!user.isVerified) {
            let verificationToken = await verificationTokenModel.findOne({ userId: user._id });
            if (!verificationToken) {
                const verificationToken = await new verificationTokenModel({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex"),
                }).save();
                const url = `http://localhost:3000/user/${user.id}/verify/${verificationToken.token}`;
                await sendEmail(user.email, "Verify Email", url);
            }

            return res.status(400).send({ success: false, message: "Verify your email" });
        }


        const token = await generateToken(user._id);
        res.status(201).send({ success: true, message: 'User logined', token })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
}

const verifyEmailController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.params.userId });
        if (!user) {
            console.log("error in user")
            return res.status(400).send({ success: false, message: "Invalid link" });
        }
        const verificationToken = await verificationTokenModel.findOne({
            userId: user._id,
            token: req.params.verificationToken,
        });
        if (!verificationToken) {
            console.log("error in token")
            return res.status(400).send({ success: false, message: "Invalid link" });
        }

        await userModel.updateOne({ _id: user._id }, { $set: { isVerified: true } });
        await verificationTokenModel.deleteOne({ userId: user._id });

        res.status(200).send({ success: true, message: "Email verified successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
}


const getUserInfoController = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId);
        user.password = undefined;
        res.status(200).send({ success: true, user: user });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Internal server erorr" })
    }
}

const sendResetPasswordLinkController = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).send({ success: false, message: "Email not found" });
        }

        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).send({ success: false, message: "invalid Email" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({ success: false, message: "No user found with this Email" });
        }

        let verificationToken = await verificationTokenModel.findOne({ userId: user._id });
        if (!verificationToken) {
            verificationToken = await new verificationTokenModel({ userId: user._id, token: crypto.randomBytes(32).toString("hex") }).save();
        }

        const url = `http://localhost:3000/user/reset-password/${user._id}/${verificationToken.token}`;
        await sendEmail(user.email, "Reset Password", url);
        res.status(200).send({ success: true, message: "Password reset link sent to your email account" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error in sending reset password link", error })
    }
}

const verifyResetPasswordLinkController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.params.userId });
        if (!user) {
            console.log("error in user");
            return res.status(400).send({ success: false, message: "invalid Email" });
        }

        const verificationToken = await verificationTokenModel.findOne({ userId: user._id });
        if (!verificationToken) {
            console.log("error in user");
            return res.status(400).send({ success: false, message: "Invalid link" });
        }
        res.status(200).send({ success: true, message: "valid link" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error in verifying reset password link", error })
    }
}

const resetPasswordController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.params.userId });
        if (!user) {
            return res.status(400).send({ success: false, message: "invalid Email" });
        }
        const verificationToken = await verificationTokenModel.findOne({
            userId: user._id,
            token: req.params.verificationToken,
        });
        if (!verificationToken) {
            return res.status(400).send({ success: false, message: "Invalid link" });
        }

        if (!user.isVerified) {
            user.isVerified = true;
        }
        user.password = await hashPassword(req.body.password);
        await user.save();
        await verificationTokenModel.deleteOne({ userId: user._id });

        res.status(200).send({ success: true, message: "Password reset successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error in resetting password", error })
    }
}

const applyForSellerController = async (req, res) => {
    try {
        // Create a new seller application
        const newSeller = new sellerModel({ ...req.body, status: 'pending' });
        await newSeller.save();

        // Find the admin user
        const admin = await userModel.findOne({ role: "admin" });

        // Check if admin exists
        if (!admin) {
            return res.status(404).send({ success: false, message: "Admin not found" });
        }

        // Ensure the admin notification array exists, initialize it if not
        const notification = admin.notification || [];

        // Push the new notification for the admin
        notification.push({
            type: 'apply for seller',
            message: `${newSeller.firstName} ${newSeller.lastName} has applied for a seller account`,
            data: {
                sellerId: newSeller._id,
                name: `${newSeller.firstName} ${newSeller.lastName}`,
                onClickPath: `/admin/sellers`
            }
        });

        // Update the admin with the new notification
        await userModel.findByIdAndUpdate(admin._id, { notification });

        // Respond with a success message
        res.status(201).send({ success: true, message: 'Seller account applied successfully' });
    } catch (error) {
        // Log and respond with error
        console.log(error);
        res.status(500).send({ success: false, message: "Error applying for seller", error });
    }
};


const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        res.status(200).send({ success: true, message: "All requests", data: { notification: user.notification, seenNotification: user.seenNotification } });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error fetching notifications", error });
    }
}

const markAllReadController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        const notification = user.notification;
        const seenNotfication = user.seenNotification;
        seenNotfication.push(...notification);
        user.notification = [];
        user.seenNotification = seenNotfication;
        await user.save();
        res.status(201).send({ success: true, message: "Marked all notifications as read" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error marking all notifications read", error });
    }
}

const deleteAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        user.notification = [];
        user.seenNotification = [];
        await user.save();
        res.status(201).send({ success: true, message: "Deleted all notifications" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error deleting all notifications", error });
    }
}

const getAllproductsController = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.status(200).send({ success: true, message: 'All products are fetched', products });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error fetching all products', error });
    }
}


const getAProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ _id: req.params.productId });
        const seller = await sellerModel.findOne({ userId: product.sellerId });
        res.status(200).send({ success: true, message: 'product is fetched', product, seller });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error fetching the product', error });
    }
}
const checkoutController = async (req, res) => {
    try {
        req.body.userId = undefined;
        const razorpay = new Razorpay({
            key_id: "YourRazorID",
            key_secret: "YourRazorSecret"
        });

        const options = req.body;
        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).send('Error creating order');  // Early return with error message if order creation fails
        }

        return res.status(200).send(order);  // Only send a single response
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Error in checkout" });  // Only use res.send() after setting the status
    }
};



const validateOrderController = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // The secret key used to validate the signature (replace it with your actual Razorpay secret key)
        const secretKey = "YourRazorSecret";

        // Generate the HMAC SHA256 signature using Razorpay's provided order ID and payment ID
        const sha = crypto.createHmac("sha256", secretKey);
        sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generatedSignature = sha.digest("hex");

        // Compare the generated signature with the received one
        if (generatedSignature !== razorpay_signature) {
            return res.status(400).send({ message: "Transaction is not legitimate" });
        }

        // If the signature matches, proceed with your order confirmation or processing
        // You can update the order status in the database here, if necessary.

        // Respond with a success message and the payment details
        res.status(200).send({
            message: "Payment validation successful",
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id
        });
    } catch (error) {
        console.error("Error during payment validation:", error);
        // Return a proper error message with status 500
        res.status(500).send({ message: "Error during payment validation" });
    }
};


module.exports = {
    registerController,
    loginController,
    getUserInfoController,
    verifyEmailController,
    sendResetPasswordLinkController,
    verifyResetPasswordLinkController,
    resetPasswordController,
    applyForSellerController,
    getAllNotificationController,
    markAllReadController,
    deleteAllNotificationController,
    getAllproductsController,
    getAProductController,
    checkoutController,
    validateOrderController
}