//Misc fucntions
function toggleModal(id){//modal
    document.getElementById(id).classList.toggle('hide')
    runAnim(el(id).firstElementChild, 'modal-slide')
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
        if(iLvl === undefined && gameState !== undefined){iLvl = gameState.stage}else{iLvl = 1}
        this.action = key
        this.desc = itemsRef[key].desc
        this.type = itemsRef[key].type


        //Variable properties
        let extraProps = [
            {key:'name', val: `${key} scroll`},
            {key:'itemid', val: "id" + Math.random().toString(8).slice(2)},//gens unique id
            {key:'durability', val: 10},
            {key:'effectMod', val: 0},
            {key:'cost', val: 12}, 
        ]


        //Resolves extra properties that either have default from above or gain value from ref object
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
        this.maxLife = 32,
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

        this.maxInventory = 8,
        this.inventory = [],

        this.gold = 0
    }
}

class EnemyObj {
    constructor(){
        this.life  = Math.floor(6 + gameState.stage * 2),
        this.maxLife = this.life

        this.power = Math.ceil(rng(gameState.stage * 0.5, 0)),
        this.def   = Math.ceil(rng(gameState.stage * 0.3, 0)),

        this.dice  = 4 + Math.round(gameState.stage * 0.2),
        
        this.level = gameState.stage
        this.image = `./img/enemy/${gameState.stage}.png`
    }
}

