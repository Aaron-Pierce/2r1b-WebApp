import { GameState } from "./types";

export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    confirmJoin: (gameCode: string, isCreator: boolean) => void;
    noSuchGame: () => void;
    gameStateResponse: (gameState: GameState) => void;
    namesList: (nameList: String[]) => void;
    announceJoin: (name: String) => void;
}

export interface ClientToServerEvents {
    joinGame: (gameCode: string, userId: string, name: string) => void;
    createGame: (gameCode: string, creatorId: string) => void;
    queryGameState: (gameCode: string) => void;
    getNamesList: (gameCode: string) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    name: string;
    age: number;
}
