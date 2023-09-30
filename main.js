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

    //Roll player dice
    console.log(1);
    playerObj.roll = rng(playerObj.dice)

    syncUi()
}

//TURN CALCULATION (player action logic)
//Resolve an issue when you have 1 extra action and no way to pay the cost. See iron dagger.
function turnCalc(buttonElem){

    //Reset damage clac vars
    combatState.dmgDoneByPlayer = 0
    combatState.dmgTakenByPlayer = 0
    combatState.dmgDoneByEnemy = 0
    combatState.dmgTakenByEnemy = 0

    playerObj.lastAction = `Turn ${combatState.turn}: ` //Used for ui
    combatState.sourceAction = findObj(playerObj.actions, 'actionId', buttonElem.getAttribute('actionId')) //Get action id from button elem
    let playerActionKey = combatState.sourceAction.keyId //Changed to id form actionKey to link with num
    let actionMod = combatState.sourceAction.actionMod

    //PRE TURN - Stat modification actions has to be done before generic actions.

    //PLAYER ACTIONS
    if       (playerActionKey ===  'a1'){// "mace"

        combatState.dmgDoneByPlayer += actionMod + playerObj.power

        if(playerObj.roll === 4){
            playerObj.def += 1
        }

    }else if (playerActionKey ===  'a2'){// "hammer"

        if(playerObj.roll > 4 ){
            combatState.dmgDoneByPlayer += 6 + playerObj.power
        }
        else {
            combatState.dmgDoneByPlayer += actionMod + playerObj.power
        }

    }else if (playerActionKey ===  'a3'){// ice shards "book of magic" 

        if(playerObj.power > 0){
            playerObj.power -= 1 //Cost

            let mult = playerObj.actionSlots - playerObj.actions.length 
    
            if(mult < 1){
                mult = 0
            }
    
            combatState.dmgDoneByPlayer += (actionMod + playerObj.power) * mult
        }
        else{
            alert('Not enough power to pay for action cost.')
            return
        }

    }else if (playerActionKey ===  'a4'){// "dagger pair" 

        combatState.dmgDoneByPlayer += (actionMod + playerObj.power) * 2

    }else if (playerActionKey ===  'a5'){// "bow" bow attack
        combatState.dmgDoneByPlayer += playerObj.roll + playerObj.power
    }else if (playerActionKey ===  'a6'){// knife attack

        //Resolve action cost
        if(playerObj.roll < 3){
            alert('Action requires roll greater than 2.')
            return
        } else {
            playerObj.roll -= 3
            combatState.dmgDoneByPlayer = combatState.sourceAction.actionMod + playerObj.power 
        }
    }else if (playerActionKey ===  'a7'){// sword attack 
        combatState.dmgDoneByPlayer += combatState.sourceAction.actionMod
    }else if (playerActionKey ===  'a8'){// "axe" 

        let maxLife = playerObj.life //Deal with overcap life

        if(playerObj.flatLife > playerObj.life){
            maxLife = playerObj.flatLife
        }

        playerObj.life -= 5

        combatState.dmgDoneByPlayer += playerObj.flatLife - playerObj.life + playerObj.power

    }else if (playerActionKey ===  'a9'){// ice lance "book of ice"

        if(playerObj.power > 0){
            playerObj.power -= 1 //Cost
    
            combatState.dmgDoneByPlayer += playerObj.power

        }
        else{
            alert('Not enough power to pay for action cost.')
            return
        }

    }else if (playerActionKey === 'a10'){// "iron dagger"

        //Resolve action cost
        if(playerObj.roll < 5){
            alert('Action requires roll greater than 5.')
            return
        }
        
        // else if(playerObj.roll < 5 && playerObj.actions.length === 1){
        //     alert('You had no resources to perform your only action, your turn was skipped.');
        // } 
        
        else{

            playerObj.roll -= 5

            combatState.dmgDoneByPlayer = combatState.sourceAction.actionMod + playerObj.power
            
            playerObj.power += 1
            
        }

    }else if (playerActionKey === 'a11'){// lightning "book of lightning"

        if(playerObj.power > 1){

            playerObj.power -= 2 //Cost
    
            combatState.dmgDoneByPlayer += rng(20) + playerObj.power

        }
        else{
            alert('Not enough power to pay for action cost.')
            return
        }

    }else if (playerActionKey === 'a12'){// shield bash

        combatState.dmgDoneByPlayer += playerObj.def * playerObj.power

    }else if (playerActionKey === 'a13'){// fireball "book of fire"

        combatState.dmgDoneByPlayer += actionMod + playerObj.power

    }else if (playerActionKey === 'a14'){// pyroblast "book of fire"

        if(playerObj.power > 0){
            playerObj.power -= 1 //Cost
    
            combatState.dmgDoneByPlayer += playerObj.power * playerObj.roll

        }
        else{
            alert('Not enough power to pay for action cost.')
            return
        }
        

    }else if (playerActionKey === 'a15'){// block "shield"

        combatState.dmgDoneByEnemy -= actionMod - playerObj.dice

    }else if (playerActionKey === 'a16'){// barrier
        
        playerObj.protection = ['Barrier']

        combatState.sourceAction.cooldown = 0

    }else if (playerActionKey === 'a18'){// dash "boots" (keep 50% of roll)

        playerObj.rollBonus += Math.floor(playerObj.roll * 0.5)

    }else if (playerActionKey === 'a19'){// reroll
        playerObj.roll = rng(playerObj.dice) 
    }else if (playerActionKey === "a20"){// "scroll of repetition"

        playerObj.inventory.forEach(item => {
            item.actions.forEach(action => {
                if(action.keyId !== 'a20'){
                    action.actionCharge += combatState.sourceAction.actionMod
                }
            })
        })
    }else if (playerActionKey === 'a21'){// weakness
        enemyObj.power -= combatState.sourceAction.actionMod
    }else if (playerActionKey === 'a22'){// wounds
        enemyObj.def -= combatState.sourceAction.actionMod
    }else if (playerActionKey === 'a23'){// chain
        enemyObj.dice -= combatState.sourceAction.actionMod
    }else if (playerActionKey === 'a25'){// stun

        if(playerObj.roll === 1){
            enemyObj.state = 'Skip turn'
        }
        
        else{
            alert('Action requires roll 1.')
            return
        }
    }else if (playerActionKey === 'a34'){// fortification
        playerObj.def += playerObj.roll
    }else if (playerActionKey === 'a42'){// shield block
        combatState.dmgDoneByEnemy -= playerObj.roll //- playerObj.power
    }
    
    enemyActionLogic()
    damageCalc()

    //POST DMG CALC EFFECTS - Healing potion - heal after damage is taken.
    if (playerActionKey === 'a33'){
        playerObj.life += combatState.sourceAction.actionMod
        if(playerObj.life > playerObj.maxLife){playerObj.life = playerObj.maxLife}
    }

    combatEndCheck()
}


