import { useState } from "react";
import { Card, cardGroupFromMember, Cards, getCardsFromPlayset } from "../../shared/cards";
import { cardGroupEqual, numCardsInPlayset, Playset } from "../../shared/playset";
import { InventoryCard } from "../WaitingScreen/InventoryCard/InventoryCard";
import { PlaysetComponent } from "../WaitingScreen/Playset/PlaysetComponent";
import { mergePlaysetWith, SavedPlaysets } from "../WaitingScreen/SavedPlaysets/SavedPlaysets";
import styles from "./ManualDeal.module.css";
import { QRCodeSVG } from "qrcode.react"


interface SavedPlayset {
    name: String,
    playset: Playset
}



export function ManualDeal() {
    let [currentPlayset, setCurrentPlayset] = useState<Playset>({ cardGroups: [] })
    let [dealMode, setDealMode] = useState(false);

    // https://bost.ocks.org/mike/shuffle/
    function getShuffledCardsFromPlayset() {
        function shuffle(array: Card[]): Card[] {
            var m = array.length, t, i;

            // While there remain elements to shuffle…
            while (m) {

                // Pick a remaining element…
                i = Math.floor(Math.random() * m--);

                // And swap it with the current element.
                t = array[m];
                array[m] = array[i];
                array[i] = t;
            }

            return array;
        }

        return shuffle([...getCardsFromPlayset(currentPlayset)])
    }



    function activateCard(card: Card) {
        let newGroup = cardGroupFromMember(card);

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
    }

    function removeStackFromPlaysetByIndex(index: number) {
        setCurrentPlayset({
            cardGroups: currentPlayset.cardGroups.filter((e, ind) => ind !== index)
        })
    }

    let savedPlaysets: SavedPlayset[] = JSON.parse(localStorage.getItem("savedPlaysets") || "[]");

    return (
        <div id={styles.manualDeal}>
            <div id="topAnchor"></div>
            {
                !dealMode && (
                    <>
                        <h1>Manual Deal</h1>
                        <div id="playsetDesigner">
                            <PlaysetComponent groupCards={true} isEditable={true} playset={currentPlayset} removeCallback={(ind) => removeStackFromPlaysetByIndex(ind)} hasUnsavedChanges={false} confirmPlaysetCallback={() => { }}></PlaysetComponent>

                            <SavedPlaysets mergeCallback={(playset: Playset) => {
                                mergePlaysetWith(currentPlayset, playset, setCurrentPlayset)
                            }}
                                overwriteCallback={(p: Playset) => {
                                    setCurrentPlayset(p)
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
                        <div style={{ paddingTop: "3em", paddingBottom: "3em" }}>
                            <button onClick={() => {
                                window.scrollTo(0, 0);
                                document.getElementById("topAnchor")?.scrollIntoView();
                                setDealMode(!dealMode);
                            }}>Toggle deal mode</button>
                        </div>
                    </>
                )
            }

            {
                dealMode && (
                    <>
                        <div id={styles.qrCodeWrapper}>
                            {
                                getShuffledCardsFromPlayset().map((card, index, arr) => {
                                    return <div className={styles.dealtQRCode} key={card.displayName + index.toString()}>
                                        {/* <h1>{card.cardId}</h1> */}
                                        <div onClick={() => {
                                            let confirm = window.confirm("Open card in new window?")
                                            if(confirm) window.open(window.location.origin + "/cardImages/" + card.cardId + ".jpg");
                                        }}>
                                            <QRCodeSVG size={256} value={window.location.origin + "/cardImages/" + card.cardId + ".jpg"} />
                                        </div>
                                        <h1>{index + 1} / {arr.length}</h1>
                                    </div>
                                })
                            }
                        </div>
                        <div style={{ padding: "1em" }}>
                            <button onClick={() => {
                                document.getElementById("topAnchor")?.scrollIntoView();
                                setDealMode(!dealMode);
                            }}>Toggle deal mode</button>
                        </div>
                    </>
                )
            }
        </div>
    )
}
