import { useState } from "react";
import { ServerSocketInfo } from "../../App";
import { useAppSelector } from "../../app/hooks";
import { GameState } from "../../shared/types";
import { selectPlayerInfo, selectState } from "../GameSelector/gameSlice";
import { PlaysetComponent } from "../WaitingScreen/Playset/PlaysetComponent";


import styles from "./GameView.module.css";
import { PlayerCard } from "./PlayerCard/PlayerCard";

interface GameViewProps {
    socketInfo: ServerSocketInfo;
}
export function GameView(props: GameViewProps) {

    let currentState = useAppSelector(selectState);
    let playerInfo = useAppSelector(selectPlayerInfo);

    let [playsetVisible, setPlaysetVisible] = useState(false);

    if (playerInfo === null) return <></>;
    if (currentState !== GameState.InRound && currentState !== GameState.RoundStart) return <></>;
    return (
        <div id={styles.gameView}>
            <div id={styles.cardPanel}>
                <PlayerCard card={playerInfo.card}></PlayerCard>
                <div id={styles.layout}>
                    <div>
                    </div>
                    <div style={{ backgroundColor: 'blue' }}></div>
                </div>
            </div>

            <div id={styles.infoPanel}>
                
            </div>
        </div>
    )
}