import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // For the CSS styles

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero">
        <h1>WELCOME TO PANADURA MUNICIPLE COUNCIL</h1>
        <p>Efficient management of public spaces and events for a smarter city.</p>
        <Link to="/event-booking" className="cta-button">Book an Event Now</Link>
      </header>
      <section className="features">
        <div className="feature-item">
          <h2>Upcoming Events</h2>
          <p>Stay updated on all the events happening in the city.</p>
          <Link to="/upcoming-events" className="link-button">View Events</Link>
        </div>
        <div className="feature-item">
          <h2>Book an Event</h2>
          <p>Host your own event by booking public spaces easily.</p>
          <Link to="/event-booking" className="link-button">Book an Event</Link>
        </div>
        <div className="feature-item">
          <h2>Report Issues</h2>
          <p>Help us keep the city running smoothly by reporting any issues.</p>
          <Link to="/reporting-issues" className="link-button">Report an Issue</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
