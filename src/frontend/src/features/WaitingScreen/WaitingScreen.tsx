import { useEffect, useState } from "react";
import { GameState, RoundInfo } from "../../shared/types";
import { ServerSocketInfo } from "../../App";
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectCode, selectIsCreator, selectNamesList, selectState, setState } from "../GameSelector/gameSlice"

import styles from "./WaitingScreen.module.css";
import { Card, cardGroupFromMember, Cards, getCardsFromPlayset } from "../../shared/cards";
import { PlaysetCard } from "./PlaysetCard/PlaysetCard";
import { InventoryCard } from "./InventoryCard/InventoryCard";
import { CardStack } from "./CardGroup/CardStack";
import { numCardsInPlayset, Playset, cardGroupEqual } from "../../shared/playset";
import { PlaysetComponent } from "./Playset/PlaysetComponent";
import { RoundDesigner } from "./RoundDesigner/RoundDesiger";
import { mergePlaysetWith, SavedPlaysets } from "./SavedPlaysets/SavedPlaysets";


export interface WaitingScreenProps {
    socketInfo: ServerSocketInfo
}


export function WaitingScreen(props: WaitingScreenProps) {

    let gameCode = useAppSelector(selectCode);
    let currentGameState = useAppSelector(selectState);
    let isGameCreator = useAppSelector(selectIsCreator);
    let namesList = useAppSelector(selectNamesList);
    let dispatch = useAppDispatch();

    let [currentPlayset, setCurrentPlayset] = useState<Playset>({
        cardGroups: []
    });


    let [playsetHasUnsavedChanges, setPlaysetHasUnsavedChanges] = useState(false);


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

            props.socketInfo.socket.on("newPlayset", (playset: Playset) => {
                console.log("new playset: ", playset);

                setCurrentPlayset(playset);
                setPlaysetHasUnsavedChanges(false);
            })

            props.socketInfo.socket.on("confirmNewRoundInfo", (hasError: boolean, message: string) => {
                if (hasError) {
                    alert(message)
                } else {
                    alert("Successfully updated round info");
                }
            })

            return () => {
                props.socketInfo.socket.off("gameStateResponse");
                props.socketInfo.socket.off("newPlayset");
                props.socketInfo.socket.off("confirmNewRoundInfo");
            }
        }
    });

    useEffect(() => {
        console.log("entered useeffect for gamecode", gameCode);

        if (gameCode !== null) {
            console.log("emitted gameset request.");
            props.socketInfo.socket.emit("getPlayset", gameCode);
        }
    }, [gameCode]);

    function setPlayset() {
        if (gameCode !== null) {
            props.socketInfo.socket.emit("setPlayset", gameCode, currentPlayset);
        }
    }

    function setRoundInfo(roundInfo: RoundInfo[]) {
        if (gameCode !== null) {
            props.socketInfo.socket.emit("setRoundInfo", gameCode, roundInfo);
        }
    }

    function sendStartGameMessage() {
        console.log("trying to send startGame");

        if (gameCode !== null) {
            props.socketInfo.socket.emit("requestStartGame", gameCode);
        }
    }


    if (gameCode == null) return <></>;
    if (currentGameState !== GameState.WaitingOnPlayers) return <></>;

    return (
        <div id={styles.waitingScreen}>
            <h1><span style={{ color: `rgba(0, 0, 0, 0.7)`, fontWeight: 'lighter' }}>Game Code:</span> {gameCode}</h1>
            <div id="nameList">
                <p>Players ({namesList.length}): {namesList.join(", ")}</p>
            </div>

            <div className={styles.gameConfigureSection}>
                {isGameCreator && (
                    <RoundDesigner playerCount={namesList.length} submitRoundInfo={setRoundInfo}></RoundDesigner>
                )}
            </div>

            <div className={styles.gameConfigureSection}>
                {isGameCreator && (
                    <span>
                        <input id="collapsePlaysetDesignerCheckbox" type={"checkbox"} checked={isPlaysetViewCollapsed} onChange={() => setPlaysetViewCollapsed(!isPlaysetViewCollapsed)}></input>
                        <label htmlFor="collapsePlaysetDesignerCheckbox">Collapse Playset Designer</label>
                    </span>
                )}
                {isGameCreator ? (
                    !isPlaysetViewCollapsed && (
                        <div id="playsetDesigner">
                            <PlaysetComponent groupCards={true} isEditable={isGameCreator} playset={currentPlayset} removeCallback={(ind) => removeStackFromPlaysetByIndex(ind)} hasUnsavedChanges={playsetHasUnsavedChanges} confirmPlaysetCallback={() => setPlayset()}></PlaysetComponent>

                            <SavedPlaysets mergeCallback={(playset: Playset) => {
                                mergePlaysetWith(currentPlayset, playset, setCurrentPlayset)
                                setPlaysetHasUnsavedChanges(true);
                            }}
                                overwriteCallback={(p: Playset) => {
                                    setCurrentPlayset(p)
                                    setPlaysetHasUnsavedChanges(true);
                                }}
                            ></SavedPlaysets>
                            <div id="cardInventory" style={{ marginTop: "2em" }}>
                                {
                                    Cards.map(card => (
                                        <InventoryCard key={card.cardId.toString()} card={card} activePlayset={currentPlayset} activateCard={activateCard}></InventoryCard>
                                    ))
                                }
                            </div>
                        </div>
                    )
                ) : (
                    <PlaysetComponent isEditable={false} playset={currentPlayset} groupCards={true}></PlaysetComponent>
                )}
            </div>

            <div className={styles.gameConfigureSection}>
                {
                    isGameCreator && (
                        <div style={{ paddingBottom: '2em', fontSize: "2em" }}>
                            <button onClick={() => sendStartGameMessage()}>Start Game</button>
                            <p>{gameStartErrorMessages}</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
