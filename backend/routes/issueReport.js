const express = require('express');
const router = express.Router();
const IssueReport = require('../models/IssueReport');

// Create an issue report
router.post('/', async (req, res) => {
  try {
    const newReport = new IssueReport(req.body);
    const savedReport = await newReport.save();
    res.status(200).json(savedReport);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all issue reports
router.get('/', async (req, res) => {
  try {
    const reports = await IssueReport.find();
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a specific issue report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await IssueReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json('Report not found');
    }
    res.status(200).json(report);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Search for submitted issues
router.get('/search', async (req, res) => {
  const { query } = req.query; // Expecting a query parameter named "query"
  try {
    const reports = await IssueReport.find({
      $or: [
        { issueDescription: { $regex: query, $options: 'i' } }, // Search by issue description
        { contactEmail: { $regex: query, $options: 'i' } },   // Search by contact email
        { contactPhone: { $regex: query, $options: 'i' } }     // Search by contact phone
      ]
    });
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update an issue report
router.patch('/:id', async (req, res) => {
  try {
    const updatedReport = await IssueReport.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedReport);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete an issue report
router.delete('/:id', async (req, res) => {
  try {
    await IssueReport.findByIdAndDelete(req.params.id);
    res.status(200).json('Report deleted');
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
