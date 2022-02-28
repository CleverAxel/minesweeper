import './Board.css';
import { useState } from 'react';
import HeaderBoard from './HeaderBoard.jsx';
import RestartMenu from './RestartMenu.jsx';
const NBR_ROW = 12;
const NBR_COLUMN = 15;
const NBR_MINE = 30; //30
const NBR_MINE_CAN_DELETE = 5;

class StateOfTheGame{
    constructor(nbrRow, nbrColumn, nbrMine){
        this.board = [];
        this.nbrRow = nbrRow;
        this.nbrColumn = nbrColumn;
        this.nbrMine = nbrMine;
        this.nbrFlag = nbrMine;
        this.init(nbrRow, nbrColumn)
        this.setMines(nbrMine);

        this.isWin = false;
        this.gameOver = false;
        this.isFirstMove = true;
        this.wasReset = false;

    }

    reset(setState){
        this.board = [];

        this.init(this.nbrRow, this.nbrColumn);
        this.setMines(this.nbrMine);
        this.nbrFlag = this.nbrMine;
        this.gameOver = false;
        this.isWin = false;
        this.isFirstMove = true;
        this.wasReset = true;
        setState(this.board.flat());
    }

    init(nbrRow, nbrColumn){
        this.board = new Array(nbrRow);
        for(let i = 0; i < nbrRow; i++){
            this.board[i] = new Array(nbrColumn)
            for(let j = 0; j < nbrColumn; j++){
                this.board[i][j] = {
                    isFlagged: false,
                    isMine: false,
                    isRevealed: false,
                    valueToReveal: 0
                }
            }
        }
    }

    setMines(nbrMine){
        let mineCounter = 0;
        while(mineCounter < nbrMine){
            let randomRow = Math.floor(Math.random() * this.nbrRow);
            let randomColumn = Math.floor(Math.random() * this.nbrColumn);

            if(this.board[randomRow][randomColumn].isMine === false && this.board[randomRow][randomColumn].isRevealed === false){
                this.board[randomRow][randomColumn].isMine = true;
                this.setCluesAroundMine(randomRow, randomColumn);
                mineCounter++;
            }
        }
    }

    setCluesAroundMine(row, column){
        let index = row * this.nbrColumn + column;
        for(let rowOffset = -1; rowOffset <= 1; rowOffset++){
            for(let columnOffset = -1; columnOffset <= 1; columnOffset++){
                let i = row + rowOffset;
                let j = column + columnOffset;

                let newIndex = i * this.nbrColumn + j;

                if(i >= 0 && j >= 0 && i < this.nbrRow && j < this.nbrColumn && newIndex != index){
                    this.board[i][j].valueToReveal += 1;
                }
            }
        }
        this.board[row][column].valueToReveal = 0;
    }

    RevealCase(selectedCase, setState){
        if(this.gameOver === false){
            let row = parseInt(selectedCase / this.nbrColumn);
            let column = selectedCase % this.nbrColumn;

            if(this.board[row][column].isFlagged === false && this.board[row][column].isRevealed === false){
                this.board[row][column].isRevealed = true;
                if(this.board[row][column].valueToReveal === 0 && this.board[row][column].isMine === false){
                    this.ClearEmptyField(selectedCase);
                }

                if(this.isFirstMove && (this.board[row][column].valueToReveal > 0 || this.board[row][column].isMine)){
                    if(this.board[row][column].isMine === false){
                        this.board[row][column].isRevealed = false;
                        selectedCase = this.FindMineAroundClue(selectedCase);
                    }
                    this.ClearPathForFirstMove(selectedCase);
                }else{
                    if(this.board[row][column].isMine){
                        this.gameOver = true;
                        this.RevealMines();
                        console.log("perdu");
                    }
                }

                this.isFirstMove = false;
                setState(this.board.flat());
            }
        }
    }

    FindMineAroundClue(position){
        let row = parseInt(position / this.nbrColumn);
        let column = position % this.nbrColumn;

        for(let rowOffset = -1; rowOffset <= 1; rowOffset++){
            for(let columnOffset = -1; columnOffset <= 1; columnOffset++){
                let i = row + rowOffset;
                let j = column + columnOffset;

                if(i >= 0 && j >= 0 && i < this.nbrRow && j < this.nbrColumn && this.board[i][j].isMine){
                    return i * this.nbrColumn + j;
                }
            }
        }
    }

    RevealMines(){
        for(let i = 0; i < this.nbrRow; i++){
            for(let j = 0; j < this.nbrColumn; j++){
                if(this.board[i][j].isMine){
                    this.board[i][j].isRevealed = true;
                }
            }
        }
    }

