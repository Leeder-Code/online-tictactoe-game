const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const router = require('./routes/router')
// const cors = require('cors')

const PORT = process.env.PORT || 8002;

const app = express()
const server = http.createServer(app)
app.use(router)
// app.use(cors())

let players = []
let turns = ['x','o']
const io = socketio(server,{
    cors: {
        methods: ["GET", "POST"]
      }
})
const WINNIG_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
]
let board = ['','','','','','','','','']
const checkWin = (currentTurn) => WINNIG_COMBINATIONS.some(combination => combination.every(index => board[index] == currentTurn))
const isDraw = () => [...board].every(cell => cell == 'x' || cell == 'o')
io.on('connection', socket => {
    board = ['','','','','','','','','']
    players.push(socket.id)
    io.to(players[0]).emit('player', ('x'))
    io.to(players[1]).emit('player', ('o'))


    console.log(players)
    
   
    socket.on('place', (place) =>{
        if(board[place.cellid] === ''){
            let circleTurn;
            io.emit('placed', (place))
            board[place.cellid] = place.turn
            console.log(board)
            if(place.turn == 'o'){
                circleTurn = true;
            }else circleTurn = false;

            let win = {
                draw: false,
                turn: place.turn,
            }
            if(checkWin(place.turn)){
                win.draw = false;
                io.emit('endGame', win)
                board = ['','','','','','','','','']
            }else if(isDraw()){
                win.draw = true;
                io.emit('endGame', win)
                board = ['','','','','','','','','']
            }else io.emit('swapped', (!circleTurn))

        }else return;
    })

    socket.on('swapTurn', (circleTurn) => {
        io.emit('swapped', (!circleTurn))
    })

    socket.on('restart', () =>{
        io.emit('restart')
    })

    socket.on('disconnect', () => {
        players = players.filter(i => i != socket.id)
    })

})

server.listen(PORT, () => console.log(`Server na ${PORT}`))