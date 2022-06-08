import { Card } from "./cards";
import { Playset } from "./playset";
import { GameState } from "./types";

export interface ServerToClientEvents {
    confirmJoin: (gameCode: string, isCreator: boolean) => void;
    noSuchGame: () => void;
    gameStateResponse: (gameState: GameState) => void;
    namesList: (nameList: String[]) => void;
    announceJoin: (name: String) => void;
    confirmGameCreation: (success: boolean, name: string) => void;
    newPlayset: (playset: Playset) => void;
}

export interface ClientToServerEvents {
    joinGame: (gameCode: string, userId: string, name: string) => void;
    createGame: (gameCode: string, creatorId: string) => void;
    queryGameState: (gameCode: string) => void;
    getNamesList: (gameCode: string) => void;
    setPlayset: (gameCode: string, playset: Playset) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    name: string;
    age: number;
}
