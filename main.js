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
function findObj(data, prop, val){

        return data.find(x => x[prop] === val)
    
}
function removeFromArr(data, elem){
        let index = data.indexOf(elem);
            if (index > -1) { // only splice array when item is found
                data.splice(index, 1); // 2nd parameter means remove one item only
            }
}



//Classes
class Item {
    constructor(key, iLvl){
        if(iLvl === undefined){iLvl = 1}

        this.action = key
        this.desc = itemsReference[key].desc

        let extraProps = [
            {key:'name', val: `${key} scroll`},
            {key:'itemid', val: "id" + Math.random().toString(8).slice(2)},//gens unique id
            {key:'durability', val: 5},
            {key:'effectMod', val: 0},
            {key:'itemType', val: 'active'},
            {key:'cost', val: 12}, 
        ]

        extraProps.forEach(property => {
            if(itemsReference[key][property.key] === undefined){
                this[property.key] = property.val  
            } else {
                this[property.key] = itemsReference[key][property.key] * iLvl
            }
        })
    }
}

class PlayerObjReference {
    constructor(){
        this.maxLife = 25,
        this.life  = 25,
        this.power = 0,
        this.def   = 0,
        this.dice  = 6,

        this.gold  = 0,
        this.maxInventorySlots = 4,
        this.inventory = []
    }
}

class EnemyObjReference {
    constructor(){
        this.life  = Math.floor(rng(6 * (level * 0.5), 3 + level)),
        this.power = Math.ceil(rng(level * 0.5, 0)),
        this.def   = Math.ceil(rng(level * 0.5, 0)),
        this.dice  = 2 + level,
        
        this.name  = rarr(enemyNameStart) + rarr(enemyNameEnd),
        this.level = level
    }
}

class CombatState {
    constructor(){
        this.turn = 1
        this.enemyDamageTaken = 0
        this.playerDamageTaken = 0
    }
}



