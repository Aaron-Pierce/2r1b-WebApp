import React, { useState } from "react";
import { Card } from "../../../shared/cards";
import styles from "./PlayerCard.module.css";

interface PlayerCardProps {
    card: Card
}

export function PlayerCard(props: PlayerCardProps) {

    let [cardVisibility, setCardVisibility] = useState<"none" | "colorshare" | "cardshare" | "always">("none");

    function pressRevealColor() {
        setCardVisibility("colorshare");
    }



    function pressRevealCard() {
        setCardVisibility("cardshare");
    }

    function releaseButton() {
        if (cardVisibility === "cardshare" || cardVisibility === "colorshare") {
            setCardVisibility("none");
        }
    }

    return <div className={styles.playerCardWrapper}>
        <div className={styles.cardWrapper}>
            <img src={`cardImages/${props.card.cardId}.jpg`} className={
                `${cardVisibility !== "none" ? "" : styles.hidden} ${cardVisibility === "colorshare" ? styles.colorShare : ""}`
            }></img>
            <img src={`cardImages/cardback.jpg`} className={
                `${cardVisibility === "none" ?  "" : styles.hidden}`
            }></img>
        </div>
        <div className={styles.controlsWrapper}>
            <div>
                <button className={styles.holdButton} onTouchStart={pressRevealColor} onMouseDown={pressRevealColor} onTouchEnd={releaseButton} onTouchCancel={releaseButton} onMouseUp={releaseButton}>
                    COLOR <br/> SHARE
                </button>
            </div>
            <div>

                <button className={styles.holdButton} onTouchStart={pressRevealCard} onMouseDown={pressRevealCard} onTouchEnd={releaseButton} onTouchCancel={releaseButton} onMouseUp={releaseButton}>
                    CARD <br/> SHARE
                </button>
            </div>
        </div>
    </div>
}