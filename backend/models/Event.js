function createEvent(title, start, end, description, invitedUsers = []) {
  return {
    title,
    start,
    end,
    description,
    invitedUsers,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

module.exports = { createEvent };
