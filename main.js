import {Utility} from "./utility.js"
let utility = new Utility()

import {
    Item, PlayerObj, EnemyObj, CombatState, GameState, itemsRef, rewardRef, enemyActions, gameState
} from "./data.js"

import {
    floatText, updateUi, genCards, updateBtnLabel
} from "./ui.js"
export let playerObj, enemyObj, combatState
export let rewardPool = []


//Generate
function genPlayer(){
    playerObj = new PlayerObj

    let startingItems = ['Attack', 'Block','Barrier']
    startingItems.forEach(key => {addTargetItem(key)})

    playerObj.inventory[0].durability = 99
    playerObj.inventory[1].durability = 99 

    // addRandomItem(2)
}

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
    for(let i =0; i< quant; i++){
        if(playerObj.inventory.length < playerObj.maxInventory){

            let newItem = new Item(utility.rarr(Object.keys(itemsRef)), iLvl)
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

//Generate enemy action for the next turn
function genEnemyActions(){
    enemyObj.roll = utility.rng(enemyObj.dice) //Roll enemy dice
    let actionRoll = utility.rng(100)          //roll to pick action
    let enemyAc                                //Final action
    let aAction = []  
    let actionKeys = Object.keys(enemyActions) //Get keys

    //if weakened enemy starts recovering
    if(enemyObj.def < 0 || enemyObj.def < 0 || enemyObj.def < 0){
        enemyActions.Recover.rate = 1
        console.log('updater');
    }
    else{
        enemyActions.Recover.rate = 4
    }

    //Pick action
    if(actionRoll < 6){//5%
        for(let i =0; i<actionKeys.length; i++){
            if(enemyActions[actionKeys[i]].rate === 3){
                aAction.push(enemyActions[actionKeys[i]].action)
            }
        }
        enemyAc = utility.rarr(aAction)
    } 
    else if (actionRoll < 16){//10%
        for(let i =0; i<actionKeys.length; i++){
            if(enemyActions[actionKeys[i]].rate === 2){
                aAction.push(enemyActions[actionKeys[i]].action)
            }
        }
        enemyAc = utility.rarr(aAction)
    } 
    else if (actionRoll < 46){//30%
        for(let i =0; i<actionKeys.length; i++){
            if(enemyActions[actionKeys[i]].rate === 1){
                aAction.push(enemyActions[actionKeys[i]].action)
            }
        }
        enemyAc = utility.rarr(aAction)
    } //55% att
    else {enemyAc = enemyActions.Attack.action}

    enemyObj.action = enemyAc
}



class Game {
    //Combat start
    initiateCombat(){
        combatState = new CombatState
        if(playerObj === undefined || playerObj.life < 1 ){genPlayer()}
    
        //Restore flat def
        if(playerObj.def !== playerObj.flatDef){
            playerObj.def = playerObj.flatDef
        }
    
        //Restore flat power
        if(playerObj.power < playerObj.flatPower){
            playerObj.power = playerObj.flatPower
        }
    
        //Generates enemy
        enemyObj = new EnemyObj
        utility.el('enemyImg').setAttribute('src', enemyObj.image)

        genEnemyActions() 
        updateUi()
        genCards()
    }

    //Turn
    turnCalc(buttonElem, itemId){
    
        //Damage calculation
        if (enemyObj.life > 0 && playerObj.life > 0) {
            let playerDmgDone = 0
            combatState.playerDmgTaken = 0
            let enemyDmgDone = 0
            combatState.enemyDmgTaken = 0
            playerObj.lastAction = `Turn ${combatState.turn}: `
    
            let itemid = buttonElem.getAttribute('itemid')
            let sourceItem = utility.findObj(playerObj.inventory, 'itemid', itemid)
            let playerAction = sourceItem.action
    
    
            //PRE TURN
            //Stat modification actions has to be done before generic actions
            if(playerAction==='Counter'){
                enemyObj.state='Skip turn'
            }
            //Instant actions
            else if (playerAction === 'Reroll'){
                playerObj.roll = utility.rng(playerObj.dice)
                
                
                //Deal with durability
                sourceItem.durability--
                if(sourceItem.durability<1){
                    utility.removeFromArr(playerObj.inventory, sourceItem)
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
            else if(playerAction === 'Barrier'){
                playerObj.protection = 'Barrier'
                sourceItem.cooldown = 0

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
            //Player calc
            if (['Attack', 'Fireball'].indexOf(playerAction) > -1){
                if(enemyObj.def > playerDmgDone && enemyObj.def > 0){enemyObj.def--}//reduce def on low hit
    
                playerDmgDone -= enemyObj.def //Check def
                if(playerDmgDone < 0){playerDmgDone = 0} //Set positive damage to 0
                enemyObj.life -= playerDmgDone //Reduce life
    
                combatState.enemyDmgTaken = playerDmgDone //Trigger damage indicator
            }
    
            //Enemy calc
            if(['Attack'].indexOf(enemyObj.action) > -1 && enemyObj.state !== 'Skip turn'){

                if(playerObj.protection === 'Barrier'){
                    playerObj.protection = ''
                    enemyDmgDone = Math.round(enemyDmgDone * 0.25)
                    console.log(12);
                }
     
                if(playerObj.def > enemyDmgDone && playerObj.def > 0){playerObj.def--}//reduce def on low hit4
    
                enemyDmgDone -= playerObj.def
                if (enemyDmgDone < 0){enemyDmgDone = 0} //Set positive damage to 0
                playerObj.life -= enemyDmgDone
                
                //Trigger damage indicator
                combatState.playerDmgTaken = enemyDmgDone
            }
            else if (['Multistrike'].indexOf(enemyObj.action) > -1 && enemyObj.state !== 'Skip turn'){
                for (let i = 0; i < 3; i ++){
    
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
                utility.removeFromArr(playerObj.inventory, sourceItem)
                if(sourceItem.type === 'passive'){
                    resolvePassiveItem(sourceItem)
                    //Loose passive stat
                }
            }
            
            
            //End turn updates
            playerObj.roll = utility.rng(playerObj.dice) + playerObj.rollBonus
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
            utility.toggleModal('gameOverScreen')
        }
        //Victory
        else if (enemyObj.life < 1){
            updateUi()
            gameState.stage++
            game.genReward('gen', 5) //Number of rewards to give
        }
    
    }
     
    //Rewards
    genReward(val, quant){
        //Pick from reward pool    
        if(val === 'gen'){
            let rewardRefPool = utility.cloneArr(rewardRef) //copy rewards ref array to avoid duplicates when generating random rewards
            let generatedItem
            utility.el('rewards').innerHTML = `` // clear modal body
    
            for(let i =0; i < quant; i++){ //gen item per quant value in function
                let reward = utility.rarr(rewardRefPool) //pick random reward
    
                if(reward.type !== 'Item'){ //if reward is not item, remove it from array so it can't be picked again.
                    utility.removeFromArr(rewardRefPool, reward)
                }
    
                if(reward.type === 'Item'){//item
                    //Gen random item
                    generatedItem = new Item(utility.rarr(Object.keys(itemsRef, gameState.stage)))
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
                    
                    button.setAttribute('onclick', `game.genReward('${reward.type}', '${generatedItem.itemid}')`) //quant will be id for items
                }
                
                else{
                    button.innerHTML = `${reward.desc}`
                    button.setAttribute('onclick', `game.genReward('${reward.type}')`)
                }
    
    
                utility.el('rewards').append(button)
    
            }
    
            utility.toggleModal('rewardScreen')
        }
        //Resolve reward
        else {
            //Add selected reward to player
            if(val === 'Heal'){
                playerObj.life += Math.floor(playerObj.maxLife / 2)
                if(playerObj.life > playerObj.maxLife){playerObj.life = playerObj.maxLife}
            }
            else if(val === 'Repair'){
                playerObj.inventory[utility.rng(playerObj.inventory.length) -1].durability += Math.floor(5 + (gameState.stage * 0.25))
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
    
            this.initiateCombat()
            genCards()
            updateUi()
            utility.toggleModal('rewardScreen')
        }
    }
}

//Makes game methods global
let game = new Game
window.game = game
game.initiateCombat()

window.playerObj = playerObj
