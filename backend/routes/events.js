const express = require('express');
const router = express.Router();
const { createEvent } = require('../models/Event');

// Mock database
let events = [];

// Get all events
router.get('/', (req, res) => {
  res.json(events);
});

// Get a single event by id
router.get('/:id', (req, res) => {
  const event = events.find(e => e.id === parseInt(req.params.id));
  if (!event) return res.status(404).send('Event not found');
  res.json(event);
});

// Create a new event
router.post('/', (req, res) => {
  const { title, start, end, description } = req.body;
  const newEvent = createEvent(title, start, end, description);
  newEvent.id = events.length + 1;
  events.push(newEvent);
  res.status(201).json(newEvent);
});

// Update an event
router.put('/:id', (req, res) => {
  const event = events.find(e => e.id === parseInt(req.params.id));
  if (!event) return res.status(404).send('Event not found');

  const { title, start, end, description } = req.body;
  event.title = title;
  event.start = start;
  event.end = end;
  event.description = description;
  event.updatedAt = new Date();

  res.json(event);
});

// Delete an event
router.delete('/:id', (req, res) => {
  const eventIndex = events.findIndex(e => e.id === parseInt(req.params.id));
  if (eventIndex === -1) return res.status(404).send('Event not found');

  const deletedEvent = events.splice(eventIndex, 1);
  res.json(deletedEvent);
});

module.exports = router;
