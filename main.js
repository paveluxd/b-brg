//INITITATE GAME
    function initGame(mapY, stage){

        //Create initial game and player objects
        if(typeof gs == 'undefined'){
            gs = new GameState
            gs.plObj = new PlayerObj

            //Resolve ititial items
            gs.plObj.startingItems.forEach(key => {addItem(key)})

            saveGame()
        }
        
        mapRef = gs.mapObj.tiles
        genMap()

        
        //Gen remaining UI
        // syncTree()     //merge
        syncCharPage() //merge?
        genTabs()      //merge ui
        spriteBuilder('player')//create player sprite

        resolvePlayerStats()
        syncUi()
    }

//INITITATE COMBAT
    function initiateCombat(){

        //1.Create cinbat object.
            gs.inCombat = true
            gs.combatTurn = 1

        //2.Reset variables for new encounter.
            if(typeof gs.encounter !== 'number'){
                gs.encounter = 1
            }  

        //3.Generates enemy
            gs.enObj = new EnemyObj //New enemy per fight 
            genEneAction()          //Gen before player turn and after. Do it at this stage because it references gs.enObj.
            spriteBuilder('enemy')

        //4.Set stats before combat
            //Restore sword dmg buff
            gs.plObj.swordDmgMod = 0

            //Restore flat def
            if(gs.plObj.def !== gs.plObj.flatDef){
                gs.plObj.def = gs.plObj.flatDef
            }

            //Restore flat power
            if(gs.plObj.power !== gs.plObj.flatPower){//see if power should stay betweeen combats, set sign to <
                gs.plObj.power = gs.plObj.flatPower
            } 
        
            //Recalc all items and actions
            resolvePlayerStats()

        //5.Roll player dice. Roll after stats if dice will be changed.
            gs.plObj.roll = rng(gs.plObj.dice)
            //PASSIVE: post roll passives.
            resolvePostRollPassives()

        //6.syncUI() will generate action cards that will trigger turnCalc().
            syncUi()

        //7.Open combat screen
            screen("combat")
    }
    //1.TURN CALC
        function turnCalc(buttonElem){
            //Set random ghost images
            el('p-ghost').setAttribute('src',`./img/character/ghost-${rng(3)}.svg`)
            el('e-ghost').setAttribute('src',`./img/character/ghost-${rng(3)}.svg`)

            //Reset combat state vars
            gs.combatTurnState = ''
            gs.plObj.dmgDone = 0
            gs.plObj.dmgTaken = 0
            gs.enObj.dmgDone = 0
            gs.enObj.dmgTaken = 0
            gs.lifeRestoredByPlayer = 0

            //Clear combat log.
            gs.logMsg = [`TURN:${gs.combatTurn} ------------------------------------`]

            //Save players previous action.
            if(gs.sourceAction !== undefined){
                gs.previousAction = gs.sourceAction 
            }

            gs.sourceAction = findObj(gs.plObj.actions, 'actionId', buttonElem.getAttribute('actionId')) //Get action id from button elem
            let actionMod = gs.sourceAction.actionMod
            let playerActionKey = gs.sourceAction.keyId

            //LOGIC: player
            if      (playerActionKey =='a1' ){// mace

                gs.plObj.dmgDone += actionMod + gs.plObj.power
    
                if(gs.plObj.roll === 4){
                    gs.plObj.def += 1
    
                    gs.logMsg.push('Mace: +1 def.')
                }
    
                gs.logMsg.push(`Mace: deals ${actionMod + gs.plObj.power} dmg.`)
    
            }else if(playerActionKey =='a2' ){// 'armor break' 'hammer'

                //Get reduction value
                let defReduction = gs.plObj.def
                if(defReduction < 1){defReduction = 0}

                //Resolve stat change
                changeStat('def', -defReduction, 'enemy') 
                changeStat('def', -1, 'player') 

                //Log
                gs.logMsg.push(`Hammer attack: reduced enemy def by ${defReduction}.`)
    
            }else if(playerActionKey =='a3' ){// Spell: shards "book of moon" 
    
                //Action cost
                if(gs.plObj.power < 1) return showAlert('Not enough power to pay for action cost.')

                //Resolve stat change
                changeStat('power', -1, 'player') 
    
                //Calc total dmg
                let mult = gs.plObj.actionSlots - gs.plObj.actions.length 
                if(mult < 1){mult = 0}
            
                //Damage
                gs.plObj.dmgDone += (actionMod + gs.plObj.power) * mult

                //Log
                gs.logMsg.push(`Shard: dealt ${(actionMod + gs.plObj.power) * mult} dmg.`)
    
            }else if(playerActionKey =='a4' ){// dagger pair 
    
                gs.plObj.dmgDone += (actionMod + gs.plObj.power) * 2 
                gs.logMsg.push('Dagger pair attack.')
    
            }else if(playerActionKey =='a5' ){// bow
    
                gs.plObj.dmgDone += gs.plObj.roll + gs.plObj.power
    
            }else if(playerActionKey =='a6' ){// EX: cut 'dagger'

                //Action cost check
                if(gs.plObj.roll < 3) return showAlert('Action requires roll greater than 2.')
                
                //Resolve stat change
                changeStat('roll', -3, 'player') 

                //Damage
                gs.plObj.dmgDone = gs.sourceAction.actionMod + gs.plObj.power 

                //Combat log
                gs.logMsg.push('Attacked with dagger as extra action.')
                
            }else if(playerActionKey =='a7' ){// sword attack 
    
                gs.plObj.dmgDone += gs.sourceAction.actionMod + gs.plObj.power + gs.plObj.swordDmgMod

                if(gs.plObj.roll == 5 || gs.plObj.roll == 6){
                    gs.plObj.swordDmgMod += 1
                }

                //Log
                gs.logMsg.push(`Sword: dealt ${gs.plObj.power} dmg.`)
    
            }else if(playerActionKey =='a8' ){// "axe" 
    
                let maxLife = gs.plObj.life //Deal with overcap life
    
                if(gs.plObj.flatLife > gs.plObj.life){
                    maxLife = gs.plObj.flatLife
                }
    
                gs.plObj.life -= 5
    
                gs.plObj.dmgDone += gs.plObj.flatLife - gs.plObj.life + gs.plObj.power
    
            }else if(playerActionKey =='a9' ){// SP/EX: ice lance "book of ice"

                //Action cost
                if(gs.plObj.power < 1) return showAlert('Not enough power to pay for action cost.')

                //Resolve stat change
                changeStat('power', -1, 'player') 
   
                //Dmg
                gs.plObj.dmgDone += gs.plObj.power

                //Log
                gs.logMsg.push(`Ice lance: dealt ${gs.plObj.power} dmg.`)
    
            }else if(playerActionKey =='a10'){// EX: backstab "iron dagger"
    
                //Resolve action cost
                if(gs.plObj.roll < 5) return showAlert('Action requires roll greater than 5.')
                
                // else if(gs.plObj.roll < 5 && gs.plObj.actions.length === 1){
                //     showAlert('You had no resources to perform your only action, your turn was skipped.');
                // } 
    
                gs.plObj.roll -= 5
                gs.plObj.dmgDone = gs.sourceAction.actionMod + gs.plObj.power
                gs.plObj.power += 1
    
            }
             else if(playerActionKey =='a11'){// SP: lightning "book of lightning"
    
                //Action cost
                if(gs.plObj.power < 2) return showAlert('Not enough power to pay for action cost.')

                //Resolve stat change
                changeStat('power', -2, 'player') 

                //Dmg
                let dmgVal = rng(20) + gs.plObj.power
                gs.plObj.dmgDone += dmgVal

                //Log
                gs.logMsg.push(`Lightning: dealt ${dmgVal} dmg.`)
    
            }else if(playerActionKey =='a12'){// shield bash
    
                //Dmg
                gs.plObj.dmgDone += gs.plObj.def * gs.plObj.power

                //Log
                gs.logMsg.push(`Shield bash: dealt ${gs.plObj.def * gs.plObj.power} dmg.`)
    
            }else if(playerActionKey =='a13'){// SP: fireball  "book of fire"
    
                //Dmg
                gs.plObj.dmgDone += actionMod + gs.plObj.power

                //Log
                gs.logMsg.push(`Fireball: dealt ${actionMod + gs.plObj.power} dmg.`)
    
            }else if(playerActionKey =='a14'){// SP: pyroblast "book of fire"
    
                //Action cost
                if(gs.plObj.power < 1) return showAlert('Not enough power to pay for action cost.')

                //Resolve stat change
                changeStat('power', -1, 'player') 
    
                //Dmg
                gs.plObj.dmgDone += gs.plObj.power * gs.plObj.roll

                //Log
                gs.logMsg.push(`Pyroblast: dealt ${gs.plObj.power * gs.plObj.roll} dmg.`)

            }else if(playerActionKey =='a15'){// quick block "tower shield"
    
                gs.enObj.dmgDone -= actionMod - gs.plObj.dice
    
            }else if(playerActionKey =='a16'){// barrier
                
                gs.plObj.protection = ['Barrier']
                gs.sourceAction.cooldown = 0
    
            }else if(playerActionKey =='a18'){// preparation "boots" (keep 50% of roll)
    
                //Value
                gs.plObj.rollBonus += Math.ceil(gs.plObj.roll * 0.5)

                //Log
                gs.logMsg.push(`Preparation: saved ${Math.ceil(gs.plObj.roll * 0.5)} roll points.`)
    
            }else if(playerActionKey =='a19'){// reroll
    
                //Val
                gs.plObj.roll = rng(gs.plObj.dice)

                //PASSIVE: check for on-roll passives.
                resolvePostRollPassives()
    
            }else if(playerActionKey =="a20"){// "scroll of repetition"

                //Restores charge to all items
                gs.plObj.inventory.forEach(item => {
                    item.actions.forEach(action => {
                        if(action.playerActionKeyId !== 'a20'){
                            action.actionCharge += gs.sourceAction.actionMod
                        }
                    })
                })

            }else if(playerActionKey =='a21'){// "curse of weakness"
    
                //Resolve stat change
                changeStat('power', -actionMod, 'enemy')
    
            } 
             else if(playerActionKey =='a22'){// (ene def-) wounds

                //Resolve stat change
                changeStat('def', -actionMod, 'enemy')
    
            }else if(playerActionKey =='a23'){// (ene -dice) "curse of chain"
    
                //Resolve stat change
                changeStat('dice', -actionMod, 'enemy')
    
            }else if(playerActionKey =='a24'){// (ene roll-) slowness "curse of slowness"
    
                //Resolve stat change
                changeStat('roll', -actionMod, 'enemy')
    
            }else if(playerActionKey =='a25'){// stun "chain"
    
                if(gs.plObj.roll != 1) return showAlert('Action requires roll 1.')

                gs.enObj.state = 'Skip turn'
     
            }else if(playerActionKey =='a47'){// stun: smoke bomb
    
                if(['attack', 'combo', 'final strike', 'charged strike'].indexOf(gs.enObj.action.playerActionKey) > -1) showAlert(`Smoke bomb failed vs attack.`)
                gs.enObj.state = 'Skip turn'
                
            }else if(playerActionKey =='a26'){// SP: freeze (stun spell) "book of ice"

                //Action cost
                if(gs.plObj.power < 1) return showAlert('Not enough power to pay for action cost.')

                //Resolve stat change
                changeStat('power', -1, 'player') 
    
                gs.enObj.state = 'Skip turn'
    
            }else if(playerActionKey =='a31'){// RING: defence charge !!! see if resolving stats at this point will cause issues. Required due to def behaviour
    
                // gs.plObj.def -= actionMod
                resolveCharge(gs.sourceAction)
                resolvePlayerStats()
    
            }else if(playerActionKey =='a33'){// healing potion
                
                //Heal value
                gs.lifeRestoredByPlayer += Math.round((gs.plObj.flatLife - gs.plObj.life) / 100 * actionMod)

                //Log
                gs.logMsg.push(`Heling potion: +${gs.lifeRestoredByPlayer}  life.`)  
                 
            }else if(playerActionKey =='a34'){// (def+) fortification

                //Resolve stat change
                changeStat('def', actionMod, 'player')
    
            }else if(playerActionKey =='a35'){// dodge % evasion "leather cape"
    
                let dodgePercent = gs.plObj.roll * actionMod
                let dodgeRoll = rng(100)
    
                if(dodgeRoll < dodgePercent){
                    gs.enObj.dmgDone = -99999 // add something better for dodge later
                }
    
            }
             else if(playerActionKey =='a37'){// SP: buff next attack with piercing "leather gloves"

                //Action cost
                if(gs.plObj.power < 1) return showAlert('Not enough power to pay for action cost.')

                //Resolve stat change
                changeStat('power', -1, 'player') 
    
                gs.plObj.piercing = true
                gs.sourceAction.cooldown = 0

            }else if(playerActionKey =='a38'){// static "cape"
    
                if(gs.plObj.roll < 8) return showAlert('This action requires roll greater than 8.')
    
                //Resolve stat change
                changeStat('power', 2, 'player')
                    
            }else if(playerActionKey =='a39'){// sprint "woolen boots"

                //Resolve stat change
                changeStat('roll', 2, 'player')
    
            }else if(playerActionKey =='a40'){// water potion "water potion"

                //Resolve stat change
                changeStat('power', actionMod, 'player')
    
            }else if(playerActionKey =='a41'){// poison
                
                //Marker
                gs.plObj.poisonBuff = true

                //Log
                gs.logMsg.push('Applied poison to weapons.<br>')
    
            }else if(playerActionKey =='a42'){// 'block' 'shield'
    
                gs.enObj.dmgDone -= gs.plObj.roll

                //Log
                gs.logMsg.push(`Blocked ${gs.plObj.roll} dmg.`)
    
            }else if(playerActionKey =='a44'){// "restoration" "scroll of restoration"

                let restoredPoints = 0
    
                if(gs.plObj.def < 0){
                    restoredPoints += gs.plObj.def
                    gs.plObj.def = 0
                }
                if(gs.plObj.power < 0){
                    restoredPoints += gs.plObj.power
                    gs.plObj.power = 0
                }
                if(gs.plObj.dice < gs.plObj.flatDice){
                    restoredPoints += gs.plObj.dice - gs.plObj.flatDice
                    gs.plObj.dice = gs.plObj.flatDice
                }

                if(restoredPoints == undefined) return false

                gs.lifeRestoredByPlayer += (-1 * restoredPoints)

                //Log
                gs.logMsg.push(`restoration: restored ${-1 * restoredPoints} life`)
    
            }else if(playerActionKey =='a45'){// club attack
    
                gs.plObj.dmgDone += 3 + gs.plObj.power

                //Log
                gs.logMsg.push(`Club: dealt ${gs.plObj.power} dmg.`)
    
            }else if(playerActionKey =='a48'){// "focus" "wooden staff"

                //Resolve stat change
                changeStat('power', Math.floor(1 * gs.plObj.roll / 4), 'player')
    
            }else if(playerActionKey =='a49'){// zealotry
    
                //Resolve stat change
                changeStat('power', gs.plObj.roll, 'player')
                changeStat('def', -gs.plObj.roll, 'player')
    
            }
             else if(playerActionKey =='a50'){// defensive stance
            
                //Resolve stat change
                changeStat('roll', -1, 'player')
                
                gs.sourceAction.cooldown = 0
     
            }else if(playerActionKey =='a52'){// hook/swap
            
                let rollRef = gs.plObj.roll
                gs.plObj.roll = gs.enObj.roll
                gs.enObj.roll = rollRef
    
                //Log
                gs.logMsg.push(`rolls swapped (Result: P${gs.plObj.roll}/E${gs.enObj.roll})`)
    
                //RECALC ENEMY INTENDED ACTION: if player mods roll or power as extra action.
                recalcEneAction()
            }else if(playerActionKey =='a53'){// "transmute" "alchemists playerActionKey"
                
                //Condition check
                if(gs.plObj.roll != 1 && gs.plObj.roll != 2) return showAlert('Transmute requires roll 1 or 2.')
    
                //Stat mod
                gs.plObj.coins += gs.plObj.roll
                
                //Log
                gs.logMsg.push(`transmute: added ${gs.plObj.roll} coins`)
    
            }else if(playerActionKey =='a54'){// "inferno" "scroll of inferno"
    
                //Dmg
                gs.plObj.dmgDone += gs.plObj.power * gs.plObj.coins
    
                //Log
                gs.logMsg.push(`inferno: dealt ${gs.plObj.coins} dmg, and consued ${gs.plObj.coins} coins`)
    
                //Cost
                gs.plObj.coins = 0
    
            }else if(playerActionKey =='a55'){// "fear" "wizards head"

                //Marker
                gs.enObj.state = 'fear'
                gs.sourceAction.cooldown = 0
                
                //Set variable cooldown.  
                let referenceActionObj = findByProperty(actionsRef, 'keyId', gs.sourceAction.keyId) //Find action reference
                referenceActionObj.cooldown = rng(4,2)

                //Log
                gs.logMsg.push(`fear: enamy will block during the next turn (fear reacharge:${referenceActionObj.cooldown})`)

            }else if(playerActionKey =='a57'){// "heal" "book of order"

                //Cost
                if(gs.plObj.power < 0) return showAlert('Not enough power to pay for action cost.')
                
                //Resolve stat change
                changeStat('power', -1, 'player') 

                gs.lifeRestoredByPlayer += actionMod + gs.plObj.power + gs.plObj.def
                
                //Log
                gs.logMsg.push(`heal: +${gs.lifeRestoredByPlayer} life, -1 power.`)
                
            }else if(playerActionKey =='a60'){// heavy block "towerbuckler"
    
                gs.enObj.dmgDone -= gs.plObj.def * (actionMod/100) 

                //Log
                gs.logMsg.push(`Hevy block: blocked ${gs.plObj.def * (actionMod/100)} dmg.`)
    
            }

            //PASSIVES post-action: Player passive effects.
            gs.plObj.actions.forEach(action => {
                if      (action.keyId == 'a17'){ // combo "gloves"
                    if(gs.plObj.roll === 6 && action.cooldown > 0){

                        gs.combatTurnState = 'extra-action'
                        action.cooldown = 0

                        //Log
                        ombatState.logMsg.push(`Combo extra action (passive).`)

                    }
                }else if(action.keyId == 'a36'){ // critical hit "woolen gloves"
                    if(gs.plObj.roll > 8 && action.cooldown > 0){

                        gs.plObj.dmgDone = gs.plObj.dmgDone * (action.actionMod/100)
                        action.cooldown = 0

                        //Log
                        ombatState.logMsg.push(`Critical hit (passive).`)

                    }
                }else if(action.keyId == 'a51'){ // overload 'exoskeleton'
                    if(gs.plObj.roll > gs.plObj.dice){

                        gs.plObj.dmgDone = gs.plObj.dmgDone * (action.actionMod / 100 + 1)

                        //Log
                        gs.logMsg.push(`Overload activated (passive).`)

                    }
                }else if(action.keyId == 'a56'){ // sigil of light

                    if(gs.plObj.life + gs.lifeRestoredByPlayer <= gs.plObj.flatLife) return



                    //Mod max life
                    gs.plObj.flatLife += action.actionMod
                    gs.plObj.flatLifeMod += action.actionMod

                    // Log
                    gs.logMsg.push(`Faith: +${action.actionMod} max life (passive).`)  
                }
            })
            
            //LOGIC: enemy
            enemyActionLogic()

            //PASSIVES: work for both player and enemy.
            gs.plObj.actions.forEach(action => {
                if (action.keyId === 'a43'){ // throns crown
                    if(gs.enObj.dmgDone !== undefined){
                        gs.enObj.dmgDone = gs.enObj.dmgDone * 2
                    }
                    if(gs.plObj.dmgDone !== undefined){
                        gs.plObj.dmgDone = gs.plObj.dmgDone * 2
                    }
                }
            })

            combatCalc() //Dmg and heal calc.
            combatEndCheck()

            //Trigger ghost animation
            el('e-ghost').setAttribute('style',`transform: scale(-1, 1);`) //flip ene
            runAnim(el(`p-ghost`), 'ghost-trigger')
            runAnim(el('e-ghost'), 'ghost-trigger')
        }
        //Damage calculation.
        function combatCalc(){    

            //PLAYER DMG
            if(gs.plObj.dmgDone > 0){

                //POISON: apply id dmg is done.
                if(gs.plObj.poisonBuff || gs.plObj.poisonBuff == 'triggered'){
                    let poisonStackCount = 1
            
                    //Shards
                    if(gs.sourceAction.keyId === 'a3'){
                        let mult = gs.plObj.actionSlots - gs.plObj.actions.length 
            
                        if(mult < 1){
                            mult = 0
                        }
            
                        poisonStackCount = mult
                    } 
                    //Dagger pair
                    else if(gs.sourceAction.keyId === 'a4'){
                        poisonStackCount = 2
                    }
            
                    gs.enObj.poisonStacks += poisonStackCount
                    gs.plObj.poisonBuff = 'triggered'
                    gs.logMsg.push(`Applied ${poisonStackCount} poison stacks. Poison was triggered.`)
                }
                
                //DEF: resolve.
                if(!gs.plObj.piercing){//Ignore def if piercing state
                    
                    //Reduce def on low hit
                    if(gs.enObj.def > 0){
                        changeStat('def', -1, 'enemy')
                    }

                    //Reduce dmg by def
                    gs.plObj.dmgDone -= gs.enObj.def
                    
                }
                //Set positive damage to 0 (due to def)
                if(gs.plObj.dmgDone < 0){
                    gs.plObj.dmgDone = 0
                }
                
                //Resolve stat change
                changeStat('life', -gs.plObj.dmgDone, 'enemy')           

                //Reset piercing buff after attack was performed
                gs.plObj.piercing = false
            }

            //ENE DMG
            if(gs.enObj.dmgDone > 0){

                //Reduce damage if barrier
                if(gs.plObj.protection !== undefined && gs.plObj.protection[0] === 'Barrier'){

                    gs.plObj.protection = '' //Reset variable

                    // Convert action mod (75) to barrier reduction %
                    gs.enObj.dmgDone = Math.round(gs.enObj.dmgDone * (1 - gs.sourceAction.actionMod / 100)) 
                }

                //Resolve enemy actions
                if      (['attack', 'crit', 'charged strike'].indexOf(gs.enObj.action.key) > -1){

                    //Reduce def on low hit
                    if(gs.plObj.def > 0){
                        changeStat('def', -1, 'player')
                    }

                    //Reduce dmg by def
                    gs.enObj.dmgDone -= gs.plObj.def

                    //Set positive damage to 0
                    if (gs.enObj.dmgDone < 0){
                        gs.enObj.dmgDone = 0
                    } 

                    //Resolve dmg
                    changeStat('life', -gs.enObj.dmgDone, 'player')

                }else if(['combo'].indexOf(gs.enObj.action.key) > -1){
                    for (let i = 0; i < 3; i ++){

                        //Move to a diff var due to def reducing dmg done 3 times
                        let playerDamageTaken = gs.enObj.dmgDone

                        //Reduce def on low hit
                        if(gs.plObj.def > 0){
                            changeStat('def', -1, 'player')
                        }

                        //Reduce damage by def
                        playerDamageTaken -= gs.plObj.def

                        //Set positive damage to 0
                        if (playerDamageTaken < 0){playerDamageTaken = 0} 

                        //Resolve dmg
                        changeStat('life', -playerDamageTaken, 'player')

                    }
                }else if(['final strike'].indexOf(gs.enObj.action.key) > -1 && gs.enObj.life < 0){ //final strike only works if enemy is dead.

                    //Reduce def on low hit
                    if(gs.plObj.def > 0){
                        changeStat('def', -1, 'player')
                    }

                    //Reduce damage by def
                    playerDamageTaken -= gs.plObj.def

                    //Resolve dmg
                    changeStat('life', -gs.enObj.dmgDone, 'player')
                }
            }

            //Player healing
            if(gs.lifeRestoredByPlayer > 0){
                restoreLife(gs.lifeRestoredByPlayer)
            }
        }

        //Floating stat number 
        function indicateStatChange(){
            ['player', 'enemy'].forEach(target =>{
                ['lifeChange', 'diceChange', 'rollChange', 'defChange', 'powerChange'].forEach(stat => {

                    let objStat = gs.plObj[stat]
                    let objStatMarker = gs.plObj[`${stat}Marker`]
                    let elem = el(`p-${stat}`)
                    let statValue = gs.plObj[stat]
                    
                    if (target == 'enemy'){
                        objStat = gs.enObj[stat]
                        objStatMarker = gs.enObj[`${stat}Marker`]
                        elem = el(`e-${stat}`)
                        statValue = gs.enObj[stat]
                    }

                    //Return if stat was not modified
                    if(objStatMarker == false) return 
                    
                    //Update elem value
                    elem.innerHTML = statValue

                    //Set color
                    if(statValue > 0){//gain
                        elem.setAttribute('style','color:var(--green);')
                        elem.innerHTML = `+${statValue}`
                    } else if(statValue == 0){
                        elem.setAttribute('style','color:white;')
                    } else{ //loose
                        elem.setAttribute('style','color:var(--orange);')
                    }

                    //Trigger animation
                    runAnim(elem, 'stat-float')

                    //Reset 'change' properties.
                    gs.plObj[stat] = 0
                    gs.plObj[`${stat}Marker`] = false

                    if (target == 'enemy'){
                        gs.enObj[stat] = 0
                        gs.enObj[`${stat}Marker`] = false
                    }
                })

            })
        }

        function changeStat(stat, value, target){
            if(target == 'player'){
                gs.plObj[stat] += value

                //Trigger floating number
                gs.plObj[`${stat}ChangeMarker`] = true
                gs.plObj[`${stat}Change`] += value
            } else { //enemy
                gs.enObj[stat] += value

                //Trigger floating number
                gs.enObj[`${stat}ChangeMarker`] = true
                gs.enObj[`${stat}Change`] += value
            }
        }

        function restoreLife(val){
            let lifeChange = val
            gs.plObj.life += lifeChange

           
            
            //Prevent overhealing
            if(gs.plObj.life > gs.plObj.flatLife){
                gs.plObj.life = gs.plObj.flatLife
                lifeChange = 0
            }
            
            //Trigger floating number
            gs.plObj.lifeChangeMarker = true
            gs.plObj.lifeChange += lifeChange
        }

    //2.END TURN
        function combatEndCheck(){ 
            
            gs.totalCombatTurns++ //Stats for testing.
            resolveCharge(gs.sourceAction) //Deal with action charges.

            // DEFEAT (also loose if 0 actions).
            if(gs.plObj.life < 1 || gs.plObj.actions.length < 1){
                clearSavedGame()
                openStateScreen('game-end')
            }
            // VICTORY.
            else if (gs.enObj.life < 1){
                //End game stats
                gs.enemyCounter++

                //Exit
                if(gs.encounter == gs.playerLocationTile.enemyQuant){
                    gs.encounter = 'end'

                    if(gs.playerLocationTile.tileType === 'portal'){
                        openStateScreen("completed")
                        return
                    }
                }

                //Next fight
                else{
                    gs.encounter++ 
                }
                
                //If final encounter, show rewards
                if(gs.encounter == 'end'){

                    //Lock screen
                    document.body.classList.add('lock-actions', 'darken')

                    //Run gen reward after delay
                    window.setTimeout(
                        function(){

                            //Open reward screen
                            genRewards(gs.flatItemReward + gs.playerLocationTile.enemyQuant)

                            //Unlock screen
                            document.body.classList.remove('lock-actions', 'darken')
                        },
                        1000
                    )
                }
                //Next encounter
                else{
                    initiateCombat()
                    runAnim(el('enemy-sprite'), 'enemyEntrance') 
                }

                gs.plObj.exp++                                   //Add 1 exp
                gs.plObj.lvl = Math.round(1 + gs.plObj.exp / 3) //Recalc player lvl'
            }
            // NEXT TURN.
            else if (gs.sourceAction.actionType !== "extra-action" || gs.plObj.roll < 1){

                //POISON: resolve stacks
                if(gs.enObj.poisonStacks > 0){

                    //Reduce random stat by 1 per posion stack
                    for(i = 0; i < gs.enObj.poisonStacks; i++){
                        let statRoll = rng(5)
                            
                        if       (statRoll == 2){
                            gs.enObj.def -= 1
                            gs.logMsg.push(`poison: -1 def. ${gs.enObj.poisonStacks - 1} stacks remaining`)

                        }else if (statRoll == 3){
                            gs.enObj.power -= 1
                            gs.logMsg.push(`poison: -1 power. ${gs.enObj.poisonStacks - 1} stacks remaining`)

                        }else if (statRoll == 4 && gs.enObj.dice > 3){
                            gs.enObj.dice -= 1
                            gs.logMsg.push(`poison: -1 dice. ${gs.enObj.poisonStacks - 1} stacks remaining`)

                        }else if (statRoll == 5){ //20% to increase poison stacks
                            gs.enObj.poisonStacks += 1
                            gs.logMsg.push(`poison: +1 stack. ${gs.enObj.poisonStacks - 1} stacks remaining`)
                        }else {
                            gs.enObj.life -= 1
                            gs.logMsg.push(`poison: -1 life. ${gs.enObj.poisonStacks - 1} stacks remaining`)
                        }
                    }

                    //Reduce poison stacks
                    gs.enObj.poisonStacks -= 1

                    //Removes poison buff if it was triggered during this turn.
                    if(gs.plObj.poisonBuff == 'triggered'){
                        gs.plObj.poisonBuff = false
                        gs.logMsg.push(`poison buff removed`)
                    }
                }

                //COODLOWN: Increase turn cooldowns
                gs.plObj.actions.forEach(action => {
                    if(typeof action.cooldown != 'undefined' && action.cooldown < findByProperty(actionsRef, 'keyId', action.keyId).cooldown){
                        action.cooldown++
                    }
                })
        
                //Player turn roll.
                gs.plObj.roll = rng(gs.plObj.dice) + gs.plObj.rollBonus 

                //PASSIVE: post roll passives.
                resolvePostRollPassives()

                gs.plObj.rollBonus = 0                                    // Remove any roll bonuses.
                genEneAction()                                             // Gen enemy action.
                gs.enObj.state = ``                                        // Reset enemy state.
                gs.combatTurn++                                     // Increase turn counter.
            }

            //COMBAT LOG: Print all combat logs.
            gs.logMsg.forEach(msg => {
                console.log(`${upp(msg)}`)
            })

            //Run floating indicators
            indicateStatChange()

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

            let coinsReward = rng(gs.flatCoinsReward)

            el('reward-desc').innerHTML = `
                You defeated the enemy.<br>
                You get +${gs.flatFoodReward + gs.playerLocationTile.enemyQuant} <img src="./img/ico/fish.svg">, ${coinsReward} coins , and one of these rewadrs:
            `
            gs.plObj.food += gs.flatFoodReward + (gs.playerLocationTile.enemyQuant)
            gs.plObj.coins += coinsReward

            toggleModal('reward-screen')         
        }

        