    ClearEmptyField(index){
        let arrayOfEmpty = [index];
        for(let k = 0; k < arrayOfEmpty.length; k++){
            let row = parseInt(arrayOfEmpty[k] / this.nbrColumn);
            let column = arrayOfEmpty[k] % this.nbrColumn;
            let newIndex = 0;

            for(let rowOffset = -1; rowOffset <= 1; rowOffset++){
                for(let columnOffset = -1; columnOffset <= 1; columnOffset++){
                    let i = row + rowOffset;
                    let j = column + columnOffset;
    
                    if(i >= 0 && j >= 0 && i < this.nbrRow && j < this.nbrColumn && this.board[i][j].isFlagged === false){
                        if(this.board[i][j].valueToReveal <= 0 && this.board[i][j].isRevealed === false){
                            newIndex = i * this.nbrColumn + j;
                            arrayOfEmpty.push(newIndex)
                        }
                        this.board[i][j].isRevealed = true;
                    }
                }
            }
        }
    }

    ClearPathForFirstMove(position){
        let arrayOfDeletedMine = [position];
        let isEnoughMineGone = false;
        
        for(let k = 0; k < arrayOfDeletedMine.length; k++){
            let row = parseInt(arrayOfDeletedMine[k] / this.nbrColumn);
            let column = arrayOfDeletedMine[k] % this.nbrColumn;

            if(arrayOfDeletedMine.length >= NBR_MINE_CAN_DELETE){
                isEnoughMineGone = true;
            }

            for(let rowOffset = -1; rowOffset <= 1; rowOffset++){
                for(let columnOffset = -1; columnOffset <= 1; columnOffset++){
                    let i = row + rowOffset;
                    let j = column + columnOffset;
                    let newIndex = i * this.nbrColumn + j;
                    
                    if(i >= 0 && j >= 0 && i < this.nbrRow && j < this.nbrColumn){
                        if(arrayOfDeletedMine[k] !== newIndex){
                            if(isEnoughMineGone ===  false && this.board[i][j].isMine){
                                arrayOfDeletedMine.push(newIndex);
                                this.board[i][j].isMine = false;
                            }

                            if(this.board[i][j].isMine === false && this.board[i][j].valueToReveal > 0){
                                this.board[i][j].valueToReveal -= 1;
                            }
                        }
                    }
                }
            }
            this.board[row][column].isMine = false;
        }

        this.ClearEmptyField(position);
        this.CheckForBrokenMines(position);
        this.setMines(arrayOfDeletedMine.length);
    }

    CheckForBrokenMines(position){
        let arrayBrokenMines = [];
        for(let row = 0; row < this.nbrRow; row++){
            for(let column = 0; column < this.nbrColumn; column++){
                if(this.board[row][column].isMine && this.board[row][column].isRevealed){
                    arrayBrokenMines.push(row * this.nbrColumn + column);
                    //console.log("cassé");
                }
            }
        }
        if(arrayBrokenMines.length > 0){
            this.FixBrokenMine(arrayBrokenMines);
            for(let i = 0; i < this.nbrRow; i++){
                for(let j = 0; j < this.nbrColumn; j++){
                    this.board[i][j].isRevealed = false;
                }
            }
            this.ClearEmptyField(position);
        }
    }

    FixBrokenMine(arrayBrokenMines){
        for(let k = 0; k < arrayBrokenMines.length; k++){
            let row = parseInt(arrayBrokenMines[k] / this.nbrColumn);
            let column = arrayBrokenMines[k] % this.nbrColumn;

            for(let rowOffset = -1; rowOffset <= 1; rowOffset++){
                for(let columnOffset = -1; columnOffset <= 1; columnOffset++){
                    let i = row + rowOffset;
                    let j = column + columnOffset;

                    if(i >= 0 && j >= 0 && i < this.nbrRow && j < this.nbrColumn){
                        if(this.board[i][j].valueToReveal === 0 && this.board[i][j].isMine === false){
                            this.CountMinesAround(i, j);
                        }
                    } 
                }
            }
        }
    }

    CountMinesAround(row, column){
        let nbrMine = 0;
        for(let rowOffset = -1; rowOffset <= 1; rowOffset++){
            for(let columnOffset = -1; columnOffset <= 1; columnOffset++){
                let i = row + rowOffset;
                let j = column + columnOffset;

                if(i >= 0 && j >= 0 && i < this.nbrRow && j < this.nbrColumn){
                    if(this.board[i][j].isMine){
                        nbrMine++;
                    }
                } 
            }
        }
        this.board[row][column].valueToReveal = nbrMine;
    }