//Enemy action logic
function enemyActionLogic(){
    if(enemyObj.state !== 'Skip turn' && combatState.sourceAction.actionType !== "extra-action"){

        if      (enemyObj.action === 'Attack'){
            combatState.dmgDoneByEnemy += enemyObj.roll + enemyObj.power 
        }
        else if (enemyObj.action === 'Block'){//block
            combatState.dmgDoneByPlayer -= enemyObj.roll
            combatState.enemyAction = ['Block', enemyObj.roll]
        }
        else if (enemyObj.action === 'Multistrike'){
            combatState.dmgDoneByEnemy += (1 + enemyObj.power)
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
            combatState.dmgDoneByEnemy += enemyObj.flatLife                   
        }
        
    }
}

//Turn damage calculation
function damageCalc(){
    //Damage inflicted by player
    //Melee attack (a7) / bow attack (a5) / ice shards (a3) / knife (a6)
    // if (['a7', 'a5', 'a3', 'a6'].indexOf(combatState.sourceAction.keyId) > -1){
    if(combatState.dmgDoneByPlayer > 0){//calculate all skills that deal damage?

        //Reduce def on low hit
        if(enemyObj.def >= combatState.dmgDoneByPlayer && enemyObj.def > 0){
            enemyObj.def--
        }

        //Check def
        combatState.dmgDoneByPlayer -= enemyObj.def
        
        //Set positive damage to 0
        if(combatState.dmgDoneByPlayer < 0){
            combatState.dmgDoneByPlayer = 0
        }
        
        //Reduce life
        enemyObj.life -= combatState.dmgDoneByPlayer            

        //Trigger enemy damage indicator
        combatState.dmgTakenByEnemy = combatState.dmgDoneByPlayer 
    }

    //Damage inflicted by enemy
    if(enemyObj.state !== 'Skip turn' && combatState.sourceAction.actionType !== "extra-action"){

        //Reduce damage if barrier
        if(playerObj.protection !== undefined && playerObj.protection[0] === 'Barrier'){

            playerObj.protection = '' //Reset variable

            // Convert action mod (75) to barrier reduction %
            combatState.dmgDoneByEnemy = Math.round(combatState.dmgDoneByEnemy * (1 - combatState.sourceAction.actionMod / 100)) 
        }

        if(['Attack'].indexOf(enemyObj.action) > -1){

            //Reduce def on low hit
            if(playerObj.def >= combatState.dmgDoneByEnemy && playerObj.def > 0){playerObj.def--} //Reduce def

            combatState.dmgDoneByEnemy -= playerObj.def

            //Set positive damage to 0
            if (combatState.dmgDoneByEnemy < 0){combatState.dmgDoneByEnemy = 0} 
            playerObj.life -= combatState.dmgDoneByEnemy

            //Trigger player damage indicator
            combatState.dmgTakenByPlayer = combatState.dmgDoneByEnemy
        }
        else if (['Multistrike'].indexOf(enemyObj.action) > -1){
            for (let i = 0; i < 3; i ++){

                //Move to a diff var due to def reducing dmg done 3 times
                let playerDamageTaken = combatState.dmgDoneByEnemy

                //Reduce def on low hit
                if(playerObj.def >= combatState.dmgDoneByEnemy && playerObj.def > 0){playerObj.def--} //Reduce def

                //Reduce damage by def
                playerDamageTaken -= playerObj.def

                //Set positive damage to 0
                if (playerDamageTaken < 0){playerDamageTaken = 0} 
                playerObj.life -= playerDamageTaken

                //Trigger player damage indicator
                combatState.dmgTakenByPlayer = combatState.dmgDoneByEnemy
            }
        }
        else if(['Detonate'].indexOf(enemyObj.action) > -1 && enemyObj.life < 0){

                playerObj.life -= combatState.dmgDoneByEnemy

                //Trigger player damage indicator
                combatState.dmgTakenByPlayer = combatState.dmgDoneByEnemy
        }
    }
}

//End of turn checks
function combatEndCheck(){ 

    //Deal with action charges
    resolveCharge(combatState.sourceAction)
    

    //Defeat (also loose if 0 actions)
    if(playerObj.life < 1 || playerObj.actions.length < 1){
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
        genReward('gen', 40) //Number of rewards to give

        gameState.stage++
        playerObj.exp++                                   //Add 1 exp
        
        playerObj.lvl = Math.round(1 + playerObj.exp / 3) //Recalc player lvl'
    }

    //Next turn (also end if roll reaches 0)

    else if (playerObj.roll < 1 || combatState.sourceAction.actionType !== "extra-action") {

        playerObj.roll = rng(playerObj.dice) + playerObj.rollBonus
        playerObj.rollBonus = 0
        genEneAction()

        enemyObj.state = ''

        combatState.turn++
    }

    syncUi()
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
                let item = rarr(itemsRef) 
                if(item === undefined){
                    console.log(1);
                }
                generatedReward =  new ItemObj(item.itemName)
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

            else if(statObj.stat === 'dice-mod'){
                flatDice += statObj.value
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