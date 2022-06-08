import { Card } from "../../../../shared/cards";
import styles from "./StackedCard.module.css";

interface GroupedCardProps{
    card: Card,
    index: number
}

export function GroupedCard(props: GroupedCardProps){
    return <div className={styles.groupedCard} style={{top: `-${Math.max(0, 100 - props.index * 10 + 100*(props.index-1))}%`, left: `${5 * props.index}%`}}>
        <img src={`/cardImages/${props.card.cardId}.jpg`}></img>
    </div>
}