const { expect } = require('chai');
const { createEvent } = require('../models/Event');

describe('Event Model', () => {
  it('should create an event with given properties', () => {
    const title = 'Test Event';
    const start = new Date();
    const end = new Date(start.getTime() + 3600000); // 1 hour later
    const description = 'This is a test event';

    const event = createEvent(title, start, end, description);

    expect(event).to.be.an('object');
    expect(event.title).to.equal(title);
    expect(event.start).to.equal(start);
    expect(event.end).to.equal(end);
    expect(event.description).to.equal(description);
    expect(event.createdAt).to.be.an.instanceOf(Date);
    expect(event.updatedAt).to.be.an.instanceOf(Date);
  });
});
