import { useEffect, useState } from "react";
import { ServerSocketInfo } from "../../App";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { GameState } from "../../shared/types";
import { selectCode, selectIsCreator, selectPlayerInfo, selectRoundEndUTCString, selectRoundIndex, selectState, setRoundEndUTCString, setRoundIndex } from "../GameSelector/gameSlice";
import { PlaysetComponent } from "../WaitingScreen/Playset/PlaysetComponent";


import styles from "./GameView.module.css";
import { PlayerCard } from "./PlayerCard/PlayerCard";
import { RoundInfoDisplay } from "./RoundInfo/RoundInfoDisplay";


interface GameViewProps {
    socketInfo: ServerSocketInfo;
}
export function GameView(props: GameViewProps) {

    let currentState = useAppSelector(selectState);
    let gameCode = useAppSelector(selectCode);
    let playerInfo = useAppSelector(selectPlayerInfo);
    let isCreator = useAppSelector(selectIsCreator);
    let roundEndUTCString = useAppSelector(selectRoundEndUTCString);
    let roundIndex = useAppSelector(selectRoundIndex);

    let [publicRevealed, setPublicRevealed] = useState(false);

    let [roundIsLive, setRoundIsLive] = useState(true);

    let dispatch = useAppDispatch();

    let [timerString, setTimerString] = useState("");
    // let [roundIndex, setRoundIndex] = useState(0);

    useEffect(() => {
        let timerLoop = setInterval(() => {
            if (roundEndUTCString) {
                let roundEndDate = new Date(roundEndUTCString.toString());
                let secondUntilThen = Math.floor((roundEndDate.getTime() - Date.now()) / 1000);
                if (secondUntilThen < 0) {
                    setTimerString("0:00");
                    if (roundIsLive) {
                        if (navigator.vibrate !== undefined) {
                            navigator.vibrate([100, 100, 100, 100, 100, 100]);
                        }
                        setRoundIsLive(false);
                    }
                } else {
                    let minutes = Math.floor(secondUntilThen / 60);
                    let seconds = secondUntilThen % 60;
                    setTimerString(
                        `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`
                    )
                }
            }
        }, 1000);

        let newRoundHandler = (newRoundIndex: number, roundEndUTCString: String) => {
            dispatch(setRoundEndUTCString(roundEndUTCString.toString()))
            dispatch(setRoundIndex(newRoundIndex));
            setRoundIsLive(true);
        }

        props.socketInfo.socket.on("newRound", newRoundHandler);
        return () => {
            clearInterval(timerLoop);
            props.socketInfo.socket.off("newRound", newRoundHandler);
        }
    })

    function requestAdvanceRound() {
        if (gameCode) {
            props.socketInfo.socket.emit("requestAdvanceRound", gameCode);
        }
    }

    function requestEndGame() {
        if (gameCode) {
            props.socketInfo.socket.emit("requestGameEnd", gameCode);
        }
    }

    function requestBuriedCard(){
        if(gameCode){
            props.socketInfo.socket.emit("getBuriedCard", gameCode);
        }
    }
    
    if (playerInfo === null) return <></>;
    if (playerInfo.card === null || playerInfo.card === undefined) {
        return (
            <p>You weren't dealt a card - this probably means you joined while the game was running. You will be dealt in for the next game.</p>
        )
    }
    if (currentState !== GameState.InRound && currentState !== GameState.RoundStart) return <></>;
    return (
        <div id={styles.gameView}>
            <div id={styles.cardPanel}>
                <div id={styles.floatingHeader}>
                    <div style={{ textAlign: 'left' }}>
                        {/* left */}
                        <p>{timerString}</p>
                    </div>
                    <div>
                        {/* middle */}
                        <p>{localStorage.getItem("playerName") || ""}</p>
                    </div>
                    <div>
                        {/* right */}
                    </div>
                </div>
                <PlayerCard card={playerInfo.card} publicRevealed={publicRevealed}></PlayerCard>
                <div id={styles.layout}>
                    <div>
                    </div>
                    <div style={{ backgroundColor: 'blue' }}></div>
                </div>
            </div>

            <div id={styles.infoPanel} className={styles.removeH1Margin}>
                <hr style={{ marginTop: '5.3em' }}></hr>

                {
                    isCreator && roundEndUTCString && (Date.now() - new Date(roundEndUTCString.toString()).getTime() >= -1000) && roundIndex !== (playerInfo.roundStructure.length - 1) && (
                        <button onClick={() => requestAdvanceRound()}>Advance Round</button>
                    )
                }
                {
                    isCreator && roundEndUTCString && (Date.now() - new Date(roundEndUTCString.toString()).getTime() >= -1000) && roundIndex === (playerInfo.roundStructure.length - 1) && (
                        <button onClick={() => requestEndGame()}>End Game</button>
                    )
                }
                
                {
                    isCreator && roundEndUTCString && (Date.now() - new Date(roundEndUTCString.toString()).getTime() >= -1000) && roundIndex === (playerInfo.roundStructure.length - 1) && (
                        <button onClick={() => requestBuriedCard()}>Get Buried Card</button>
                    )
                }

                <div style={{marginTop: "0.2em"}}>
                    <RoundInfoDisplay roundStructure={playerInfo.roundStructure} activeRoundIndex={roundIndex}></RoundInfoDisplay>
                </div>

                <div style={{}}>
                    <PlaysetComponent style={{paddingTop: 0}} isEditable={false} playset={playerInfo.activePlayset} groupCards={false} showBorder={false}></PlaysetComponent>
                </div>

                <hr></hr>
                <div style={{fontSize: "1.25em"}}>
                    <input type={"checkbox"} id="publicRevealCheckbox" style={{transform: "scale(1.5)"}} checked={publicRevealed} onChange={() => setPublicRevealed(!publicRevealed)}></input>
                    <label style={{marginLeft: "0.25em"}} htmlFor="publicRevealCheckbox">Always show card? (public reveal)</label>
                </div>

            </div>
        </div>
    )
}