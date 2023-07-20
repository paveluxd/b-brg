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
function el(id){//Returns gtml elem by id
    return document.getElementById(id)
}
function cloneArr(arr){
    return JSON.parse(JSON.stringify(arr));
}



//Classes
class Item {
    constructor(key, iLvl){
        if(iLvl === undefined && gameState !== undefined){
            iLvl = gameState.stage
        }
        else{iLvl = 1}

        this.action = key
        this.desc = itemsRef[key].desc
        this.type = itemsRef[key].type

        let extraProps = [
            {key:'name', val: `${key} scroll`},
            {key:'itemid', val: "id" + Math.random().toString(8).slice(2)},//gens unique id
            {key:'durability', val: 5},
            {key:'effectMod', val: 0},
            {key:'cost', val: 12}, 
        ]

        extraProps.forEach(property => {
            if(itemsRef[key].type === 'passive' && property.key === 'durability'){
                this.durability = 1 //set dur of all passive items to 1.
            } 
            else if(itemsRef[key][property.key] === undefined){
                this[property.key] = property.val 
            }
            else {
                this[property.key] = itemsRef[key][property.key]
            }
        })
    }
}

class PlayerObj {
    constructor(){
        this.maxLife = 25,
        this.life  = this.maxLife

        this.flatPower = 0,
        this.power = 0,

        this.flatDef = 0,
        this.def   = 0,

        this.defaultDice = 6
        this.flatDice = this.defaultDice
        this.dice  = this.defaultDice,
        this.roll = rng(this.defaultDice)
        this.rollBonus = 0

        this.maxInventory = 6,
        this.inventory = [],

        this.gold = 0
    }
}

class EnemyObj {
    constructor(){
        this.life  = Math.floor(rng(12 * (gameState.stage * 0.5), 3 + gameState.stage)),
        this.maxLife = this.life
        this.power = Math.ceil(rng(gameState.stage * 0.5, 0)),
        this.def   = Math.ceil(rng(gameState.stage * 0.5, 0)),
        this.dice  = 2 + gameState.stage,
        
        this.name  = rarr(enemyNameStart) + rarr(enemyNameEnd),
        this.level = gameState.stage
        this.image = `./img/enemy/${gameState.stage}.png`
    }
}

class CombatState {
    constructor(){
        this.turn = 1
        this.enemyDmgTaken = 0
        this.playerDmgTaken = 0
    }
}

class GameState{
    constructor(){
        this.stage = 1
    }
}



