//INITITATE GAME
    function initGame(mapY, stage){

        //Create initial game and player objects
        if(typeof gameState == 'undefined'){
            gameState = new GameState
            playerObj = new PlayerObj
        }

        
        if(mapY !== undefined){
            config.mapY = mapY
        }
        gameState.mapObj = new MapObj
        mapRef = gameState.mapObj.tiles
        
        

        //Resolve ititial items
        playerObj.startingItems.forEach(key => {addItem(key)})

        //Gen remaining UI
        syncTree()     //merge
        syncCharPage() //merge?
        genTabs()      //merge ui
        
        spriteBuilder('player')//create player sprite

        genMap() //map
        // console.log(el('map'));

        //Increase stage to scale enemies
        gameState.stage++ 
        
        resolvePlayerStats()
        syncUi()
    }

//INITITATE COMBAT
    function initiateCombat(){

        //1.Create cinbat object.
        combatState = new CombatState

        //2.Reset variables for new encounter.
        if(typeof gameState.encounter !== 'number'){
            gameState.encounter = 1
        }  

        //3.Generates enemy
        enemyObj = new EnemyObj //New enemy per fight 
        genEneAction()          //Gen before player turn and after. Do it at this stage because it references enemyObj.
        spriteBuilder('enemy')

        //4.Set stats before combat
            //Restore sword dmg buff
            playerObj.swordDmgMod = 0

            //Restore flat def
            if(playerObj.def !== playerObj.flatDef){
                playerObj.def = playerObj.flatDef
            }

            //Restore flat power
            if(playerObj.power !== playerObj.flatPower){//see if power should stay betweeen combats, set sign to <
                playerObj.power = playerObj.flatPower
            } 
        
            //Recalc all items and actions
            resolvePlayerStats()

        //5.Roll player dice. Roll after stats if dice will be changed.
        playerObj.roll = rng(playerObj.dice)

        //6.syncUI() will generate action cards that will trigger turnCalc().
        syncUi()

        //7.Open combat screen
        screen("combat")
    }
    //1.TURN CALC
        function turnCalc(buttonElem){
            //Reset combat state vars
            combatState.turnState = ''
            combatState.dmgDoneByPlayer = 0
            combatState.dmgTakenByPlayer = 0
            combatState.dmgDoneByEnemy = 0
            combatState.dmgTakenByEnemy = 0

            //Combat log.
            combatState.logMsg = [``]

            //Save players previous action.
            if(combatState.sourceAction !== undefined){
                combatState.previousAction = combatState.sourceAction 
            }

            combatState.sourceAction = findObj(playerObj.actions, 'actionId', buttonElem.getAttribute('actionId')) //Get action id from button elem
            let actionMod = combatState.sourceAction.actionMod
            let playerActionKey = combatState.sourceAction.keyId

            //LOGIC: player
            if      (playerActionKey =='a1' ){// mace

                combatState.dmgDoneByPlayer += actionMod + playerObj.power
    
                if(playerObj.roll === 4){
                    playerObj.def += 1
    
                    combatState.logMsg.push('Mace: +1 def.')
                }
    
                combatState.logMsg.push(`Mace: deals ${actionMod + playerObj.power} dmg.`)
    
            }else if(playerActionKey =='a2' ){// hammer
    
                let largestRoll = playerObj.roll
                if(enemyObj.roll > playerObj.roll){largestRoll = enemyObj.roll}
    
                let defReuctionValue =  playerObj.def - largestRoll
    
                if(defReuctionValue < 0) return combatState.logMsg.push(`hammer attack reduced enemy def by 0`)
    
                enemyObj.def -= defReuctionValue
                combatState.logMsg.push(`Hammer attack reduced enemy def by ${defReuctionValue}.`)
    
            }else if(playerActionKey =='a3' ){// ice shards "book of magic" 
    
                if(playerObj.power > 0){
                    playerObj.power -= 1 //Cost
    
                    let mult = playerObj.actionSlots - playerObj.actions.length 
            
                    if(mult < 1){
                        mult = 0
                    }
            
                    combatState.dmgDoneByPlayer += (actionMod + playerObj.power) * mult
                }
                else{
                    showAlert('Not enough power to pay for action cost.')
                    return
                }
    
            }else if(playerActionKey =='a4' ){// dagger pair 
    
                combatState.dmgDoneByPlayer += (actionMod + playerObj.power) * 2 
                combatState.logMsg.push('Dagger pair attack.')
    
            }else if(playerActionKey =='a5' ){// bow
    
                console.log('bow');
                combatState.dmgDoneByPlayer += playerObj.roll + playerObj.power
    
            }else if(playerActionKey =='a6' ){// cut 'dagger'
    
                //Resolve action cost
                if(playerObj.roll < 3){
                    showAlert('Action requires roll greater than 2.')
                    return
                } else {
                    playerObj.roll -= 3
                    combatState.dmgDoneByPlayer = combatState.sourceAction.actionMod + playerObj.power 
                    combatState.logMsg.push('Attacked with dagger as extra action.')
                }
            }else if(playerActionKey =='a7' ){// sword attack 
    
                combatState.dmgDoneByPlayer += combatState.sourceAction.actionMod + playerObj.power + playerObj.swordDmgMod
                if(playerObj.roll == 5 || playerObj.roll == 6){
                    playerObj.swordDmgMod += 1
                }
    
            }else if(playerActionKey =='a8' ){// "axe" 
    
                let maxLife = playerObj.life //Deal with overcap life
    
                if(playerObj.flatLife > playerObj.life){
                    maxLife = playerObj.flatLife
                }
    
                playerObj.life -= 5
    
                combatState.dmgDoneByPlayer += playerObj.flatLife - playerObj.life + playerObj.power
    
            }else if(playerActionKey =='a9' ){// ice lance "book of ice"
    
                if(playerObj.power > 0){
                    playerObj.power -= 1 //Cost
            
                    combatState.dmgDoneByPlayer += playerObj.power
    
                }
                else{
                    showAlert('Not enough power to pay for action cost.')
                    return
                }
    
            }else if(playerActionKey =='a10'){// backstab "iron dagger"
    
                //Resolve action cost
                if(playerObj.roll < 5) return showAlert('Action requires roll greater than 5.')
                
                // else if(playerObj.roll < 5 && playerObj.actions.length === 1){
                //     showAlert('You had no resources to perform your only action, your turn was skipped.');
                // } 
    
                playerObj.roll -= 5
                combatState.dmgDoneByPlayer = combatState.sourceAction.actionMod + playerObj.power
                playerObj.power += 1
    
            }
             else if(playerActionKey =='a11'){// lightning "book of lightning"
    
                if(playerObj.power < 1) return showAlert('Not enough power to pay for action cost.')
                playerObj.power -= 2 //Cost
                combatState.dmgDoneByPlayer += rng(20) + playerObj.power
    
            }else if(playerActionKey =='a12'){// shield bash
    
                combatState.dmgDoneByPlayer += playerObj.def * playerObj.power
    
            }else if(playerActionKey =='a13'){// fireball "book of fire"
    
                combatState.dmgDoneByPlayer += actionMod + playerObj.power
    
            }else if(playerActionKey =='a14'){// pyroblast "book of fire"
    
                if(playerObj.power < 0) return showAlert('Not enough power to pay for action cost.')
                playerObj.power -= 1 //Cost
    
                combatState.dmgDoneByPlayer += playerObj.power * playerObj.roll
    
            }else if(playerActionKey =='a15'){// quick block "tower shield"
    
                combatState.dmgDoneByEnemy -= actionMod - playerObj.dice
    
            }else if(playerActionKey =='a16'){// barrier
                
                playerObj.protection = ['Barrier']
                combatState.sourceAction.cooldown = 0
    
            }else if(playerActionKey =='a18'){// preparation "boots" (keep 50% of roll)
    
                playerObj.rollBonus += Math.ceil(playerObj.roll * 0.5)
    
            }else if(playerActionKey =='a19'){// reroll
    
                playerObj.roll = rng(playerObj.dice) 
    
            }else if(playerActionKey =="a20"){// "scroll of repetition"
    
                playerObj.inventory.forEach(item => {
                    item.actions.forEach(action => {
                        if(action.playerActionKeyId !== 'a20'){
                            action.actionCharge += combatState.sourceAction.actionMod
                        }
                    })
                })
            }else if(playerActionKey =='a21'){// weakness "scroll of weakness"
    
                enemyObj.power -= actionMod
    
            } 
             else if(playerActionKey =='a22'){// (ene def-) wounds
    
                enemyObj.def -= actionMod
    
            }else if(playerActionKey =='a23'){// (ene stun) chain
    
                enemyObj.dice -= actionMod
    
            }else if(playerActionKey =='a24'){// (ene roll-) slowness "scroll of slowness"
    
                enemyObj.roll -= actionMod
    
            }else if(playerActionKey =='a25'){// tank stun
    
                if(playerObj.roll === 1){
                    enemyObj.state = 'Skip turn'
                }
                else{
                    showAlert('Action requires roll 1.')
                    return
                }
    
            }else if(playerActionKey =='a47'){// stun: smoke bomb
    
                if(['attack', 'combo', 'final strike', 'charged strike'].indexOf(enemyObj.action.playerActionKey) > -1) showAlert(`Smoke bomb failed vs attack.`)
                enemyObj.state = 'Skip turn'
                
            }else if(playerActionKey =='a26'){// spell: freeze (stun spell) "book of ice"
    
                if(playerObj.power > 0){
                    playerObj.power -= 1 //Cost
                    enemyObj.state = 'Skip turn'
                }
                else{
                    showAlert('Not enough power to pay for action cost.')
                    return
                }
    
            }else if(playerActionKey =='a31'){// defence charge !!! see if resolving stats at this point will cause issues. Required due to def behaviour
    
                // playerObj.def -= actionMod
                resolveCharge(combatState.sourceAction)
                resolvePlayerStats()
    
            }else if(playerActionKey =='a34'){// (def+) fortification
    
                playerObj.def += actionMod
    
            }else if(playerActionKey =='a35'){// dodge % evasion "leather cape"
    
                let dodgePercent = playerObj.roll * actionMod
                let dodgeRoll = rng(100)
    
                if(dodgeRoll < dodgePercent){
                    combatState.dmgDoneByEnemy = -99999 // write something custom later
                }
    
            }else if(playerActionKey =='a37'){// buff next attack with piercing "leather gloves"
    
                if(playerObj.power > 0){
    
                    playerObj.power -= 1 //Cost
                    playerObj.piercing = true
                    combatState.sourceAction.cooldown = 0
    
                }
                else{
                    showAlert('Not enough power to pay for action cost.')
                    return
                }
    
            }
             else if(playerActionKey =='a38'){// static "cape"
    
                if(playerObj.roll > 8){
    
                    playerObj.power += 2 //Cost
                    
                }
                else{
                    showAlert('This action requires roll greater than 8.')
                    return
                }
    
            }else if(playerActionKey =='a39'){// sprint "woolen boots"
    
                    playerObj.roll += 2 //Cost
    
            }else if(playerActionKey =='a40'){// water potion "water potion"
    
                playerObj.power += actionMod
    
            }else if(playerActionKey =='a41'){// poison
    
                playerObj.poisonBuff = true
                combatState.logMsg.push('Applied poison to weapons.<br>')
    
            }else if(playerActionKey =='a42'){// shield block "buckler"
    
                combatState.dmgDoneByEnemy -= playerObj.roll //- playerObj.power
    
            }else if(playerActionKey =='a44'){// "restoration" "scroll of restoration"

                let restoredPoints = 0
    
                if(playerObj.def < 0){
                    restoredPoints += playerObj.def
                    playerObj.def = 0
                }
                if(playerObj.power < 0){
                    restoredPoints += playerObj.power
                    playerObj.power = 0
                }
                if(playerObj.dice < playerObj.flatDice){
                    restoredPoints += playerObj.dice - playerObj.flatDice
                    playerObj.dice = playerObj.flatDice
                }

                if(restoredPoints == undefined) return false
                playerObj.life += (-1 * restoredPoints)
                combatState.logMsg.push(`restoration: restored ${-1 * restoredPoints} life`)
    
            }else if(playerActionKey =='a45'){// wooden mace attack
    
                combatState.dmgDoneByPlayer += 3 + playerObj.power
    
            }else if(playerActionKey =='a48'){// "focus" "wooden staff"
    
                playerObj.power += Math.floor(1 * playerObj.roll / 4)
    
            }else if(playerActionKey =='a49'){// zealotry
    
                playerObj.power += playerObj.roll
                playerObj.def -= playerObj.roll
    
            }else if(playerActionKey =='a50'){// defensive stance
            
                playerObj.roll--
                combatState.sourceAction.cooldown = 0
     
            }
             else if(playerActionKey =='a52'){// hook/swap
            
                let rollRef = playerObj.roll
                playerObj.roll = enemyObj.roll
                enemyObj.roll = rollRef
    
                combatState.logMsg.push(`rolls swapped (Result: P${playerObj.roll}/E${enemyObj.roll})`)
    
                //RECALC ENEMY INTENDED ACTION: if player mods roll or power as extra action.
                recalcEneAction()
            }else if(playerActionKey =='a53'){// "transmute" "alchemists playerActionKey"
                
                if(playerObj.roll != 1 && playerObj.roll != 2) return showAlert('Transmute requires roll 1 or 2.')
    
                playerObj.coins += playerObj.roll
                
                combatState.logMsg.push(`transmute: added ${playerObj.roll} coins`)
    
            }else if(playerActionKey =='a54'){// "inferno" "scroll of inferno"
    
                combatState.dmgDoneByPlayer += playerObj.power * playerObj.coins
    
                combatState.logMsg.push(`inferno: dealt ${playerObj.coins} dmg, and consued ${playerObj.coins} coins`)
    
                playerObj.coins = 0
    
            }else if(playerActionKey =='a55'){// "fear" "wizards head"

                enemyObj.state = 'fear'
                combatState.sourceAction.cooldown = 0
                
                //Set variable cooldown.  
                let referenceActionObj = findByProperty(actionsRef, 'keyId', combatState.sourceAction.keyId) //Find action reference
                referenceActionObj.cooldown = rng(4,2)
                combatState.logMsg.push(`fear: enamy will block during the next turn (fear reacharge:${referenceActionObj.cooldown})`)

            }


            //Player passive effects.
            playerObj.actions.forEach(action => {
                if      (action.keyId === 'a17'){ // combo "gloves"
                    if(playerObj.roll === 6 && action.cooldown > 0){

                        combatState.turnState = 'extra-action'
                        action.cooldown = 0
                        ombatState.logMsg.push(`Combo extra action (passive).`)

                    }
                }else if(action.keyId === 'a36'){ // critical hit "woolen gloves"
                    if(playerObj.roll > 8 && action.cooldown > 0){

                        combatState.dmgDoneByPlayer = combatState.dmgDoneByPlayer * (action.actionMod/100)
                        action.cooldown = 0
                        ombatState.logMsg.push(`Critical hit (passive).`)

                    }
                }else if(action.keyId === 'a51'){ // overload 'exoskeleton'
                    if(playerObj.roll > playerObj.dice){

                        combatState.dmgDoneByPlayer = combatState.dmgDoneByPlayer * (action.actionMod / 100 + 1)
                        combatState.logMsg.push(`Overload activated (passive).`)

                    }
                }
            })
            
            //LOGIC: enemy
            enemyActionLogic()

            //PASSIVES: work for both player and enemy.
            playerObj.actions.forEach(action => {
                if (action.keyId === 'a43'){ // throns crown
                    if(combatState.dmgDoneByEnemy !== undefined){
                        combatState.dmgDoneByEnemy = combatState.dmgDoneByEnemy * 2
                    }
                    if(combatState.dmgDoneByPlayer !== undefined){
                        combatState.dmgDoneByPlayer = combatState.dmgDoneByPlayer * 2
                    }
                }
            })

            //Manages dmg calc.
            damageCalc()

            //POST DMG CALC EFFECTS - Healing potion - heal after damage is taken.
            if (playerActionKey === 'a33'){// healing potion
                
                playerObj.life += Math.round((playerObj.flatLife - playerObj.life) / 100 * actionMod)
                 
            }

            combatEndCheck()
        }
        //Damage calculation.
        function damageCalc(){    

            //PLAYER DMG
            if(combatState.dmgDoneByPlayer > 0){

                //POISON: apply id dmg is done.
                if(playerObj.poisonBuff || playerObj.poisonBuff == 'triggered'){
                    let poisonStackCount = 1
            
                    //Shards
                    if(combatState.sourceAction.keyId === 'a3'){
                        let mult = playerObj.actionSlots - playerObj.actions.length 
            
                        if(mult < 1){
                            mult = 0
                        }
            
                        poisonStackCount = mult
                    } 
                    //Dagger pair
                    else if(combatState.sourceAction.keyId === 'a4'){
                        poisonStackCount = 2
                    }
            
                    enemyObj.poisonStacks += poisonStackCount
                    playerObj.poisonBuff = 'triggered'
                    combatState.logMsg.push(`Applied ${poisonStackCount} poison stacks. Poison was triggered.`)
                }
                
                //DEF: resolve.
                if(!playerObj.piercing){//Ignore def if piercing state
                    
                    //Reduce def on low hit
                    if(enemyObj.def >= combatState.dmgDoneByPlayer && enemyObj.def > 0){
                        combatState.dmgDoneByPlayer -= enemyObj.def
                        enemyObj.def--
                    }
                    //Reduce dmg by def
                    else{
                        combatState.dmgDoneByPlayer -= enemyObj.def
                    }
                }
                //Set positive damage to 0 (due to def)
                if(combatState.dmgDoneByPlayer < 0){
                    combatState.dmgDoneByPlayer = 0
                }
                
                //Reduce life
                enemyObj.life -= combatState.dmgDoneByPlayer            

                //Trigger enemy damage indicator
                combatState.dmgTakenByEnemy = combatState.dmgDoneByPlayer 

                //Reset piercing buff after attack was performed
                playerObj.piercing = false
            }

            //ENE DMG
            if(combatState.dmgDoneByEnemy > 0){

                //Reduce damage if barrier
                if(playerObj.protection !== undefined && playerObj.protection[0] === 'Barrier'){

                    playerObj.protection = '' //Reset variable

                    // Convert action mod (75) to barrier reduction %
                    combatState.dmgDoneByEnemy = Math.round(combatState.dmgDoneByEnemy * (1 - combatState.sourceAction.actionMod / 100)) 
                }

                //Resolve enemy actions
                if      (['attack', 'crit', 'charged strike'].indexOf(enemyObj.action.key) > -1){

                    //Reduce def on low hit
                    if(playerObj.def >= combatState.dmgDoneByEnemy && playerObj.def > 0){
                        playerObj.def--
                    }

                    combatState.dmgDoneByEnemy -= playerObj.def

                    //Set positive damage to 0
                    if (combatState.dmgDoneByEnemy < 0){
                        combatState.dmgDoneByEnemy = 0
                    } 

                    playerObj.life -= combatState.dmgDoneByEnemy


                    //Trigger player damage indicator
                    combatState.dmgTakenByPlayer = combatState.dmgDoneByEnemy
                }else if(['combo'].indexOf(enemyObj.action.key) > -1){
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
                }else if(['final strike'].indexOf(enemyObj.action.key) > -1 && enemyObj.life < 0){ //final strike only works if enemy is dead.

                    playerObj.life -= combatState.dmgDoneByEnemy

                    //Trigger player damage indicator
                    combatState.dmgTakenByPlayer = combatState.dmgDoneByEnemy
                }
            }
        }

    //2.END TURN
        function combatEndCheck(){ 
            
            gameState.totalCombatTurns++ //Stats for testing.
            resolveCharge(combatState.sourceAction) //Deal with action charges.

            // DEFEAT (also loose if 0 actions).
            if(playerObj.life < 1 || playerObj.actions.length < 1){
                openStateScreen('game-end')
            }
            // VICTORY.
            else if (enemyObj.life < 1){
                //End game stats
                gameState.enemyCounter++

                //Exit
                if(gameState.encounter === gameState.playerLocationTile.enemyQuant){
                    gameState.encounter = 'end'

                    if(gameState.playerLocationTile.tileType === 'portal'){
                        openStateScreen("completed")
                        return
                    }
                }

                //Next fight
                else{
                    gameState.encounter++ 
                }
                
                //If final encounter, show rewards
                if(gameState.encounter === 'end'){
                    //Generate rewards modal
                    genRewards(gameState.flatItemReward + gameState.playerLocationTile.enemyQuant) //Number of rewards to give
                }
                //Next encounter
                else{
                    initiateCombat()
                    runAnim(el('enemy-sprite'), 'enemyEntrance') 
                }

                playerObj.exp++                                   //Add 1 exp
                playerObj.lvl = Math.round(1 + playerObj.exp / 3) //Recalc player lvl'
            }
            // NEXT TURN.
            else if (combatState.sourceAction.actionType !== "extra-action" || playerObj.roll < 1){

                //POISON: resolve stacks
                if(enemyObj.poisonStacks > 0){

                    //Reduce random stat by 1 per posion stack
                    for(i = 0; i < enemyObj.poisonStacks; i++){
                        let statRoll = rng(5)
                            
                        if       (statRoll == 2){
                            enemyObj.def -= 1
                            combatState.logMsg.push(`poison: -1 def. ${enemyObj.poisonStacks - 1} stacks remaining`)

                        }else if (statRoll == 3){
                            enemyObj.power -= 1
                            combatState.logMsg.push(`poison: -1 power. ${enemyObj.poisonStacks - 1} stacks remaining`)

                        }else if (statRoll == 4 && enemyObj.dice > 3){
                            enemyObj.dice -= 1
                            combatState.logMsg.push(`poison: -1 dice. ${enemyObj.poisonStacks - 1} stacks remaining`)

                        }else if (statRoll == 5){ //20% to increase poison stacks
                            enemyObj.poisonStacks += 1
                            combatState.logMsg.push(`poison: +1 stack. ${enemyObj.poisonStacks - 1} stacks remaining`)
                        }else {
                            enemyObj.life -= 1
                            combatState.logMsg.push(`poison: -1 life. ${enemyObj.poisonStacks - 1} stacks remaining`)
                        }
                    }

                    //Reduce poison stacks
                    enemyObj.poisonStacks -= 1

                    //Removes poison buff if it was triggered during this turn.
                    if(playerObj.poisonBuff == 'triggered'){
                        playerObj.poisonBuff = false
                        combatState.logMsg.push(`poison buff removed`)
                    }
                }

                //COODLOWN: Increase turn cooldowns
                playerObj.actions.forEach(action => {
                    if(typeof action.cooldown != 'undefined' && action.cooldown < findByProperty(actionsRef, 'keyId', action.keyId).cooldown){
                        action.cooldown++
                    }
                })
        
                playerObj.roll = rng(playerObj.dice) + playerObj.rollBonus // Roll player dice.
                playerObj.rollBonus = 0                                    // Remove any roll bonuses.
                runAnim(el('intent-indicator'), 'turn-slide')              // Enemy intent animation.
                genEneAction()                                             // Gen enemy action.
                enemyObj.state = ``                                        // Reset enemy state.
                combatState.turn++                                         // Increase turn counter.
            }

            //Print all combat logs.
            combatState.logMsg.forEach(msg => {
                console.log(`${combatState.turn}. ${upp(msg)}`)
            })

            syncUi()
        }
        
    //3.REWARD
        function genRewards(quant){
            
            //Clear
            el('reward-container').innerHTML = `` 
            
            //Gen item list
            genOfferedItemList(quant, 'reward')

            //Move inventory list to 2nd slide of reward screen
            el('inventory-slide').append(el('inventory-list'))

            //Give food & gold per killed enemy

            let coinsReward = rng(gameState.flatCoinsReward)

            el('reward-desc').innerHTML = `
                You defeated the enemy.<br>
                You get +${gameState.flatFoodReward + gameState.playerLocationTile.enemyQuant} <img src="./img/ico/fish.svg">, ${coinsReward} coins , and one of these rewadrs:
            `
            playerObj.food += gameState.flatFoodReward + (gameState.playerLocationTile.enemyQuant)
            playerObj.coins += coinsReward

            toggleModal('reward-screen')         
        }

        
