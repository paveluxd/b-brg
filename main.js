//INITITATE GAME
function initGame(){
    //Check LS

    //If LS empty
    gameState = new GameState


    //Gen player
    playerObj = new PlayerObj
    playerObj.startingItems.forEach(key => {
        addTargetItem(key)
    })


    //Gen remaining UI
    syncTree() //merge
    syncCharPage() //merge?
    genTabs() //merge ui
}

//INITITATE COMBAT
function initiateCombat(){
    combatState = new CombatState                      //New obj for every fight
    resolvePlayerStats('reset-to-flat')                //Restores def and pow to flat values
    gameState.encounter = 1 //Reset encounter

    //Generates enemy
    enemyObj = new EnemyObj                            //New enemy for every fight 
    el('enemyImg').setAttribute('src', enemyObj.image) //Adds ene img to index
    genEneAction()                                     //Gen before player turn and after
    
    syncUi()
}

//TURN
function turnCalc(buttonElem, actionId){

    //Damage calculation
    if (enemyObj.life > 0 && playerObj.life > 0) {
        let playerDmgDone = 0
        combatState.playerDmgTaken = 0
        let enemyDmgDone = 0
        combatState.enemyDmgTaken = 0
        playerObj.lastAction = `Turn ${combatState.turn}: `

        let actionId = buttonElem.getAttribute('actionId')
        let sourceItem = findObj(playerObj.actions, 'actionId', actionId)
        let playerAction = sourceItem.actionKey


        //PRE TURN
        //Stat modification actions has to be done before generic actions
        if(playerAction               === 'counter'){
            enemyObj.state='Skip turn'
        }
        //Extra actions
        else if(sourceItem.actionType === 'extra'){
            if (playerAction === 'Reroll'){
                playerObj.roll = rng(playerObj.dice) 
            }
            else if (playerAction === 'ExtraAttack'){
                playerDmgDone = 1 + playerObj.power //Set damage

                if(enemyObj.def > playerDmgDone && enemyObj.def > 0){enemyObj.def--}//Reduce def on low hit

                playerDmgDone -= enemyObj.def             //Reduce dmg by def
                if(playerDmgDone < 0){playerDmgDone = 0}  //Set positive damage to 0
                enemyObj.life -= playerDmgDone            //Reduce life

                //Trigger enemy damage indicator
                combatState.enemyDmgTaken = playerDmgDone 
            }

            //Deal with durability
            resolveCharge(sourceItem)

            syncUi()
            combatEndCheck()
            return
        }


        //TURN
        //Player action
        if      (playerAction === 'attack'){
            playerDmgDone += playerObj.roll + playerObj.power
        }
        else if (playerAction === 'fireball'){
            let mult = playerObj.actionSlots - playerObj.actions.length 
            if(mult < 1){mult = 0}
            playerDmgDone += playerObj.roll * mult
        }
        else if (playerAction === 'block'){
            enemyDmgDone -= playerObj.roll //- playerObj.power
        }
        else if (playerAction === "repair"){
            playerObj.actions.forEach(elem => {
                if(elem.action !== 'repair' && elem.actionType !== 'passive'){
                    elem.actionCharge += sourceItem.actionMod
                }
            })
        }
        else if (playerAction === 'fortify'){
            playerObj.def += playerObj.roll
        }
        else if (playerAction === 'dodge'){
            playerAction.rollBonus += Math.floor(playerObj.roll * 0.5)
        }
        else if (playerAction === 'break'){
            enemyObj.def -= playerObj.roll
        }
        else if (playerAction === 'weaken'){
            enemyObj.power -= playerObj.roll
        }
        else if (playerAction === 'root'){
            enemyObj.dice -= sourceItem.actionMod
        }
        else if (playerAction === 'barrier'){
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
            else if (enemyObj.action === 'Detonate'){
                enemyDmgDone += enemyObj.maxLife                    
            }
            
        }


        //DAMAGE CALCULATION
        //Damage inflicted by player
        if (['attack', 'fireball'].indexOf(playerAction) > -1){
            if(enemyObj.def > playerDmgDone && enemyObj.def > 0){enemyObj.def--}//Reduce def on low hit

            playerDmgDone -= enemyObj.def             //Check def
            if(playerDmgDone < 0){playerDmgDone = 0}  //Set positive damage to 0
            enemyObj.life -= playerDmgDone            //Reduce life

            //Trigger enemy damage indicator
            combatState.enemyDmgTaken = playerDmgDone 
        }

        //Damage inflicted by enemy
        if(enemyObj.state !== 'Skip turn'){

            //Reduce damage if barrier
            if(playerObj.protection === 'Barrier'){
                playerObj.protection = ''
                enemyDmgDone = Math.round(enemyDmgDone * 0.25)
            }

            if(['Attack'].indexOf(enemyObj.action) > -1){

                //Reduce def on low hit
                if(playerObj.def > enemyDmgDone && playerObj.def > 0){playerObj.def--}
    
                enemyDmgDone -= playerObj.def

                //Set positive damage to 0
                if (enemyDmgDone < 0){enemyDmgDone = 0} 
                playerObj.life -= enemyDmgDone

                //Trigger player damage indicator
                combatState.playerDmgTaken = enemyDmgDone
            }
            else if (['Multistrike'].indexOf(enemyObj.action) > -1){
                for (let i = 0; i < 3; i ++){

                    //Move to a diff var due to def reducing dmg done 3 times
                    let playerDamageTaken = enemyDmgDone

                    //Reduce def on low hit
                    if(playerObj.def > enemyDmgDone && playerObj.def > 0){playerObj.def--}
    
                    //Reduce damage by def
                    playerDamageTaken -= playerObj.def

                    //Set positive damage to 0
                    if (playerDamageTaken < 0){playerDamageTaken = 0} 
                    playerObj.life -= playerDamageTaken

                    //Trigger player damage indicator
                    combatState.playerDmgTaken = enemyDmgDone
                }
            }
            else if(['Detonate'].indexOf(enemyObj.action) > -1 && enemyObj.life < 0){

                    playerObj.life -= enemyDmgDone

                    //Trigger player damage indicator
                    combatState.playerDmgTaken = enemyDmgDone
            }
        }

        //POST CALCULATION
        //Heal after damage taken to make heal effective if you heal near hp cap.
        if (playerAction === 'heal'){
            playerObj.life += sourceItem.actionMod
            if(playerObj.life > playerObj.maxLife){playerObj.life = playerObj.maxLife}
        }

        //Deal with durability
        resolveCharge(sourceItem)

        //End turn updates
        playerObj.roll = rng(playerObj.dice) + playerObj.rollBonus
        playerObj.rollBonus = 0
        genEneAction()
        enemyObj.state = ''
        combatState.turn++
        syncUi()
    }

    combatEndCheck()
}

