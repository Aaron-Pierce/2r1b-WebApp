import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, RoundInfo } from '../../shared/types';
import { RootState } from '../../app/store';
import { Card } from '../../shared/cards';
import { Playset } from '../../shared/playset';

export interface GameInfo {
    code: string | null,
    state: GameState,
    isCreator: Boolean
    playerInfo: PlayerInfo | null
}

export interface PlayerInfo {
    card: Card,
    activePlayset: Playset,
    roundStructure: RoundInfo[]
}

const initialState: GameInfo = {
    code: null,
    state: GameState.WaitingOnPlayers,
    isCreator: false,
    playerInfo: null
};

export const gameSlice = createSlice({
    name: 'counter',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setCode: (state, action: PayloadAction<string>) => {
            console.log("Setting code using", action);
            
            if(action.payload.trim() !== ""){
                state.code = action.payload;
                console.log("updated");
                
            }
        },
        setState: (state, action: PayloadAction<GameState>) => {
            state.state = action.payload;
        },
        setIsCreator: (state, action: PayloadAction<Boolean>) => {
            state.isCreator = action.payload;
        },
        setPlayerInfo: (state, action: PayloadAction<PlayerInfo | null>) => {
            state.playerInfo = action.payload;
        }
    }
});

export const { setCode, setState, setIsCreator, setPlayerInfo } = gameSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCode = (state: RootState) => state.game.code;
export const selectState = (state: RootState) => state.game.state;
export const selectIsCreator = (state: RootState) => state.game.isCreator;
export const selectPlayerInfo = (state: RootState) => state.game.playerInfo;


export default gameSlice.reducer;
