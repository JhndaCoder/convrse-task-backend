const express = require ('express');
const Booking = require ('../models/Booking');
const Property = require ('../models/Property');
const {
  authMiddleware,
  adminMiddleware,
} = require ('../middleware/authMiddleware');
const router = express.Router ();
const stripe = require ('stripe') (process.env.STRIPE_SECRET_KEY);

const handleServerError = (res, message, error) => {
  console.error (message, error);
  res.status (500).json ({error: message});
};
const User = require ('../models/User');

router.post ('/', authMiddleware, async (req, res) => {
  const {propertyId, bookingDate} = req.body;

  try {
    const property = await Property.findById (propertyId);
    if (!property) return res.status (404).json ({error: 'Property not found'});

    const existingBooking = await Booking.findOne ({
      property: propertyId,
      bookingDate,
    });
    if (existingBooking) {
      return res
        .status (400)
        .json ({error: 'This property is already booked for this date'});
    }

    const booking = new Booking ({
      property: propertyId,
      user: req.user._id,
      bookingDate,
      status: 'pending',
    });

    await booking.save ();
    res.status (201).json (booking);
  } catch (error) {
    console.error ('Booking creation error:', error);
    res.status (500).json ({error: 'Failed to create booking'});
  }
});

router.get ('/', authMiddleware, async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'admin') {
      bookings = await Booking.find ().populate ('property').populate ('user');
    } else {
      bookings = await Booking.find ({user: req.user._id}).populate (
        'property'
      );
    }

    res.json (bookings);
  } catch (error) {
    handleServerError (res, 'Failed to fetch bookings.', error);
  }
});

router.put ('/update-status/:id', authMiddleware, async (req, res) => {
  const {status, userEmail} = req.body;

  try {
    const booking = await Booking.findById (req.params.id);
    if (!booking) {
      console.error ('Booking not found for ID:', req.params.id);
      return res.status (404).json ({error: 'Booking not found.'});
    }

    if (userEmail) {
      const user = await User.findOne ({email: userEmail});
      if (!user) {
        console.error ('User not found for email:', userEmail);
        return res.status (404).json ({error: 'User not found.'});
      }
      booking.user = user._id;
    }

    booking.status = status;
    await booking.save ();

    res.json ({message: 'Booking updated successfully.', booking});
  } catch (error) {
    console.error ('Error updating booking:', error);
    res.status (500).json ({error: 'Failed to update booking.'});
  }
});

router.delete ('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete (req.params.id);
    if (!booking) return res.status (404).json ({error: 'Booking not found'});

    res.status (204).send ();
  } catch (error) {
    res.status (500).json ({error: 'Failed to delete booking'});
  }
});

router.post ('/pay', authMiddleware, async (req, res) => {
  const {bookingId} = req.body;

  try {
    const booking = await Booking.findById (bookingId).populate ('property');
    if (!booking) return res.status (404).json ({error: 'Booking not found'});

    if (booking.paymentIntentId) {
      const existingIntent = await stripe.paymentIntents.retrieve (
        booking.paymentIntentId
      );
      if (existingIntent.status !== 'canceled') {
        return res.json ({
          clientSecret: existingIntent.client_secret,
          paymentIntentId: existingIntent.id,
        });
      }
    }
    const paymentIntent = await stripe.paymentIntents.create ({
      amount: booking.property.price * 100, // Amount in cents
      currency: 'usd',
      automatic_payment_methods: {enabled: true},
      metadata: {bookingId: booking._id.toString ()},
    });

    booking.paymentIntentId = paymentIntent.id;
    await booking.save ();

    res.status (201).json ({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    handleServerError (res, 'Failed to create payment intent.', error);
  }
});

router.get (
  '/payment-status/:paymentIntentId',
  authMiddleware,
  async (req, res) => {
    const {paymentIntentId} = req.params;

    try {
      const paymentIntent = await stripe.paymentIntents.retrieve (
        paymentIntentId
      );

      if (!paymentIntent) {
        return res.status (404).json ({error: 'Payment intent not found.'});
      }

      res.status (200).json ({status: paymentIntent.status});
    } catch (error) {
      console.error ('Error retrieving payment status:', error);
      res.status (500).json ({error: 'Failed to retrieve payment status.'});
    }
  }
);

router.put ('/update-status/:id', authMiddleware, async (req, res) => {
  const {status} = req.body;

  try {
    const booking = await Booking.findByIdAndUpdate (
      req.params.id,
      {status},
      {new: true}
    );

    if (!booking) return res.status (404).json ({error: 'Booking not found.'});
    res.json ({message: 'Booking status updated.', booking});
  } catch (error) {
    console.error ('Error updating booking status:', error);
    res.status (500).json ({error: 'Failed to update booking status.'});
  }
});

module.exports = router;
