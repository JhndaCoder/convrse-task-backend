const express = require ('express');
const dotenv = require ('dotenv');
dotenv.config ();

const connectDB = require ('./config/db');
const authRoutes = require ('./routes/authRoutes');
const propertyRoutes = require ('./routes/propertyRoutes');
const paymentRoutes = require ('./routes/paymentRoutes');
const cors = require ('cors');

const app = express ();
connectDB ();

app.use (cors ());
app.use (express.json ());

app.use ('/api/auth', authRoutes);
app.use ('/api/properties', propertyRoutes);
app.use ('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen (PORT, () => console.log (`Server running on port ${PORT}`));
