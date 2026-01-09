import razorpay from "razorpay";

// global variables 
const currency = "inr"

const razorpayInstance = new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID
})
const placeOrderRazorpay = async (req , res) => {
       key_id
}