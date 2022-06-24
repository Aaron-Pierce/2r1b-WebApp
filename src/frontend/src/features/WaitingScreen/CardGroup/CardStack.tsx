import React from "react";
import { CardGroup } from "../../../shared/cards";
import { Playset } from "../../../shared/playset";
import styles from "./CardStack.module.css";
import { GroupedCard } from "./StackedCard/StackedCard";

interface CardStackProps {
    group: CardGroup,
    playset: Playset,
    removeCallback: () => void;
}

export function CardStack(props: CardStackProps){
    return (
    <div className={styles.cardGroup} onClick={props.removeCallback}>
        {
            props.group.cards.map((card, ind) => <GroupedCard key={card.cardId.toString()} card={card} index={ind}></GroupedCard>)
        }
    </div>
    )
}