import { useState, FormEvent, KeyboardEvent } from "react"
import { ServerSocketInfo } from "../../App";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCode, selectIsCreator, selectState, setCode, setIsCreator } from "./gameSlice";

export interface GameSelectorProps{
    socketInfo: ServerSocketInfo
}

export function GameSelector(props: GameSelectorProps){

    let currentGameCode = useAppSelector(selectCode);
    let [gameCode, setGameCode] = useState("");
    let dispatch = useAppDispatch();

    if(currentGameCode !== null) return <></>;



    function handleChange(evt: FormEvent){
        setGameCode(((evt.target) as HTMLInputElement).value)        
    }


    function joinGame(){
        if(gameCode.trim() !== "") {
            console.log("joining", gameCode);
            props.socketInfo.socket.on("confirmJoin", (gameCode, isCreator) => {
                dispatch(setCode(gameCode));
                dispatch(setIsCreator(isCreator))
            })
            props.socketInfo.socket.emit("joinGame", gameCode, props.socketInfo.userid, (document.getElementById("yourNameInput") as HTMLInputElement).value);
        };
    }


    function onKeyDown(evt: KeyboardEvent<HTMLInputElement>){
        if(evt.key === "Enter"){
            joinGame();
        }
    }

    function createGame(){
        let gameId = (document.getElementById("gameId") as HTMLInputElement).value
        props.socketInfo.socket.emit("createGame", gameId, props.socketInfo.userid);
    }


    props.socketInfo.socket.on("confirmGameCreation", (success, gameId) => {
        console.log(success, gameId);
        
        if(success){
            (document.getElementById("gameId") as HTMLInputElement).value = "";
            (document.getElementById("successIndicator") as HTMLParagraphElement).innerText = "Created game " + gameId;
        }
    })

    return (
        <div id="gameSelectorSection">
            <h1>Game Selector:</h1>
            <input placeholder="Your Name" id="yourNameInput" name="name"></input>
            <br></br>
            <label htmlFor="yourNameInput">(Use your real one, it'll be shown on your card.)</label>
            <br></br>
            <input placeholder="Game code" onChange={handleChange} value={gameCode} onKeyDown={onKeyDown}></input>
            <button onClick={joinGame}>submit</button>

            <hr/>
            <hr/>
            <div id="createGame">
                <input id="gameId" placeholder="gameId"></input>
                <button onClick={createGame} onKeyDown={evt => {if(evt.key === "Enter") createGame()}}>Create</button>
                <p id="successIndicator"></p>
            </div>
        </div>
    )
}