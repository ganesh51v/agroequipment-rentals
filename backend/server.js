const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import database connection and initialization
const { connectMySQL, createDatabase } = require('./config/mysql');
const connectDB = require('./config/db');
const initDatabase = require('./config/initDatabase');

// Initialize express app
const app = express();

// Create database, connect, and initialize tables
(async () => {
  await createDatabase();
  await connectMySQL();
  await initDatabase();
  await connectDB(); // Connect to MongoDB
})();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..')));

// Serve images folder
app.use('/images', express.static(path.join(__dirname, '../images')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/admin', require('./routes/admin'));

// Add providers route
app.use('/api/providers', require('./routes/providers'));

// Catch-all route to serve booking-fixed.html for unknown routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile('booking-fixed.html', { root: path.join(__dirname, '..') });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app;
