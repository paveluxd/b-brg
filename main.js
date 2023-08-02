

//Add actions
//Add equipment
//Redo  rewards

//Build the tree


//This function is triggered from the html
function initGame(){
    //Check LS

    //If LS empty
    gameState = new GameState


    //Gen player
    playerObj = new PlayerObj
    playerObj.startingItems.forEach(key => {
        addTargetItem(key)
        // resolvePassiveItem()
    })
    playerObj.actions[0].durability = 99
    playerObj.actions[1].durability = 99 
    // addRandomItem(2)


    //Gen remaining UI
    syncTree() //merge
    syncCharPage() //merge?
    genTabs() //merge ui
}


//ADD ITEMS
function addTargetItem(key, iLvl){
    if(playerObj.actions.length < playerObj.actionSlots){

        let newItem = newItemObjkey, iLvl)
        if(newItem.actionType === 'passive'){resolvePassiveItem(newItem, 'add')}
        playerObj.actions.push(newItem)

    }else{
        console.log('Inventory is full.');
    }
}

//
function addRandomItem(quant, iLvl){
    for(let i =0; i< quant; i++){
        if(playerObj.actions.length < playerObj.actionSlots){

            let newItem = newItemObjrarr(Object.keys(actionsRef)), iLvl)
            if(newItem.actionType === 'passive'){resolvePassiveItem(newItem, 'add')}
            playerObj.actions.push(newItem)

        }else{
            console.log('Inventory is full.');
        }
    }
}


