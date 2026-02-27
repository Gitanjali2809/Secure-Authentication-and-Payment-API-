const crypto = require("crypto");

// Secret key used to generate signature
// In real project, this should come from .env file (process.env.RAZORPAY_KEY_SECRET)
const secret = "demo_secret_key";

// Order ID received from Razorpay when creating order
const order_id = "order_demo123";

// Payment ID received from Razorpay after successful payment
const payment_id = "pay_demo123";

// Generate signature using HMAC SHA256
// Razorpay uses this same logic to create razorpay_signature
const signature = crypto
  .createHmac("sha256", secret) // create HMAC object with secret key
  .update(order_id + "|" + payment_id) // combine order_id and payment_id
  .digest("hex"); // convert to hex format

// Print generated signature (used to compare with razorpay_signature)
console.log(signature);

// In backend, this generated signature is compared with razorpay_signature
// If both match -> payment is verified
// If not match -> payment is invalid