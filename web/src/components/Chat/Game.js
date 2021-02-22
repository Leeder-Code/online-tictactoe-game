import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client'

let socket;

const Game = () => {
    const ENDPOINT = 'localhost:5000'
    const [player, setPlayer] = useState()

    const [value, setValue] = useState('')
    const [messages, setMessages] = useState([])

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
    const X_CLASS = 'x'
    const O_CLASS = 'o'
    let circleTurn;
    let cellElements;
    const winningMessageElement = useRef()
    const winningMessageTextElement = useRef()
    const board = useRef()

    const startGame = () =>{

        circleTurn = false;
        cellElements = document.querySelectorAll('.cell')
        cellElements.forEach(i => {
            i.classList.remove(X_CLASS)
            i.classList.remove(O_CLASS)
            i.removeEventListener('click', handleClick)
            i.addEventListener('click', handleClick, {once: true})
        })
        setHoverClass()
        winningMessageElement.current.classList.remove('show')
    }

    const handleClick = (e) => {
        const cell = e.target
        const currentClass = circleTurn ? O_CLASS : X_CLASS
        placeMark(cell, currentClass)
        if(checkWin(currentClass)){
            endGame(false)
        }else if(isDraw()){
            endGame(true)
        }else{
            swapTurn()
            setHoverClass()
        }
    }

    const placeMark = (cell, currentClass) =>{
        cell.classList.add(currentClass)
    }
    const swapTurn = () =>{
        circleTurn = !circleTurn
    }
    const setHoverClass = () => {
        board.current.classList.remove(X_CLASS)
        board.current.classList.remove(O_CLASS)
        circleTurn ? board.current.classList.add(O_CLASS) : board.current.classList.add(X_CLASS)
    }

    const checkWin = (currentClass) => WINNIG_COMBINATIONS.some(combination => combination.every(index => cellElements[index].classList.contains(currentClass)))

    const isDraw = () => [...cellElements].every(cell => cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS))
    const endGame = (draw) =>{
        if(draw){
            winningMessageTextElement.current.innerText = 'Remis!'
        }else{
            winningMessageTextElement.current.innerText = `${circleTurn ? 'O wygrało!' : 'X Wygrał!'}`
        }
        winningMessageElement.current.classList.add('show')
    }
    useEffect(() => {
        startGame()
    },[])

    useEffect(() =>{
        socket = io(ENDPOINT)
        return () =>{
            socket.off()
        }
    },[])

    // useEffect(() => {
    // },[handleClick]) 

    useEffect(() => {
        socket.on('player', (player) =>{
            setPlayer(player)
        })
    },[])
    console.log(player)
    
    let messComp = messages.map(i => <li>{i}</li>)
    return ( 
        <>
        <div className="board" ref={board} id='board'>
            <div  className="cell"></div>
            <div  className="cell"></div>
            <div  className="cell"></div>
            <div  className="cell"></div>
            <div  className="cell"></div>
            <div  className="cell"></div>
            <div  className="cell"></div>
            <div  className="cell"></div>
            <div className="cell" ></div>
        </div>
        <div className="winning-message " ref={winningMessageElement}>
            <div ref={winningMessageTextElement}></div>
            <button onClick={startGame} id="restart">Restart</button>
        </div>
        </>
     );
}
 
export default Game;