//ENEMY
    //Enemy action logic
    function enemyActionLogic(){
        //State checkd. Deals with stun and extra actions.
        if(gs.enObj.state == 'Skip turn') return                         gs.logMsg.push(`enemy skipped turn due to stun`)
        if(gs.sourceAction.actionType == "extra-action") return gs.logMsg.push(`enemy skipped turn due to extra action`)

        //Resolve actions.
        if      ('attack, combo, final strike, charged strike'.slice(', ').indexOf(gs.enObj.action.key) > -1){

            gs.enObj.dmgDone += gs.enObj.action.actionVal

        }else if('block'.slice(', ').indexOf(gs.enObj.action.key) > -1){

            gs.plObj.dmgDone -= gs.enObj.action.actionVal

        }else if('recover, rush, empower, fortify'.slice(', ').indexOf(gs.enObj.action.key) > -1){

            //Resolve stat change
            changeStat(gs.enObj.action.stat, gs.enObj.action.actionVal, 'enemy')

        }else if('wound, weaken, slow, drain'.slice(', ').indexOf(gs.enObj.action.key) > -1){   

            //Resolve stat change
            changeStat(gs.enObj.action.stat, -gs.enObj.action.actionVal, 'player')

        }
        
        //Records previous action for ui updates.
        gs.enemyAction = gs.enObj.action 
    }
    //Pick enemy action
    function genEneAction(){

        
        //Next turn roll
        gs.enObj.roll = rng(gs.enObj.dice)         

        //Generate action refs with proper calculation for this roll
        let actionKeys = [
            'attack', 
            // 'final strike', 
            'combo', 
            // 'charge', 
            'block', 
            'fortify', 
            'empower', 
            // 'rush', 
            'recover', 
            'wound', 
            // 'weaken', 
            // 'slow', 
            'drain', 
            'sleep'
        ]

        
        //Generates all enemy actions.
        gs.enObj.actionRef = []
        actionKeys.forEach(key => {gs.enObj.actionRef.push(new EnemyActionObj(key))})

        //Pick action
        let actionRoll = rng(100)           //Roll for action chance.

        //Prevent action selection if enemy is charging an attack.
        if(gs.enObj.action != undefined && gs.enObj.action.key == 'charge'){
            
            gs.enObj.action.actionVal--
            gs.enObj.action.desc = `Charges an attack (${ gs.enObj.action.actionVal} turns)`

            //Switch action to charged strike on cd 0
            if(gs.enObj.action.actionVal < 1){
                gs.enObj.action = new EnemyActionObj('charged strike')
            }

        }else if(actionRoll < 2){           //R5: 1%

            gs.enObj.action = rarr(gs.enObj.actionRef.filter(action => action.rate == 5))

        }else if(actionRoll < 7){           //R4: 5%

            gs.enObj.action = rarr(gs.enObj.actionRef.filter(action => action.rate == 4))

        }else if(actionRoll < 25){          //R3: 18%

            gs.enObj.action = rarr(gs.enObj.actionRef.filter(action => action.rate == 3))

        }else if(actionRoll < 55){          //R2: 30% 

            gs.enObj.action = rarr(gs.enObj.actionRef.filter(action => action.rate == 2))

        }else{                              //R1: 45%

            gs.enObj.action = rarr(gs.enObj.actionRef.filter(action => action.rate == 1))

        }

        //Log: next enemy action.
        // console.log(gs.enObj.action);

        //Resolve fear.
        if(gs.enObj.state == 'fear'){
            gs.enObj.action = new EnemyActionObj('block')
            gs.enObj.state = ''
        }
        
        //Resolve undefined actions due to lack of rate.
        if(gs.enObj.action === undefined) {
            gs.enObj.action = rarr(gs.enObj.actionRef.filter(action => action.rate == 1))
        }
    }
    //Recalculate current action.
    function recalcEneAction(){
        gs.enObj.action = new EnemyActionObj(gs.enObj.action.key)
        gs.logMsg.push(`enemy action recalculated`)
    }
    

