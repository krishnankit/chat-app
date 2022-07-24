const chatForm = document.getElementById('chat-form')
const chatMessages = document.getElementsByClassName('chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

//Get username and room from URL
const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

console.log(username, room)

const socket = io()

//Join room
socket.emit('joinRoom', {username, room})

// Get room and users
socket.on('roomUsers', ({room, users}) => {
  outputRoomName(room)
  outputRoomUsers(users)
})

// Receive message from server
socket.on('message', message => {
  console.log(message)
  outputMessage(message)

  chatMessages.scrollTop = chatMessages.scrollHeight
})

//Submit message
chatForm.addEventListener('submit', (e) => {
  e.preventDefault()

  // Send message to server
  const msg = e.target.elements.msg.value
  socket.emit('message', msg)

  e.target.elements.msg.value = ''
  e.target.elements.msg.focus()
})

// Show message on DOM
function outputMessage(message) {
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `
  <p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.message}
  </p>
  `
  document.querySelector('.chat-messages').appendChild(div)
}

function outputRoomName(room) {
  roomName.innerHTML = room
}

function outputRoomUsers(users) {
  users.forEach(user => {
    const newUser = document.createElement('li')
    newUser.textContent = user.username
    userList.appendChild(newUser)
  })
}