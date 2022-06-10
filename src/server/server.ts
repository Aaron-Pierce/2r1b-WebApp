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
  state: GameState,
  creatorId: string,
  roundStructure: RoundInfo[],
  playset: Playset
  playerCardMap: { [playerId: string]: Card };
  buriedCard: Card | null;
  currentRoundIndex: number;
  secondsLeftInRound: number;
}

let socketIdToPlayerIDMap: { [socketId: string]: string } = {};
let playerIdNames: { [playerId: string]: string } = {};

let runningGames: { [gameId: string]: Game } = {};

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
        let rejoining = runningGames[gameCode].players.has(userId);
        socket.emit("confirmJoin", gameCode, runningGames[gameCode].creatorId === userId);

        if (rejoining) {
          // player is already in the game, we should push them along if appropriate
          if (runningGames[gameCode].state === GameState.InRound || runningGames[gameCode].state === GameState.RoundStart) {
            let game = runningGames[gameCode];
            socket.emit("gameStartSignal", game.roundStructure, game.playset, game.playerCardMap[socketIdToPlayerIDMap[socket.id]]);
          }
        } else {
          // new player
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
          },
          playerCardMap: {},
          buriedCard: null,
          currentRoundIndex: -1,
          secondsLeftInRound: -1
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



            socket.emit("gameStartSignal", game.roundStructure, game.playset, game.playerCardMap[socketIdToPlayerIDMap[socket.id]]);
            getSocketIDsForGame(gameCode).forEach(socketId => {
              socket.to(socketId).emit("gameStartSignal", game.roundStructure, game.playset, game.playerCardMap[socketIdToPlayerIDMap[socketId]]);
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
  })
})



verifyPairs();