//Data & vars
let itemsRef = {
    //Item key is used as 'action' string
    //Basic
    Attack:  {desc: "Deal damage equal to dice roll value", durability:99 },
    Block:   {desc: 'Block damage equal to dice roll value',},
    Dodge:   {desc: 'Skip turn to keep half of your roll for the next turn'},
    Repair:  {desc: 'Restore durability to all different type items', effectMod: 1,},
    Fireball:{desc: 'Deal damage equal to (roll x empty item slots)', durability: 1,},
    
    //Player stats
    Heal:    {desc: "Restore 8 life", durability: 2, effectMod: 12},
    Fortify: {desc: 'Increase def until the end of this fight', durability:1, effectMod: 1,},
    // Rage:    {desc: 'Increase power until the end of this fight'},
    // Focus:   {desc: 'Increase next turn roll'},

    // //Enemy states
    // Weaken:  {desc: 'Reduce enemy power by 1'},
    // Break:   {desc: 'Reduce enemy defence by 1'},
    // Root:    {desc: 'Reduce enemy dice by 1'},
    Counter: {desc: 'Prevent enemy action', durability: 2},
    // Stun:    {desc: 'Prevent enemy for acting during this turn'},

    // //Passive items
    Shield:    {desc: 'Passive: +3 def while in inventory', type: 'passive', effectMod: 3,},
    Amulet:    {desc: 'Passive: +2 power while in inventory', type: 'passive', effectMod: 2,},
    Belt:      {desc: 'Passive: +20 max life while in inventory', type: 'passive', effectMod: 20,},
    d8:        {desc: 'Passive: Use d8 for rolls while this is in inventory', type: 'passive', effectMod: 8,}
}
let deckRef = {
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
let rewardRef = [
    {type:'Item', freq: 10, desc: 'Get random item (requires empty slot)'}, 
    {type:'Train', freq: 5, desc: 'Increase maximum life'},
    {type:'Enhance', freq: 1, desc: 'Increase defence'},
    {type:'Power', freq: 1, desc: 'Increase power by 1.'},
    {type:'Heal', freq: 3, desc: 'Restore life'},
    {type:'Repair', freq: 3, desc:'Repair random item'},
    {type:'Bag', freq: 1, desc: 'Gain an additional inventory slot'}
]

let enemyNameStart = ['Gar', 'Tar', 'Wal', 'Far', 'Duh', 'Ro' ,'Nar', 'Tal', 'Ikr']
let enemyNameEnd =   ['talin', 'war', 'barun', 'antoles', 'farhair', 'dox', 'marin', 'volen', 'darion']
let playerObj, enemyObj, combatState
let rewardPool = []
let playerActionContainer = document.getElementById('playerActionContainer')
let gameState = new GameState



//GAME
//Generate
function genPlayer(){
    playerObj = new PlayerObj

    let startingItems = ['Attack', 'Fireball', 'Fortify', 'd8']
    startingItems.forEach(key => {addTargetItem(key)})

    // addRandomItem(4)
    console.log(playerObj);
}

//Manage player charsheet
//ADD ITEMS
function addTargetItem(key, iLvl){
    if(playerObj.inventory.length < playerObj.maxInventory){

        let newItem = new Item(key, iLvl)
        if(newItem.type === 'passive'){resolvePassiveItem(newItem, 'add')}
        playerObj.inventory.push(newItem)

    }else{
        console.log('Inventory is full.');
    }
}

function addRandomItem(quant, iLvl){
    for(i=0; i< quant; i++){
        if(playerObj.inventory.length < playerObj.maxInventory){

            let newItem = new Item(rarr(Object.keys(itemsRef)), iLvl)
            if(newItem.type === 'passive'){resolvePassiveItem(newItem, 'add')}
            playerObj.inventory.push(newItem)

        }else{
            console.log('Inventory is full.');
        }
    }
}

function resolvePassiveItem(item, event){
    if(event === 'add'){
        if(item.action==='Shield'){
            playerObj.flatDef += item.effectMod
        }
        else if(item.action==='Amulet'){
            playerObj.flatPower += item.effectMod
        }
        else if(item.action==='Belt'){
            playerObj.maxLife += item.effectMod
        }
        else if(item.action==='d8'){
            playerObj.flatDice = item.effectMod
            playerObj.dice = item.effectMod
        }
        
    }
    else{

        if(item.action==='Shield'){

            if(0 < playerObj.flatDef < item.effectMod){
                playerObj.flatDef = 0 //Sync stats to avoid negative
            } 
            else{
                playerObj.flatDef -= item.effectMod //Update flat to restore at the start of the round
            }
            
            if(0 < playerObj.def < item.effectMod){
                playerObj.def = 0
            }
            else{
                let reductionVal = item.effectMod - (playerObj.flatDef - playerObj.def) //Takes into consideration flat vs actual stat diff
                playerObj.def -= reductionVal //Update here if you loose item during combat
            }
        }

        else if(item.action==='Amulet'){
            
            if(0 < playerObj.flatPower < item.effectMod){
                playerObj.flatPower = 0 //Sync stats to avoid negative
            } 
            else{
                playerObj.flatPower -= item.effectMod //Update flat to restore at the start of the round
            }
            
            if(0 < playerObj.power < item.effectMod){
                playerObj.power = 0
            }
            else{
                let reductionVal = item.effectMod - (playerObj.flatDef - playerObj.def) //Takes into consideration flat vs actual stat diff
                playerObj.def -= reductionVal //Update here if you loose item during combat
            }
        }  

        else if(item.action==='Belt'){
            
            if(0 < playerObj.maxLife < item.effectMod){
                playerObj.flatPower = 1 //Sync stats to avoid negative
            } 
            else{
                playerObj.maxLife -= item.effectMod //Update flat to restore at the start of the round
            }

            if(playerObj.life > playerObj.maxLife){
                playerObj.life = playerObj.maxLife
            }
        } 

        else if(item.action==='d8'){
            playerObj.flatDice = playerObj.defaultDice
            playerObj.dice = playerObj.defaultDice
        }

    }
}

function genEnemy(){
    enemyObj = new EnemyObj
    el('enemyImg').setAttribute('src', enemyObj.image)

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
        enemyAc = enemyActions.Attack.action
    }

    enemyObj.action = enemyAc
}



