import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import io from 'socket.io-client'

let socket;

const Game = () => {
    
    const ENDPOINT = 'localhost:5000'
    const [player, setPlayer] = useState('Obserwator')
    const [circleTurn, setCircleTurn] = useState(false)
    // const [cellElements, setCellElements] = useState()
    useEffect(() =>{
        socket = io(ENDPOINT)
        return () =>{
            socket.off()
        }
    },[])

    useEffect(() => {
        // setCellElements(document.querySelectorAll('.cell'))
        socket.on('player', (player) =>{
            setPlayer(player)
        })
        socket.on('swapped', (turn) =>{
            if(turn !== undefined){
                setCircleTurn(turn)
            }
        })
        socket.on('placed', (place) =>{
            document.getElementById(place.cellid).classList.add(place.turn)
        })
        socket.on('endGame', (win) => {
            endGame(win.draw, win.turn)
        })
        socket.on('restart', () =>{
                startGame()
        })

    },[])
    
    
    const X_CLASS = 'x'
    const O_CLASS = 'o'

    const winningMessageElement = useRef()
    const winningMessageTextElement = useRef()
    const board = useRef() 
    let turnMessageElement = useRef()

    const startGame = () =>{
        setCircleTurn(false)
        let cells = document.querySelectorAll('.cell');
        // board.current.classList.remove(O_CLASS)
        // board.current.classList.remove(X_CLASS)
        for(let i =0; i < cells.length; i++){
            let x = cells[i]
            x.classList.remove(X_CLASS)
            x.classList.remove(O_CLASS)
        } //todo: cala plansza z serwera
        winningMessageElement.current.classList.remove('show')
    }

    const handleClick = (e) => {
        const cell = e.target
        const currentClass = circleTurn ? O_CLASS : X_CLASS
        if(player === currentClass){
            placeMark(cell, currentClass)
        }
    }

    const placeMark = (cell, currentClass) =>{
        let place = {
            cellid: cell.id,
            turn: currentClass,
        }
        socket.emit('place',place)
    }

    const setHoverClass = () => {
        board.current.classList.remove(X_CLASS)
        board.current.classList.remove(O_CLASS)
        player === 'o' ? board.current.classList.add(O_CLASS) : board.current.classList.add(X_CLASS)
    }

    const endGame = (draw, turn) =>{
        if(draw){
            winningMessageTextElement.current.innerText = 'Remis!'
        }else{
            winningMessageTextElement.current.innerText = `${turn == 'o' ? 'O wygrało!' : 'X Wygrał!'}`
        }
        winningMessageElement.current.classList.add('show')
    }


    useEffect(() => {
        if(player){
            startGame()
            setHoverClass()
        }
    },[player])
    let handleRestart = () =>{
        socket.emit('restart')
    }
    let turnMessage = circleTurn 
    ? 'O' 
    : 'X'
    let cells = Array.from(Array(9).keys())

    cells = cells.map((i,index) => <div onClick={handleClick} id={index} className="cell"></div>)

    return ( 
        <>
        <div className="turns">
            <div ref={turnMessageElement}>{'Tura ' + turnMessage}</div>
            <div>Grasz jako {player.toUpperCase()}</div>
        </div>
        <div className="board" ref={board} id='board'>
            {cells}
        </div>
        <div className="winning-message " ref={winningMessageElement}>
            <div ref={winningMessageTextElement}></div>
            <button onClick={handleRestart} id="restart">Restart</button>
        </div>
        </>
     );
}
 
export default Game;