//END CHECK
function combatEndCheck(){
    //Defeat
    if(playerObj.life < 1 || playerObj.actions.length < 1){
        syncUi()
        toggleModal('gameOverScreen')
    }
    //Victory
    else if (enemyObj.life < 1){

        //Exit
        if(gameState.stage % gameState.bossFrequency === 0){
            gameState.encounter = 'end'
        }
        //Next fight
        else{
            gameState.encounter++
        }
        
        //Reward
        genReward('gen', 6) //Number of rewards to give

        gameState.stage++
        playerObj.exp++ //Add 1 exp
        playerObj.lvl = Math.round(1 + playerObj.exp / 3) //Recalc player lvl'
        syncUi()        
    }
}
    
//REWARD
function genReward(val, quant){

    //Clear modal body
    el('reward-container').innerHTML = `` 


    //Pick from reward pool
    if(val === 'gen'){ 
        let rewardRefPool = cloneArr(rewardRef) //Copy rewards ref array to avoid duplicates when generating random rewards
        let generatedReward

        for(let i =0; i < quant; i++){ //Gen item per quant value in function
            let reward = rarr(rewardRefPool) //Pick random reward

            if(['Item', 'Action'].indexOf(reward.rewardType) < -1){ //If reward is not item, remove it from array so it can't be picked again.
                removeFromArr(rewardRefPool, reward)
            }

            if(reward.rewardType === 'Item'){//Add item
                generatedReward =  new ItemObj(rarr(Object.keys(itemsRef)))
                rewardPool.push(generatedReward)
            }
            else if(reward.rewardType == 'Action'){//Add temp action
                generatedReward =  new ActionObj(rarr(Object.keys(actionsRef)))
                rewardPool.push(generatedReward)
            }
            else{//not item
                rewardPool.push(reward)
            }

            //Create buttons
            let button = document.createElement('button')
            
            //If item add item desc
            if(reward.rewardType === 'Item'){
                button.innerHTML = `
                <h3>${generatedReward.itemName} (item)</h3> 
                (requires an empty inventory slot).`
                
                button.setAttribute('onclick', 
                    `genReward('${reward.rewardType}', 
                    '${generatedReward.itemId}'
                )`) //'quant' value in function will be id for items
            }
            else if(reward.rewardType == 'Action'){
                button.innerHTML = `
                <h3>${generatedReward.actionName} x ${generatedReward.actionCharge} (temp. action)</h3> 
                (requires an empty action slot).`
                
                button.setAttribute('onclick', 
                    `genReward('${reward.rewardType}', 
                    '${generatedReward.actionId}'
                )`) //'quant' value in function will be id for items
            }
            
            else{
                button.innerHTML = `${reward.desc}`
                button.setAttribute('onclick', `genReward('${reward.rewardType}')`)
            }

            el('reward-container').append(button)
        }

        toggleModal('rewardScreen')
    }
    //Resolve reward
    else {
        if     (val == 'Heal'){
            playerObj.life += Math.floor(playerObj.maxLife / 2)
            if(playerObj.life > playerObj.maxLife){playerObj.life = playerObj.maxLife}
        }
        else if(val == 'Repair'){
            playerObj.actions[rng(playerObj.actions.length) -1].actionCharge += Math.floor(5 + (gameState.stage * 0.25))
        }
        else if(val == 'Bag'){
            playerObj.actionSlots++
        }
        else if(val == 'Enhance'){
            playerObj.flatDef++
        }
        else if(val == 'Train'){
            playerObj.maxLife += Math.floor(4 + (gameState.stage * 0.5))
        }
        else if(val == 'Power'){
            playerObj.flatPower++
        }
        else if(val == 'Gold'){
            playerObj.gold += rng(gameState.stage, 1)
        }
        else if(val == 'Action'){//Get action
            
            rewardPool.forEach(elem => {
                if(elem.actionId !== undefined && elem.actionId === quant){
                    if(playerObj.actions.length < playerObj.actionSlots){
                        if(elem.actionType === 'passive'){
                            resolvePassiveItem(elem, 'add')
                        }
                        playerObj.tempActions.push(elem)
                    }
                    else {
                        //Trigger item swap
                    }
                }
            })
        }
        else {//Get item
            
            rewardPool.forEach(elem => {
                if(elem.itemId !== undefined && elem.itemId === quant){
                    if(playerObj.inventory.length < playerObj.inventorySlots){
                        playerObj.inventory.push(elem)
                    }
                    else {
                        //Trigger item swap
                    }
                }
            })
            
        }

        rewardPool = []

        if(gameState.encounter == 'end'){
            playerObj.tempActions = []
            resolvePlayerStats()
            screen("map")
        }
        else{
            initiateCombat()
            toggleModal('rewardScreen')
        }

        syncUi()
    }

}