//ENEMY
    //Enemy action logic
    function enemyActionLogic(){
        //State checkd. Deals with stun and extra actions.
        if(enemyObj.state == 'Skip turn') return                         combatState.logMsg.push(`enemy skipped turn due to stun`)
        if(combatState.sourceAction.actionType == "extra-action") return combatState.logMsg.push(`enemy skipped turn due to extra action`)

        //Resolve actions.
        if      ('attack, combo, final strike, charged strike'.slice(', ').indexOf(enemyObj.action.key) > -1){
            // console.log(combatState.dmgDoneByEnemy + ` inc dmg`);
            combatState.dmgDoneByEnemy += enemyObj.action.actionVal
            // console.log(combatState.dmgDoneByEnemy);

        }else if ('block'.slice(', ').indexOf(enemyObj.action.key) > -1){

            combatState.dmgDoneByPlayer -= enemyObj.action.actionVal

        }else if('recover, rush, empower, fortify'.slice(', ').indexOf(enemyObj.action.key) > -1){

            enemyObj[enemyObj.action.stat] += enemyObj.action.actionVal

        }else if('wound, weaken, slow, drain'.slice(', ').indexOf(enemyObj.action.key) > -1){   

            playerObj[enemyObj.action.stat] -= enemyObj.action.actionVal

        }
        
        //Records previous action for ui updates.
        combatState.enemyAction = enemyObj.action 
    }
    //Pick enemy action
    function genEneAction(){

        
        //Next turn roll
        enemyObj.roll = rng(enemyObj.dice)         

        //Generate action refs with proper calculation for this roll
        let actionKeys = [
            'attack', 
            // 'final strike', 
            'combo', 
            // 'charge', 
            'block', 
            'fortify', 
            // 'empower', 
            // 'rush', 
            // 'recover', 
            // 'wound', 
            // 'weaken', 
            // 'slow', 
            'drain', 
            // 'sleep'
        ]

        
        //Generates all enemy actions.
        enemyObj.actionRef = []
        actionKeys.forEach(key => {enemyObj.actionRef.push(new EnemyActionObj(key))})

        //Pick action
        let actionRoll = rng(100)           //Roll for action chance.

        //Prevent action selection if enemy is charging an attack.
        if(enemyObj.action != undefined && enemyObj.action.key == 'charge'){
            
            enemyObj.action.actionVal--
            enemyObj.action.desc = `Charges an attack (${ enemyObj.action.actionVal} turns)`

            //Switch action to charged strike on cd 0
            if(enemyObj.action.actionVal < 1){
                enemyObj.action = new EnemyActionObj('charged strike')
            }

        }else if(actionRoll < 2){           //R5: 1%

            enemyObj.action = rarr(enemyObj.actionRef.filter(action => action.rate == 5))

        }else if(actionRoll < 7){           //R4: 5%

            enemyObj.action = rarr(enemyObj.actionRef.filter(action => action.rate == 4))

        }else if(actionRoll < 17){          //R3: 10%

            enemyObj.action = rarr(enemyObj.actionRef.filter(action => action.rate == 3))

        }else if(actionRoll < 47){          //R2: 30% 

            enemyObj.action = rarr(enemyObj.actionRef.filter(action => action.rate == 2))

        }else{                              //R1: 54%

            enemyObj.action = rarr(enemyObj.actionRef.filter(action => action.rate == 1))

        }

        //Log: next enemy action.
        // console.log(enemyObj.action);

        //Resolve fear.
        if(enemyObj.state == 'fear'){
            enemyObj.action = new EnemyActionObj('block')
            enemyObj.state = ''
        }
        
        //Resolve undefined actions due to lack of rate.
        if(enemyObj.action === undefined) {
            enemyObj.action = rarr(enemyObj.actionRef.filter(action => action.rate == 1))
        }
    }
    //Recalculate current action.
    function recalcEneAction(){
        enemyObj.action = new EnemyActionObj(enemyObj.action.key)
        combatState.logMsg.push(`enemy action recalculated`)
    }
    

