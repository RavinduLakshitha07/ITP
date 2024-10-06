const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const bookingRoutes = require('./routes/booking'); // Assume you've separated your route handling here
const issueReportRoutes = require('./routes/issueReport'); // Assume you've separated your route handling here

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Default to port 5000 if not set in .env

// Middleware
app.use(cors());
app.use(express.json()); // Use express.json() instead of bodyParser.json()
app.use(bodyParser.json()); // This is optional because express.json() does the same thing

// Routes
app.use('/api/booking', bookingRoutes); // Separate route file for booking
app.use('/api/issue-reports', issueReportRoutes); // Separate route file for issue reports

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eventbooking', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Temporary in-memory storage for bookings (this can be removed when MongoDB is used)
let bookings = [];

// Route to handle booking submission (if MongoDB isn't implemented yet)
app.post('/api/booking', (req, res) => {
  const {
    eventName,
    eventDate,
    startTime,
    endTime,
    eventType,
    venue,
    organizerName,
    contactEmail,
    contactPhone,
    description,
    attendees,
    permits,
    specialRequests,
  } = req.body;

  // Simple validation
  if (!eventName || !eventDate || !startTime || !endTime || !eventType || !venue || !organizerName || !contactEmail || !contactPhone || !attendees) {
    return res.status(400).json({ message: 'All required fields must be filled.' });
  }

  // Create a new booking object
  const newBooking = {
    id: bookings.length + 1, // In a real app, you'd use a database with unique IDs
    eventName,
    eventDate,
    startTime,
    endTime,
    eventType,
    venue,
    organizerName,
    contactEmail,
    contactPhone,
    description,
    attendees,
    permits,
    specialRequests,
  };

  // Add the booking to the in-memory array
  bookings.push(newBooking);

  // Send the new booking back to the client
  res.status(201).json(newBooking);
});

// Route to delete a booking by ID
app.delete('/api/booking/:id', (req, res) => {
  const bookingId = parseInt(req.params.id, 10);
  bookings = bookings.filter((booking) => booking.id !== bookingId);

  res.status(200).json({ message: 'Booking deleted successfully' });
});

// Route to get all bookings
app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

// Basic route to check server status
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
