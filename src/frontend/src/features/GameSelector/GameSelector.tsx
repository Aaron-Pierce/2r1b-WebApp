import { useState, FormEvent, KeyboardEvent, useEffect } from "react"
import { ServerSocketInfo } from "../../App";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCode, selectIsCreator, selectState, setCode, setIsCreator } from "./gameSlice";
import styles from "./GameSelector.module.css";

export interface GameSelectorProps {
    socketInfo: ServerSocketInfo
}

export function GameSelector(props: GameSelectorProps) {

    let currentGameCode = useAppSelector(selectCode);
    let [gameCode, setGameCode] = useState("");
    let dispatch = useAppDispatch();


    function handleChange(evt: FormEvent) {
        setGameCode(((evt.target) as HTMLInputElement).value.toLowerCase())
    }


    function joinGame() {
        if (gameCode.trim() !== "") {

            let playerName = (document.getElementById("yourNameInput") as HTMLInputElement).value;
            localStorage.setItem("playerName", playerName);

            console.log("joining", gameCode);
            props.socketInfo.socket.on("confirmJoin", (gameCode, isCreator) => {
                dispatch(setCode(gameCode));
                dispatch(setIsCreator(isCreator))
            })
            props.socketInfo.socket.emit("joinGame", gameCode, props.socketInfo.userid, (document.getElementById("yourNameInput") as HTMLInputElement).value);

            let resetZoomTag = document.createElement("meta");
            resetZoomTag.name = "viewport";
            resetZoomTag.content = "maximum-scale=1, minimum-scale=1, initial-scale=1";
            document.getElementsByTagName("head")[0].appendChild(resetZoomTag);
            setTimeout(() => {
                resetZoomTag.content = "maximum-scale=10, minimum-scale=0, initial-scale=1";
            }, 100);
        };
    }


    function onKeyDown(evt: KeyboardEvent<HTMLInputElement>) {
        if (evt.key === "Enter") {
            joinGame();
        }
    }

    function createGame() {
        let gameId = (document.getElementById("gameId") as HTMLInputElement).value.toLowerCase()
        props.socketInfo.socket.emit("createGame", gameId, props.socketInfo.userid);
    }


    useEffect(() => {
        props.socketInfo.socket.on("confirmGameCreation", (success, gameId) => {
            console.log(success, gameId);

            if (success) {
                (document.getElementById("gameId") as HTMLInputElement).value = "";
                (document.getElementById("successIndicator") as HTMLParagraphElement).innerText = "Created game " + gameId;
            }
        })

        return () => {
            props.socketInfo.socket.off("confirmGameCreation");
        }
    })



    if (currentGameCode !== null) return <></>;
    return (
        <div id={styles.gameSelectorSection}>

            <div id={styles.joinSection}>
                <div className={styles.noMargins}>
                    <p>An digital adaptation of...</p>
                    <h1>Two Rooms and a Boom</h1>
                    <p>by <a href="https://www.tuesdayknightgames.com/tworoomsandaboom">Tuesday Knight Games</a>, adapted by <a href="https://github.com/Aaron-Pierce">Aaron Pierce</a></p>
                    <p>Version 1.2</p>
                </div>
                <h2>Join a Game</h2>
                <form onSubmit={e => e.preventDefault()}>
                    <input placeholder="Your Name" id="yourNameInput" name="name" className={styles.input}></input>
                    <br />
                    <input placeholder="Game code" onChange={handleChange} value={gameCode} onKeyDown={onKeyDown} className={styles.input}></input>
                    <br />
                    <button onClick={joinGame} className={styles.btn}>Submit</button>
                </form>
            </div>
            <div id="createGame">
                <h2>Create a Game</h2>
                <input id="gameId" placeholder="gameId" onKeyDown={(evt) => evt.key === "Enter" ? createGame() : 0}></input>
                <br />
                <button onClick={createGame} className={styles.btn}>Create</button>
                <p id="successIndicator"></p>
            </div>

            <div id={styles.rulebookSection}>
                <a href="/rulebooks/TwoRooms_Rulebook_v3.pdf">Rulebook (4mb pdf)</a>
                <br></br>
                <a href="/rulebooks/TwoRooms_CharacterGuide_v3.pdf">Character Guide (1.5mb pdf)</a>
            </div>
        </div>
    )
}