import React, { useState, useEffect } from 'react';
import './App.css';
import Calendar from './components/Calendar';
import EventForm from './components/EventForm';

function App() {
  const [events, setEvents] = useState([]);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3001/events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  // Handle adding new event
  const handleAddEvent = async (newEvent) => {
    try {
      const response = await fetch('http://localhost:3001/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });
      const addedEvent = await response.json();
      setEvents([...events, addedEvent]);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <div className="App">
      <h1>Calendar App</h1>
      <EventForm onAddEvent={handleAddEvent} />
      <Calendar events={events} />
    </div>
  );
}

export default App;
