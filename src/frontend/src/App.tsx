import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import { GameSelector } from './features/GameSelector/GameSelector';
import { WaitingScreen } from './features/WaitingScreen/WaitingScreen';


import {io, Socket} from "socket.io-client"
import { ClientToServerEvents, ServerToClientEvents } from "./shared/SocketIOEvents";
import { nanoid } from 'nanoid';

export interface ServerSocketInfo {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  userid: string
}

function App() {

  let userId = localStorage.getItem("userId") || nanoid();
  localStorage.setItem("userId", userId);
  console.log("userid: ", userId);
  
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
  let socketInfoBundle = {
    socket: socket,
    userid: userId
  }
  
  return (
    <div className="App">
      <GameSelector socketInfo={socketInfoBundle}></GameSelector>
      <WaitingScreen socketInfo={socketInfoBundle}></WaitingScreen>
    </div>
  );
}

export default App;
