import { useEffect, useState } from "react";
import { GameState } from "../../shared/types";
import { ServerSocketInfo } from "../../App";
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { GameInfo, selectCode, selectState, setState } from "../GameSelector/gameSlice"


export interface WaitingScreenProps {
    socketInfo: ServerSocketInfo
}

export function WaitingScreen(props: WaitingScreenProps) {

    let gameCode = useAppSelector(selectCode);
    let currentGameState = useAppSelector(selectState);
    let dispatch = useAppDispatch();


    let [nameList, setNameList] = useState<String[]>([]);



    useEffect(() => {
        if (gameCode !== null) {
            props.socketInfo.socket.emit("queryGameState", gameCode);
            props.socketInfo.socket.on("gameStateResponse", (state: GameState) => {
                console.log("game is in state", state);
                if(currentGameState !== state){
                    dispatch(setState(state));
                }
            });
            
            props.socketInfo.socket.on("namesList", (list: String[]) => {
                console.log("got names list", list);
                setNameList(list);
            });

            props.socketInfo.socket.on("announceJoin", (name: String) => {
                setNameList([...nameList, name]);
            })
            if(nameList.length === 0){
                props.socketInfo.socket.emit("getNamesList", gameCode); 
            }
        }
    })


    if (gameCode == null) return <></>;
    if(currentGameState !== GameState.WaitingOnPlayers) return <></>;


    return (
        <div id="waitingScreen">
            <h1>{gameCode}</h1>
            {nameList.map(name => <p key={name.toString()}>{name}</p>)}
        </div>
    )
}