//ACTIONS
    //Resolve action charges
    function resolveCharge(action){
        action.actionCharge--

        if(action.actionCharge < 1){

            //Remove action
            removeFromArr(gs.plObj.actions, action)
            removeFromArr(gs.plObj.tempActions, action)

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
        gs.plObj.actions = []

        //Adds actions from items to players actions array.
        gs.plObj.inventory.forEach(item => {

            //Check all equipped items
            if(item.equipped){

                //Add all actions from equipped item.
                item.actions.forEach(action => {
                    if(gs.plObj.actionSlots < gs.plObj.actions.length) return
                    if(action.actionCharge < 1) return

                    //Add action to player actions
                    gs.plObj.actions.push(action)  
                })
            }
        })

        //Add temporary actions to players actions array.
        gs.plObj.tempActions.forEach(action => {
            if(gs.plObj.actionSlots > gs.plObj.actions.length){
                gs.plObj.actions.push(action)
            }
        })



        //Resolve life  
        //Add reclaculation for all stats
        let baseLife = gs.plObj.baseLife + gs.plObj.flatLifeMod //Flat life mod for max life spell fx
        let flatLife = 0
        let lifeMultiplier = 1
        let lifeDeviation = gs.plObj.life - gs.plObj.flatLife// See if temporary bonuses should be included.

        let basePower = gs.plObj.basePower
        let flatPower = 0
        let powerDeviation = gs.plObj.power - gs.plObj.flatPower

        let baseDef = gs.plObj.baseDef
        let flatDef   = 0
        let defDeviation = gs.plObj.def - gs.plObj.flatDef

        let baseDice = gs.plObj.baseDice
        let flatDice = baseDice
        let diceDeviation = gs.plObj.dice - gs.plObj.flatDice

        let flatSlots = gs.plObj.baseSlots

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
        gs.plObj.inventory.forEach(item => {
            if(item.passiveStats.length > 0 && item.equipped){
                extractPassiveStats(item)
            }
        })

        //Check actions
        gs.plObj.actions.forEach(action => {
            if(action.passiveStats.length > 0){
            extractPassiveStats(action)
            }
        })

        //Check tree nodes
        gs.plObj.treeNodes.forEach(node => {
            if(node.passiveStats !== undefined && node.passiveStats.length > 0){
                extractPassiveStats(node)
            }
        })

        //Life final calculation
        //(base + flat) + deviation + temporary
        //Temporayr not yet implemented
        gs.plObj.flatLife= Math.round((baseLife + flatLife) * lifeMultiplier)
        gs.plObj.life = gs.plObj.flatLife+ lifeDeviation  

        //Power final calculation
        //(base + flat) + deviation + temporary
        gs.plObj.flatPower = basePower + flatPower
        gs.plObj.power = gs.plObj.flatPower + powerDeviation

        //Def final calc
        gs.plObj.flatDef = baseDef + flatDef
        gs.plObj.def = gs.plObj.flatDef + defDeviation

        //Dice
        gs.plObj.flatDice = flatDice
        gs.plObj.dice = gs.plObj.flatDice + diceDeviation

        //Slots 
        gs.plObj.equipmentSlots = flatSlots
        gs.plObj.actionSlots = flatSlots
    }
    //Resolve post-roll passives
    function resolvePostRollPassives(){
        gs.plObj.actions.forEach(action => {
            if     (action.keyId == 'a58'){ // power surge
                if(gs.plObj.roll == 8){
                    gs.plObj.power += action.actionMod
                    gs.logMsg.push(`Power surge: +1 power (passive).`)
                    el('p-power').innerHTML = gs.plObj.power
                }
            }
            else if(action.keyId == 'a59'){ // armor up
                if(gs.plObj.roll == 4){
                    gs.plObj.def += action.actionMod
                    gs.logMsg.push(`Armor up: +1 def (passive).`)
                    el('p-def').innerHTML = gs.plObj.def
                }
            }
        })
    }


//Dealing with offered items
    //Gen list
    function genOfferedItemList(quant, event) {

        gs.plObj.offeredItemsArr = []
        let generatedReward

        if(quant == undefined){quant = gs.flatItemReward}//Resolve undefined quant

        if(quant == "all"){//all items for testing
            itemsRef.forEach(item => {
                generatedReward =  new ItemObj(item.itemName)
                gs.plObj.offeredItemsArr.push(generatedReward.itemName)
                

                //Add card to container
                el('merchant-container').append(genItemCard(generatedReward, 'item-to-buy'))
            })
        }else{

            //Gen item per quant value in function
            for(i = 0; i < quant; i++){ 
    
                generatedReward =  new ItemObj()
    
                //Add item to reward pool, to find them after item card is selected from html
                gs.plObj.offeredItemsArr.push(generatedReward)
                
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
        gs.plObj.offeredItemsArr.forEach(targetItem => {

            if(targetItem.itemId == undefined || targetItem.itemId != itemId) return false

            //If no slots return
            if(gs.plObj.inventory.length == gs.plObj.inventorySlots){ 
                showAlert('No inventory slots.') 
                return
            }

            if(event == 'reward'){
                //Add item to players inventory & auto-equip
                gs.plObj.inventory.push(targetItem)
                equipItem(targetItem.itemId)
    
                //Move inventory list back to it's page
                el('inventory').childNodes[1].append(el('inventory-list'))
                
                //screen() is ran from the button.
            }
            else if(event == 'purchase'){
                if(resolvePayment(targetItem.cost) == false) return
                
                //Destroy item card
                el(itemId).remove()

                //Update coins indicator
                el('merchant-coins-indicator').innerHTML = `You have: ${gs.plObj.coins}<img src="./img/ico/coin.svg">`

                showAlert(`${upp(targetItem.itemName)} purchased for ${targetItem.cost} and added to the inventory.`)

                gs.plObj.inventory.push(targetItem)

                equipItem(targetItem.itemId)
            }

        })
    }

//ITEMS
    //Add item (to player inventory based on arguments).
    function addItem(key, iLvl){

        //Check if there are slots in the inventory.
        if(gs.plObj.inventory.length < gs.plObj.inventorySlots){

            // console.log(key);

            //Create new item obj
            let newItem = new ItemObj(key, iLvl)

            //If empty equippment slots, equip item automatically.
            if(gs.plObj.equipmentSlots > calcEquippedItems()){
                newItem.equipped = true
            }

            //Add item to the inventory.
            gs.plObj.inventory.push(newItem)

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
        gs.plObj.inventory.forEach(invItem => {
            if(!invItem.equipped || invItem.itemSlot == 'generic') return false
            itemSlots.push(invItem.itemSlot)
        })


        //Equip
        if(
            !item.equipped &&                         //check if equipped
            gs.plObj.equipmentSlots > calcEquippedItems() &&  //check if there are slots
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
        let item = findByProperty(gs.plObj.inventory, 'itemId', itemId)
        
        //Remove item actions
        item.actions.forEach(action => {
            removeFromArr(gs.plObj.actions, action)
        })

        //Remove from inventory
        removeFromArr(gs.plObj.inventory, item)

        syncUi()
    }
    //Sell item (merchant).
    function sellItem(itemId){
        let item = findItemById(itemId)
        
        gs.plObj.coins += item.cost
        
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
        if(gs.plObj.coins < cost){
            showAlert(`You can't afford this. You need <img src="./img/ico/coin.svg"> ${cost - gs.plObj.coins} more.`)
            return false
        }
        else{
            gs.plObj.coins -= cost
            showAlert(`You paid <img src="./img/ico/coin.svg"> ${cost} coins.`)
        }
    }
    //Util: find item by action.
    function findItemByAction(action){
        let itemWihtAction

        gs.plObj.inventory.forEach(item => {

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
            sourceArr = gs.plObj.inventory
        }

        sourceArr.forEach(item => {
            if(item.itemId != itemId) return false
            targetItem = item
        })

        if(targetItem == undefined){
            gs.plObj.offeredItemsArr

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
        if(gs.plObj.treePoints > 0){
            gs.plObj.treeNodes.push(node)// Add skill node to player obj        
            
            resolvePlayerStats()
            syncUi()
        }
    }


//GAME START
    //Checks if LS save exists
    loadGame()

    initGame()

    if(config.testCombat == 1){
        initiateCombat() //Disable if not testing combat
    }
    // el('map').scrollTo(0, 9999); // Sets map position to view unit.