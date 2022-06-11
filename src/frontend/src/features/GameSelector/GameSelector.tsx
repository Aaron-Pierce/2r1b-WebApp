import { useState, FormEvent, KeyboardEvent, useEffect } from "react"
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


    function handleChange(evt: FormEvent){
        setGameCode(((evt.target) as HTMLInputElement).value.toLowerCase())        
    }


    function joinGame(){
        if(gameCode.trim() !== "") {

            let playerName = (document.getElementById("yourNameInput") as HTMLInputElement).value;
            localStorage.setItem("playerName", playerName);

            console.log("joining", gameCode);
            props.socketInfo.socket.on("confirmJoin", (gameCode, isCreator) => {
                dispatch(setCode(gameCode));
                dispatch(setIsCreator(isCreator))
            })
            props.socketInfo.socket.emit("joinGame", gameCode, props.socketInfo.userid, (document.getElementById("yourNameInput") as HTMLInputElement).value);

            let resetZoomTag = document.createElement("meta");
            resetZoomTag.name="viewport";
            resetZoomTag.content="maximum-scale=1, minimum-scale=1, initial-scale=1";
            document.getElementsByTagName("head")[0].appendChild(resetZoomTag);
            setTimeout(() => {
                resetZoomTag.content="maximum-scale=10, minimum-scale=0, initial-scale=1";
            }, 100);
        };
    }


    function onKeyDown(evt: KeyboardEvent<HTMLInputElement>){
        if(evt.key === "Enter"){
            joinGame();
        }
    }

    function createGame(){
        let gameId = (document.getElementById("gameId") as HTMLInputElement).value.toLowerCase()
        props.socketInfo.socket.emit("createGame", gameId, props.socketInfo.userid);
    }


    useEffect(() => {
        props.socketInfo.socket.on("confirmGameCreation", (success, gameId) => {
            console.log(success, gameId);
            
            if(success){
                (document.getElementById("gameId") as HTMLInputElement).value = "";
                (document.getElementById("successIndicator") as HTMLParagraphElement).innerText = "Created game " + gameId;
            }
        })
    
        return () => {
            props.socketInfo.socket.off("confirmGameCreation");
        }
    })



    if(currentGameCode !== null) return <></>;
    return (
        <div id="gameSelectorSection">
            <h1>Game Selector:</h1>
            <input placeholder="Your Name" id="yourNameInput" name="name"></input>
            <br></br>
            <label htmlFor="yourNameInput">(Use your real one, it'll be shown on your card)</label>
            <br></br>
            <input placeholder="Game code" onChange={handleChange} value={gameCode} onKeyDown={onKeyDown}></input>
            <button onClick={joinGame}>submit</button>

            <hr/>
            <hr/>
            <div id="createGame">
                <input id="gameId" placeholder="gameId" onKeyDown={(evt) => evt.key === "Enter" ? createGame() : 0}></input>
                <button onClick={createGame}>Create</button>
                <p id="successIndicator"></p>
            </div>
        </div>
    )
}