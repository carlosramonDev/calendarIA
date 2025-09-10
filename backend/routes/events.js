const express = require('express');
const router = express.Router();
const { createEvent } = require('../models/Event');
const { sendEmail } = require('../utils/mailer');

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
  const { title, start, end, description, invitedUsers } = req.body;
  const newEvent = createEvent(title, start, end, description);
  newEvent.id = events.length + 1;
  newEvent.invitedUsers = invitedUsers || [];
  events.push(newEvent);

  // Send email notifications to invited users
  if (invitedUsers && invitedUsers.length > 0) {
    invitedUsers.forEach(email => {
      sendEmail(
        email,
        `Invitation to Event: ${title}`,
        `You are invited to ${title} from ${start} to ${end}. Description: ${description}`,
        `<p>You are invited to <strong>${title}</strong> from ${start} to ${end}.</p><p>Description: ${description}</p>`
      );
    });
  }

  res.status(201).json(newEvent);
});

// Update an event
router.put('/:id', (req, res) => {
  const event = events.find(e => e.id === parseInt(req.params.id));
  if (!event) return res.status(404).send('Event not found');

  const { title, start, end, description, invitedUsers } = req.body;
  event.title = title;
  event.start = start;
  event.end = end;
  event.description = description;
  event.invitedUsers = invitedUsers || event.invitedUsers; // Update invited users
  event.updatedAt = new Date();

  // Send email notifications to newly invited users (if any)
  if (invitedUsers && invitedUsers.length > 0) {
    const existingInvitedUsers = event.invitedUsers || [];
    invitedUsers.forEach(email => {
      if (!existingInvitedUsers.includes(email)) {
        sendEmail(
          email,
          `Invitation to Event: ${title}`,
          `You are invited to ${title} from ${start} to ${end}. Description: ${description}`,
          `<p>You are invited to <strong>${title}</strong> from ${start} to ${end}.</p><p>Description: ${description}</p>`
        );
      }
    });
  }

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
