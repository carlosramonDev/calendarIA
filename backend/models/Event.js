function createEvent(title, start, end, description) {
  return {
    title,
    start,
    end,
    description,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

module.exports = { createEvent };
