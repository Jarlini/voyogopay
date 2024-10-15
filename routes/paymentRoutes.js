const express = require('express');
const paypal = require('../config/paypalConfig');
const Payment = require('../models/Payment');
const router = express.Router();
 
paypal.configure({
  mode: 'sandbox', // Change to 'live' when you go to production
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

router.post('/create-payment', (req, res) => {
  const { amount, currency, description } = req.body;

  const paymentJson = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: 'http://localhost:3000/api/payments/success',
      cancel_url: 'http://localhost:3000/api/payments/cancel',
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: description,
              sku: '001',
              price: amount,
              currency: currency,
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: currency,
          total: amount,
        },
        description: description,
      },
    ],
  };

  paypal.payment.create(paymentJson, (error, payment) => {
    if (error) {
      console.error('Error creating payment:', error);
      return res.status(500).json({ error: 'Payment creation failed' });
    } else {
      const approvalUrl = payment.links.find(link => link.rel === 'approval_url');
      res.json({ approvalUrl: approvalUrl.href });
    }
  });
});

// Execute Payment Route
router.post('/execute-payment', async (req, res) => {
  const { paymentId, payerId } = req.body;

  const executePaymentJson = {
    payer_id: payerId,
  };

  paypal.payment.execute(paymentId, executePaymentJson, async (error, payment) => {
    if (error) {
      return res.status(500).json({ error: error.response });
    } else {
      try {
        // Save payment details to database
        const newPayment = new Payment({
          userId: req.user._id,
          transactionId: payment.id,
          amount: payment.transactions[0].amount.total,
          currency: payment.transactions[0].amount.currency,
          paymentStatus: payment.state,
        });
        await newPayment.save();

        res.json({ message: 'Payment successful', payment });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  });
});

module.exports = router;
