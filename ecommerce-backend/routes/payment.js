const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

//Creating Order
router.post('/orders', async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: 'rzp_test_AugzZsQsXxRMWt',
      key_secret: 'DjikgqYHFKMebfgJgqOEoVm8'
    });

    const options = {
      amount: req.body.amount * 100,
      currency: 'INR',
      receipt: crypto.randomBytes(10).toString('hex')
    };
    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something Went Wrong!' });
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error!' });
  }
});

//Verifying the payment
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    console.log(req.body);
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const resultSign = crypto
      .createHmac('sha256', 'DjikgqYHFKMebfgJgqOEoVm8')
      .update(sign.toString())
      .digest('hex');
    console.log(resultSign, ' | ', razorpay_signature);
    if (razorpay_signature == resultSign) {
      return res.status(200).json({ message: 'Payment verified successfully' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error!' });
  }
});

module.exports = router;
