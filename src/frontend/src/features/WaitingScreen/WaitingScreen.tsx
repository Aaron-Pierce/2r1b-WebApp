import { useEffect, useState } from "react";
import { GameState, RoundInfo } from "../../shared/types";
import { ServerSocketInfo } from "../../App";
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectCode, selectIsCreator, selectState, setState } from "../GameSelector/gameSlice"

import styles from "./WaitingScreen.module.css";
import { Card, cardGroupFromMember, Cards } from "../../shared/cards";
import { PlaysetCard } from "./PlaysetCard/PlaysetCard";
import { InventoryCard } from "./InventoryCard/InventoryCard";
import { CardStack } from "./CardGroup/CardStack";
import { numCardsInPlayset, Playset } from "../../shared/playset";
import { PlaysetComponent } from "./Playset/PlaysetComponent";
import { RoundDesigner } from "./RoundDesigner/RoundDesiger";


export interface WaitingScreenProps {
    socketInfo: ServerSocketInfo
}

export function WaitingScreen(props: WaitingScreenProps) {

    let gameCode = useAppSelector(selectCode);
    let currentGameState = useAppSelector(selectState);
    let isGameCreator = useAppSelector(selectIsCreator);
    let dispatch = useAppDispatch();

    let [currentPlayset, setCurrentPlayset] = useState<Playset>({
        cardGroups: []
    });
    let [playsetHasUnsavedChanges, setPlaysetHasUnsavedChanges] = useState(false);


    let [nameList, setNameList] = useState<String[]>([]);

    let [lastGameStateQueryTime, setLastGameStateQueryTime] = useState<number>(0);

    let [isPlaysetViewCollapsed, setPlaysetViewCollapsed] = useState(false);

    let [gameStartErrorMessages, setGameStartErrorMessages] = useState("");


    function activateCard(card: Card) {
        let newGroup = cardGroupFromMember(card);
        // let newCardsToAdd = [card, ...Cards.filter(c => card.pairsWith.indexOf(c.cardId) !== -1)];

        // let newPlayset = [...currentPlayset, ...newCardsToAdd.filter(newCard => currentPlayset.every(other => other.cardId !== newCard.cardId))];

        for (let groups of currentPlayset.cardGroups) {
            if (!groups.cards.every(otherCard => otherCard.cardId !== card.cardId)) {
                let choice = window.confirm("This will create a duplicate card, is that okay?")
                if (!choice) return;
                else {
                    break;
                }
            }
        }

        let newPlayset: Playset = {
            cardGroups: [...currentPlayset.cardGroups, newGroup]
        }
        setCurrentPlayset(newPlayset);
        setPlaysetHasUnsavedChanges(true);
    }

    function removeStackFromPlaysetByIndex(index: number) {
        setCurrentPlayset({
            cardGroups: currentPlayset.cardGroups.filter((e, ind) => ind !== index)
        })
        setPlaysetHasUnsavedChanges(true);
    }


    useEffect(() => {
        if (gameCode !== null) {
            if (Date.now() - lastGameStateQueryTime > 1000) {
                props.socketInfo.socket.emit("queryGameState", gameCode);
                let randId = Math.random()
                props.socketInfo.socket.on("gameStateResponse", (state: GameState) => {
                    console.log("triggered event handler", randId);

                    console.log("game is in state", state);
                    if (currentGameState !== state) {
                        dispatch(setState(state));
                    }
                    setLastGameStateQueryTime(Date.now());
                });
            }

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

            props.socketInfo.socket.on("newPlayset", (playset: Playset) => {
                console.log("new playset: ", playset);

                setCurrentPlayset(playset);
                setPlaysetHasUnsavedChanges(false);
            })

            props.socketInfo.socket.on("confirmNewRoundInfo", (hasError: boolean, message: string) => {
                if(hasError){
                    alert(message)
                } else {
                    alert("Successfully updated round info");
                }
            })
            
            return () => {
                props.socketInfo.socket.off("gameStateResponse");
                props.socketInfo.socket.off("namesList");
                props.socketInfo.socket.off("announceJoin");
                props.socketInfo.socket.off("newPlayset");
                props.socketInfo.socket.off("confirmNewRoundInfo");
            }
        }
    })

    function setPlayset() {
        if (gameCode !== null) {
            props.socketInfo.socket.emit("setPlayset", gameCode, currentPlayset);
        }
    }

    function setRoundInfo(roundInfo: RoundInfo[]){
        if(gameCode !== null){
            props.socketInfo.socket.emit("setRoundInfo", gameCode, roundInfo);
        }
    }

    function sendStartGameMessage(){
        console.log("trying to send startGame");
        
        if(gameCode !== null){
            props.socketInfo.socket.emit("requestStartGame", gameCode);
        }
    }


    if (gameCode == null) return <></>;
    if (currentGameState !== GameState.WaitingOnPlayers) return <></>;

    return (
        <div id="waitingScreen">
            <h1>{gameCode}</h1>
            <div id="nameList">
                <p>Players ({nameList.length}): {nameList.join(", ")}</p>
            </div>
            <hr />

            {isGameCreator && (
                <RoundDesigner playerCount={nameList.length} submitRoundInfo={setRoundInfo}></RoundDesigner>
            )}

            {isGameCreator && (
                <span>
                    <input id="collapsePlaysetDesignerCheckbox" type={"checkbox"} checked={isPlaysetViewCollapsed} onChange={() => setPlaysetViewCollapsed(!isPlaysetViewCollapsed)}></input>
                    <label htmlFor="collapsePlaysetDesignerCheckbox">Collapse Playset Designer</label>
                </span>
            )}


            {isGameCreator ? (
                !isPlaysetViewCollapsed && (
                    <div id="playsetDesigner">
                        <PlaysetComponent isEditable={isGameCreator} playset={currentPlayset} removeCallback={(ind) => removeStackFromPlaysetByIndex(ind)} hasUnsavedChanges={playsetHasUnsavedChanges} confirmPlaysetCallback={() => setPlayset()}></PlaysetComponent>
                        <div id="cardInventory">
                            {
                                Cards.map(card => (
                                    <InventoryCard key={card.cardId.toString()} card={card} activePlayset={currentPlayset} activateCard={activateCard}></InventoryCard>
                                ))
                            }
                        </div>
                    </div>
                )
            ) : (
                <PlaysetComponent isEditable={false} playset={currentPlayset}></PlaysetComponent>
            )}

            {
                isGameCreator && (
                    <div style={{padding: '2em'}}>
                        <button onClick={() => sendStartGameMessage()}>Start Game</button>
                        <p>{gameStartErrorMessages}</p>
                    </div>
                )
            }


        </div>
    )
}