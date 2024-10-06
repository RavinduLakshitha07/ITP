import React, { useEffect, useState } from 'react';

function EventBooking() {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [eventType, setEventType] = useState('');
  const [venue, setVenue] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [description, setDescription] = useState('');
  const [attendees, setAttendees] = useState('');
  const [permits, setPermits] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState(null);

  const eventTypes = ['Conference', 'Workshop', 'Seminar', 'Charity', 'Other'];
  const venues = ['Hall A', 'Hall B', 'Outdoor Area', 'Auditorium', 'Other'];

  const formatDate = (date) => date.toISOString().split('T')[0];

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDate(tomorrow);
  };

  const getMaxDate = () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 60);
    return formatDate(futureDate);
  };

  const validateField = (name, value) => {
    const alphanumericPattern = /^[a-zA-Z0-9\s]*$/;
    const specialCharsPattern = /^[a-zA-Z0-9\s.,]*$/;
    const phonePattern = /^07[0-9]{8}$/;
    const emailPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;

    switch (name) {
      case 'eventName':
        if (!alphanumericPattern.test(value)) {
          return 'Event name can only contain letters and numbers.';
        }
        break;
      case 'organizerName':
        if (!alphanumericPattern.test(value)) {
          return 'Organizer name can only contain letters and numbers.';
        }
        break;
      case 'description':
        if (!specialCharsPattern.test(value)) {
          return 'Description can only contain letters, numbers, commas, and periods.';
        }
        break;
      case 'permits':
        if (value && !specialCharsPattern.test(value)) { 
          return 'Permits can only contain letters, numbers, commas, and periods.';
        }
        break;
      case 'specialRequests':
        if (value && !specialCharsPattern.test(value)) {
          return 'Special requests can only contain letters, numbers, commas, and periods.';
        }
        break;
      case 'contactPhone':
        const phoneDigitsOnlyPattern = /^07\d{8}$/;
        if (!phoneDigitsOnlyPattern.test(value)) {
          return 'Please enter a valid phone number starting with "07" and containing exactly 10 digits (e.g., 0788888888).';
        }
        break;
      case 'contactEmail':
        const validEmail = value.replace(/[^a-zA-Z0-9@.]/g, '');
        if (value.length > 100) {
          return 'Email must not exceed 100 characters.';
        }
        if (!emailPattern.test(value)) {
          return 'Please enter a valid email address (e.g., user@example.com).';
        }
        break;
        case 'attendees':
          const attendeesCount = parseInt(value, 10);
          // Set the minimum to 1 and maximum to 1000
          if (isNaN(attendeesCount) || attendeesCount < 1 || attendeesCount > 1000) {
            return 'Number of attendees must be a number between 1 and 1000.';
          }
          break;
        
        break;
      default:
        break;
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'eventName':
        setEventName(value);
        break;
      case 'eventDate':
        setEventDate(value);
        break;
      case 'startTime':
        setStartTime(value);
        break;
      case 'endTime':
        setEndTime(value);
        break;
      case 'eventType':
        setEventType(value);
        break;
      case 'venue':
        setVenue(value);
        break;
      case 'organizerName':
        setOrganizerName(value);
        break;
      case 'contactEmail':
        setContactEmail(value);
        break;
      case 'contactPhone':
        setContactPhone(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'attendees':
        setAttendees(value);
        break;
      case 'permits':
        setPermits(value);
        break;
      case 'specialRequests':
        setSpecialRequests(value);
        break;
      case 'searchQuery':
        setSearchQuery(value);
        break;
      default:
        break;
    }

    const error = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handlePhoneInput = (e) => {
    const inputValue = e.target.value.replace(/\D/g, ''); // Only digits allowed
    if (inputValue.length <= 10 && inputValue.startsWith('07')) {
      setContactPhone(inputValue);
    } else if (inputValue.length < 2 && inputValue.startsWith('0')) {
      setContactPhone(inputValue);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phonePattern = /^07[0-9]{8}$/;
    if (!phonePattern.test(contactPhone)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        contactPhone: 'Please enter a valid phone number starting with 07 and containing exactly 10 digits (e.g., 0788888888).'
      }));
      return;
    }

    const formErrors = {};
    Object.keys({ eventName, organizerName, contactPhone, contactEmail, description, attendees }).forEach((field) => {
      const error = validateField(field, eval(field));
      if (error) formErrors[field] = error;
    });

    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    const bookingData = {
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

    try {
      let response;
      if (isEditing) {
        response = await fetch(`http://localhost:5000/api/booking/${editingBookingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        });
      } else {
        response = await fetch('http://localhost:5000/api/booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      const data = await response.json();
      if (isEditing) {
        setBookings(bookings.map((booking) => (booking._id === data._id ? data : booking)));
        setIsEditing(false);
        setEditingBookingId(null);
      } else {
        setBookings([...bookings, data]);
      }

      resetForm();
    } catch (err) {
      console.error('Error:', err);
      setErrors({ form: 'Failed to submit the booking. Please try again later.' });
    }
  };

  const handleEdit = (booking) => {
    setEventName(booking.eventName);
    setEventDate(booking.eventDate);
    setStartTime(booking.startTime);
    setEndTime(booking.endTime);
    setEventType(booking.eventType);
    setVenue(booking.venue);
    setOrganizerName(booking.organizerName);
    setContactEmail(booking.contactEmail);
    setContactPhone(booking.contactPhone);
    setDescription(booking.description);
    setAttendees(booking.attendees);
    setPermits(booking.permits);
    setSpecialRequests(booking.specialRequests);
    
    setEditingBookingId(booking._id);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await fetch(`http://localhost:5000/api/booking/${id}`, { method: 'DELETE' });
        setBookings(bookings.filter((booking) => booking._id !== id));
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete booking. Please try again later.');
      }
    }
  };

  const resetForm = () => {
    setEventName('');
    setEventDate('');
    setStartTime('');
    setEndTime('');
    setEventType('');
    setVenue('');
    setOrganizerName('');
    setContactEmail('');
    setContactPhone('');
    setDescription('');
    setAttendees('');
    setPermits('');
    setSpecialRequests('');
    setErrors({});
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return; // Check if window was opened successfully

    const bookingRows = bookings.map((booking) => `
      <tr>
        <td>${booking.eventName}</td>
        <td>${booking.eventDate}</td>
        <td>${booking.startTime}</td>
        <td>${booking.endTime}</td>
        <td>${booking.eventType}</td>
        <td>${booking.venue}</td>
        <td>${booking.organizerName}</td>
        <td>${booking.contactEmail}</td>
        <td>${booking.contactPhone}</td>
        <td>${booking.description}</td>
        <td>${booking.attendees}</td>
        <td>${booking.permits}</td>
        <td>${booking.specialRequests}</td>
      </tr>
    `).join('');

    const content = `
      <html>
  <head>
    <title>Event Booking Details</title>
    <style>
      body { 
        font-family: Arial, sans-serif; 
        text-align: center; /* This centers the headings and any other block content */
      }
      table { 
        border-collapse: collapse; 
        width: 100%; 
        margin-top: 20px; /* Adds space between headings and table */
      }
      th, td { 
        border: 1px solid #dddddd; 
        text-align: left; 
        padding: 8px; 
      }
      th { 
        background-color: green; 
        color: white; 
      }
    </style>
  </head>
  <body>
    <h1>Panadura Municipal Council</h1>
    <h2>Event Booking Details</h2>
    <table>
      <thead>
        <tr>
          <th>Event Name</th>
          <th>Event Date</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Event Type</th>
          <th>Venue</th>
          <th>Organizer Name</th>
          <th>Contact Email</th>
          <th>Contact Phone</th>
          <th>Description</th>
          <th>Attendees</th>
          <th>Permits</th>
          <th>Special Requests</th>
        </tr>
      </thead>
      <tbody>
        ${bookingRows}
      </tbody>
    </table>
  </body>
</html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/booking');
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <h1>Event Booking Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Event Name:</label>
          <input type="text" name="eventName" value={eventName} onChange={handleInputChange} required />
          {errors.eventName && <span>{errors.eventName}</span>}
        </div>
        <div>
          <label>Event Date:</label>
          <input type="date" name="eventDate" min={getMinDate()} max={getMaxDate()} value={eventDate} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Start Time:</label>
          <input type="time" name="startTime" value={startTime} onChange={handleInputChange} required />
        </div>
        <div>
          <label>End Time:</label>
          <input type="time" name="endTime" value={endTime} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Event Type:</label>
          <select name="eventType" value={eventType} onChange={handleInputChange} required>
            <option value="">Select</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Venue:</label>
          <select name="venue" value={venue} onChange={handleInputChange} required>
            <option value="">Select</option>
            {venues.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Organizer Name:</label>
          <input type="text" name="organizerName" value={organizerName} onChange={handleInputChange} required />
          {errors.organizerName && <span>{errors.organizerName}</span>}
        </div>
        <div>
          <label>Contact Email:</label>
          <input type="email" name="contactEmail" value={contactEmail} onChange={handleInputChange} required />
          {errors.contactEmail && <span>{errors.contactEmail}</span>}
        </div>
        <div>
          <label>Contact Phone:</label>
          <input type="text" name="contactPhone" value={contactPhone} onChange={handlePhoneInput} required />
          {errors.contactPhone && <span>{errors.contactPhone}</span>}
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={description} onChange={handleInputChange}></textarea>
          {errors.description && <span>{errors.description}</span>}
        </div>
        <div>
          <label>Number of Attendees:</label>
          <input type="number" name="attendees" value={attendees} onChange={handleInputChange} required />
          {errors.attendees && <span>{errors.attendees}</span>}
        </div>
        <div>
          <label>Permits:</label>
          <textarea name="permits" value={permits} onChange={handleInputChange}></textarea>
          {errors.permits && <span>{errors.permits}</span>}
        </div>
        <div>
          <label>Special Requests:</label>
          <textarea name="specialRequests" value={specialRequests} onChange={handleInputChange}></textarea>
          {errors.specialRequests && <span>{errors.specialRequests}</span>}
        </div>
        <button type="submit" className="btn-small">{isEditing ? 'Update Booking' : 'Submit Booking'}</button>
<button type="button" className="btn-small" onClick={resetForm}>Reset</button>
<button type="button" className="btn-small" onClick={handlePrint}>Print Bookings</button>


      </form>

      <h2>Booking List</h2>
      <input
        type="text"
        name="searchQuery"
        placeholder="Search bookings..."
        value={searchQuery}
        onChange={handleInputChange}
      />
      <ul>
        {bookings.filter((booking) => booking.eventName.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((booking) => (
            <li key={booking._id}>
              {booking.eventName} - {booking.eventDate}
              <button onClick={() => handleEdit(booking)}>Edit</button>
              <button onClick={() => handleDelete(booking._id)}>Delete</button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default EventBooking;