//ACTIONS
    //Resolve action charges
    function resolveCharge(action){
        action.actionCharge--

        if(action.actionCharge < 1){

            //Remove action
            removeFromArr(playerObj.actions, action)
            removeFromArr(playerObj.tempActions, action)

            //Resolve item on 0 charge
            let item = findItemByAction(action)
            //Delete id consumable
            if(
                item.itemName.includes('potion') ||
                item.itemName.includes('scroll') ||
                item.itemName.includes('curse')
            ){
                removeItem(item.itemId)
            }
            //Else unequip
            else if(item.passiveStats.length === 0){
                equipItem(item.itemId)
            }

            
            //Loose passive stat
            resolvePlayerStats()  
        }
    }
    //Resolve stats
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

        let flatSlots = playerObj.baseSlots

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

                //Item slots
                else if(statObj.stat === 'slots'){
                    flatSlots += statObj.value
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

        //Slots 
        playerObj.equipmentSlots = flatSlots
        playerObj.actionSlots = flatSlots
    }


//Dealing with offered items
    //Gen list
    function genOfferedItemList(quant, event) {

        playerObj.offeredItemsArr = []
        let generatedReward

        if(quant == undefined){quant = gameState.flatItemReward}//Resolve undefined quant

        if(quant == "all"){//all items for testing
            itemsRef.forEach(item => {
                generatedReward =  new ItemObj(item.itemName)
                playerObj.offeredItemsArr.push(generatedReward.itemName)
                

                //Add card to container
                el('merchant-container').append(genItemCard(generatedReward, 'item-to-buy'))
            })
        }else{

            //Gen item per quant value in function
            for(i = 0; i < quant; i++){ 
    
                generatedReward =  new ItemObj()
    
                //Add item to reward pool, to find them after item card is selected from html
                playerObj.offeredItemsArr.push(generatedReward)
                
                //Add html cards per item
                if(event == 'reward'){
                    //Gen item html card elem
                    let rewardElem = genItemCard(generatedReward, 'reward')
    
                    //Add card to container
                    el('reward-container').append(rewardElem)
                }
                else if(event == 'merchant'){
                    //Gen item html card elem
                    let rewardElem = genItemCard(generatedReward, 'item-to-buy')
    
                    //Add card to container
                    el('merchant-container').append(rewardElem)
                }
            }
        }

    }
    //Resolve
    function resolveChoosingOfferedItem(itemId, event){   

        //Find item with matching id
        playerObj.offeredItemsArr.forEach(targetItem => {

            if(targetItem.itemId == undefined || targetItem.itemId != itemId) return false

            //If no slots return
            if(playerObj.inventory.length == playerObj.inventorySlots){ 
                showAlert('No inventory slots.') 
                return
            }

            if(event == 'reward'){
                //Add item to players inventory & auto-equip
                playerObj.inventory.push(targetItem)
                equipItem(targetItem.itemId)
    
                //Move inventory list back to it's page
                el('inventory').childNodes[1].append(el('inventory-list'))
                
                //screen() is ran from the button.
            }
            else if(event == 'purchase'){
                if(resolvePayment(targetItem.cost) == false) return
                
                //Destroy item card
                el(itemId).remove()

                showAlert(`${upp(targetItem.itemName)} purchased for ${targetItem.cost} and added to the inventory.`)

                playerObj.inventory.push(targetItem)

                equipItem(targetItem.itemId)
            }

        })
    }

