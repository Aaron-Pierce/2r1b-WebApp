import { Card } from "../../../shared/cards";
import styles from "./PlaysetCard.module.css";

export interface PlaysetCardProps{
    card: Card,
}

export function PlaysetCard(props: PlaysetCardProps){
    return (
        <div className={styles.playsetCard}>
            <img src={`/cardImages/${props.card.cardId}.jpg`}></img>
        </div>
    )
}