const users = []

function userJoin(id, username, room) {
  const user = {
    id, username, room
  }

  users.push(user)
  return user
}

// Get users in particular room
function getRoomUsers(room) {
  return users.filter(user => user.room === room)
}

function getCurrentUser(id) {
  return users.find(user => user.id === id)
}

module.exports = {
  userJoin,
  getCurrentUser,
  getRoomUsers
}