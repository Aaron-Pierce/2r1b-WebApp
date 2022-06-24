import { useEffect, useState } from "react";
import { Card, cardGroupFromMember, Cards, getCardsFromPlayset } from "../../shared/cards";
import { cardGroupEqual, numCardsInPlayset, Playset } from "../../shared/playset";
import { InventoryCard } from "../WaitingScreen/InventoryCard/InventoryCard";
import { PlaysetComponent } from "../WaitingScreen/Playset/PlaysetComponent";
import { mergePlaysetWith, SavedPlaysets } from "../WaitingScreen/SavedPlaysets/SavedPlaysets";
import styles from "./ManualDeal.module.css";
import { QRCodeSVG } from "qrcode.react"
import { PlayerCard } from "../GameView/PlayerCard/PlayerCard";


interface SavedPlayset {
    name: String,
    playset: Playset
}



function hashCode(str: String) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}


export function ManualDeal() {
    let [currentPlayset, setCurrentPlayset] = useState<Playset>({ cardGroups: [] })
    let [dealMode, setDealMode] = useState(false);
    let [playerCard, setPlayerCard] = useState<Card | null>(null);
    let [shouldLinkDirectlyToImage, setShouldLinkDirectlyToImage] = useState(false);

    useEffect(() => {
        if(window.location.hash){
            console.log("hash is ", window.location.hash);
            
            let hashedCardId = window.location.hash.substring(1);
            console.log("Stripped card id");
            
            for(let c of Cards){
                if(hashCode(c.cardId) === parseInt(hashedCardId)){
                    console.log("Found cardId match", c);
                    setPlayerCard(c);
                    break;
                }
            }
        }
    }, [])


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

    if(playerCard){
        return (
            <PlayerCard card={playerCard} publicRevealed={false}></PlayerCard>
        )
    }

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
                        <input onChange={() => setShouldLinkDirectlyToImage(!shouldLinkDirectlyToImage)} checked={shouldLinkDirectlyToImage} type={"checkbox"} name="useImageCheckbox" id="useImageCheckbox"></input>
                        <label htmlFor="useImageCheckbox">Should link directly to image?</label>
                        <div id={styles.qrCodeWrapper}>
                            {
                                getShuffledCardsFromPlayset().map((card, index, arr) => {
                                    let cardUrl = window.location.origin + "/?manual#" + hashCode(card.cardId);
                                    if(shouldLinkDirectlyToImage){
                                        cardUrl = window.location.origin + "/cardImages/" + card.cardId + ".jpg"
                                    }
                                    return <div className={`${styles.dealtQRCode} ${shouldLinkDirectlyToImage && styles.backgroundTint}`} key={card.displayName + index.toString()}>
                                        {/* <h1>{card.cardId}</h1> */}
                                        <div onClick={() => {
                                            let confirm = window.confirm("Open card in new window?")
                                            if(confirm) window.open(cardUrl);
                                        }}>
                                            {/* <QRCodeSVG size={256} value={window.location.origin + "/cardImages/" + card.cardId + ".jpg"} /> */}
                                            <QRCodeSVG size={256} value={cardUrl} />
                                        </div>
                                        <h1>{index + 1} / {arr.length}</h1>
                                    </div>
                                })
                            }
                        </div>
                        <div style={{ padding: "1em", paddingBottom: "3em" }}>
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
