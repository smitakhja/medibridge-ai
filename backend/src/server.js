const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const healthRoutes = require('./routes/health');
const reportsRoutes = require('./routes/reports');
const doctorsRoutes = require('./routes/doctors');
const appointmentsRoutes = require('./routes/appointments');
const facilitiesRoutes = require('./routes/facilities');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/facilities', facilitiesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok', message: 'MediBridge AI API is running', timestamp: new Date() });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🏥 MediBridge AI Server running on port ${PORT}`);
});

module.exports = app;
