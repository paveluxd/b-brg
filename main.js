//INITITATE GAME
function initGame(){
    gameState = new GameState
    playerObj = new PlayerObj

    //Resolve ititial items
    playerObj.startingItems.forEach(key => {addItem(key)})

    //Gen remaining UI
    syncTree()     //merge
    syncCharPage() //merge?
    genTabs()      //merge ui
}

//INITITATE COMBAT
function initiateCombat(){
    combatState = new CombatState
    if(typeof gameState.encounter !== 'number'){gameState.encounter = 1}  //Reset encounter
    
    //Generates enemy
    enemyObj = new EnemyObj                            //New enemy for every fight 
    el('enemyImg').setAttribute('src', enemyObj.image) //Adds ene img to index
    genEneAction()                                     //Gen before player turn and after. Do it at this stage because it references eneObj.
    
    //Remove temporary buffs from previous encounter
    //Restore flat def
    if(playerObj.def !== playerObj.flatDef){
        playerObj.def = playerObj.flatDef
    }
    //Restore flat power
    if(playerObj.power < playerObj.flatPower){
        playerObj.power = playerObj.flatPower
    } 

    resolvePlayerStats()
    syncUi()
}

//TURN CALCULATION
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
        let playerAction = sourceItem.id //changed to ide form actionKey to link with num
        console.log(sourceItem);

        //PRE TURN
        //Stat modification actions has to be done before generic actions
        if(playerAction               === 'counter'){
            enemyObj.state='Skip turn'
        }

        //Extra actions
        else if(sourceItem.actionType === 'extra'){
            if      (playerAction === 'Reroll'){
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
        if      (playerAction === 'rangedAttack'){
            playerDmgDone += playerObj.roll + playerObj.power
        }
        else if (playerAction === 'a7'){ //sword attack
            //Get action mod
            let actionMod
            playerObj.actions.forEach(action => {
                if(action.id === 'a7'){
                actionMod = action.actionMod
            }
            })
            playerDmgDone += actionMod
        }
        else if (playerAction === 'fireball'){
            let mult = playerObj.actionSlots - playerObj.actions.length 
            if(mult < 1){mult = 0}
            playerDmgDone += playerObj.roll * mult
        }
        else if (playerAction === 'shieldBlock'){
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
                enemyDmgDone += enemyObj.flatLife                   
            }
            
        }


        //DAMAGE CALCULATION
        //Damage inflicted by player
        //Melee attack(a7) / 
        if (['a7', 'rangedAttack', 'fireball'].indexOf(playerAction) > -1){
            if(enemyObj.def >= playerDmgDone && enemyObj.def > 0){enemyObj.def--}//Reduce def on low hit

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
                if(playerObj.def >= enemyDmgDone && playerObj.def > 0){playerObj.def--} //Reduce def
    
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
                    if(playerObj.def >= enemyDmgDone && playerObj.def > 0){playerObj.def--} //Reduce def
    
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

//COMBAT END CHECK (Separate due to extra actions win check)
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
        playerObj.exp++                                   //Add 1 exp
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
            playerObj.life += Math.floor(playerObj.flatLife/ 2)
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
            playerObj.flatLife+= Math.floor(4 + (gameState.stage * 0.5))
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

                    //If there are empty action slots -> add action.
                    if(playerObj.actions.length < playerObj.actionSlots){
                        //Add temporary action
                        playerObj.tempActions.push(elem)

                        resolvePlayerStats() // test if this works fine
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
                        //If no inventory slots, trigger item swap screen
                    }
                }
            })
            
        }

        rewardPool = []

        //End of encounter
        if(gameState.encounter === 'end'){
            playerObj.tempActions = []
            resolvePlayerStats()
            screen('map')
        }

        //Next encounter
        else{
            initiateCombat()

            //Hide reward modal
            toggleModal('rewardScreen')

            //Animates enemy sprite moving in at the start of the combat.
            runAnim(el('enemySprite'), 'enemyEntrance') 
        }

        syncUi() //Update UI if reward was added etc
    }

}




//Gen enemy actions
function genEneAction(){
    enemyObj.roll = rng(enemyObj.dice)         //Roll enemy dice
    let actionRoll = rng(100)                  //Roll to pick action
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

    //If low life enamble detonate
    if(enemyObj.flatLife/ enemyObj.life > 3){
        eneActionRef.Detonate.rate = 1
    }
    else{
        eneActionRef.Detonate.rate = undefined
    }

    //Pick action
    if(actionRoll < 2 && objContainsByPropValue(eneActionRef, 'rate', 4)){       //1%
        for(let i = 0; i < actionKeys.length; i++){
            if(eneActionRef[actionKeys[i]].rate === 4){
                aAction.push(eneActionRef[actionKeys[i]].action)
            }
        }
        enemyAc = rarr(aAction)
    }
    if(actionRoll < 7 && objContainsByPropValue(eneActionRef, 'rate', 3)){       //5%
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
    } 
    else {enemyAc = eneActionRef.Attack.action}                                  //55% att

    enemyObj.action = enemyAc
}




//ITEM MANAGEMENT
//Add item
function addItem(key, iLvl){

    //Check if there are slots in the inventory.
    if(playerObj.inventory.length < playerObj.inventorySlots){

        //Create new item obj
        let newItem = new ItemObj(key, iLvl)

        //If empty equippment slots, equip item automatically.
        if(playerObj.equipmentSlots > calcEquippedItems()){
            newItem.equipped = true
        }

        //Add item to the inventory.
        playerObj.inventory.push(newItem)

        //Resolve stats and actions added by item?
        // resolvePlayerStats()
    }

    else{
        alert('Inventory is full.')
    }
}

