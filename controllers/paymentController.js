const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User"); 

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// CREATE ORDER
const createOrder = async (req, res) => {
    try {

        const options = {
            amount: 500 * 100,
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order: order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



// VERIFY PAYMENT
const verifyPayment = async (req, res) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;


        const sign = razorpay_order_id + "|" + razorpay_payment_id;


        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");
        
        
        // temporary
        console.log("BODY FROM POSTMAN:", razorpay_order_id, razorpay_payment_id);
        console.log("EXPECTED SIGNATURE:", expectedSign);
        console.log("RECEIVED SIGNATURE:", razorpay_signature);
        console.log("SECRET USED:", process.env.RAZORPAY_KEY_SECRET);


        if (razorpay_signature === expectedSign) {

            // mark user as paid
            await User.findByIdAndUpdate(
                req.user._id,
                { isPaid: true },
                { new: true }
            );

            return res.status(200).json({
                success: true,
                message: "Payment verified and user updated!"
            });

        } else {

            return res.status(400).json({
                success: false,
                message: "Invalid signature"
            });

        }

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


module.exports = {
    createOrder,
    verifyPayment
};
