import React, { useState, useEffect } from 'react';
import './ReportingIssues.css';

const ReportingIssues = () => {
  const [issueDescription, setIssueDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredReports, setFilteredReports] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null); // Track which report is being edited

  // Fetch all reports
  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/issue-reports');
      const data = await response.json();
      setReports(data);
      setFilteredReports(data); // Initialize filtered reports
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Handle search functionality
  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredReports(reports); // Reset to all reports if search is empty
      return;
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = reports.filter(report =>
      report.issueDescription.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredReports(filtered);
  };

  // Handle description input with validation
  const handleDescriptionInput = (e) => {
    const value = e.target.value;
    const validDescription = value.replace(/[^a-zA-Z0-9\s]/g, ''); // Removes special characters
    setIssueDescription(validDescription);
  };

  // Handle phone input with specific pattern validation
  const handlePhoneInput = (e) => {
    const inputValue = e.target.value.replace(/\D/g, ''); // Only digits allowed
    if (inputValue.length <= 10 && inputValue.startsWith('07')) {
      setContactPhone(inputValue);
    } else if (inputValue.length < 2 && inputValue.startsWith('0')) {
      setContactPhone(inputValue);
    }
  };

  // Handle email input with validation for valid characters and length
  const handleEmailInput = (e) => {
    const value = e.target.value;
    const validEmail = value.replace(/[^a-zA-Z0-9@.]/g, ''); // Allow only specific characters
    if (validEmail.length > 100) {
      setEmailError('Email must be 100 characters or less.');
    } else {
      setEmailError('');
      setContactEmail(validEmail);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const phonePattern = /^07[0-9]{8}$/;
    if (!phonePattern.test(contactPhone)) {
      setError('Please enter a valid phone number starting with 07 and containing exactly 10 digits (e.g., 0788888888).');
      return;
    }

    if (emailError || contactEmail.length === 0) {
      setError('Please enter a valid email.');
      return;
    }

    const issueData = {
      issueDescription,
      contactEmail,
      contactPhone,
    };

    try {
      const response = await fetch('http://localhost:5000/api/issue-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(issueData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the issue report.');
      }

      const data = await response.json();
      setReports((prevReports) => [...prevReports, data]);
      setFilteredReports((prevReports) => [...prevReports, data]); // Update filtered reports as well
      setError('');
      setIssueDescription('');
      setContactEmail('');
      setContactPhone('');
      setEditingIndex(null); // Reset editing index after submission
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to submit the report. Please try again later.');
    }
  };

  // Handle edit action for a report
  const handleEdit = (index) => {
    const reportToEdit = filteredReports[index];
    setIssueDescription(reportToEdit.issueDescription);
    setContactEmail(reportToEdit.contactEmail);
    setContactPhone(reportToEdit.contactPhone);
    setEditingIndex(index); // Set the index of the report being edited
  };

  // Handle update action
  const handleUpdate = async (e) => {
    e.preventDefault();
    const phonePattern = /^07[0-9]{8}$/;
    if (!phonePattern.test(contactPhone)) {
      setError('Please enter a valid phone number starting with 07 and containing exactly 10 digits (e.g., 0788888888).');
      return;
    }

    if (emailError || contactEmail.length === 0) {
      setError('Please enter a valid email.');
      return;
    }

    const updatedIssueData = {
      issueDescription,
      contactEmail,
      contactPhone,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/issue-reports/${filteredReports[editingIndex]._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedIssueData),
      });

      if (!response.ok) {
        throw new Error('Failed to update the issue report.');
      }

      const updatedReport = await response.json();

      const updatedReports = reports.map((report, index) => {
        if (index === editingIndex) {
          return updatedReport;
        }
        return report;
      });

      setReports(updatedReports);
      setFilteredReports(updatedReports); // Update filtered reports as well
      setError('');
      setIssueDescription('');
      setContactEmail('');
      setContactPhone('');
      setEditingIndex(null); // Reset editing index after updating
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to update the report. Please try again later.');
    }
  };

  // Handle delete action for a report
  const handleDelete = async (index, reportId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/issue-reports/${reportId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete the issue report.');
      }

      // Update reports state after deletion
      const updatedReports = filteredReports.filter((_, i) => i !== index);
      setReports(updatedReports);
      setFilteredReports(updatedReports); // Update filtered reports as well
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to delete the report. Please try again later.');
    }
  };

  // Print function
  const handlePrint = () => {
    const printContent = document.getElementById('printable-content').innerHTML;
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
      <html>
  <head>
    <title>Print Report</title>
    <style>
      body { 
        font-family: Arial, sans-serif; 
        text-align: center; 
      }
      table { 
        width: 100%; 
        border-collapse: collapse; 
        margin-top: 20px; 
      }
      th, td { 
        padding: 8px; 
        text-align: left; 
        border: 1px solid #ddd; 
      }
      th { 
        background-color: green; 
        color: white; 
      }
    </style>
  </head>
  <body>
    <h1>Panadura Municipal Council</h1>
    <h2>Issue Report</h2>
    <table>
      <tr>
        <th>Issue Description</th>
        <th>Contact Email</th>
        <th>Contact Phone</th>
      </tr>
      ${printContent}
    </table>
  </body>
</html>
    `);
    newWindow.document.close();
    newWindow.print();
  };

  return (
    <div className="reporting-issues">
      <h2>Reporting Issues</h2>
      {error && <p className="error">{error}</p>}

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for issues..."
      />
      <button style={{ padding: '10px 20px', margin: '5px', fontSize: '16px', borderRadius: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }} onClick={handleSearch}>Search</button>

      <form onSubmit={editingIndex !== null ? handleUpdate : handleSubmit}>
        <textarea
          value={issueDescription}
          onChange={handleDescriptionInput}
          placeholder="Issue Description"
          required
        />
        <input
          type="email"
          value={contactEmail}
          onChange={handleEmailInput}
          placeholder="Contact Email"
          required
        />
        {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
        <input
          type="text"
          value={contactPhone}
          onChange={handlePhoneInput}
          placeholder="Contact Phone"
          required
        />
        <button style={{ padding: '10px 20px', margin: '5px', fontSize: '16px', borderRadius: '5px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }} type="submit">{editingIndex !== null ? 'Update' : 'Submit Booking'}</button>
        <button style={{ padding: '10px 20px', margin: '5px', fontSize: '16px', borderRadius: '5px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }} type="reset">Reset</button>
      </form>

      <button style={{ padding: '10px 20px', margin: '5px', fontSize: '16px', borderRadius: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }} onClick={handlePrint}>Print Booking</button>

      <table id="printable-content">
        <thead>
          <tr>
            <th>Issue Description</th>
            <th>Contact Email</th>
            <th>Contact Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((report, index) => (
            <tr key={report._id}>
              <td>{report.issueDescription}</td>
              <td>{report.contactEmail}</td>
              <td>{report.contactPhone}</td>
              <td>
                <button style={{ padding: '10px 20px', marginRight: '5px', fontSize: '16px', borderRadius: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }} onClick={() => handleEdit(index)}>Edit</button>
                <button style={{ padding: '10px 20px', marginRight: '5px', fontSize: '16px', borderRadius: '5px', backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }} onClick={() => handleDelete(index, report._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportingIssues;
