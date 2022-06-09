import express from 'express';
import path from 'path';

import { Server } from "socket.io";
import { createServer } from "http";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from '../shared/SocketIOEvents';
import { GameState, RoundInfo } from '../shared/types';
import { verifyPairs } from '../shared/cards';
import { Playset } from '../shared/playset';

const app = express();
const httpServer = createServer(app);
const port = 3000;

app.use(express.static(path.join(__dirname, "/../../build/frontend/")))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "/../../build/frontend/index.html"));
})






interface Game {
  players: Set<String>,
  state: GameState,
  creatorId: string,
  roundStructure: RoundInfo[],
  playset: Playset
}

let socketIdToPlayerIDMap: { [socketId: string]: string } = {};
let playerIdNames: { [playerId: string]: string } = {};

let runningGames: { [gameId: string]: Game } = {};

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)

  const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {});



  io.on("connect", (socket) => {
    console.log("a user has connected");

    function getSocketIDsForGame(gameCode: string){
      let ids = [];
      for (let socketId in socketIdToPlayerIDMap) {
        if (runningGames[gameCode].players.has(socketIdToPlayerIDMap[socketId])) {
          ids.push(socketId);
        }
      }
      return ids;
    }

    socket.on("joinGame", (gameCode, userId, playersName) => {
      socketIdToPlayerIDMap[socket.id] = userId;
      playerIdNames[userId] = playersName;
      if (Object.keys(runningGames).indexOf(gameCode) === -1) {
        socket.emit("noSuchGame");
      } else {
        let rejoining = runningGames[gameCode].players.has(userId);
        socket.emit("confirmJoin", gameCode, runningGames[gameCode].creatorId === userId);
        if (!rejoining) {
          console.log("A player has joined! Players: ", runningGames[gameCode].players);
          runningGames[gameCode].players.add(userId);
          // tell everyone a new list of names
          for (let socketId in socketIdToPlayerIDMap) {
            if (runningGames[gameCode].players.has(socketIdToPlayerIDMap[socketId])) {
              if (socketId !== socket.id) {
                socket.to(socketId).emit("announceJoin", playersName);
              }
            }
          }
          console.log(runningGames[gameCode]);
        }
      }
    })


    socket.on("createGame", (gameID, creatorId) => {
      if (runningGames[gameID]) {
        socket.emit("confirmGameCreation", false, gameID);
      } else {
        runningGames[gameID] = {
          players: new Set(),
          creatorId: creatorId,
          roundStructure: [],
          state: GameState.WaitingOnPlayers,
          playset: {
            cardGroups: []
          }
        };
        socket.emit("confirmGameCreation", true, gameID);
      }
    });

    socket.on("queryGameState", (gameCode) => {
      if (runningGames[gameCode]) {
        socket.emit("gameStateResponse", runningGames[gameCode].state)
      }
    });

    socket.on("getNamesList", (gameCode) => {
      if (runningGames[gameCode]) {
        socket.emit("namesList", Array.from(runningGames[gameCode].players).map(userId => playerIdNames[userId.toString()]))
      }
    })

    socket.on("setPlayset", (gameCode, playset) => {
      if(runningGames[gameCode]){
        runningGames[gameCode].playset = playset;
        console.log(getSocketIDsForGame(gameCode).map(e => socketIdToPlayerIDMap[e]));
        socket.emit("newPlayset", playset);
        getSocketIDsForGame(gameCode).forEach(socketId => {
          console.log("emitting new playset to ", socketId);          
          socket.to(socketId).emit("newPlayset", playset);
        })
      }
    })
  })
})



verifyPairs();