//RECALC STATS
function resolvePlayerStats(mod, stat){
    if(stat == 'maxLife' && mod == 'add'){

        let extraFlatLife = 0
        extraFlatLife += playerObj.initialLife
        playerObj.maxLifeMod = playerObj.initLifeMod

        // Check items
        playerObj.actions.forEach(item => {
            if(item.name == 'Belt'){//change to type
                extraFlatLife += item.actionMod
            }
            else if (item.name == 'LeatherBelt'){
                playerObj.maxLifeMod += node.nodeMod
            }
        })

        // Check tree nodes
        playerObj.treeNodes.forEach(node => {
            if(node.nodeType == 'flatLife'){
                extraFlatLife += node.nodeMod
            }
            else if(node.nodeType == 'percentLife'){
                playerObj.maxLifeMod += node.nodeMod
            }
        })

        //Multiply by life mod
        playerObj.maxLife = Math.round(extraFlatLife * playerObj.maxLifeMod)
    }

    if(mod == 'reset-to-flat'){
       //Restore flat def
        if(playerObj.def !== playerObj.flatDef){
            playerObj.def = playerObj.flatDef
        }

        //Restore flat power
        if(playerObj.power < playerObj.flatPower){
            playerObj.power = playerObj.flatPower
        } 
    }

    //Get all actions from all items and move them to actions arr
    playerObj.actions = []


    playerObj.inventory.forEach(item => {
        item.actions.forEach(action => {
            if(playerObj.actionSlots > playerObj.actions.length)
            playerObj.actions.push(action)
        })
    })

    //Add temporary actions
    playerObj.tempActions.forEach(action => {
        if(playerObj.actionSlots > playerObj.actions.length){
            playerObj.actions.push(action)
        }
    })

}




