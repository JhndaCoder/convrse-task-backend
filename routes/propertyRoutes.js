const express = require ('express');
const Property = require ('../models/Property');
const {
  authMiddleware,
  adminMiddleware,
} = require ('../middleware/authMiddleware');
const router = express.Router ();

router.get ('/', authMiddleware, async (req, res) => {
  const {location, minPrice, maxPrice, availability, search} = req.query;

  try {
    const query = {};

    if (location) query.location = location;
    if (minPrice) query.price = {...query.price, $gte: minPrice};
    if (maxPrice) query.price = {...query.price, $lte: maxPrice};
    if (availability) query.availability = availability;
    if (search) query.name = {$regex: search, $options: 'i'};

    const properties = await Property.find ();
    res.json (properties);
  } catch (error) {
    console.error ('Error fetching properties:', error);
    res.status (500).json ({error: 'Failed to fetch properties'});
  }
});

router.get ('/:id', authMiddleware, async (req, res) => {
  try {
    const property = await Property.findById (req.params.id);
    if (!property) {
      return res.status (404).json ({error: 'Property not found'});
    }
    res.json (property);
  } catch (error) {
    res.status (500).json ({error: 'Failed to fetch property'});
  }
});

router.post ('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const property = new Property (req.body);
    await property.save ();
    res.status (201).json (property);
  } catch (error) {
    res.status (500).json ({error: 'Failed to create property'});
  }
});

router.put ('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate (
      req.params.id,
      req.body,
      {new: true}
    );
    if (!property) {
      return res.status (404).json ({error: 'Property not found'});
    }
    res.json (property);
  } catch (error) {
    res.status (500).json ({error: 'Failed to update property'});
  }
});

router.delete ('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete (req.params.id);
    if (!property) {
      return res.status (404).json ({error: 'Property not found'});
    }
    res.status (204).send ();
  } catch (error) {
    res.status (500).json ({error: 'Failed to delete property'});
  }
});

module.exports = router;
