const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const router = require('./routes/router')
const cors = require('cors')

const PORT = process.env.PORT || 5000;

const app = express()
const server = http.createServer(app)
app.use(router)
app.use(cors())

let players = []
let turns = ['x','o']
const io = socketio(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
})
io.on('connection', socket => {
    players.push(socket.id)

    io.to(players[0]).emit('player', ('x'))
    io.to(players[1]).emit('player', ('o'))

    socket.on('place', (cellid) =>{

        io.emit('placed', (cellid))
    })

    socket.on('swapTurn', (circleTurn) => {
        console.log(!circleTurn)
        io.emit('swapped', (!circleTurn))
    })

    socket.on('disconnect', () => {
        players = players.filter(i => i != socket.id)
    })



    // socket.on('wyslij', (message, callback) => {
    //     msg = message
    //     console.log(msg)
    // })
})

server.listen(PORT, () => console.log(`Server na ${PORT}`))