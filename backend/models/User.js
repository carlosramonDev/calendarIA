function createUser(username, email, password) {
  return {
    username,
    email,
    password,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

module.exports = { createUser };