//ADD ITEMS
function addTargetItem(key, iLvl){
    if(playerObj.inventory.length < playerObj.inventorySlots){

        playerObj.inventory.push(new ItemObj(key, iLvl))
        resolvePlayerStats()//Adjust this to recalc all items

    }else{
        console.log('Inventory is full.');
    }
}

function addRandomItem(quant, iLvl){
    for(let i =0; i< quant; i++){
        if(playerObj.actions.length < playerObj.actionSlots){

            let newItem = new ItemObj(rarr(Object.keys(actionsRef)), iLvl)
            if(newItem.actionType === 'passive'){resolvePassiveItem(newItem, 'add')}
            playerObj.actions.push(newItem)

        }else{
            console.log('Inventory is full.');
        }
    }
}

//Enemy actions
function genEneAction(){
    enemyObj.roll = rng(enemyObj.dice) //Roll enemy dice
    let actionRoll = rng(100)          //roll to pick action
    let enemyAc                                //Final action
    let aAction = []  
    let actionKeys = Object.keys(eneActionRef) //Get keys

    //If weakened enemy starts recovering
    if(enemyObj.def < 0 || enemyObj.def < 0 || enemyObj.def < 0){
        eneActionRef.Recover.rate = 1
    }
    else{
        eneActionRef.Recover.rate = undefined
    }

    // If low life enamble detonate
    if(enemyObj.maxLife / enemyObj.life > 3){
        eneActionRef.Detonate.rate = 1
    }else{
        eneActionRef.Detonate.rate = undefined
    }


    //Pick action
    if(actionRoll < 2 && objContainsByPropValue(eneActionRef, 'rate', 4)){//1%
        for(let i = 0; i < actionKeys.length; i++){
            if(eneActionRef[actionKeys[i]].rate === 4){
                aAction.push(eneActionRef[actionKeys[i]].action)
            }
        }
        enemyAc = rarr(aAction)
    }
    if(actionRoll < 7 && objContainsByPropValue(eneActionRef, 'rate', 3)){//5%
        for(let i = 0; i < actionKeys.length; i++){
            if(eneActionRef[actionKeys[i]].rate === 3){
                aAction.push(eneActionRef[actionKeys[i]].action)
            }
        }
        enemyAc = rarr(aAction)
    } 
    else if (actionRoll < 17 && objContainsByPropValue(eneActionRef, 'rate', 2)){//10%
        for(let i =0; i<actionKeys.length; i++){
            if(eneActionRef[actionKeys[i]].rate === 2){
                aAction.push(eneActionRef[actionKeys[i]].action)
            }
        }
        enemyAc = rarr(aAction)
    } 
    else if (actionRoll < 47 && objContainsByPropValue(eneActionRef, 'rate', 1)){//30%
        for(let i =0; i<actionKeys.length; i++){
            if(eneActionRef[actionKeys[i]].rate === 1){
                aAction.push(eneActionRef[actionKeys[i]].action)
            }
        }
        enemyAc = rarr(aAction)
    } //55% att
    else {enemyAc = eneActionRef.Attack.action}

    enemyObj.action = enemyAc
}

