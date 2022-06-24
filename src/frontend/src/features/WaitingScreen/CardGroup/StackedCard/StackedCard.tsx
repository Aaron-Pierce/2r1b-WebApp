import { Card } from "../../../../shared/cards";
import styles from "./StackedCard.module.css";

interface GroupedCardProps{
    card: Card,
    index: number
}

export function GroupedCard(props: GroupedCardProps){
    return <div className={styles.groupedCard} style={{top: `-${Math.max(0, 250*(props.index) - 10*props.index)}px`, left: `${10 * props.index}px`}}>
        <img alt="A two rooms card" src={`/cardImages/${props.card.cardId}.jpg`}></img>
    </div>
}