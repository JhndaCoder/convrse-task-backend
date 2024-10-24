const express = require ('express');
const dotenv = require ('dotenv');
dotenv.config ();
const errorHandler = require ('./middleware/errorHandler');

const connectDB = require ('./config/db');
const authRoutes = require ('./routes/authRoutes');
const propertyRoutes = require ('./routes/propertyRoutes');
const paymentRoutes = require ('./routes/paymentRoutes');
const cors = require ('cors');
const helmet = require ('helmet');
const rateLimit = require ('express-rate-limit');

const app = express ();
connectDB ();

app.use (helmet ());
app.use (cors ());
const limiter = rateLimit ({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use (limiter);
app.use (express.json ());

app.use ('/api/auth', authRoutes);
app.use ('/api/properties', propertyRoutes);
app.use ('/api/payments', paymentRoutes);

app.use (errorHandler);

const PORT = process.env.PORT || 5000;
app.listen (PORT, () => console.log (`Server running on port ${PORT}`));
