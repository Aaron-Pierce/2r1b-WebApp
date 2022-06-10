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

    function getSrc() {
        if (cardVisibility === "none") {
            return `cardImages/cardback.jpg`
        } else if (cardVisibility === "always") {
            return `cardImages/${props.card.cardId}.jpg`;
        } else {
            return `cardImages/${props.card.cardId}.jpg`
        }
    }

    return <div className={styles.playerCardWrapper}>
        <div className={styles.cardWrapper}>
            <img src={getSrc()} className={((cardVisibility === "colorshare") ? styles.colorShare : " ")}></img>
        </div>
        <div className={styles.controlsWrapper}>
            <div>
                <button onTouchStart={pressRevealColor} onMouseDown={pressRevealColor} onTouchEnd={releaseButton} onTouchCancel={releaseButton} onMouseUp={releaseButton}>
                    Reveal Color (hold)
                </button>
            </div>
            <div>

                <button onTouchStart={pressRevealCard} onMouseDown={pressRevealCard} onTouchEnd={releaseButton} onTouchCancel={releaseButton} onMouseUp={releaseButton}>
                    Reveal Card (hold)
                </button>
            </div>
        </div>
    </div>
}