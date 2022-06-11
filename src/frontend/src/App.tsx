import React, { useEffect } from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import { GameSelector } from './features/GameSelector/GameSelector';
import { WaitingScreen } from './features/WaitingScreen/WaitingScreen';


import { io, Socket } from "socket.io-client"
import { ClientToServerEvents, ServerToClientEvents } from "./shared/SocketIOEvents";
import { nanoid } from 'nanoid';
import { useAppDispatch } from './app/hooks';
import { GameState, RoundInfo } from './shared/types';
import { Playset } from './shared/playset';
import { Card } from './shared/cards';
import { setNamesList, setPlayerInfo, setRoundEndUTCString, setRoundIndex, setState } from './features/GameSelector/gameSlice';
import { GameView } from './features/GameView/GameView';

export interface ServerSocketInfo {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  userid: string
}

interface AppProps {
  socketInfo: ServerSocketInfo
}

function App(props: AppProps) {

  window.onerror = (err) => {
    alert(err.toString());
    alert(err.valueOf())
  } 

  let dispatch = useAppDispatch();

  useEffect(() => {

    let gameStartListener = (roundInfo: RoundInfo[], playset: Playset, myCard: Card) => {
      console.log("Game is starting", roundInfo, playset, myCard);
      dispatch(setState(GameState.BetweenRounds));
      dispatch(setPlayerInfo({
        activePlayset: playset,
        card: myCard,
        roundStructure: roundInfo
      }))
    };

    let updateTimerListener = (roundEndUTCString: String) => {
      console.log("got new round string", roundEndUTCString);
      
      dispatch(setRoundEndUTCString(roundEndUTCString))
    }

    let endGameListener = () => {
      dispatch(setState(GameState.WaitingOnPlayers));
      dispatch(setRoundIndex(0));
      dispatch(setPlayerInfo(null));
    }

    let newNamesListListener = (namesList: String[]) => {
      dispatch(setNamesList(namesList));
    }

    props.socketInfo.socket.on("gameStartSignal", gameStartListener)
    props.socketInfo.socket.on("updateTimer", updateTimerListener)
    props.socketInfo.socket.on("gameEnd", endGameListener)
    props.socketInfo.socket.on("namesList", newNamesListListener)
    return () => {
      props.socketInfo.socket.off("gameStartSignal", gameStartListener)
      props.socketInfo.socket.off("updateTimer", updateTimerListener)
      props.socketInfo.socket.off("gameEnd", endGameListener)
      props.socketInfo.socket.off("namesList", newNamesListListener)
    }
  })


  return (
    <div className="App">
      <GameSelector socketInfo={props.socketInfo}></GameSelector>
      <WaitingScreen socketInfo={props.socketInfo}></WaitingScreen>
      <GameView socketInfo={props.socketInfo}></GameView>
    </div>
  );
}

export default App;
