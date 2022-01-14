const users = [];

const userJoin = (id, name, room, img) => {
  const user = { id, name, room, img };
  users.push(user);

  return user;
};

const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getRoomUsers = (room) => {
  return users.filter((user) => user.room === room);
};

const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

module.exports = {
  userJoin,
  getRoomUsers,
  userLeave,
  getCurrentUser,
};