class CombatState {
    constructor(){
        this.turn = 1
        this.enemyDmgTaken = 0
        this.playerDmgTaken = 0
        this.enemyAction = []
        this.playerAction = []
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
    Attack:  {desc: "Deal damage equal to dice roll value", durability:12 },
    Block:   {desc: 'Block damage equal to dice roll value', },
    Dodge:   {desc: 'Skip turn to keep half of your roll for the next turn', },
    Repair:  {desc: 'Restore durability to all different type items', effectMod: 3,},
    Fireball:{desc: 'Deal damage equal to (roll x empty item slots)', durability: 6,},
    
    //Player stats
    Heal:    {desc: "Restore 12 life", durability: 3, effectMod: 12},
    Fortify: {desc: 'Increase def until the end of this fight', durability:1, effectMod: 3,},
    // Rage:    {desc: 'Increase power until the end of this fight'},
    // Focus:   {desc: 'Increase next turn roll'},
    Reroll: {desc: "Instant action: Reroll your dice.", durability: 10},

    //Enemy states
    Weaken:  {desc: 'Reduce enemy power', durability: 3,},
    Break:   {desc: 'Break enemy defence', durability: 3,},
    Counter: {desc: 'Prevent enemy action', durability: 3},
    Root:    {desc: 'Reduce enemy dice by 2', durability: 3, effectMod: 3,},
    // Stun:    {desc: 'Prevent enemy for acting during this turn'},

    //Passive items
    Shield:  {desc: '+3 def while in inventory (passive)', type: 'passive', effectMod: 3,},
    Amulet:  {desc: '+2 power while in inventory (passive)', type: 'passive', effectMod: 2,},
    Belt:    {desc: '+20 max life while in inventory (passive)', type: 'passive', effectMod: 20,},
    d8:      {desc: 'Use d8 for rolls while this is in inventory (passive)', type: 'passive', effectMod: 8,}
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
    {type:'Item', freq: 1, desc: 'Get random item (requires empty slot)'}, 
    {type:'Item', freq: 1, desc: 'Get random item (requires empty slot)'}, 
    {type:'Item', freq: 1, desc: 'Get random item (requires empty slot)'}, 
    {type:'Item', freq: 1, desc: 'Get random item (requires empty slot)'}, 
    {type:'Item', freq: 1, desc: 'Get random item (requires empty slot)'}, 
    {type:'Item', freq: 1, desc: 'Get random item (requires empty slot)'}, 

    {type:'Train', freq: 1, desc: 'Increase maximum life'},
    {type:'Enhance', freq: 1, desc: 'Increase defence'},
    {type:'Power', freq: 1, desc: 'Increase power by 1.'},
    {type:'Heal', freq: 1, desc: 'Restore life'},
    {type:'Repair', freq: 1, desc:'Repair random item'},
    {type:'Bag', freq: 1, desc: 'Gain an additional inventory slot'}
]
let enemyActions = {
    Attack:      {        action: 'Attack',  desc: `Attack`},
    Block:       {rate:1, action: 'Block',   desc: `Block`},
    Multistrike: {rate:2, action: 'Multistrike', desc: `Multistrike`},
    Fortify:     {rate:2, action: 'Fortify', desc: `Armor up!`},
    Empower:     {rate:2, action: 'Empower', desc: `More POWER!`},
    Rush:        {rate:1, action: 'Rush', desc: `Larger dice!`},
    Sleep:       {rate:3, action: 'Sleep', desc: `Zzzz...`,}, //Make sure all rates are there, else error

    Recover:     {rate:4, action: 'Recover', desc:`Recover`}

    // "poi att":  {rate:1,   desc: `Will attack with poison for ${dmgVal}`},
    // "fire att": {rate:1,   desc: `Will attack with fire for ${dmgVal}`},
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


let playerObj, enemyObj, combatState
let rewardPool = []
let playerActionContainer = document.getElementById('playerActionContainer')
let gameState = new GameState



//GAME
//Generate
function genPlayer(){
    playerObj = new PlayerObj

    let startingItems = ['Attack', 'Block','Reroll']
    startingItems.forEach(key => {addTargetItem(key)})

    playerObj.inventory[0].durability = 99
    playerObj.inventory[1].durability = 99 

    // addRandomItem(2)
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
    let actionRoll = rng(100)                  //roll to pick action
    let enemyAc                                //Final action
    let aAction = []  
    let actionKeys = Object.keys(enemyActions) //Get keys

    if(enemyObj.def < 0 || enemyObj.def < 0 || enemyObj.def < 0){
        enemyActions.Recover.rate = 1
        console.log('updater');
    }
    else{
        enemyActions.Recover.rate = 4

    }

    //Pick action
    if(actionRoll < 6){//5%
        for(i=0; i<actionKeys.length; i++){
            if(enemyActions[actionKeys[i]].rate === 3){
                aAction.push(enemyActions[actionKeys[i]].action)
            }
        }
        enemyAc = rarr(aAction)
    } 
    else if (actionRoll < 16){//10%
        for(i=0; i<actionKeys.length; i++){
            if(enemyActions[actionKeys[i]].rate === 2){
                aAction.push(enemyActions[actionKeys[i]].action)
            }
        }
        enemyAc = rarr(aAction)
    } 
    else if (actionRoll < 46){//30%
        for(i=0; i<actionKeys.length; i++){
            if(enemyActions[actionKeys[i]].rate === 1){
                aAction.push(enemyActions[actionKeys[i]].action)
            }
        }
        enemyAc = rarr(aAction)
    } //55% att
    else {enemyAc = enemyActions.Attack.action}

    enemyObj.action = enemyAc
}


//***
//COMBAT
function initiateCombat(){
    combatState = new CombatState
    if(playerObj === undefined || playerObj.life < 1 ){genPlayer()}

    //Restore flat def
    if(playerObj.def !== playerObj.flatDef){
        playerObj.def = playerObj.flatDef
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
        //Instant actions
        else if (playerAction === 'Reroll'){
            playerObj.roll = rng(playerObj.dice)
            
            
            //Deal with durability
            sourceItem.durability--
            if(sourceItem.durability<1){
                removeFromArr(playerObj.inventory, sourceItem)
                if(sourceItem.type === 'passive'){
                    resolvePassiveItem(sourceItem)
                    //Loose passive stat
                }
            }
            updateUi()
            genCards()
            return
        }


        //TURN
        //Player action
        if      (playerAction === 'Attack'){
            playerDmgDone += playerObj.roll + playerObj.power
        }
        else if (playerAction === 'Fireball'){
            let mult = playerObj.maxInventory - playerObj.inventory.length 
            if(mult < 1){mult = 0}
            playerDmgDone += playerObj.roll * mult
        }
        else if (playerAction === 'Block'){
            enemyDmgDone -= playerObj.roll //- playerObj.power
        }
        else if (playerAction === "Repair"){
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
            playerAction.rollBonus += Math.floor(playerObj.roll * 0.5)
        }
        else if (playerAction === 'Break'){
            enemyObj.def -= playerObj.roll
        }
        else if (playerAction === 'Weaken'){
            enemyObj.power -= playerObj.roll
        }
        else if (playerAction === 'Root'){
            enemyObj.dice -= sourceItem.effectMod
        }
        
        //Enemy action
        if(enemyObj.state !== 'Skip turn'){

            if      (enemyObj.action === 'Attack'){
                enemyDmgDone += enemyObj.roll + enemyObj.power 
            }
            else if (enemyObj.action === 'Block'){//block
                playerDmgDone -= enemyObj.roll
                combatState.enemyAction = ['Block', enemyObj.roll]
            }
            else if (enemyObj.action === 'Multistrike'){
                enemyDmgDone += (1 + enemyObj.power)
            }
            else if (enemyObj.action === 'Fortify'){
                let x = Math.round((enemyObj.roll + gameState.stage) *0.25)
                enemyObj.def += x
                combatState.enemyAction = ['Fortify', x]
            }
            else if (enemyObj.action === 'Empower'){
                let x = Math.round((enemyObj.roll + gameState.stage) *0.25)
                enemyObj.power += x
                combatState.enemyAction = ['Empower', x]
            }
            else if (enemyObj.action === 'Rush'){
                let x = Math.round(1 + (gameState.stage) *0.2)
                enemyObj.dice += x
                combatState.enemyAction = ['Rusn', x]
            }
            else if (enemyObj.action === 'Sleep'){
                combatState.enemyAction = ['Sleep']
            }
            else if (enemyObj.action === 'Recover'){
                if(enemyObj.def < 0){
                    combatState.enemyAction = ['Recover', Math.abs(enemyObj.def), 'def'] //abs turns integer positive
                    enemyObj.def = 0
                }
                else if(enemyObj.power < 0){
                    combatState.enemyAction = ['Recover', Math.abs(enemyObj.def), 'power'] //abs turns integer positive
                    enemyObj.power = 0

                }
                else if(enemyObj.dice < 6){
                    combatState.enemyAction = ['Recover', Math.abs(enemyObj.def), 'dice'] //abs turns integer positive
                    enemyObj.dice = 6

                }
            }
            
        }


        //CALC
        //Deal damage if chars attacked
        if (['Attack', 'Fireball'].indexOf(playerAction) > -1){
            if(enemyObj.def > playerDmgDone && enemyObj.def > 0){enemyObj.def--}//reduce def on low hit

            playerDmgDone -= enemyObj.def //Check def
            if(playerDmgDone < 0){playerDmgDone = 0} //Set positive damage to 0
            enemyObj.life -= playerDmgDone //Reduce life

            combatState.enemyDmgTaken = playerDmgDone //Trigger damage indicator
        }

        if(['Attack'].indexOf(enemyObj.action) > -1 && enemyObj.state !== 'Skip turn'){
 
            if(playerObj.def > enemyDmgDone && playerObj.def > 0){playerObj.def--}//reduce def on low hit4

            enemyDmgDone -= playerObj.def
            if (enemyDmgDone < 0){enemyDmgDone = 0} //Set positive damage to 0
            playerObj.life -= enemyDmgDone
            
            //Trigger damage indicator
            combatState.playerDmgTaken = enemyDmgDone
        }
        else if (['Multistrike'].indexOf(enemyObj.action) > -1 && enemyObj.state !== 'Skip turn'){
            for (i = 0; i < 3; i ++){

                let playerDamageTaken = enemyDmgDone//move to a diff var due to def reducing dmg done 3 times
            
                if(playerObj.def > enemyDmgDone && playerObj.def > 0){playerObj.def--}//reduce def on low hit

                playerDamageTaken -= playerObj.def
                if (playerDamageTaken < 0){playerDamageTaken = 0} //Set positive damage to 0
                playerObj.life -= playerDamageTaken
                
                //Trigger damage indicator
                combatState.playerDmgTaken = enemyDmgDone

            }

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
        
        
        //End turn updates
        playerObj.roll = rng(playerObj.dice) + playerObj.rollBonus
        playerObj.rollBonus = 0
        genEnemyActions()
        enemyObj.state = ''
        combatState.turn++
        genCards() 
        // updateBtnLabel(buttonElem, sourceItem) //Update durability labels
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
        genReward('gen', 5) //Number of rewards to give
    }

}

//***
//REWARDS
function genReward(val, quant){
    //Pick from reward pool    
    if(val === 'gen'){
        let rewardRefPool = cloneArr(rewardRef) //copy rewards ref array to avoid duplicates when generating random rewards
        let generatedItem
        el('rewards').innerHTML = `` // clear modal body

        for(i=0; i < quant; i++){ //gen item per quant value in function
            let reward = rarr(rewardRefPool) //pick random reward

            if(reward.type !== 'Item'){ //if reward is not item, remove it from array so it can't be picked again.
                removeFromArr(rewardRefPool, reward)
            }

            if(reward.type === 'Item'){//item
                //Gen random item
                generatedItem = new Item(rarr(Object.keys(itemsRef, gameState.stage)))
                rewardPool.push(generatedItem)
            }
            else{//not item
                rewardPool.push(reward)
            }

            //Create buttons
            let button = document.createElement('button')
            
            //if item add item desck
            if(reward.type === 'Item'){
                button.innerHTML = `
                <h3>${generatedItem.action} (Durability: ${generatedItem.durability})</h3> 
                ${generatedItem.desc} (requires empty item slot).`
                
                button.setAttribute('onclick', `genReward('${reward.type}', '${generatedItem.itemid}')`) //quant will be id for items
            }
            
            else{
                button.innerHTML = `${reward.desc}`
                button.setAttribute('onclick', `genReward('${reward.type}')`)
            }


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
            //Get item from reward gen
            rewardPool.forEach(elem => {
                if(elem.itemid !== undefined && elem.itemid === quant){
                    if(playerObj.inventory.length < playerObj.maxInventory){
                        if(elem.type === 'passive'){resolvePassiveItem(elem, 'add')}
                        playerObj.inventory.push(elem)
                    }
                }
            })
            rewardPool = []
        }

        initiateCombat()
        genCards()
        updateUi()
        toggleModal('rewardScreen')
    }
}
// genReward('gen', 4)


//***
//UI
function runAnim(elem, animClass){
    elem.classList.remove(animClass)
    void elem.offsetWidth; // trigger reflow
    elem.classList.add(animClass)
}

function floatText(target, string){

    if(target === 'en'){
        el('enDmgInd').innerHTML = string
        runAnim(el('enDmgInd'), 'float-num')
    }
    else{
        el('plDmgInd').innerHTML = string
        runAnim(el('plDmgInd'), 'float-num')
    }


    //if positive -> text green etc
    if(string[0] === '-'){
        el('enDmgInd').setAttribute('style', 'color:red;')
        el('plDmgInd').setAttribute('style', 'color:red;')

    }
    else{
        el('enDmgInd').setAttribute('style', 'color:white;')
        el('plDmgInd').setAttribute('style', 'color:white;')

    }
}

function updateUi(){
    //log
    el('log').innerHTML = `Stage: ${gameState.stage} <br> Turn: ${combatState.turn}` 

    //Enemy floating number
    if(combatState.enemyDmgTaken > 0){//Attack
        floatText('en',`-${combatState.enemyDmgTaken} life`)
    }
    else if(combatState.enemyAction[0] === 'Fortify'){
        floatText('en',`+${combatState.enemyAction[1]} def`)
    }
    else if(combatState.enemyAction[0] === 'Empower'){
        floatText('en',`+${combatState.enemyAction[1]} power`)
    }
    else if(combatState.enemyAction[0] === 'Rush'){
        floatText('en',`+${combatState.enemyAction[1]} dice`)
    }
    else if(combatState.enemyAction[0] === 'Sleep'){
        floatText('en',`Zzzzz`)
    }
    else if(combatState.enemyAction[0] === 'Block'){
        floatText('en',`Blocked ${combatState.enemyAction[1]}`)
    }
    else if(combatState.enemyAction[0] === 'Recover'){
        floatText('en',`Recovered ${combatState.enemyAction[1]} ${combatState.enemyAction[2]}`)
    }

    combatState.enemyAction = []
    

    //Player floating number
    if(combatState.playerDmgTaken > 0){
        floatText('pl',`-${combatState.playerDmgTaken} life`)
    }

    //Player stats
    el('p-life').innerHTML = `${playerObj.life}/${playerObj.maxLife}`
    el('p-def').innerHTML = `${playerObj.def}`
    el('p-dice').innerHTML = `${playerObj.roll} (d${playerObj.dice})`
    el('p-power').innerHTML = `${playerObj.power}`        

    //Enemy stats
    el('life').innerHTML = `${enemyObj.life}/${enemyObj.maxLife}`
    el('def').innerHTML = `${enemyObj.def}`
    el('dice').innerHTML = `${enemyObj.roll} (d${enemyObj.dice})`
    el('power').innerHTML = `${enemyObj.power}`        

    if(enemyObj.action === 'Attack'){
        el('intent').innerHTML = `${enemyActions[enemyObj.action].desc} for ${enemyObj.roll + enemyObj.power}`
    }
    else if(enemyObj.action === 'Block'){
        el('intent').innerHTML = `${enemyActions[enemyObj.action].desc} ${enemyObj.roll} damage`

    }
    else if(enemyActions[enemyObj.action] === undefined){
        console.log(enemyObj);
    }
    else{
        // console.log(enemyActions[enemyObj.action]);
        el('intent').innerHTML = `${enemyActions[enemyObj.action].desc}`
    }
}

//Action buttons
function genCards(){
    playerActionContainer.innerHTML = ''
    
    //Add buyyons per player item
    playerObj.inventory.forEach(item => {
        let button = document.createElement('button')

        //add top decorative bar
        let bar = document.createElement('div')
        bar.innerHTML = `
                    <svg height="4" width="4" style="fill: black;">
                        <polygon points="0,0 0,4 4,0"/>
                    </svg>
                    <svg height="4" width="4" style="fill: black;">
                        <polygon points="4,0 0,0 4,4"/>
                    </svg>
                    `

        let content = document.createElement('section')
        
        button.setAttribute('onclick', `turnCalc(this)`)
        button.setAttribute('itemid', item.itemid) // add item id
        button.classList.add('action')

        button.append(bar, content)
        updateBtnLabel(button, item)
        
        playerActionContainer.append(button)
    })

    //Add empty item slots
    let emptySlots = playerObj.maxInventory - playerObj.inventory.length
    for (i=0; i < emptySlots; i++){
        let button = document.createElement('button')
        button.innerHTML = `[ ]`
        button.disabled = true
        button.classList.add('action', 'empty-slot')
        playerActionContainer.append(button) 
    }

}

function updateBtnLabel(buttonElem, itemObj){
    if(itemObj.action === 'Attack'){
        buttonElem.querySelector('section').innerHTML = `
        <span>
            <h3>${itemObj.action} for ${playerObj.roll + playerObj.power}</h3> 
            <p>x${itemObj.durability}</p>
        </span>
        <p class='desc'>${itemObj.desc}</p>
    `   
    }
    else if(itemObj.action === 'Fireball'){        
        buttonElem.querySelector('section').innerHTML = `
            <span>
                <h3>${itemObj.action} for ${playerObj.roll * (playerObj.maxInventory - playerObj.inventory.length)}</h3> 
                <p>x${itemObj.durability}</p>
            </span>
            <p class='desc'>${itemObj.desc}</p>
        `
    }
    else if (['Block', 'Break'].indexOf(itemObj.action) > -1){
        buttonElem.querySelector('section').innerHTML = `
            <span>
                <h3>${itemObj.action} ${playerObj.roll}</h3> 
                <p>x${itemObj.durability}</p>
            </span>
            <p class='desc'>${itemObj.desc}</p>
        `      
    }
    else{
        buttonElem.querySelector('section').innerHTML = `
            <span>
                <h3>${itemObj.action}</h3> 
                <p>x${itemObj.durability}</p>
            </span>
            <p class='desc'>${itemObj.desc}</p>
        `        
    }
}