//Replace this with a loop that will check all player items and regen stats.
function resolvePassiveItem(item, event){
    if(event === 'add'){
        if(item.action==='Shield'){
            playerObj.flatDef += item.mod
        }
        else if(item.action==='Amulet'){
            playerObj.flatPower += item.mod
        }
        else if(item.action==='Belt'){
            resolvePlayerStats('add', 'maxLife')
        }
        else if(item.action==='d8'){
            playerObj.flatDice = item.mod
            playerObj.dice = item.mod
        }
    }
    else{ //Removed

        if(item.action==='Shield'){

            if(0 < playerObj.flatDef < item.mod){
                playerObj.flatDef = 0 //Sync stats to avoid negative
            } 
            else{
                playerObj.flatDef -= item.mod //Update flat to restore at the start of the round
            }
            
            if(0 < playerObj.def < item.mod){
                playerObj.def = 0
            }
            else{
                let reductionVal = item.mod - (playerObj.flatDef - playerObj.def) //Takes into consideration flat vs actual stat diff
                playerObj.def -= reductionVal //Update here if you loose item during combat
            }
        }

        else if(item.action==='Amulet'){
            
            if(0 < playerObj.flatPower < item.mod){
                playerObj.flatPower = 0 //Sync stats to avoid negative
            } 
            else{
                playerObj.flatPower -= item.mod //Update flat to restore at the start of the round
            }
            
            if(0 < playerObj.power < item.mod){
                playerObj.power = 0
            }
            else{
                let reductionVal = item.mod - (playerObj.flatDef - playerObj.def) //Takes into consideration flat vs actual stat diff
                playerObj.def -= reductionVal //Update here if you loose item during combat
            }
        }  

        else if(item.action==='Belt'){
            
            if(0 < playerObj.maxLife < item.mod){
                playerObj.flatPower = 1 //Sync stats to avoid negative
            } 
            else{
                playerObj.maxLife -= item.mod //Update flat to restore at the start of the round
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

//Generate enemy action for the next turn
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

//Combat start
function initiateCombat(){
    combatState = new CombatState                       //New obj for every fight

    resolvePlayerStats('reset-to-flat')                 //Restores def and pow to flat values

    //Generates enemy
    enemyObj = new EnemyObj                            //New enemy for every fight 
    el('enemyImg').setAttribute('src', enemyObj.image) //adds ene img to index
    genEneAction()                                     //Gen before player turn and after

    //UI
    syncUi()
}

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
        let sourceItem = findObj(playerObj.actions, 'itemid', itemid)
        let playerAction = sourceItem.action


        //PRE TURN
        //Stat modification actions has to be done before generic actions
        if(playerAction==='Counter'){
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
            resolveDurability(sourceItem)

            syncUi()
            combatEndCheck()
            return
        }


        //TURN
        //Player action
        if      (playerAction === 'Attack'){
            playerDmgDone += playerObj.roll + playerObj.power
        }
        else if (playerAction === 'Fireball'){
            let mult = playerObj.actionSlots - playerObj.actions.length 
            if(mult < 1){mult = 0}
            playerDmgDone += playerObj.roll * mult
        }
        else if (playerAction === 'Block'){
            enemyDmgDone -= playerObj.roll //- playerObj.power
        }
        else if (playerAction === "Repair"){
            playerObj.actions.forEach(elem => {
                if(elem.action !== 'Repair' && elem.actionType !== 'passive'){
                    elem.durability += sourceItem.mod
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
            enemyObj.dice -= sourceItem.mod
        }
        else if (playerAction === 'Barrier'){
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
        if (['Attack', 'Fireball'].indexOf(playerAction) > -1){
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
        if (playerAction === 'Heal'){
            playerObj.life += sourceItem.mod
            if(playerObj.life > playerObj.maxLife){playerObj.life = playerObj.maxLife}
        }

        //Deal with durability
        resolveDurability(sourceItem)

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

//Check if game state changed
function combatEndCheck(){
    //Defeat
    if(playerObj.life < 1 || playerObj.actions.length < 1){
        syncUi()
        toggleModal('gameOverScreen')
    }
    //Victory
    else if (enemyObj.life < 1){

        //Gen rewards or open map if boss was killed
        if(gameState.stage % gameState.bossFrequency === 0){
            genReward('end') //End round
            gameState.encounter = 0
        }
        else{
            genReward('gen', 3) //Number of rewards to give
        }

        gameState.encounter++
        gameState.stage++
        playerObj.exp++ //Add 1 exp
        playerObj.lvl = Math.round(1 + playerObj.exp / 3) //Recalc player lvl'

        syncUi()        
    }
}

//
function resolveDurability(item){
    item.durability--
        if(item.durability<1){
            removeFromArr(playerObj.actions, item)
            if(item.actionType === 'passive'){
                resolvePassiveItem(item)//Loose passive stat
            }
        }
}
    
//Rewards
function genReward(val, quant){

    //Clear modal body
    el('reward-container').innerHTML = `` 


    //Pick from reward pool
    if(val === 'gen'){ 
        let rewardRefPool = cloneArr(rewardRef) //copy rewards ref array to avoid duplicates when generating random rewards
        let generatedItem

        for(let i =0; i < quant; i++){ //gen item per quant value in function
            let reward = rarr(rewardRefPool) //pick random reward

            if(reward.rewardType !== 'Item'){ //if reward is not item, remove it from array so it can't be picked again.
                removeFromArr(rewardRefPool, reward)
            }

            if(reward.rewardType === 'Item'){//item
                //Gen random item
                generatedItem = newItemObjrarr(Object.keys(actionsRef, gameState.stage)))
                rewardPool.push(generatedItem)
            }
            else{//not item
                rewardPool.push(reward)
            }

            //Create buttons
            let button = document.createElement('button')
            
            //if item add item desck
            if(reward.rewardType === 'Item'){
                button.innerHTML = `
                <h3>${generatedItem.action} (Durability: ${generatedItem.durability})</h3> 
                ${generatedItem.desc} (requires empty item slot).`
                
                button.setAttribute('onclick', `genReward('${reward.rewardType}', '${generatedItem.itemid}')`) //quant will be id for items
            }
            
            else{
                button.innerHTML = `${reward.desc}`
                button.setAttribute('onclick', `genReward('${reward.rewardType}')`)
            }

            el('reward-container').append(button)
        }

        toggleModal('rewardScreen')
    }
    else if(val === 'end'){
        let button = document.createElement('button')
        button.setAttribute('onclick', 'screen("map")')
        button.innerHTML = 'Return to map'
        el('reward-container').append(button)

        toggleModal('rewardScreen')//Show rewards modal
    }


    //Resolve reward
    else {
        if(val       === 'Heal'){
            playerObj.life += Math.floor(playerObj.maxLife / 2)
            if(playerObj.life > playerObj.maxLife){playerObj.life = playerObj.maxLife}
        }
        else if(val  === 'Repair'){
            playerObj.actions[rng(playerObj.actions.length) -1].durability += Math.floor(5 + (gameState.stage * 0.25))
        }
        else if(val  === 'Bag'){
            playerObj.actionSlots++
        }
        else if(val  === 'Enhance'){
            playerObj.flatDef++
        }
        else if (val === 'Train'){
            playerObj.maxLife += Math.floor(4 + (gameState.stage * 0.5))
        }
        else if(val  === 'Power'){
            playerObj.flatPower++
        }
        else if(val  === 'Gold'){
            playerObj.gold += rng(gameState.stage, 1)
        }
        else {
            //Get item from reward gen
            rewardPool.forEach(elem => {
                if(elem.itemid !== undefined && elem.itemid === quant){
                    if(playerObj.actions.length < playerObj.actionSlots){
                        if(elem.actionType === 'passive'){resolvePassiveItem(elem, 'add')}
                        playerObj.actions.push(elem)
                    }
                }
            })
            rewardPool = []
        }

        initiateCombat()
        
        syncUi()
        toggleModal('rewardScreen')
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

//
function resolvePlayerStats(mod, stat){
    if(stat == 'maxLife' && mod == 'add'){

        let extraFlatLife = 0
        extraFlatLife += playerObj.initialLife
        playerObj.maxLifeMod = playerObj.initLifeMod

        // Check items
        playerObj.actions.forEach(item => {
            if(item.name == 'Belt'){//change to type
                extraFlatLife += item.mod
            }
            else if (item.name == 'LeatherBelt'){
                playerObj.maxLifeMod += node.mod
            }
        })

        // Check tree nodes
        playerObj.treeNodes.forEach(node => {
            if(node.nodeType == 'flatLife'){
                extraFlatLife += node.mod
            }
            else if(node.nodeType == 'percentLife'){
                playerObj.maxLifeMod += node.mod
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
}