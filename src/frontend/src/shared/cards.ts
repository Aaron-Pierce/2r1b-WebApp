export type Card = {
    displayName: String,
    cardId: String, // ${cardId}.jpg should be the image name
    pairsWith: String[]
}

export const Cards: Card[] = [
    {
        displayName: "Agent",
        cardId: "agent_blue",
        pairsWith: ["agent_red"]
    },
    {
        displayName: "Agent",
        cardId: "agent_red",
        pairsWith: ["agent_blue"]
    },
    {
        displayName: "Agoraphobe",
        cardId: "agoraphobe_grey",
        pairsWith: []
    },
    {
        displayName: "Ahab",
        cardId: "ahab_grey",
        pairsWith: ["moby_grey"]
    },
    {
        displayName: "Ambassador",
        cardId: "ambassador_blue",
        pairsWith: ["ambassador_red"]
    },
    {
        displayName: "Ambassador",
        cardId: "ambassador_red",
        pairsWith: ["ambassador_blue"]
    },
    {
        displayName: "Anarchist",
        cardId: "anarchist_grey",
        pairsWith: []
    },
    {
        displayName: "Angel",
        cardId: "angel_blue",
        pairsWith: ["angel_red"]
    },
    {
        displayName: "Angel",
        cardId: "angel_red",
        pairsWith: ["angel_blue"]
    },
    {
        displayName: "Basic",
        cardId: "basic_blue",
        pairsWith: ["basic_red"]
    },
    {
        displayName: "Basic",
        cardId: "basic_red",
        pairsWith: ["basic_blue"]
    },
    {
        displayName: "Blind",
        cardId: "blind_blue",
        pairsWith: ["blind_red"]
    },
    {
        displayName: "Blind",
        cardId: "blind_red",
        pairsWith: ["blind_blue"]
    },
    {
        displayName: "Bomb Bot",
        cardId: "bomb-bot_grey",
        pairsWith: []
    },
    {
        displayName: "Bomber",
        cardId: "bomber_red",
        pairsWith: ["president_blue"]
    },
    {
        displayName: "Bouncer",
        cardId: "bouncer_blue",
        pairsWith: ["bouncer_red"]
    },
    {
        displayName: "Bouncer",
        cardId: "bouncer_red",
        pairsWith: ["bouncer_blue"]
    },
    {
        displayName: "Butler",
        cardId: "butler_grey",
        pairsWith: ["maid_grey"]
    },
    {
        displayName: "Clone",
        cardId: "clone_grey",
        pairsWith: []
    },
    {
        displayName: "Clown",
        cardId: "clown_blue",
        pairsWith: ["clown_red"]
    },
    {
        displayName: "Clown",
        cardId: "clown_red",
        pairsWith: ["clown_blue"]
    },
    {
        displayName: "Conman",
        cardId: "conman_blue",
        pairsWith: ["conman_red"]
    },
    {
        displayName: "Conman",
        cardId: "conman_red",
        pairsWith: ["conman_blue"]
    },
    {
        displayName: "Coyboy",
        cardId: "coyboy_blue",
        pairsWith: ["coyboy_red"]
    },
    {
        displayName: "Coyboy",
        cardId: "coyboy_red",
        pairsWith: ["coyboy_blue"]
    },
    {
        displayName: "Criminal",
        cardId: "criminal_blue",
        pairsWith: ["criminal_red"]
    },
    {
        displayName: "Criminal",
        cardId: "criminal_red",
        pairsWith: ["criminal_blue"]
    },
    {
        displayName: "Cupid",
        cardId: "cupid_red",
        pairsWith: ["eris_blue"]
    },
    {
        displayName: "Dealer",
        cardId: "dealer_blue",
        pairsWith: ["dealer_red"]
    },
    {
        displayName: "Dealer",
        cardId: "dealer_red",
        pairsWith: ["dealer_blue"]
    },
    {
        displayName: "Decoy",
        cardId: "decoy_grey",
        pairsWith: ["sniper_grey", "target_grey"]
    },
    {
        displayName: "Demon",
        cardId: "demon_blue",
        pairsWith: ["demon_red"]
    },
    {
        displayName: "Demon",
        cardId: "demon_red",
        pairsWith: ["demon_blue"]
    },
    {
        displayName: "Doctor",
        cardId: "doctor_blue",
        pairsWith: ["engineer_red"]
    },
    {
        displayName: "Dr Boom",
        cardId: "dr-boom_red",
        pairsWith: ["tuesday-knight_blue"]
    },
    {
        displayName: "Drunk",
        cardId: "drunk_grey",
        pairsWith: []
    },
    {
        displayName: "Enforcer",
        cardId: "enforcer_blue",
        pairsWith: ["enforcer_red"]
    },
    {
        displayName: "Enforcer",
        cardId: "enforcer_red",
        pairsWith: ["enforcer_blue"]
    },
    {
        displayName: "Engineer",
        cardId: "engineer_red",
        pairsWith: ["doctor_blue"]
    },
    {
        displayName: "Eris",
        cardId: "eris_blue",
        pairsWith: ["cupid_red"]
    },
    {
        displayName: "Gambler",
        cardId: "gambler_grey",
        pairsWith: []
    },
    {
        displayName: "Hot Potato",
        cardId: "hot-potato_grey",
        pairsWith: []
    },
    {
        displayName: "Immunologist",
        cardId: "immunologist_red",
        pairsWith: ["invincible_blue"]
    },
    {
        displayName: "Intern",
        cardId: "intern_grey",
        pairsWith: []
    },
    {
        displayName: "Invincible",
        cardId: "invincible_blue",
        pairsWith: ["immunologist_red"]
    },
    {
        displayName: "Juliet",
        cardId: "juliet_grey",
        pairsWith: ["romeo_grey"]
    },
    {
        displayName: "Leprechaun",
        cardId: "leprechaun_grey",
        pairsWith: []
    },
    {
        displayName: "Maid",
        cardId: "maid_grey",
        pairsWith: ["butler_grey"]
    },
    {
        displayName: "Martyr",
        cardId: "martyr_red",
        pairsWith: ["presidentsdaughter_blue"]
    },
    {
        displayName: "Mastermind",
        cardId: "mastermind_grey",
        pairsWith: []
    },
    {
        displayName: "Mayor",
        cardId: "mayor_blue",
        pairsWith: ["mayor_red"]
    },
    {
        displayName: "Mayor",
        cardId: "mayor_red",
        pairsWith: ["mayor_blue"]
    },
    {
        displayName: "Medic",
        cardId: "medic_blue",
        pairsWith: ["medic_red"]
    },
    {
        displayName: "Medic",
        cardId: "medic_red",
        pairsWith: ["medic_blue"]
    },
    {
        displayName: "Mi6",
        cardId: "mi6_grey",
        pairsWith: []
    },
    {
        displayName: "Mime",
        cardId: "mime_blue",
        pairsWith: ["mime_red"]
    },
    {
        displayName: "Mime",
        cardId: "mime_red",
        pairsWith: ["mime_blue"]
    },
    {
        displayName: "Minion",
        cardId: "minion_grey",
        pairsWith: []
    },
    {
        displayName: "Mistress",
        cardId: "mistress_grey",
        pairsWith: ["wife_grey"]
    },
    {
        displayName: "Moby",
        cardId: "moby_grey",
        pairsWith: ["ahab_grey"]
    },
    {
        displayName: "Mummy",
        cardId: "mummy_blue",
        pairsWith: ["mummy_red"]
    },
    {
        displayName: "Mummy",
        cardId: "mummy_red",
        pairsWith: ["mummy_blue"]
    },
    {
        displayName: "Negotiator",
        cardId: "negotiator_blue",
        pairsWith: ["negotiator_red"]
    },
    {
        displayName: "Negotiator",
        cardId: "negotiator_red",
        pairsWith: ["negotiator_blue"]
    },
    {
        displayName: "Nuclear Tyrant",
        cardId: "nuclear-tyrant_grey",
        pairsWith: []
    },
    {
        displayName: "Nurse",
        cardId: "nurse_blue",
        pairsWith: ["tinkerer_red"]
    },
    {
        displayName: "Paparazzo",
        cardId: "paparazzo_blue",
        pairsWith: ["paparazzo_red"]
    },
    {
        displayName: "Paparazzo",
        cardId: "paparazzo_red",
        pairsWith: ["paparazzo_blue"]
    },
    {
        displayName: "Paranoid",
        cardId: "paranoid_blue",
        pairsWith: ["paranoid_red"]
    },
    {
        displayName: "Paranoid",
        cardId: "paranoid_red",
        pairsWith: ["paranoid_blue"]
    },
    {
        displayName: "Presidents Daughter",
        cardId: "presidentsdaughter_blue",
        pairsWith: ["martyr_red"]
    },
    {
        displayName: "President",
        cardId: "president_blue",
        pairsWith: ["bomber_red"]
    },
    {
        displayName: "Private Eye",
        cardId: "private-eye_grey",
        pairsWith: []
    },
    {
        displayName: "Psychologist",
        cardId: "psychologist_blue",
        pairsWith: ["psychologist_red"]
    },
    {
        displayName: "Psychologist",
        cardId: "psychologist_red",
        pairsWith: ["psychologist_blue"]
    },
    {
        displayName: "Queen",
        cardId: "queen_grey",
        pairsWith: []
    },
    {
        displayName: "Rival",
        cardId: "rival_grey",
        pairsWith: []
    },
    {
        displayName: "Robot",
        cardId: "robot_grey",
        pairsWith: []
    },
    {
        displayName: "Romeo",
        cardId: "romeo_grey",
        pairsWith: ["juliet_grey"]
    },
    {
        displayName: "Security",
        cardId: "security_blue",
        pairsWith: ["security_red"]
    },
    {
        displayName: "Security",
        cardId: "security_red",
        pairsWith: ["security_blue"]
    },
    {
        displayName: "Shy Guy",
        cardId: "shy-guy_blue",
        pairsWith: ["shy-guy_red"]
    },
    {
        displayName: "Shy Guy",
        cardId: "shy-guy_red",
        pairsWith: ["shy-guy_blue"]
    },
    {
        displayName: "Sniper",
        cardId: "sniper_grey",
        pairsWith: ["target_grey", "decoy_grey"]
    },
    {
        displayName: "Spy",
        cardId: "spy_blue",
        pairsWith: ["spy_red"]
    },
    {
        displayName: "Spy",
        cardId: "spy_red",
        pairsWith: ["spy_blue"]
    },
    {
        displayName: "Survivor",
        cardId: "survivor_grey",
        pairsWith: ["victim_grey"]
    },
    {
        displayName: "Target",
        cardId: "target_grey",
        pairsWith: ["decoy_grey", "sniper_grey"]
    },
    {
        displayName: "Thug",
        cardId: "thug_blue",
        pairsWith: ["thug_red"]
    },
    {
        displayName: "Thug",
        cardId: "thug_red",
        pairsWith: ["thug_blue"]
    },
    {
        displayName: "Tinkerer",
        cardId: "tinkerer_red",
        pairsWith: ["nurse_blue"]
    },
    {
        displayName: "Travler",
        cardId: "travler_grey",
        pairsWith: []
    },
    {
        displayName: "Tuesday Knight",
        cardId: "tuesday-knight_blue",
        pairsWith: ["dr-boom_red"]
    },
    {
        displayName: "Usurper",
        cardId: "usurper_blue",
        pairsWith: ["usurper_red"]
    },
    {
        displayName: "Usurper",
        cardId: "usurper_red",
        pairsWith: ["usurper_blue"]
    },
    {
        displayName: "Victim",
        cardId: "victim_grey",
        pairsWith: ["survivor_grey"]
    },
    {
        displayName: "Wife",
        cardId: "wife_grey",
        pairsWith: ["mistress_grey"]
    },
    {
        displayName: "Zombie",
        cardId: "zombie_grey",
        pairsWith: []
    },
    
]

export function verifyPairs(){
    for(let card of Cards){
        if(card.cardId.indexOf("grey") === -1 && card.pairsWith.length === 0){
            console.log(card, "made it out with no pairs");
            
        }
        for(let pair of card.pairsWith){
            let exists = false;
            for(let otherCard of Cards){
                if(otherCard.cardId === pair) {
                    if(otherCard.pairsWith.indexOf(card.cardId) === -1){
                        console.log(card, "depends on", otherCard, "but not the other way")
                    }
                    exists = true;
                    break;
                }
            }
            if(!exists){
                console.log("Couldn't find pair " + pair);
            }else{
                // console.log(pair, "exists");
                
            }
        }
    }
}