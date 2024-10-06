const express = require('express');
const PDFDocument = require('pdfkit');  // Import pdfkit for PDF generation
const Booking = require('../models/Booking');  // Ensure the model is correctly imported

const router = express.Router();

// Route to handle booking submission (POST)
router.post('/', async (req, res) => {
  console.log("Booking submission received:", req.body); // Log the received data

  // Basic validation (optional, could be enhanced)
  if (!req.body.eventName || !req.body.eventDate || !req.body.attendees) {
    return res.status(400).json({ message: 'Event Name, Date, and Attendees are required.' });
  }

  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error creating booking:", error); // Log the error
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});

// Route to get all bookings (GET)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: error.message });
  }
});

// Route to delete a booking by ID (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const bookingId = req.params.id;
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: error.message });
  }
});

// Route to update a booking by ID (PUT)
router.put('/:id', async (req, res) => {
  try {
    const bookingId = req.params.id;

    // Use $set to only update the fields that are provided in req.body
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { $set: req.body },  // This ensures only the provided fields are updated
      { new: true }  // Return the updated document
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: error.message });
  }
});

// Route to generate a PDF booking report by ID (GET)
router.get('/print/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const doc = new PDFDocument();
    let filename = `Booking_Report_${booking._id}.pdf`;
    filename = encodeURIComponent(filename);

    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.text(`Booking Report`, { align: 'center' });
    doc.text(`\n`);
    doc.text(`Event Name: ${booking.eventName}`);
    doc.text(`Event Date: ${booking.eventDate}`);
    doc.text(`Number of Attendees: ${booking.attendees}`);
    // Add any other fields from the booking model you want to include in the PDF

    doc.end();
    doc.pipe(res);  // Send the PDF to the client
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