//COMBAT
function initiateCombat(){
    combatState = new CombatState
    if(playerObj === undefined || playerObj.life < 1 ){genPlayer()}

    //Restore flat def
    if(playerObj.def !== playerObj.flatDef){
        playerObj.def = playerObj.flatDef
        console.log('synced def');
    }

    //Restore flat power
    if(playerObj.power < playerObj.flatPower){playerObj.power = playerObj.flatPower}

    genEnemy()
    genEnemyActions() 
    updateUi()
    genCards()
}
initiateCombat()


//Turn
function turnCalc(buttonElem, itemId){

    //Damage calculation
    if (enemyObj.life > 0 && playerObj.life > 0) {
        let playerDmgDone = 0
        combatState.playerDmgTaken = 0
        let enemyDmgDone = 0
        combatState.enemyDmgTaken = 0
        playerObj.lastAction = `Turn ${combatState.turn}: `

        let itemid = buttonElem.getAttribute('itemid')
        let sourceItem = findObj(playerObj.inventory, 'itemid', itemid)
        let playerAction = sourceItem.action


        //PRE TURN
        //Stat modification actions has to be done before generic actions
        if(playerAction==='Counter'){
            enemyObj.state='Skip turn'
        }


        //TURN
        //Player action
        if      (playerAction === 'Attack'){//attack
            playerDmgDone += playerObj.roll + playerObj.power
        }
        else if (playerAction === 'Fireball'){
            let mult = playerObj.maxInventory - playerObj.inventory.length 
            if(mult < 1){mult = 0}
            playerDmgDone += playerObj.roll * mult
        }
        else if (playerAction === 'Block'){//block
            enemyDmgDone -= playerObj.roll //- playerObj.power
        }
        else if (playerAction === "Repair"){//repair
            playerObj.inventory.forEach(elem => {
                if(elem.action !== 'Repair' && elem.type !== 'passive'){
                    elem.durability += sourceItem.effectMod
                }
            })
        }
        else if (playerAction === 'Fortify'){
            playerObj.def += playerObj.roll
        }
        else if (playerAction === 'Dodge'){
            playerAction.rollBonus += Math.flooe(playerObj.roll * 0.5)
        }
        
        //Enemy action
        if      (enemyObj.action === 'Attack' && enemyObj.state !== 'Skip turn'){//attack
            enemyDmgDone += enemyObj.roll + enemyObj.power 
        }
        else if (enemyObj.action === 'Block' && enemyObj.state !== 'Skip turn'){//block
            playerDmgDone -= enemyObj.roll
        }


        //CALC
        //Deal damage if chars attacked
        if (['Attack', 'Fireball'] .indexOf(playerAction) > -1
        ){
            if(enemyObj.def > playerDmgDone && enemyObj.def > 0){enemyObj.def--}//reduce def on low hit
            if(playerDmgDone < 0){playerDmgDone = 0} //Set positive damage to 0
            playerDmgDone -= enemyObj.def //Check def
            enemyObj.life -= playerDmgDone //Reduce life
            combatState.enemyDmgTaken = playerDmgDone //Trigger damage indicator
        }

        if (enemyObj.action === 'Attack' && enemyObj.state !== 'Skip turn'){
            if(playerObj.def > enemyDmgDone && playerObj.def > 0){playerObj.def--}//reduce def on low hit
            if (enemyDmgDone < 0){enemyDmgDone = 0} //Set positive damage to 0
            enemyDmgDone -= playerObj.def
            playerObj.life -= enemyDmgDone

            //Trigger damage indicator
            combatState.playerDmgTaken = enemyDmgDone
        }

        //POST CALC
        //Heal after damage taken to make heal effective if you heal near hp cap.
        if (playerAction === 'Heal'){
            playerObj.life += sourceItem.effectMod
            if(playerObj.life > playerObj.maxLife){playerObj.life = playerObj.maxLife}
        }


        //Deal with durability
        sourceItem.durability--
        if(sourceItem.durability<1){
            removeFromArr(playerObj.inventory, sourceItem)
            if(sourceItem.type === 'passive'){
                resolvePassiveItem(sourceItem)
                //Loose passive stat
            }
        }
        genCards() 
        updateBtnLabel(buttonElem, sourceItem) //Update durability labels

        
        //End turn updates
        playerObj.roll = rng(playerObj.dice) + playerObj.rollBonus
        playerObj.rollBonus = 0
        genEnemyActions()
        enemyObj.state = ''
        combatState.turn++
        updateUi()
    }


    //Check if game state changed
    //Defeat
    if(playerObj.life < 1 || playerObj.inventory.length < 1){
        updateUi()
        toggleModal('gameOverScreen')
    }
    //Victory
    else if (enemyObj.life < 1){
        updateUi()
        gameState.stage++

        genReward('gen', 3)
        
    }

}

