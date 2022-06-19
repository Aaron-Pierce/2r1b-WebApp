import { CardGroup } from "./cards"

export type Playset = {
    cardGroups: (CardGroup)[]
}

export function numCardsInPlayset(playset: Playset){
    return playset.cardGroups.reduce((acc, el) => acc + el.cards.length, 0)
}

export function cardGroupEqual(groupOne: CardGroup, groupTwo: CardGroup): boolean{
    let firstIDS = groupOne.cards.map(e => e.cardId).sort();
    let secondIDS = groupTwo.cards.map(e => e.cardId).sort();

    if(firstIDS.length !== secondIDS.length) return false;

    for(let i = 0; i < firstIDS.length; i++){
        if(firstIDS[i] !== secondIDS[i]) return false;
    }
    return true;
}