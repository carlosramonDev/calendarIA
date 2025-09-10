import React, { useState } from 'react';

const EventForm = ({ onAddEvent }) => {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !start || !end) {
      alert('Please fill in all required fields: Title, Start, End');
      return;
    }
    onAddEvent({ title, start, end, description });
    setTitle('');
    setStart('');
    setEnd('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Event</h3>
      <div>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Start Time:</label>
        <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />
      </div>
      <div>
        <label>End Time:</label>
        <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required />
      </div>
      <div>
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
      </div>
      <button type="submit">Add Event</button>
    </form>
  );
};

export default EventForm;
