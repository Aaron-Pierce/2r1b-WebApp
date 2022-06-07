import React from "react";
import { Card, Cards } from "../../../shared/cards";
import styles from "./CardGroup.module.css";

interface CardGroupProps {
    from: Card,
    playset: Card[]
}

export function CardGroup(props: CardGroupProps){
    let foundSelf = false;
    for(let card of props.playset){
        if(card.cardId === props.from.cardId){
            foundSelf = true;
        } else {
            if(card.pairsWith.indexOf(props.from.cardId) !== -1 && !foundSelf){
                return <></>
            }
        }
    }
    return (
    <div className={styles.cardGroup}>
        {
            <p>|{props.from.displayName}, {props.from.pairsWith.map(e => Cards.filter(c => c.cardId === e)[0].displayName).join(", ")}|</p>
        }
    </div>
    )
}