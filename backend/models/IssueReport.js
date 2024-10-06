const mongoose = require('mongoose');

const IssueReportSchema = new mongoose.Schema({
  issueDescription: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  dateReported: { type: Date, default: Date.now },
  status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open' }, // Added status field
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },    // Added priority field
});

module.exports = mongoose.model('IssueReport', IssueReportSchema);
