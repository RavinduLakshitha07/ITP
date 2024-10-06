import React from 'react';
import './UpcomingEvents.css';

const UpcomingEvents = () => {
  const events = [
    {
      id: 1,
      name: 'Community Festival',
      date: '2024-10-05',
      time: '10:00 AM - 5:00 PM',
      location: 'City Park',
      description: 'Join us for a day of fun with food, games, and entertainment for all ages!',
    },
    {
      id: 2,
      name: 'Charity Run',
      date: '2024-11-12',
      time: '8:00 AM - 12:00 PM',
      location: 'Downtown',
      description: 'Participate in our charity run to support local causes!',
    },
    {
      id: 3,
      name: 'Outdoor Movie Night',
      date: '2024-12-01',
      time: '6:00 PM - 10:00 PM',
      location: 'Central Square',
      description: 'Enjoy a movie under the stars with family and friends!',
    },
  ];

  return (
    <div className="upcoming-events">
      <h2>Upcoming Events</h2>
      <div className="events-list">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <h3>{event.name}</h3>
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Time:</strong> {event.time}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p>{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
