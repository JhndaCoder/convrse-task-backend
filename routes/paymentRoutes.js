const express = require ('express');
const stripe = require ('stripe') (process.env.STRIPE_SECRET_KEY);
const router = express.Router ();

router.post ('/create-checkout-session', async (req, res) => {
  const {property} = req.body;

  if (!property || !property.name || !property.price) {
    return res.status (400).json ({error: 'Invalid property data'});
  }

  try {
    const session = await stripe.checkout.sessions.create ({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {name: property.name},
            unit_amount: property.price * 100, // Stripe expects amounts in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json ({url: session.url});
  } catch (error) {
    console.error ('Error creating checkout session:', error);
    res.status (500).json ({error: 'Failed to create checkout session'});
  }
});

module.exports = router;