//Rewards
function genReward(val, quant){
    //Pick from reward pool    
    if(val === 'gen'){
        let rewardRefPool = cloneArr(rewardRef)
        el('rewards').innerHTML = ``

        for(i=0; i < quant; i++){
            let reward = rarr(rewardRefPool)
            if(reward.type !== 'Item'){
                removeFromArr(rewardRefPool, reward)
            }

            if(reward.type === 'item'){
                //Gen random item
                let item = new Item(rarr(Object.keys(itemsRef, gameState.stage)))
                rewardPool.push(item)
            }
            else{
                rewardPool.push(reward)
            }

            let button = document.createElement('button')
            button.setAttribute('onclick', `genReward('${reward.type}')`)
            button.innerHTML = `${reward.desc}`
            el('rewards').append(button)

        }

        toggleModal('rewardScreen')
    }
    //Resolve reward
    else {
        //Add selected reward to player
        if(val === 'Heal'){
            playerObj.life += Math.floor(playerObj.maxLife / 2)
            if(playerObj.life > playerObj.maxLife){playerObj.life = playerObj.maxLife}
        }
        else if(val === 'Repair'){
            playerObj.inventory[rng(playerObj.inventory.length) -1].durability += Math.floor(5 + (gameState.stage * 0.25))
        }
        else if(val === 'Bag'){
            playerObj.maxInventory++
        }
        else if(val === 'Enhance'){
            playerObj.flatDef++
        }
        else if (val === 'Train'){
            playerObj.maxLife += Math.floor(4 + (gameState.stage * 0.5))
        }
        else if(val==='Power'){
            playerObj.flatPower++
        }
        else {
            addRandomItem(1)
        }

        initiateCombat()
        genCards()
        updateUi()
        toggleModal('rewardScreen')
    }
}// genReward('gen', 4)


//MANAGE UI
function runAnim(elem, animClass){
    elem.classList.remove(animClass)
    void enemyDmgInd.offsetWidth; // trigger reflow
    elem.classList.add(animClass)
}

function updateUi(){
    //Update damage indicator
    if(combatState.enemyDmgTaken > 0){
        el('enemyDmgInd').innerHTML = `-`+ combatState.enemyDmgTaken
        runAnim(el('enemyDmgInd'), 'float-num')
    }

    if(combatState.playerDmgTaken > 0){
        el('playerDmgInd').innerHTML = `-`+combatState.playerDmgTaken
        runAnim(el('playerDmgInd'), 'float-num')
    }

    //Game stats
    el('logIndicator').innerHTML = `
    Stage: ${gameState.stage} / Turn: ${combatState.turn}`

    //Player stats
    el('p-dice').innerHTML = `${playerObj.roll} (d${playerObj.dice})`
    el('p-life').innerHTML = `${playerObj.life} / ${playerObj.maxLife} (<img src="./img/ico/shield.svg"> ${playerObj.def})`
    el('p-power').innerHTML = `${playerObj.power}`        
    // el('p-def').innerHTML = `${playerObj.def}`
    
    //Enemy stats
    el('intent').innerHTML = `I will ${enemyObj.action}!`
    el('dice').innerHTML = `${enemyObj.roll} (d${enemyObj.dice})`
    el('life').innerHTML = `${enemyObj.life} / ${enemyObj.maxLife} (<img src="./img/ico/shield.svg"> ${enemyObj.def})`
    el('power').innerHTML = `${enemyObj.power}`        
    // el('def').innerHTML = `${enemyObj.def}`
}

//Action buttons
function genCards(){
    playerActionContainer.innerHTML = ''
    
    //Add buyyons per player item
    playerObj.inventory.forEach(item => {
        let button = document.createElement('button')
        button.setAttribute('onclick', `turnCalc(this)`)
        button.setAttribute('itemid', item.itemid)
        button.classList.add('action')
        updateBtnLabel(button, item)
        playerActionContainer.append(button)
    })

    //Add empty item slots
    let emptySlots = playerObj.maxInventory - playerObj.inventory.length
    for (i=0; i < emptySlots; i++){
        let button = document.createElement('button')
        button.innerHTML = `Item slot`
        button.disabled = true
        button.classList.add('action')
        playerActionContainer.append(button) 
    }

}

function updateBtnLabel(buttonElem, itemObj){
    buttonElem.innerHTML = `
    <span style="font-weight: 600;">${itemObj.action} x${itemObj.durability}</span>
    ${itemObj.desc}`
}
