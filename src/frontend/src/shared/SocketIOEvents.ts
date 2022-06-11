import { Card } from "./cards";
import { Playset } from "./playset";
import { GameState, RoundInfo } from "./types";

export interface ServerToClientEvents {
    confirmJoin: (gameCode: string, isCreator: boolean) => void;
    noSuchGame: () => void;
    gameStateResponse: (gameState: GameState) => void;
    namesList: (nameList: String[]) => void;
    confirmGameCreation: (success: boolean, name: string) => void;
    newPlayset: (playset: Playset) => void;
    confirmNewRoundInfo: (hasError: boolean, message: string) => void;
    gameStartSignal: (roundInfo: RoundInfo[], playset: Playset, myCard: Card) => void;
    updateTimer: (roundEndUTCString: String) => void;
    newRound: (roundIndex: number, roundEndUTCString: String) => void;
    gameEnd: () => void;
}

export interface ClientToServerEvents {
    joinGame: (gameCode: string, userId: string, name: string) => void;
    createGame: (gameCode: string, creatorId: string) => void;
    queryGameState: (gameCode: string) => void;
    getNamesList: (gameCode: string) => void;
    setPlayset: (gameCode: string, playset: Playset) => void;
    setRoundInfo: (gameCode: string, roundInfo: RoundInfo[]) => void;
    requestStartGame: (gameCode: string) => void;
    requestAdvanceRound: (gameCode: string) => void;
    requestGameEnd: (gameCode: string) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    name: string;
    age: number;
}
