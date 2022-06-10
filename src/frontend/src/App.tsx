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
import { setState } from './features/GameSelector/gameSlice';

export interface ServerSocketInfo {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  userid: string
}

interface AppProps {
  socketInfo: ServerSocketInfo
}

function App(props: AppProps) {

  let dispatch = useAppDispatch();

  useEffect(() => {

    let gameStartListener = (roundInfo: RoundInfo[], playset: Playset, myCard: Card) => {
      console.log("Game is starting", roundInfo, playset, myCard);
      dispatch(setState(GameState.BetweenRounds));
    };

    props.socketInfo.socket.on("gameStartSignal", gameStartListener)
    return () => {
      props.socketInfo.socket.off("gameStartSignal", gameStartListener)
    }
  })


  return (
    <div className="App">
      <GameSelector socketInfo={props.socketInfo}></GameSelector>
      <WaitingScreen socketInfo={props.socketInfo}></WaitingScreen>
    </div>
  );
}

export default App;
