import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/HomePage'; // Home page (new design)
import Upcoming_Events from './pages/Upcoming_Events'; // Upcoming Events page
import Event_Booking from './pages/Event_Booking'; // Event Booking page
import Reporting_Issues from './pages/Reporting_Issues'; // Reporting Issues page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Homepage */}
        <Route path="/upcoming-events" element={<Upcoming_Events />} /> {/* Upcoming Events */}
        <Route path="/event-booking" element={<Event_Booking />} /> {/* Event Booking */}
        <Route path="/reporting-issues" element={<Reporting_Issues />} /> {/* Reporting Issues */}
      </Routes>
    </Router>
  );
}

export default App;
