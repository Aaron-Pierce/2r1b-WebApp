import { useState } from "react"
import { cardGroupEqual, numCardsInPlayset, Playset } from "../../../shared/playset";
import styles from "./SavedPlaysets.module.css";



interface SavedPlayset {
    name: String,
    playset: Playset
}


interface SavedPlaysetsProps{
    overwriteCallback: (p: Playset) => void;
    mergeCallback: (p: Playset) => void;
}

export function mergePlaysetWith(currentPlayset: Playset, otherPlayset: Playset, setCurrentPlayset: (p: Playset) => void){
    console.log("Merging");
    
    let cardGroups = [...currentPlayset.cardGroups];
    for(let groupToAdd of otherPlayset.cardGroups){
        let alreadyInPlayset = false;
        for(let group of currentPlayset.cardGroups){
            if(cardGroupEqual(group, groupToAdd)){
                alreadyInPlayset = true;
                break;
            }   
        }
        if(!alreadyInPlayset){
            cardGroups.push(groupToAdd)
        }
    }

    console.log("Setting new playset with", cardGroups);
    
    setCurrentPlayset({
        cardGroups: cardGroups
    });
}


export function SavedPlaysets(props: SavedPlaysetsProps){
    let [savedPlaysets, setSavedPlaysets] = useState<SavedPlayset[]>(JSON.parse(localStorage.getItem("savedPlaysets") || "[]"));
    if(savedPlaysets.length === 0) return <></>;

    return (
            <>
                <h3>Use a Saved Playset</h3>
                <div className={styles.savedPlaysetsWrapper}>
                    {savedPlaysets.map((e, ind) => (
                        <div key={ind} className={styles.savedPlayset}>
                            <p><b>{e.name} ({numCardsInPlayset(e.playset)})</b></p>
                                {e.playset.cardGroups.map((group, groupIndex) => (
                                    <p key={groupIndex}>- {group.cards.map(e => e.displayName).join(", ")}</p>
                                ))}
                            <button onClick={() => props.mergeCallback(e.playset)}>Add to playset</button>
                            <button onClick={() => props.overwriteCallback(e.playset)}>Overwrite playset</button>
                            <button onClick={() => {
                                let filtered = savedPlaysets.filter((_, i) => i !== ind);
                                localStorage.setItem("savedPlaysets", JSON.stringify(filtered));
                                setSavedPlaysets(filtered);
                            }}> Delete this</button>
                        </div>
                    ))}
                </div>
            </>
    )
}