const express = require('express');
const router = express.Router();
const chrono = require('chrono-node');
const { createEvent } = require('../models/Event');

// This would ideally interact with the database
let events = []; // Using a mock array for now

router.post('/parse', (req, res) => {
  const { text } = req.body;
  const parsed = chrono.parse(text);

  if (parsed && parsed.length > 0) {
    const result = parsed[0];
    const startDate = result.start.date();
    const endDate = result.end ? result.end.date() : startDate; // If no end date, use start date

    // Extract title - very basic, can be improved with more advanced NLP
    const title = text.replace(result.text, '').trim();

    const newEvent = createEvent(title || 'New Event', startDate, endDate, text);
    newEvent.id = events.length + 1; // Simple ID generation
    events.push(newEvent);

    res.json({ success: true, event: newEvent, parsedResult: result });
  } else {
    res.status(400).json({ success: false, message: 'Could not parse event from text.' });
  }
});

module.exports = router;
