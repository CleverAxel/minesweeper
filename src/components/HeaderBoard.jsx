import { useState, useEffect } from 'react';
import "./HeaderBoard.css";

export default function HeaderBoard({ResetBoolean, wasReset, flagCounter, gameOver, isFirstMove}){
    const [timer, setTime] = useState(0);
    const [limit, setLimit] = useState(false);

    /*if(gameOver){
        timerToReturn(timer);
    }*/
    useEffect(() =>{
        if(timer == 999){
            setLimit(true);
        }
    },[timer]);

    useEffect(() =>{
        if(wasReset){
            ResetBoolean();
            setTime(0);
            setLimit(false);
        }
    },[wasReset])

    useEffect(() =>{
        if(isFirstMove == false && gameOver == false && limit == false){
            let ID = setInterval(() => {
                setTime((timer) => timer + 1);
            }, 1000);
                
            return () => clearInterval(ID);
        }
    },[gameOver, limit, isFirstMove]);


    return(
        <div className="headerBoard">
            <div className="flagCounterContainer">
                <span>{flagCounter}</span>
                <span className="flag"><i className="fa-solid fa-flag"></i></span>
            </div>
            <div className="timerContainer">
                <span className="timer">{timer}</span>
                <span><i className="fa-regular fa-clock"></i></span>
            </div>
        </div>
    );
}