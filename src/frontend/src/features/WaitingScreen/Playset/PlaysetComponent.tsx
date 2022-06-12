import React, { useState } from "react";
import { getCardsFromPlayset } from "../../../shared/cards";
import { numCardsInPlayset, Playset } from "../../../shared/playset";
import { CardStack } from "../CardGroup/CardStack";
import { PlaysetCard } from "../PlaysetCard/PlaysetCard";

import styles from "./PlaysetComponent.module.css";

interface PlaysetComponentProps {
    playset: Playset,
    isEditable: Boolean,
    removeCallback?: (indexToRemove: number) => void,
    hasUnsavedChanges?: Boolean,
    confirmPlaysetCallback?: () => void;
    groupCards: Boolean
}

export function PlaysetComponent(props: PlaysetComponentProps) {

    let [isSticky, setIsSticky] = useState(true);

    if(props.isEditable){
        if(props.removeCallback === undefined) throw "Editable PlaysetComponent must have a removeCallback"
        if(props.hasUnsavedChanges === undefined) throw "Editable PlaysetComponent must have a hasUnsavedChanges prop set"
        if(props.confirmPlaysetCallback === undefined) throw "Editable PlaysetComponent must have a confirmPlaysetCallback"
    }

    

    return (
        <div id={styles.playsetWrapper} className={`${props.hasUnsavedChanges && styles.playsetUnsaved} ${isSticky && styles.sticky}`}>
            <h1>Current Playset ({numCardsInPlayset(props.playset)})</h1>
            <div id={styles.playsetRow}>
                {/* {
                                currentPlayset.map(card => <PlaysetCard key={card.cardId.toString()} card={card}></PlaysetCard>)
                            } */}

                {props.groupCards && 
                    props.playset.cardGroups.map((group, ind) => <CardStack key={ind} group={group} playset={props.playset} removeCallback={() => props.removeCallback && props.removeCallback(ind)}></CardStack>)
                }
                {
                    !props.groupCards &&
                    getCardsFromPlayset(props.playset).map((card, ind) => <PlaysetCard card={card} key={card.cardId.toString() + ind}></PlaysetCard>)
                }
            </div>
            {
                props.isEditable && (
                    <div style={{display: 'inline-block'}}>
                        <button onClick={props.confirmPlaysetCallback}>Set Playset</button>
                        
                        <span style={{verticalAlign: 'middle'}}>
                            <input type={"checkbox"} checked={isSticky} onChange={() => setIsSticky(!isSticky)}></input>
                            <label>Sticky</label>
                        </span>
                    </div>
                )
            }
        </div>
    )
}