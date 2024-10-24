const mongoose = require ('mongoose');

const propertySchema = new mongoose.Schema ({
  name: String,
  price: Number,
  location: String,
  amenities: [String],
  image: String,
  vrImage: String,
  available: {type: Boolean, default: true},
});

module.exports = mongoose.model ('Property', propertySchema);
