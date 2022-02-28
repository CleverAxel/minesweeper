import { useEffect, useState } from 'react';
import './RestartMenu.css';

export default function RestartMenu({gameOver, isWin, Replay}){

    const [className, setClassName] = useState("displayData");

    const DisplayMessage = () => {
        if(gameOver && isWin === false){
            return <p>Saperlipopette, vous avez tué tout le monde en faisant une carabistouille, rejouer ?</p>
        }
        
        return <p>Sacrebleu, vous avez réussi à déminer la zone, souhaitez vous rejouer ?</p>
    }

    useEffect(() =>{
        setTimeout(() => {
            setClassName((prevName) => prevName + " active")
        }, 100);
    },[]);
     
    return(
        <div className='boxContainer'>
            <div className={className}>
                {DisplayMessage()}
                <button className='replay' onClick={(() => {Replay()})}>Rejouer</button>
            </div>
        </div>
    )
}