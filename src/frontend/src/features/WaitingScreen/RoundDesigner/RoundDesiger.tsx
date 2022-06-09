import { useState } from "react"
import { getDefaultRoundSettingsAtPlayerCount, RoundInfo } from "../../../shared/types";
import styles from "./RoundDesiger.module.css"


interface AddAnotherRoundCardProps{
    callback: () => void;
}
function AddAnotherRoundCard(props: AddAnotherRoundCardProps) {
    return <div className={styles.roundCard} style={{display: "inline-flex", justifyContent: "center", alignItems: "center"}}>
        <button onClick={props.callback}>+</button>
    </div>
}

interface RoundCardProps {
    roundInfo: RoundInfo,
    changeRoundInfoCallback: (minutes: number, hostages: number) => void,
    index: number
}

function RoundCard(props: RoundCardProps) {
    let [numMinutes, setNumMinutes] = useState(props.roundInfo.minutes)
    let [numHostages, setNumHostages] = useState(props.roundInfo.numHostages);

    return (
        <div className={styles.roundCard}>
            <p>Round {props.index + 1}</p>
            <input type={"number"} value={numMinutes} onChange={e => {setNumMinutes(parseInt(e.target.value)); props.changeRoundInfoCallback(numMinutes, numHostages)}}></input>
            <br />
            <label>Length in minutes</label>
            <br />
            <input type={"number"} value={numHostages}  onChange={e => {setNumHostages(parseInt(e.target.value)); props.changeRoundInfoCallback(numMinutes, numHostages)}}></input>
            <br />
            <label>Num hostages</label>
        </div>
    )
}


interface RoundDesigerProps{
    playerCount: Number
}
export function RoundDesigner(props: RoundDesigerProps) {
    let [currentRoundSettings, setCurrentRoundSettings] = useState<RoundInfo[]>([]);



    function updateRound(ind: number, min: number, hostages: number){
        let newSettings = currentRoundSettings;
        newSettings[ind] = {
            minutes: min,
            numHostages: hostages
        }
        setCurrentRoundSettings(newSettings);
        console.log(currentRoundSettings);
        
    }

    return (
        <div id={styles.roundDesigner}>
            <div id={styles.roundsRow}>
                {
                    currentRoundSettings.map((roundInfo, ind) => {
                        return <RoundCard roundInfo={roundInfo} index={ind} changeRoundInfoCallback={(min, host) => updateRound(ind, min, host)}></RoundCard>
                    })
                }
                <AddAnotherRoundCard callback={() => setCurrentRoundSettings([...currentRoundSettings, {minutes: 1, numHostages: 1}])}></AddAnotherRoundCard>
            </div>
            <br></br>
            <hr></hr>
            <div>
                <button onClick={() => setCurrentRoundSettings(getDefaultRoundSettingsAtPlayerCount(props.playerCount))}>Just use the default for this playercount</button>
            </div>
        </div>
    )
}