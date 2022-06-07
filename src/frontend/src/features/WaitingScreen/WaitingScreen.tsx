import { useEffect, useState } from "react";
import { GameState } from "../../shared/types";
import { ServerSocketInfo } from "../../App";
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { GameInfo, selectCode, selectIsCreator, selectState, setState } from "../GameSelector/gameSlice"

import styles from "./WaitingScreen.module.css";
import { Card, Cards } from "../../shared/cards";
import { PlaysetCard } from "./PlaysetCard/PlaysetCard";
import { InventoryCard } from "./InventoryCard/InventoryCard";
import { CardGroup } from "./CardGroup/CardGroup";


export interface WaitingScreenProps {
    socketInfo: ServerSocketInfo
}

export function WaitingScreen(props: WaitingScreenProps) {

    let gameCode = useAppSelector(selectCode);
    let currentGameState = useAppSelector(selectState);
    let isGameCreator = useAppSelector(selectIsCreator);
    let dispatch = useAppDispatch();

    let [currentPlayset, setCurrentPlayset] = useState<Card[]>([]);


    let [nameList, setNameList] = useState<String[]>([]);


    function activateCard(card: Card) {
        let newCardsToAdd = [card, ...Cards.filter(c => card.pairsWith.indexOf(c.cardId) !== -1)];

        let newPlayset = [...currentPlayset, ...newCardsToAdd.filter(newCard => currentPlayset.every(other => other.cardId !== newCard.cardId))];
        setCurrentPlayset(newPlayset);
    }


    useEffect(() => {
        if (gameCode !== null) {
            props.socketInfo.socket.emit("queryGameState", gameCode);
            props.socketInfo.socket.on("gameStateResponse", (state: GameState) => {
                console.log("game is in state", state);
                if (currentGameState !== state) {
                    dispatch(setState(state));
                }
            });

            props.socketInfo.socket.on("namesList", (list: String[]) => {
                console.log("got names list", list);
                setNameList(list);
            });

            props.socketInfo.socket.on("announceJoin", (name: String) => {
                setNameList([...nameList, name]);
            })
            if (nameList.length === 0) {
                props.socketInfo.socket.emit("getNamesList", gameCode);
            }
        }
    })


    if (gameCode == null) return <></>;
    if (currentGameState !== GameState.WaitingOnPlayers) return <></>;


    return (
        <div id="waitingScreen">
            <h1>{gameCode}</h1>
            <div id="nameList">
                <p>Players ({nameList.length}): {nameList.join(", ")}</p>
            </div>
            <hr />
            {isGameCreator ? (
                <div id="playsetDesigner">
                    <p>Design a playset..</p>
                    <div id={styles.playsetWrapper}>
                        <h1>Current Playset ({currentPlayset.length})</h1>
                        <div id={styles.playsetRow}>
                            {/* {
                                currentPlayset.map(card => <PlaysetCard key={card.cardId.toString()} card={card}></PlaysetCard>)
                            } */}

                            {
                                currentPlayset.map(card => <CardGroup from={card} playset={currentPlayset}></CardGroup>)
                            }
                        </div>
                    </div>
                    <div id="cardInventory">
                        {
                            Cards.map(card => (
                                <InventoryCard key={card.cardId.toString()} card={card} activePlayset={currentPlayset} activateCard={activateCard}></InventoryCard>
                            ))
                        }
                    </div>
                </div>
            ) : <></>}
        </div>
    )
}