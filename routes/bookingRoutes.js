const express = require ('express');
const Booking = require ('../models/Booking');
const Property = require ('../models/Property');
const {authMiddleware} = require ('../middleware/authMiddleware');
const router = express.Router ();
const stripe = require ('stripe') (process.env.STRIPE_SECRET_KEY);

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
    if (req.user.role !== 'admin') {
      return res.status (403).json ({error: 'Access denied'});
    }

    const bookings = await Booking.find ()
      .populate ('property')
      .populate ('user');
    res.json (bookings);
  } catch (error) {
    res.status (500).json ({error: 'Failed to fetch bookings'});
  }
});

router.put ('/:id', authMiddleware, async (req, res) => {
  const {status} = req.body;

  try {
    const booking = await Booking.findByIdAndUpdate (
      req.params.id,
      {status},
      {new: true}
    );

    if (!booking) return res.status (404).json ({error: 'Booking not found'});
    res.json (booking);
  } catch (error) {
    res.status (500).json ({error: 'Failed to update booking'});
  }
});

router.delete ('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status (403).json ({error: 'Access denied'});
    }

    const booking = await Booking.findByIdAndDelete (req.params.id);
    if (!booking) return res.status (404).json ({error: 'Booking not found'});

    res.status (204).send ();
  } catch (error) {
    res.status (500).json ({error: 'Failed to delete booking'});
  }
});

router.post ('/pay', authMiddleware, async (req, res) => {
  const {propertyId, bookingDate, paymentMethodId} = req.body;

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

    const paymentIntent = await stripe.paymentIntents.create ({
      amount: property.price * 100,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
    });

    const booking = new Booking ({
      property: propertyId,
      user: req.user._id,
      bookingDate,
      status: 'confirmed',
    });

    await booking.save ();
    res.status (201).json ({
      message: 'Booking confirmed!',
      bookingId: booking._id,
      property: {
        name: property.name,
        price: property.price,
        location: property.location,
      },
      bookingDate,
      paymentStatus: paymentIntent.status,
    });
  } catch (error) {
    console.error ('Payment or Booking error:', error);
    res.status (500).json ({error: 'Failed to process booking'});
  }
});

module.exports = router;
