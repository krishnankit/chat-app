const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, getRoomUsers} = require('./utils/users')

const app = express()
const PORT = process.env.PORT || 3000

// Set static folder for node
app.use(express.static(path.join(__dirname, 'public')))

const server = http.createServer(app)
const botName = 'Chat Cord'

//Run when client connects
const io = socketio(server)
io.on('connection', socket => {
  socket.on('joinRoom', ({username, room}) => {
    const user = userJoin(socket.id, username, room)
    socket.join(user.room)

    socket.emit('message', formatMessage(botName, 'Welcome to chatcord!'))

    //Send message to all clients except the user that is connecting
    // .to is user to target specific room if it is not written then message will be broadcasted to all rooms
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`))

    // Send room name and room users
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(room)
    })
  })

  //Send message to all client including connecting user
  // io.emit()

  socket.on('message', msg => {
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit('message', formatMessage(user.username, msg))
  })

  socket.on('disconnect', () => {
    const user = getCurrentUser(socket.id)
    if (user) {
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`))
      // Send room name and room users
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      })
    }
  })
})

server.listen(PORT, () => {console.log(`Server started at ${PORT}`)})