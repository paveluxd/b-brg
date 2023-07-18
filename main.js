//Misc fucntions
function toggleModal(id){//modal
    document.getElementById(id).classList.toggle('hide')
}
function rng(maxValue, minValue){//random number
    if(minValue === undefined){minValue = 1}
    return Math.floor(Math.random() * (maxValue - minValue + 1) + minValue)
}
function rarr(arr){//random arr item
    return arr[Math.floor(Math.random() * arr.length)]
}
function shuffle(array) {//suffle arr
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}


//Data
let itemsReference = {
    sword: {
        name: "Sword",
        desc: "Deals 1 damage to enemy.",
        cost: 1,
        durability: 5,
    },
    shield: {
        name: "Shield",
        desc: "Deals 1 damage to enemy.",
        cost: 1,
        durability: 5,
    },
    healingPotion: {
        name: "Healing potion",
        desc: "Restore 5 life to player",
        cost: 1,
        durability: 5,
    },
}
let playerStatsReference = {
    life: 25,
    dice: 6,
    roll: 0,
    def: 0,
    power: 0,
    gold: 0,
    items: [],
}
let deckReference = {
    starterDeck: {//Add deck per subject
        card1: {
            question: "Q1",
            answer: "???",
            order: 1,
        },
        card2: {
            question: "Q2",
            answer: "???",
            order: 1,
        },
        card3: {
            question: "Q3",
            answer: "???",
            order: 2,
        },
        card4: {
            question: "Q3",
            answer: "???",
            order: 3,
        },
    }
}
let enemyNameStart = ['Gar', 'Tar', 'Wal', 'Far', 'Duh', 'Ro' ,'Nar', 'Tal', 'Ikr']
let enemyNameEnd =   ['talin', 'war', 'barun', 'antoles', 'farhair', 'dox', 'marin', 'volen', 'darion']


//Variables
let playerObj
function genPlayer(){playerObj = playerStatsReference}genPlayer()
let enemyObj = {}
let level = 1 //Scales enemy stats
let turn


//Enemy generator
function genEnemyActions(){
    //Roll enemy dice
    enemyObj.roll = rng(enemyObj.dice)

    //Pick random action
    let actionRoll = rng(100)                      //roll to pick action

    let dmgVal = Math.ceil(enemyObj.roll + enemyObj.power) //reference dmg value
    let enemyActions = {
        "attack":   {rate:1,   action: 'attack',  desc: `Will attack for ${dmgVal}`},
        "block":    {rate:1,   action: 'block',   desc: `Will crit for ${Math.ceil(dmgVal * 1.5)}`},
        // "poi att":  {rate:1,   desc: `Will attack with poison for ${dmgVal}`},
        // "fire att": {rate:1,   desc: `Will attack with fire for ${dmgVal}`},
        // "mutli att":{rate:1,   desc: `Will attack ${rng(3,2)} times, each hit deals ${Math.ceil(dmgVal * 0.3)}`},
        // "crit":     {rate:1,   desc: `Will crit for ${Math.ceil(dmgVal * 2)} after this turn`},
        
        
        // "recover":  {rate:1,   desc: `Will recover lost stats`},
        // "def break":{rate:1,   desc: `Will reduce your def by ${dmgVal}`},
        // "buff":     {rate:1,   desc: `Will use random buff spell`},
        // "debuff":   {rate:1,   desc: `Will use random debuff spell`},
        
        // "recruits": {rate:1,   desc: `Will call reinforcements`},
        
        // "spell":    {rate:1,   desc: `Will cast a <random spell>`},
        // "reflect":  {rate:1,   desc: `Will reflect any spell or attack to character that targets this`},
        // "disarm":   {rate:1,   desc: `Will steal item used against it during the next turn`},
        // "theft":    {rate:1,   desc: `Will steal random item`},   
        // "command":  {rate:1,   desc: `Will redirect actions of all enemies on you`},
        // "consume":  {rate:1,   desc: `Enemy will consume a random consumable from targets inventory`},
        // "escape":   {rate:1,   desc: `Will escape`},
        // "sepuku":   {rate:1,   desc: `Will deal ${Math.ceil(dmgVal * 2.5)} to character that would kill them`}
    }

    let enemyAc                                //Final action
    let aAction = []  
    let actionKeys = Object.keys(enemyActions) //Get keys

    //Pick action
    if(actionRoll < 100){//1%
        for(i=0; i<actionKeys.length; i++){
            if(enemyActions[actionKeys[i]].rate === 1){
                aAction.push(enemyActions[actionKeys[i]].action)
            }
        }
        enemyAc = rarr(aAction)
    } 
    else if (actionRoll < 40){//10%
        for(i=0; i<actionKeys.length; i++){
            if(enemyActions[actionKeys[i]].rate === 2){
                aAction.push(enemyActions[actionKeys[i]].action)
            }
        }
        enemyAc = rarr(aAction)
    } 
    else if (actionRoll < 60){//30%
        for(i=0; i<actionKeys.length; i++){
            if(enemyActions[actionKeys[i]].rate === 3){
                aAction.push(enemyActions[actionKeys[i]].action)
            }
        }
        enemyAc = rarr(aAction)
    } 
    else {
        enemyAc = enemyActions.attack.action
    }

    enemyObj.action = enemyAc
}


