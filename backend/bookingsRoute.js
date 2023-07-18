const authMiddleware = require("../middlewares/authMiddleware");
const bookingsModel = require("../models/bookingsModel");
const busModel = require("../models/busModel");

const stripe = require("stripe")(process.env.stripe_key);
const { v4: uuidv4 } = require("uuid");

const router = require("express").Router();

// book a seat

router.post("/book-seat", authMiddleware, async (req, res) => {
  try {
    const newBooking = new bookingsModel({
      ...req.body,
      transactionId: uuidv4(),
      user: req.body.userId,
    });
    await newBooking.save();

    //bus added to busModel
    const bus = await busModel.findById(req.body.bus);
    bus.seatsBooked = [...bus.seatsBooked, ...req.body.seats];
    await bus.save();

    res.status(200).send({
      message: "Booking successful",
      data: newBooking,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Booking failed",
      data: error,
      success: false,
    });
  }
});

// make-payment

router.post("/make-payment", authMiddleware, async (req, res) => {
  try {
    const { token, amount } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const payment = await stripe.paymentIntents.create(
      {
        amount: amount,
        currency: "inr",
        payment_method: "pm_card_visa",
        customer: customer.id,
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      res.status(200).send({
        message: "Payment successful",
        data: {
          transactionId: payment.id,
        },
        success: true,
      });
    } else {
      console.log(message);
      res.status(500).send({
        message: "Payment Failed",
        data: error,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error,
      data: error,
      success: false,
    });
  }
});

module.exports = router;
