import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Calendar from './components/Calendar';
import EventForm from './components/EventForm';
import Login from './components/Login';
import Register from './components/Register';
import NaturalLanguageInput from './components/NaturalLanguageInput';

function App() {
  const [events, setEvents] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      fetchEvents();
    }
  }, [token]);

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3001/events', {
        headers: {
          'x-auth-token': token,
        },
      });
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Handle adding new event
  const handleAddEvent = async (newEvent) => {
    try {
      const response = await fetch('http://localhost:3001/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(newEvent),
      });
      const addedEvent = await response.json();
      setEvents([...events, addedEvent]);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  // Handle user login
  const handleLogin = async (credentials) => {
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
      } else {
        alert(data.msg || 'Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed');
    }
  };

  // Handle user registration
  const handleRegister = async (userData) => {
    try {
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
      } else {
        alert(data.msg || 'Registration failed');
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('Registration failed');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setEvents([]);
  };

  // Handle natural language processing
  const handleProcessNaturalLanguage = async (text) => {
    try {
      const response = await fetch('http://localhost:3001/nlp/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Event created from natural language!');
        fetchEvents(); // Refresh events
      } else {
        alert(data.message || 'Failed to process natural language.');
      }
    } catch (error) {
      console.error('Error processing natural language:', error);
      alert('Failed to process natural language.');
    }
  };

  return (
    <Router>
      <div className="App">
        <h1>Calendar App</h1>
        {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register onRegister={handleRegister} />} />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <>
                  <NaturalLanguageInput onProcessText={handleProcessNaturalLanguage} />
                  <EventForm onAddEvent={handleAddEvent} />
                  <Calendar events={events} />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
