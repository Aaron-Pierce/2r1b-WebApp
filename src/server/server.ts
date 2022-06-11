import express from 'express';
import path from 'path';

import { Server } from "socket.io";
import { createServer } from "http";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from '../shared/SocketIOEvents';
import { GameState, RoundInfo } from '../shared/types';
import { Card, getCardsFromPlayset, verifyPairs } from '../shared/cards';
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
  disconnectedPlayers: Set<String>,
  state: GameState,
  creatorId: string,
  roundStructure: RoundInfo[],
  playset: Playset,
  playerCardMap: { [playerId: string]: Card },
  buriedCard: Card | null,
  currentRoundIndex: number,
  roundEndDate: Date
}

let socketIdToPlayerIDMap: { [socketId: string]: string } = {};
let playerIdNames: { [playerId: string]: string } = {};
let socketIdToGameMap: {[socketId: string]: string} = {};

let runningGames: { [gameId: string]: Game } = {};


function resetGame(gameCode: string){
  if(runningGames[gameCode]){
    runningGames[gameCode].state = GameState.WaitingOnPlayers;
    runningGames[gameCode].playerCardMap = {};
    runningGames[gameCode].buriedCard = null;
    runningGames[gameCode].currentRoundIndex = 0;
    runningGames[gameCode].disconnectedPlayers = new Set();
  }
}

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)

  const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {});



  io.on("connect", (socket) => {
    console.log("a user has connected");

    function getSocketIDsForGame(gameCode: string) {
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
        let rejoining = runningGames[gameCode].disconnectedPlayers.has(userId);
        socket.emit("confirmJoin", gameCode, runningGames[gameCode].creatorId === userId);
        socketIdToGameMap[socket.id] = gameCode;

        if (rejoining) {
          // player is already in the game, we should push them along if appropriate
          runningGames[gameCode].disconnectedPlayers.delete(userId)
          runningGames[gameCode].players.add(userId)
          if (runningGames[gameCode].state === GameState.InRound || runningGames[gameCode].state === GameState.RoundStart) {
            let game = runningGames[gameCode];
            socket.emit("gameStartSignal", game.roundStructure, game.playset, game.playerCardMap[socketIdToPlayerIDMap[socket.id]]);
            socket.emit("updateTimer", game.roundEndDate.toUTCString());
            if(game.state === GameState.RoundStart || game.state === GameState.InRound){
              socket.emit('newRound', game.currentRoundIndex, game.roundEndDate.toUTCString())
            }
          }
        } else {
          // new player
          console.log("A player has joined! Players: ", runningGames[gameCode].players);
          runningGames[gameCode].players.add(userId);
          // tell everyone a new list of names
          let nameList = Array.from(runningGames[gameCode].players).map(p => playerIdNames[p.toString()]);
          socket.emit("namesList", nameList);
          getSocketIDsForGame(gameCode).forEach(socketId => {
            socket.to(socketId).emit("namesList", nameList);
          })
        }
      }
    });

    socket.on('disconnect', () => {
      let gameCode = socketIdToGameMap[socket.id];
      if(runningGames[gameCode]){
        let state = runningGames[gameCode].state;
        if(state === GameState.WaitingOnPlayers){
          runningGames[gameCode].players.delete(socketIdToPlayerIDMap[socket.id]);
        } else if (state === GameState.RoundStart || state === GameState.InRound){
          runningGames[gameCode].disconnectedPlayers.add(socketIdToPlayerIDMap[socket.id]);
          runningGames[gameCode].players.delete(socketIdToPlayerIDMap[socket.id]);
        }

        getSocketIDsForGame(gameCode).forEach(socketId => {
          socket.to(socketId).emit("namesList", Array.from(runningGames[gameCode].players).map(p => playerIdNames[p.toString()]));
        })
      }
    })


    socket.on("createGame", (gameID, creatorId) => {
      if (runningGames[gameID]) {
        socket.emit("confirmGameCreation", false, gameID);
      } else {
        runningGames[gameID] = {
          players: new Set(),
          disconnectedPlayers: new Set(),
          creatorId: creatorId,
          roundStructure: [],
          state: GameState.WaitingOnPlayers,
          playset: {
            cardGroups: []
          },
          playerCardMap: {},
          buriedCard: null,
          currentRoundIndex: -1,
          roundEndDate: new Date(),
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
      if (runningGames[gameCode]) {
        runningGames[gameCode].playset = playset;
        console.log(getSocketIDsForGame(gameCode).map(e => socketIdToPlayerIDMap[e]));
        socket.emit("newPlayset", playset);
        getSocketIDsForGame(gameCode).forEach(socketId => {
          console.log("emitting new playset to ", socketId);
          socket.to(socketId).emit("newPlayset", playset);
        })
      }
    })

    socket.on("setRoundInfo", (gameCode, roundInfo) => {
      if (runningGames[gameCode]) {
        runningGames[gameCode].roundStructure = roundInfo;
        console.log(roundInfo);

        socket.emit("confirmNewRoundInfo", false, "");
      }
    })

    socket.on("requestStartGame", (gameCode) => {
      if (runningGames[gameCode]) {
        let game = runningGames[gameCode];
        if (game.creatorId === socketIdToPlayerIDMap[socket.id]) {
          if (true && true && true) { // a bunch of conditions to make sure the game is valid
            game.state = GameState.RoundStart;


            // deal cards

            let cards = getCardsFromPlayset(game.playset);

            // fischer-yates https://bost.ocks.org/mike/shuffle/

            function shuffle(array: any[]) {
              let m = array.length, t, i;

              // While there remain elements to shuffle…
              while (m) {

                // Pick a remaining element…
                i = Math.floor(Math.random() * m--);

                // And swap it with the current element.
                t = array[m];
                array[m] = array[i];
                array[i] = t;
              }

              return array;
            }

            cards = shuffle(cards);



            let playerIDs = shuffle(JSON.parse(JSON.stringify(Array.from(game.players))));
            if (cards.length !== playerIDs.length && cards.length !== playerIDs.length + 1) {
              console.error("too many cards for players!");
            }
            for (let playerId of playerIDs) {
              runningGames[gameCode].playerCardMap[playerId] = cards.pop() as Card;
            }


            if (cards.length === 1) {
              runningGames[gameCode].buriedCard = cards[0];
            } else if (cards.length !== 0) {
              console.error("Somehow finished with non-empty list of cards", cards);
            }

            runningGames[gameCode].currentRoundIndex = 0;
            let roundEndTime = new Date(Date.now() + game.roundStructure[0].minutes * 60 * 1000);
            runningGames[gameCode].roundEndDate = roundEndTime;

            socket.emit("gameStartSignal", game.roundStructure, game.playset, game.playerCardMap[socketIdToPlayerIDMap[socket.id]]);
            socket.emit("updateTimer", runningGames[gameCode].roundEndDate.toUTCString());
            getSocketIDsForGame(gameCode).forEach(socketId => {
              socket.to(socketId).emit("gameStartSignal", game.roundStructure, game.playset, game.playerCardMap[socketIdToPlayerIDMap[socketId]]);
              socket.to(socketId).emit("updateTimer", runningGames[gameCode].roundEndDate.toUTCString());
            })

            // leave some time for the opening cutscene
            setTimeout(() => {
              if (runningGames[gameCode].state === GameState.RoundStart) {
                runningGames[gameCode].state = GameState.InRound;
                console.log("Game is now fully running with ", runningGames[gameCode]);
                console.log(JSON.stringify(runningGames[gameCode]));
              }
            }, 1000);
          }
        }
      }
    })

    socket.on("requestAdvanceRound", (gameCode) => {
      if (runningGames[gameCode]) {
        if (Date.now() >= runningGames[gameCode].roundEndDate.getTime()) {
          let newRoundIndex = runningGames[gameCode].currentRoundIndex + 1;
          if (newRoundIndex < runningGames[gameCode].roundStructure.length) {
            runningGames[gameCode].currentRoundIndex = newRoundIndex;
            runningGames[gameCode].roundEndDate = new Date(Date.now() + runningGames[gameCode].roundStructure[newRoundIndex].minutes * 60 * 1000)


            socket.emit("newRound", newRoundIndex, runningGames[gameCode].roundEndDate.toUTCString());
            getSocketIDsForGame(gameCode).forEach(socketId => {
              socket.to(socketId).emit("newRound", newRoundIndex, runningGames[gameCode].roundEndDate.toUTCString());
            })
          }

        }
      }
    });

    socket.on("requestGameEnd", (gameCode) => {
      if(runningGames[gameCode] && runningGames[gameCode].creatorId === socketIdToPlayerIDMap[socket.id]){
        if(runningGames[gameCode].currentRoundIndex === runningGames[gameCode].roundStructure.length - 1){
          if(Date.now() >= runningGames[gameCode].roundEndDate.getTime() - 1000){
            // end the game
            socket.emit("gameEnd");
            getSocketIDsForGame(gameCode).forEach(socketId => {
              socket.to(socketId).emit("gameEnd");
            })

            resetGame(gameCode);
          }
        }
      }
    })
  })
})



verifyPairs();