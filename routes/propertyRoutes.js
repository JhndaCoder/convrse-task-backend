const express = require ('express');
const Property = require ('../models/Property');
const authMiddleware = require ('../middleware/authMiddleware');
const router = express.Router ();

router.get ('/', async (req, res) => {
  const properties = await Property.find ();
  res.json (properties);
});

router.get ('/:id', async (req, res) => {
  const property = await Property.findById (req.params.id);
  res.json (property);
});

router.post ('/', authMiddleware, async (req, res) => {
  const property = new Property (req.body);
  await property.save ();
  res.status (201).json (property);
});

router.put ('/:id', authMiddleware, async (req, res) => {
  const property = await Property.findByIdAndUpdate (req.params.id, req.body, {
    new: true,
  });
  res.json (property);
});

router.delete ('/:id', authMiddleware, async (req, res) => {
  await Property.findByIdAndDelete (req.params.id);
  res.status (204).send ();
});

module.exports = router;
