export enum GameState {
  WaitingOnPlayers,
  InRound,
  BetweenRounds,
  Concluded
}


export interface RoundInfo {
  minutes: number,
  numHostages: number
}

export function getDefaultRoundSettingsAtPlayerCount(playerCount: Number): RoundInfo[]{
  if(playerCount <= 10){
    return [
      {
        numHostages: 1,
        minutes: 3
      }, {
        numHostages: 1,
        minutes: 2
      }, {
        numHostages: 1,
        minutes: 1
      }
    ]
  } else if (playerCount <= 13){
    return [
      {
        numHostages: 2,
        minutes: 5
      },
      {
        numHostages: 2,
        minutes: 4
      },
      {
        numHostages: 1,
        minutes: 3
      },
      {
        numHostages: 1,
        minutes: 2
      }, 
      {
        numHostages: 1,
        minutes: 1
      }
    ]
  } else if (playerCount <= 17){
    return [
      {
        numHostages: 3,
        minutes: 5
      },
      {
        numHostages: 2,
        minutes: 4
      },
      {
        numHostages: 2,
        minutes: 3
      },
      {
        numHostages: 1,
        minutes: 2
      }, 
      {
        numHostages: 1,
        minutes: 1
      }
    ]
  } else if (playerCount <= 21){
    return [
      {
        numHostages: 4,
        minutes: 5
      },
      {
        numHostages: 3,
        minutes: 4
      },
      {
        numHostages: 2,
        minutes: 3
      },
      {
        numHostages: 1,
        minutes: 2
      }, 
      {
        numHostages: 1,
        minutes: 1
      }
    ]
  } else {
    return [
      {
        numHostages: 5,
        minutes: 5
      },
      {
        numHostages: 4,
        minutes: 4
      },
      {
        numHostages: 3,
        minutes: 3
      },
      {
        numHostages: 2,
        minutes: 2
      }, 
      {
        numHostages: 1,
        minutes: 1
      }
    ]
  }
}