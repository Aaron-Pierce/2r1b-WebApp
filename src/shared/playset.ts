import { CardGroup } from "./cards"

export type Playset = {
    cardGroups: (CardGroup)[]
}

export function numCardsInPlayset(playset: Playset){
    return playset.cardGroups.reduce((acc, el) => acc + el.cards.length, 0)
}