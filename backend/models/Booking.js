const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  eventType: { type: String },
  venue: { type: String },
  organizerName: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  description: { type: String },
  attendees: { type: Number, required: true },
  permits: { type: String },
  specialRequests: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