//Remove item
function removeItem(itemId){
    let item = findByProperty(playerObj.inventory, 'itemId', itemId)
    
    //Remove item actions
    item.actions.forEach(action => {
        removeFromArr(playerObj.actions, action)
    })

    //Remove from inventory
    removeFromArr(playerObj.inventory, item)

    syncUi()
}

//Equip/Unequip
function equipItem(item){

    //Get item types to prevent staking
    let itemTypes = []
    playerObj.inventory.forEach(item => {
        if(item.equipped){
            itemTypes.push(item.itemType)
        }
    })
    itemTypes = itemTypes.filter(elem => elem !== 'generic') //Removes generic items

    //Equip
    if(
        item.equipped === false &&                         //check if equipped
        playerObj.equipmentSlots > calcEquippedItems() &&  //check if there are slots
        itemTypes.includes(item.itemType) === false        //check if unique type
    )
    {
        item.equipped = true
    } 
    else if (item.equipped === true){
        item.equipped = false
    }
    else if(itemTypes.includes(item.itemType)){
        alert("Can't equip two items of the same type.")
    }
    else {
        alert('No equippment slots.')
    }

    resolvePlayerStats()//Adjust this to recalc all items
    syncUi()
}

//Resolve action charges
function resolveCharge(action){
    action.actionCharge--
        if(action.actionCharge<1){
            // let tempAction = action

            removeFromArr(playerObj.actions, action)
            removeFromArr(playerObj.tempActions, action)

            //Resolve stats if passive action removed due to charge loss
            // if(tempAction.passiveStats.length > 0){
                //Remove action
                resolvePlayerStats()//Loose passive stat
            // }
        }
}




//Recalc stats & adds actions from items
function resolvePlayerStats(){

    //Resets actions
    //Regen action list if the item was added, removed, equipped, unequipped
    playerObj.actions = []

    //Adds actions from items to players actions array.
    playerObj.inventory.forEach(item => {

        //Check all equipped items
        if(item.equipped){

            //Add all actions from equipped item.
            item.actions.forEach(action => {
                if(playerObj.actionSlots > playerObj.actions.length && action.actionCharge > 0){
                    playerObj.actions.push(action)
                }
            })
        }
    })

    //Add temporary actions to players actions array.
    playerObj.tempActions.forEach(action => {
        if(playerObj.actionSlots > playerObj.actions.length){
            playerObj.actions.push(action)
        }
    })



    //Resolve life  
    //Add reclaculation for all stats
    let baseLife = playerObj.baseLife
    let flatLife = 0
    let lifeMultiplier = 1
    let lifeDeviation = playerObj.life - playerObj.flatLife// See if temporary bonuses should be included.

    let basePower = playerObj.basePower
    let flatPower = 0
    let powerDeviation = playerObj.power - playerObj.flatPower

    let baseDef = playerObj.baseDef
    let flatDef   = 0
    let defDeviation = playerObj.def - playerObj.flatDef

    let baseDice = playerObj.baseDice
    let flatDice = baseDice
    let diceDeviation = playerObj.dice - playerObj.flatDice

    //Extracts stats
    function extractPassiveStats(obj){{
        obj.passiveStats.forEach(statObj => {
    
            //Flat life
            if(statObj.stat === 'life'){
                flatLife += statObj.value
            }
    
            //% life
            else if(statObj.stat === 'life%'){
                lifeMultiplier += (statObj.value / 100)
            }

            //Flat power
            else if(statObj.stat === 'power'){
                flatPower += statObj.value
            }

            //
            else if(statObj.stat === 'def'){
                flatDef += statObj.value
            }

            //Replace dice
            else if(statObj.stat === 'dice'){
                flatDice = statObj.value
            }
        })
    }}

    //Check items
    playerObj.inventory.forEach(item => {
        if(item.passiveStats.length > 0 && item.equipped){
            extractPassiveStats(item)
        }
    })

    //Check actions
    playerObj.actions.forEach(action => {
        if(action.passiveStats.length > 0){
           extractPassiveStats(action)
        }
    })

    //Check tree nodes
    playerObj.treeNodes.forEach(node => {
        if(node.passiveStats !== undefined && node.passiveStats.length > 0){
            extractPassiveStats(node)
        }
    })

    //Life final calculation
    //(base + flat) + deviation + temporary
    //Temporayr not yet implemented
    playerObj.flatLife= Math.round((baseLife + flatLife) * lifeMultiplier)
    playerObj.life = playerObj.flatLife+ lifeDeviation  

    //Power final calculation
    //(base + flat) + deviation + temporary
    playerObj.flatPower = basePower + flatPower
    playerObj.power = playerObj.flatPower + powerDeviation

    //Def final calc
    playerObj.flatDef = baseDef + flatDef
    playerObj.def = playerObj.flatDef + defDeviation

    //Dice
    playerObj.flatDice = flatDice
    playerObj.dice = playerObj.flatDice + diceDeviation
}



//TREE
//Spend tree points
function addTreeNode(node){
    if(playerObj.treePoints > 0){
        playerObj.treeNodes.push(node)// Add skill node to player obj        
        
        resolvePlayerStats()
        syncUi()
    }
}

//Start the game
initGame()
initiateCombat()