//Start combat
function initiateCombat(){//Gen enemy

    //Gen enemy
    enemyObj = {
        name: rarr(enemyNameStart) + rarr(enemyNameEnd),

        life: Math.floor(rng(6 * (level * 0.5), 3 + level)),
        power: Math.ceil(rng(level * 0.5, 0)),
        def: Math.ceil(rng(level * 0.5, 0)),
        dice: 2 + level,

        roll: 0,
        level: level,
        action: "attack",
    }

    //Enemy next turn
    genEnemyActions()
    updateUi()

    turn = 1
    console.log('Combat initiated!');
}
initiateCombat()


//Turn calc
function turnCalc(playerAction, state){

    //Damage calculation
    if (enemyObj.life > 0 && playerObj.life > 0) {



        //Vars for total damge value
        let playerDmgDone = 0
        let enemyDmgDone = 0



        //Player action
        if      (playerAction === 'attack'){//attack
            playerDmgDone += playerObj.roll
        }
        else if (playerAction === 'block'){//block
            enemyDmgDone -= playerObj.roll
        }

        //Enemy action
        if      (enemyObj.action === 'attack'){//attack
            enemyDmgDone += enemyObj.roll
        }
        else if (enemyObj.action === 'block'){//block
            playerDmgDone -= enemyObj.roll
        }



        //Deal damage if chars attacked
        if (playerAction === 'attack'){
            if (playerDmgDone < 0){playerDmgDone = 0} //Set positive damage to 0
            enemyObj.life -= playerDmgDone
        }

        if (enemyObj.action === 'attack'){
            if (enemyDmgDone < 0){enemyDmgDone = 0} //Set positive damage to 0
            playerObj.life -= enemyDmgDone
        }

        

        //Next turn actions
        playerObj.roll = rng(playerObj.dice)
        genEnemyActions()

        //Misc
        turn++
        updateUi()
    }



    //Check if game state changed
    if(playerObj.life < 1){//Defeat
        updateUi('Defeat!')
        level = 1
        turn = 1
        toggleModal('combatEnd')
    }
    else if (enemyObj.life < 1){//Victory
        updateUi('Victory!')
        level++
        turn = 1
        toggleModal('combatEnd')
    }

}


//Ui update
function updateUi(gameState){
    //Game stats
    document.getElementById('logIndicator').innerHTML = `
    Turn: ${turn}<br>
    Game state: ${gameState}`

    //Game state
    document.getElementById('combatEndIndicator').innerHTML = `${gameState}`

    //Player stats
    document.getElementById('playerIndicator').innerHTML = `
    Life: ${playerObj.life}<br>
    Dice: ${playerObj.dice}<br>
    Roll: ${playerObj.roll}<br>`

    //Enemy stats
    document.getElementById('enemyName').innerHTML = enemyObj.name
    document.getElementById('enemyIndicator').innerHTML = `
    Life: ${enemyObj.life}<br> 
    Dice: ${enemyObj.dice}<br>
    Roll: ${enemyObj.roll}<br>
    Next: ${enemyObj.action}`
}