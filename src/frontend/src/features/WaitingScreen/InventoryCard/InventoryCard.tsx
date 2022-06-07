import { Card } from "../../../shared/cards";

import styles from "./InventoryCard.module.css";

export interface InventoryCardProps {
    card: Card,
    activePlayset: Card[],
    activateCard: (card: Card) => void,
}

export function InventoryCard(props: InventoryCardProps){
    return <div className={styles.inventoryCard}>
        <img src={"cardImages/" + props.card.cardId + ".jpg"} onClick={() => props.activateCard(props.card)}></img>
    </div>
}