//Resolve charge
function resolveCharge(action){
    action.actionCharge--
        if(action.actionCharge<1){
            removeFromArr(playerObj.actions, action)
            removeFromArr(playerObj.tempActions, action)

            if(action.actionType === 'passive'){
                //Remove action
                resolvePassiveItem(action)//Loose passive stat
            }
        }
}

//Replace this with a loop that will check all player items and regen stats.
function resolvePassiveItem(item, event){
    if(event === 'add'){
        if(item.action==='Shield'){
            playerObj.flatDef += item.actionMod
        }
        else if(item.action==='Amulet'){
            playerObj.flatPower += item.actionMod
        }
        else if(item.action==='Belt'){
            resolvePlayerStats('add', 'maxLife')
        }
        else if(item.action==='d8'){
            playerObj.flatDice = itemactionMod
            playerObj.dice = item.actionMod
        }
    }
    else{ //Removed

        if(item.action==='Shield'){

            if(0 < playerObj.flatDef < item.actionMod){
                playerObj.flatDef = 0 //Sync stats to avoid negative
            } 
            else{
                playerObj.flatDef -= item.actionMod //Update flat to restore at the start of the round
            }
            
            if(0 < playerObj.def < item.actionMod){
                playerObj.def = 0
            }
            else{
                let reductionVal = item.actionMod - (playerObj.flatDef - playerObj.def) //Takes into consideration flat vs actual stat diff
                playerObj.def -= reductionVal //Update here if you loose item during combat
            }
        }

        else if(item.action==='Amulet'){
            
            if(0 < playerObj.flatPower < item.actionMod){
                playerObj.flatPower = 0 //Sync stats to avoid negative
            } 
            else{
                playerObj.flatPower -= item.actionMod //Update flat to restore at the start of the round
            }
            
            if(0 < playerObj.power < item.actionMod){
                playerObj.power = 0
            }
            else{
                let reductionVal = item.actionMod - (playerObj.flatDef - playerObj.def) //Takes into consideration flat vs actual stat diff
                playerObj.def -= reductionVal //Update here if you loose item during combat
            }
        }  

        else if(item.action==='Belt'){
            
            if(0 < playerObj.maxLife < item.actionMod){
                playerObj.flatPower = 1 //Sync stats to avoid negative
            } 
            else{
                playerObj.maxLife -= item.actionMod //Update flat to restore at the start of the round
            }

            if(playerObj.life > playerObj.maxLife){
                playerObj.life = playerObj.maxLife
            }
        } 

        else if(item.action==='d8'){
            playerObj.flatDice = playerObj.initialDice
            playerObj.dice = playerObj.initialDice
        }

    }
}

//Spend tree points
function addTreeNode(node){

    if(playerObj.treePoints > 0){
        playerObj.treeNodes.push(node)// Add skill node to player obj
        
        if(node.id === 'add-life'){
            resolvePlayerStats('add', 'maxLife')
        }else if(node.id === 'percent-life'){
            playerObj.maxLifeMod += 0.25
            resolvePlayerStats('add', 'maxLife')
        }
    
        syncUi()
    }
}

//Start the game
initGame()
initiateCombat()