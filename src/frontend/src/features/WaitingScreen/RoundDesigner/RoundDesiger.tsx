import { useEffect, useState } from "react"
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
    minutes: number,
    hostages: number,
    setMinutes: (minutes: number) => void,
    setNumHostages: (hostages: number) => void,
    index: number,
}

function RoundCard(props: RoundCardProps) {
    useEffect(() => {
        console.log("entered useEffect");
        
    })
    console.log("Creating roundCard with ", props);
    
    return (
        <div className={styles.roundCard} key={2**props.minutes * 3**props.minutes * 5**props.index}>
            <p>{JSON.stringify(props)}</p>
            <p>Round {props.index + 1}</p>
            <input type={"number"} value={props.minutes} onChange={e => {props.setMinutes(parseInt(e.target.value))}}></input>
            <br />
            <label>Length in minutes</label>
            <br />
            <input type={"number"} value={props.hostages}  onChange={e => {props.setNumHostages(parseInt(e.target.value))}}></input>
            <br />
            <label>Num hostages</label>
        </div>
    )
}


interface RoundDesigerProps{
    playerCount: Number,
    submitRoundInfo: (info: RoundInfo[]) => void;
}
export function RoundDesigner(props: RoundDesigerProps) {
    let [currentRoundSettings, setCurrentRoundSettings] = useState<RoundInfo[]>([]);



    function updateRound(ind: number, min: number, hostages: number){
        console.log("updatedRound", min, hostages);
        
        let newSettings = JSON.parse(JSON.stringify(currentRoundSettings));
        newSettings[ind] = {
            minutes: min,
            numHostages: hostages
        }
        setCurrentRoundSettings(newSettings);
        console.log(currentRoundSettings);   
    }

    console.log("rendering roundDesigner");
    

    return (
        <div id={styles.roundDesigner}>
            <div id={styles.roundsRow}>
                {
                    (() => {
                        console.log("crs", currentRoundSettings);
                        return <></>
                    })()
                }
                {                    
                    currentRoundSettings.map((roundInfo, ind) => <RoundCard minutes={roundInfo.minutes} hostages={roundInfo.numHostages} key={(2**roundInfo.minutes) * (3**roundInfo.numHostages) * (5**ind)} index={ind} setMinutes={(min) => updateRound(ind, min, roundInfo.numHostages)} setNumHostages={(numHostages) => updateRound(ind, roundInfo.minutes, numHostages)}></RoundCard>)
                }
                {
                    currentRoundSettings.length === 0 && (
                        <h2 style={{color: 'rgba(0, 0, 0, 0.7)'}}>Click the plus button to add a round {"->"}</h2>
                    )
                }
                <AddAnotherRoundCard callback={() => setCurrentRoundSettings([...currentRoundSettings, {minutes: 1, numHostages: 1}])}></AddAnotherRoundCard>
            </div>
            <br></br>
            <hr></hr>
            <div>
                <button onClick={() => setCurrentRoundSettings(getDefaultRoundSettingsAtPlayerCount(props.playerCount))}>Just use the default for this playercount</button>
            </div>
            <div>
                <button onClick={() => props.submitRoundInfo(currentRoundSettings)}>Submit Round Info</button>
            </div>
        </div>
    )
}