//ITEMS
    //Add item (to player inventory based on arguments).
    function addItem(key, iLvl){

        //Check if there are slots in the inventory.
        if(playerObj.inventory.length < playerObj.inventorySlots){

            // console.log(key);

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
            showAlert('Inventory is full.')
        }
    }
    //Equip/unequip item.
    function equipItem(itemId){

        //Find item by id
        let item = findItemById(itemId)

        //Get item types to prevent staking
        let itemSlots = []
        playerObj.inventory.forEach(invItem => {
            if(!invItem.equipped || invItem.itemSlot == 'generic') return false
            itemSlots.push(invItem.itemSlot)
        })


        //Equip
        if(
            !item.equipped &&                         //check if equipped
            playerObj.equipmentSlots > calcEquippedItems() &&  //check if there are slots
            !itemSlots.includes(item.itemSlot)        //check if unique type
        )
        {
            item.equipped = true
        } 
        //Unequip item
        else if (item.equipped == true){
            item.equipped = false
        }
        else if(itemSlots.includes(item.itemSlot)){
            showAlert("Can't equip two items of the same type.")
        }
        else {
            showAlert('No equippment slots.')
        }

        resolvePlayerStats()//Adjust this to recalc all items
        syncUi()
    }
    //Remove/drop item (inventory).
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
    //Sell item (merchant).
    function sellItem(itemId){
        let item = findItemById(itemId)
        
        playerObj.coins += item.cost
        
        removeItem(itemId)

        showAlert(`${upp(item.itemName)} sold for ${item.cost} coins.`)
    }
    //Enhance item (blacksmith).
    function modifyItem(itemId, type){
        //Find item
        let targetItem = findItemById(itemId)

        if(type == 'enhance'){
            if(resolvePayment(calcCost('enhance', itemId)) == false) return

            //Item enchance logic
                 //Add passive mod
                let addedStat = rarr([{stat:'life',value:6}, {stat:'power',value:1}, {stat:'def',value:2}])

                //If no mods add.
                if(targetItem.passiveStats.length < 1){
                    targetItem.passiveStats.push(addedStat)
                }
                //Check if matching stat exists -> increase stat
                else{
                    let matchingStat

                    targetItem.passiveStats.forEach(statObj =>{
                        if(addedStat.stat != statObj.stat) return false
                
                        matchingStat = true
                        statObj.value += addedStat.value  
                    })

                    //Else add stat
                    if(!matchingStat){
                        targetItem.passiveStats.push(addedStat)
                    }
                }

                //Increase ench quant to increase cost per enhant of the same item.
                targetItem.enhancementQuantity++

            resolvePlayerStats()//Recalculates passive stats
            showAlert('Item enhancement.')
        }
        else if(type == 'repair'){
            //Find 1st action
            let action = targetItem.actions[0]

            //If no actions return
            if(action == undefined) return showAlert("This item can't be repaired.")

            //If can't pay return
            if(resolvePayment(calcCost('repair', itemId)) == false) return

            //Add 50% of max charges
            action.actionCharge += Math.ceil(action.flatActionCharge / 2)

            //Increase ench quant to increase cost per enhant of the same item.
            targetItem.repairQuantity++

            //item repair logic
            showAlert('Item repaired.')
        }

        syncUi()
    }
    //Move function for purchasing and item here.

    //Util: resolve payment.
    function resolvePayment(cost){
        if(playerObj.coins < cost){
            showAlert(`You can't afford this. You need <img src="./img/ico/coin.svg"> ${cost - playerObj.coins} more.`)
            return false
        }
        else{
            playerObj.coins -= cost
            showAlert(`You paid <img src="./img/ico/coin.svg"> ${cost} coins.`)
        }
    }
    //Util: find item by action.
    function findItemByAction(action){
        let itemWihtAction

        playerObj.inventory.forEach(item => {

            item.actions.forEach(itemAction => {

                if(itemAction.actionId === action.actionId){

                    itemWihtAction = item

                }

            })

        })

        return itemWihtAction
    }
    //Util: find item by id.
    function findItemById(itemId, sourceArr){
        let targetItem

        if(sourceArr == undefined){
            sourceArr = playerObj.inventory
        }

        sourceArr.forEach(item => {
            if(item.itemId != itemId) return false
            targetItem = item
        })

        if(targetItem == undefined){
            playerObj.offeredItemsArr

            sourceArr.forEach(item => {
                if(item.itemId != itemId) return false
                targetItem = item
            })
        }

        return targetItem
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


//GAME START
    initGame()
    // initiateCombat() //Disable if not testing combat

    el('map').scrollTo(0, 9999); // Sets map position to view unit.