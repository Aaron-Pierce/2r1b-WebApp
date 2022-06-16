import { getDefaultRoundSettingsAtPlayerCount, RoundInfo } from "../../../shared/types"

import styles from "./RoundInfoDisplay.module.css";

type RoundInfoDisplayProps = {
    roundStructure: RoundInfo[],
    activeRoundIndex: Number
}

export function RoundInfoDisplay(props: RoundInfoDisplayProps) {
    return (
        <div className={styles.roundInfoDisplayWrapper}>
            <h1>Round Structure</h1>
            <div className={styles.roundInfoDisplay}>
                {props.roundStructure.map((round, ind) => {
                    // if(ind < props.activeRoundIndex) return <></>;
                    return <div className={`${styles.roundCard} ${ind === props.activeRoundIndex ? styles.highlighted : ""}`} key={ind}>
                        <p style={{ fontWeight: 'bold' }}>{round.minutes} minute round</p>
                        <p>{round.numHostages} hostage{round.numHostages === 1 ? "" : "s"}</p>
                    </div>
                })}
            </div>
        </div>
    )
}