    SetRemoveFlag(selectedCase, setState){
        if(this.gameOver === false && this.isFirstMove === false){
            let row = parseInt(selectedCase / this.nbrColumn);
            let column = selectedCase % this.nbrColumn;
            if(this.board[row][column].isRevealed === false){
                if(this.board[row][column].isFlagged){
                    this.board[row][column].isFlagged = false;
                    this.nbrFlag++;
                } else{
                    this.board[row][column].isFlagged = true;
                    this.nbrFlag--;
                }
            }

            if(this.nbrFlag === 0){
                let correctFlag = 0;
                for(let i = 0; i < this.nbrRow; i++){
                    for(let j = 0; j < this.nbrColumn; j++){
                        if(this.board[i][j].isMine && this.board[i][j].isFlagged){
                            correctFlag++;
                        }
                    }
                }
                if(correctFlag === this.nbrMine){
                    this.isWin = true;
                    this.gameOver = true;
                }
            }

            setState(this.board.flat());
        }
    }
}

let stateOfTheGame = new StateOfTheGame(NBR_ROW, NBR_COLUMN, NBR_MINE);

/**************************************************/

export default function Board(){
    
    const [board, setBoard] = useState(stateOfTheGame.board.flat());
    /*useEffect(() =>{
        setBoard(stateOfTheGame.board.flat())
    },[]);*/

    const Replay = () => {
        stateOfTheGame.reset(setBoard);
    }
    const ResetBoolean = () =>{
        stateOfTheGame.wasReset = false;
    }

    return (
        <div className='boardContainer'>
            <div className={stateOfTheGame.gameOver && stateOfTheGame.isWin === false ? "board startShaking" : "board"}>

                {stateOfTheGame.gameOver && <RestartMenu gameOver={stateOfTheGame.gameOver} isWin={stateOfTheGame.isWin} Replay={Replay}/>}

                <HeaderBoard ResetBoolean={ResetBoolean} wasReset={stateOfTheGame.wasReset} flagCounter={stateOfTheGame.nbrFlag} gameOver={stateOfTheGame.gameOver} isFirstMove={stateOfTheGame.isFirstMove}/>
                <Row nbrRow={NBR_ROW} nbrColumn={NBR_COLUMN} state={board} setState={setBoard}/>
            </div>
        </div>
        );
}

function Row({nbrRow, nbrColumn, state, setState}){
    let rows = new Array(nbrRow);
    for(let i = 0; i < nbrRow; i++){
        rows[i] = 
            <div className='row' key={"row" + i.toString()}>
                <Column currentRow={i} nbrColumn={nbrColumn} state={state} setState={setState}/>
            </div>
    }

    return rows;
}

function Column({currentRow, nbrColumn, state, setState}){
    let columns = new Array(nbrColumn);
    for(let i = 0; i < nbrColumn; i++){
        let currentIndex = currentRow * nbrColumn + i; 
        columns[i] = 
            <div className={DisplayClass(state, currentIndex)} key={currentIndex} 
            onClick={(() =>{stateOfTheGame.RevealCase(currentIndex, setState)})}
            onContextMenu={((e) =>{e.preventDefault(); stateOfTheGame.SetRemoveFlag(currentIndex, setState); })}>
                {DisplayState(state, currentIndex)}
            </div>
    }

    return columns
}

function DisplayState(state, currentIndex){
    if(state.length !== 0){

        if(state[currentIndex].isRevealed){

            if(state[currentIndex].isFlagged){
                return <i className="fa-solid fa-flag"></i>
            }

            if(state[currentIndex].isMine){
                return <i className="fa-solid fa-bomb"></i>
            }

            if(state[currentIndex].valueToReveal !== 0){
                return state[currentIndex].valueToReveal;
            } else{
                return null;
            }
        }

        if(state[currentIndex].isFlagged){
            return <i className="fa-solid fa-flag"></i>
        }

        /*if(state[currentIndex].isMine){
            return <i className="fa fa-bomb"></i>;
        }*/
        //return state[currentIndex].valueToReveal;
    }
    return null;
}

function DisplayClass(state, currentIndex){
    let classToReturn = "column ";

    if(state.length !== 0){
        if(state[currentIndex].isRevealed === false){

            if(state[currentIndex].isFlagged){
                classToReturn += "red ";
            }
            //background
            if(currentIndex % 2 === 0){
                return classToReturn + "lightGreen "
            } else{
                return classToReturn + "darkGreen "
            }
        } else{
            //background
            if(currentIndex % 2 === 0){
                classToReturn += "revealed ";
            } else{
                classToReturn += "darkRevealed ";
            }
            
            //couleur indice/bombe/drapeau
            if(state[currentIndex].isFlagged && state[currentIndex].isMine){
                return classToReturn + "correctFlag ";
            }

            if(state[currentIndex].isMine){
                return classToReturn + "black";
            }

            switch(state[currentIndex].valueToReveal){
                case 1:
                    return classToReturn + "blue";
                case 2:
                    return classToReturn + "green";
                case 3:
                    return classToReturn + "red";
                case 4:
                    return classToReturn + "purple";
                default:
                    return classToReturn + "black";
            }
        }
    }
    return classToReturn;
}