//Data & vars
let itemsReference = {
    //Item key is used as 'action' string
    //Basic
    Attack:  {desc: "Deal damage to enemy equal to the dice roll value.", },
    Block:   {desc: 'Reduce incomming attack damage by dice roll value.',},
    // Dodge:   {desc: 'Skip turn to keep half of your roll value for the next turn'},
    
    //Player states
    Heal:    {desc: "Restore 5 life to player.", durability: 2, effectMod: 5},
    // Repair:  {desc: 'Restore 1 durability to all items'},
    // Rage:    {desc: 'Increase power by 1'},
    // Fortify: {desc: 'Increase defence by 1'},
    // Focus:   {desc: 'Increase dice by 1'},

    // //Enemy states
    // Weaken:  {desc: 'Reduce enemy power by 1'},
    // Break:   {desc: 'Reduce enemy defence by 1'},
    // Root:    {desc: 'Reduce enemy dice by 1'},
    // Stun:    {desc: 'Prevent enemy for acting during this turn'},

    // //Passive items
    // Name:    {desc: 'Provides +2 def', itemType: 'passive'}
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

let playerObj = {}
let enemyObj = {}
let level = 1 //Scales everything
let playerActionContainer = document.getElementById('playerActionContainer')
let combatState



//GAME
//Generate
function genPlayer(){
    playerObj = new PlayerObjReference
    playerObj.roll = rng(playerObj.dice)
    addTargetItem('Heal')
    addTargetItem('Attack')
    addTargetItem('Block')
    // addRandomItem(2)
}

//Manage player charsheet
function addTargetItem(key, iLvl){
    playerObj.inventory.push(new Item(key, iLvl))
}

function addRandomItem(quant, iLvl){
    for(i=0; i< quant; i++){
        playerObj.inventory.push(new Item(rarr(Object.keys(itemsReference)), iLvl))
    }
}

function genEnemy(){
    enemyObj = new EnemyObjReference
}

//Generate enemy action for the next turn
function genEnemyActions(){
    //Roll enemy dice
    enemyObj.roll = rng(enemyObj.dice)

    //Pick random action
    let actionRoll = rng(100)                      //roll to pick action

    let dmgVal = Math.ceil(enemyObj.roll + enemyObj.power) //reference dmg value
    let enemyActions = {
        Attack:   {rate:1,   action: 'Attack',  desc: `Will attack for ${dmgVal}`},
        Block:    {rate:1,   action: 'Block',   desc: `Will crit for ${Math.ceil(dmgVal * 1.5)}`},
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



//COMBAT
//Start
function initiateCombat(){
    if(playerObj.life < 1 || playerObj.life === undefined){
        genPlayer()
    }
    genEnemy()
    genEnemyActions()    
    updateUi()
    genPlayerActionButtons()

    combatState = new CombatState
}
initiateCombat()



//Turn
function turnCalc(buttonElem, itemId){

    //Damage calculation
    if (enemyObj.life > 0 && playerObj.life > 0) {
        let playerDmgDone = 0
        let enemyDmgDone = 0
        playerObj.lastAction = `Turn ${combatState.turn}: `

        let itemid = buttonElem.getAttribute('itemid')
        let sourceItem = findObj(playerObj.inventory, 'itemid', itemid)
        let playerAction = sourceItem.action



        //Stat modification actions
        //Has to be done before generic actions
        if      (playerAction === 'Heal'){
            playerObj.life += sourceItem.effectMod
            playerObj.lastAction += `Player healed for ${sourceItem.effectMod}, life`
        }


        //Generic actions
        //Player action
        else if      (playerAction === 'Attack'){//attack
            playerDmgDone += playerObj.roll + playerObj.power
            playerObj.lastAction += `Player attacked for ${playerDmgDone}, dealing `
        }
        else if (playerAction === 'Block'){//block
            enemyDmgDone -= playerObj.roll //- playerObj.power
        }


        //Enemy action
        if      (enemyObj.action === 'Attack'){//attack
            enemyDmgDone += enemyObj.roll + enemyObj.power 
        }
        else if (enemyObj.action === 'Block'){//block
            playerDmgDone -= enemyObj.roll
        }



        //Final calculation
        //Deal damage if chars attacked
        if (playerAction === 'Attack'){
            if (playerDmgDone < 0){playerDmgDone = 0} //Set positive damage to 0
            enemyObj.life -= playerDmgDone
            playerObj.lastAction += `${playerDmgDone} damage.`

            //Trigger damage indicator

        }

        if (enemyObj.action === 'Attack'){
            if (enemyDmgDone < 0){enemyDmgDone = 0} //Set positive damage to 0
            playerObj.life -= enemyDmgDone
        }


        //Deal with durability
        sourceItem.durability--
        if(sourceItem.durability<1){
            removeFromArr(playerObj.inventory, sourceItem)
            genPlayerActionButtons()
        }
        updateBtnLabel(buttonElem, sourceItem)
        

        //Next turn actions
        playerObj.roll = rng(playerObj.dice)
        genEnemyActions()

        //Misc
        console.log(playerObj.lastAction);
        combatState.turn++
        updateUi()
    }


    //Check if game state changed
    if(playerObj.life < 1 || playerObj.inventory.length < 1){//Defeat
        updateUi('Defeat!')
        level = 1
        toggleModal('combatEnd')
    }
    else if (enemyObj.life < 1){//Victory
        updateUi('Victory!')
        level++

        document.getElementById('enemyImg').setAttribute('src', `./img/enemy/${level}.png`)
        toggleModal('combatEnd')
    }

}



//MANAGE UI
//Player and enemy stats UI
function updateUi(gameState){
    //Update damage indicator
    document.getElementById('enemyDamageIndicator').innerHTML = ''

    //Game stats
    document.getElementById('logIndicator').innerHTML = `
    Turn:<br>`

    //Game state
    document.getElementById('combatEndIndicator').innerHTML = `${gameState}`

    //Player stats
    document.getElementById('playerIndicator').innerHTML = `
    Life: ${playerObj.life}<br>
    Def: ${playerObj.def}<br>
    Power: ${playerObj.power}<br>
    Dice: ${playerObj.dice}<br>
    <br>
    Dice roll: ${playerObj.roll}<br>
    <br>`

    //Enemy stats
    // document.getElementById('enemyName').innerHTML = enemyObj.name
    document.getElementById('enemyIndicator').innerHTML = `
    Life: ${enemyObj.life}<br> 
    Def: ${enemyObj.def}<br>
    Power: ${enemyObj.power}<br>
    Dice: ${enemyObj.dice}<br>
    <br>
    Dice roll: ${enemyObj.roll}<br>
    Next: ${enemyObj.action}`
}

//Action buttons
function genPlayerActionButtons(){
    playerActionContainer.innerHTML = ''
    
    //Add buyyons per player item
    playerObj.inventory.forEach(item => {
        
        let button = document.createElement('button')
    
        button.setAttribute('onclick', `turnCalc(this)`)
        button.setAttribute('itemid', item.itemid)
        updateBtnLabel(button, item)
        playerActionContainer.append(button)
    
    })

    //Add empty item slots
    let emptySlots = playerObj.maxInventorySlots - playerObj.inventory.length
    console.log(emptySlots);
    for (i=0; i < emptySlots; i++){
        let button = document.createElement('button')
        button.disabled = true
        button.setAttribute('style', 'width:80px')
        playerActionContainer.append(button) 
    }

}

function updateBtnLabel(buttonElem, itemObj){
    buttonElem.innerHTML = `${itemObj.action} (${itemObj.durability})`
}
