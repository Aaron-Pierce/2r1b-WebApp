import React, { useEffect } from 'react';
import './App.css';
import { GameSelector } from './features/GameSelector/GameSelector';
import { WaitingScreen } from './features/WaitingScreen/WaitingScreen';


import { Socket } from "socket.io-client"
import { ClientToServerEvents, ServerToClientEvents } from "./shared/SocketIOEvents";
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
  let dispatch = useAppDispatch();

  useEffect(() => {

    console.log("attaching listeners");
    
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
      console.log("namesList");
      
      console.log("dispatched new names list", namesList);
      
      dispatch(setNamesList(namesList));
    }

    let disconnectHandler = () => {
      window.location.reload();
    }

    props.socketInfo.socket.on("gameStartSignal", gameStartListener)
    props.socketInfo.socket.on("updateTimer", updateTimerListener)
    props.socketInfo.socket.on("gameEnd", endGameListener)
    props.socketInfo.socket.on("namesList", newNamesListListener)
    props.socketInfo.socket.on("disconnect", disconnectHandler)
    return () => {
      props.socketInfo.socket.off("gameStartSignal", gameStartListener)
      props.socketInfo.socket.off("updateTimer", updateTimerListener)
      props.socketInfo.socket.off("gameEnd", endGameListener)
      props.socketInfo.socket.off("namesList", newNamesListListener)
      props.socketInfo.socket.off("disconnect", disconnectHandler);
      console.log("Cleaning up app");
      
    }
  }, [props.socketInfo, dispatch]);


  return (
    <div className="App">
      <GameSelector socketInfo={props.socketInfo}></GameSelector>
      <WaitingScreen socketInfo={props.socketInfo}></WaitingScreen>
      <GameView socketInfo={props.socketInfo}></GameView>
    </div>
  );
}

export default App;
