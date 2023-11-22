//INITITATE GAME
    function initGame(){

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
        // genTabs()              //merge ui
        spriteBuilder('player')//create player sprite

        resolvePlayerStats()
        syncUi()
    }

//INITITATE COMBAT
    function initiateCombat(){
        //Log to debug the combat issue
        console.log('Combat initiated.');

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

        
        //4. Reset flat stats
            resetFlatStats()

        //Check if player has a weapon
            checkIfPlayerCanAttack()

        //Reset once per combat passives
            gs.plObj.treeNodes.forEach(node => {
                node.activated = false
            }) 

        //5.Roll player dice. Roll after stats if dice will be changed.
            gs.plObj.roll = rng(gs.plObj.dice)
            //PASSIVE: post roll passives.
            resolvePostRollPassives()

        //6.syncUI() will generate action cards that will trigger turnCalc().
            syncUi()

            //6.1 Update the background
            if(gs.encounter == 1){
                el('combat-bg').setAttribute('src',`./img/bg/combat-${rng(config.bgCounter)}.svg`)
            }

        //7.Open combat screen
            screen("combat")
    }

    //1.TURN CALC
        function turnCalc(buttonElem){
            
            //Set random ghost images
            el('p-ghost').setAttribute('src',`./img/character/ghost-${rng(4)}.svg`)
            el('e-ghost').setAttribute('src',`./img/character/ghost-${rng(4)}.svg`)

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
            let paKey = gs.sourceAction.keyId

            //LOGIC: player
            if      (paKey =='a1' ){// mace

                gs.plObj.dmgDone += actionMod + gs.plObj.power
    
                if(gs.plObj.roll === 4){
                    gs.plObj.def += 1
    
                    gs.logMsg.push('Mace: +1 def.')
                }
    
                gs.logMsg.push(`Mace: deals ${actionMod + gs.plObj.power} dmg.`)
    
            }else if(paKey =='a2' ){// 'armor break' 'hammer'

                //Get reduction value
                let defReduction = gs.plObj.def
                if(defReduction < 1){defReduction = 0}

                //Resolve stat change
                changeStat('def', -defReduction, 'enemy') 
                changeStat('def', -1, 'player') 

                //Log
                gs.logMsg.push(`Hammer attack: reduced enemy def by ${defReduction}.`)
    
            }else if(paKey =='a3' ){// Spell: shards "book of moon" 
    
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
    
            }else if(paKey =='a4' ){// dagger pair 
    
                gs.plObj.dmgDone += (actionMod + gs.plObj.power) * 2 
                gs.logMsg.push('Dagger pair attack.')
    
            }else if(paKey =='a5' ){// bow
    
                gs.plObj.dmgDone += gs.plObj.roll + gs.plObj.power
    
            }else if(paKey =='a6' ){// EX: cut 'dagger'

                //Action cost check
                if(gs.plObj.roll < 3) return showAlert('Action requires roll greater than 2.')
                
                //Resolve stat change
                changeStat('roll', -3, 'player') 

                //Damage
                gs.plObj.dmgDone = gs.sourceAction.actionMod + gs.plObj.power 

                //Combat log
                gs.logMsg.push('Attacked with dagger as extra action.')
                
            }else if(paKey =='a7' ){// sword attack 
    
                gs.plObj.dmgDone += gs.sourceAction.actionMod + gs.plObj.power + gs.plObj.swordDmgMod

                if(gs.plObj.roll == 5 || gs.plObj.roll == 6){
                    gs.plObj.swordDmgMod += 1
                }

                //Log
                gs.logMsg.push(`Sword: dealt ${gs.plObj.power} dmg.`)
    
            }else if(paKey =='a8' ){// "axe" 
    
                let maxLife = gs.plObj.life //Deal with overcap life
    
                if(gs.plObj.flatLife > gs.plObj.life){
                    maxLife = gs.plObj.flatLife
                }
    
                gs.plObj.life -= 5
    
                gs.plObj.dmgDone += gs.plObj.flatLife - gs.plObj.life + gs.plObj.power
    
            }else if(paKey =='a9' ){// SP/EX: ice lance "book of ice"

                //Action cost
                if(gs.plObj.power < 1) return showAlert('Not enough power to pay for action cost.')

                //Resolve stat change
                changeStat('power', -1, 'player') 
   
                //Dmg
                gs.plObj.dmgDone += gs.plObj.power

                //Log
                gs.logMsg.push(`Ice lance: dealt ${gs.plObj.power} dmg.`)
    
            }else if(paKey =='a10'){// EX: backstab "iron dagger"
    
                //Resolve action cost
                if(gs.plObj.roll < 5) return showAlert('Action requires roll greater than 5.')
                
                // else if(gs.plObj.roll < 5 && gs.plObj.actions.length === 1){
                //     showAlert('You had no resources to perform your only action, your turn was skipped.');
                // } 
    
                gs.plObj.roll -= 5
                gs.plObj.dmgDone = gs.sourceAction.actionMod + gs.plObj.power
                gs.plObj.power += 1
    
            }
             else if(paKey =='a11'){// SP: lightning "book of lightning"
    
                //Action cost
                if(gs.plObj.power < 2) return showAlert('Not enough power to pay for action cost.')

                //Resolve stat change
                changeStat('power', -2, 'player') 

                //Dmg
                let dmgVal = rng(20) + gs.plObj.power
                gs.plObj.dmgDone += dmgVal

                //Log
                gs.logMsg.push(`Lightning: dealt ${dmgVal} dmg.`)
    
            }else if(paKey =='a12'){// shield bash
    
                //Dmg
                gs.plObj.dmgDone += gs.plObj.def * gs.plObj.power

                //Log
                gs.logMsg.push(`Shield bash: dealt ${gs.plObj.def * gs.plObj.power} dmg.`)
    
            }else if(paKey =='a13'){// SP: fireball  "book of fire"
    
                //Dmg
                gs.plObj.dmgDone += actionMod + gs.plObj.power

                //Log
                gs.logMsg.push(`Fireball: dealt ${actionMod + gs.plObj.power} dmg.`)
    
            }else if(paKey =='a14'){// SP: pyroblast "book of fire"
    
                //Action cost
                if(gs.plObj.power < 1) return showAlert('Not enough power to pay for action cost.')

                //Resolve stat change
                changeStat('power', -1, 'player') 
    
                //Dmg
                gs.plObj.dmgDone += gs.plObj.power * gs.plObj.roll

                //Log
                gs.logMsg.push(`Pyroblast: dealt ${gs.plObj.power * gs.plObj.roll} dmg.`)

            }else if(paKey =='a15'){// quick block "tower shield"
    
                gs.enObj.dmgDone -= actionMod - gs.plObj.dice
    
            }else if(paKey =='a16'){// barrier
                
                gs.plObj.protection = ['Barrier']
                gs.sourceAction.cooldown = 0
    
            }else if(paKey =='a18'){// preparation "boots" (keep 50% of roll)
    
                //Value
                gs.plObj.rollBonus += Math.ceil(gs.plObj.roll * 0.5)

                //Log
                gs.logMsg.push(`Preparation: saved ${Math.ceil(gs.plObj.roll * 0.5)} roll points.`)
    
            }else if(paKey =='a19'){// reroll
    
                //Val
                gs.plObj.roll = rng(gs.plObj.dice)

                //PASSIVE: check for on-roll passives.
                resolvePostRollPassives()
    
            }else if(paKey =="a20"){// "scroll of repetition"

                //Restores charge to all items
                gs.plObj.inventory.forEach(item => {
                    item.actions.forEach(action => {
                        if(action.paKeyId !== 'a20'){
                            action.actionCharge += gs.sourceAction.actionMod
                        }
                    })
                })

            }else if(paKey =='a21'){// "curse of weakness"
    
                //Resolve stat change
                changeStat('power', -actionMod, 'enemy')
    
            } 
             else if(paKey =='a22'){// (ene def-) wounds

                //Resolve stat change
                changeStat('def', -actionMod, 'enemy')
    
            }else if(paKey =='a23'){// (ene -dice) "curse of chain"
    
                //Resolve stat change
                changeStat('dice', -actionMod, 'enemy')
    
            }else if(paKey =='a24'){// (ene roll-) slowness "curse of slowness"
    
                //Resolve stat change
                changeStat('roll', -actionMod, 'enemy')
    
            }else if(paKey =='a25'){// stun "chain"
    
                if(gs.plObj.roll != 1) return showAlert('Action requires roll 1.')

                gs.enObj.state = 'Skip turn'
     
            }else if(paKey =='a47'){// stun: smoke bomb
    
                if(['attack', 'combo', 'final strike', 'charged strike'].indexOf(gs.enObj.action.paKey) > -1) showAlert(`Smoke bomb failed vs attack.`)
                gs.enObj.state = 'Skip turn'
                
            }else if(paKey =='a26'){// SP: freeze (stun spell) "book of ice"

                //Action cost
                if(gs.plObj.power < 1) return showAlert('Not enough power to pay for action cost.')

                //Resolve stat change
                changeStat('power', -1, 'player') 
    
                gs.enObj.state = 'Skip turn'
    
            }else if(paKey =='a31'){// RING: defence charge !!! see if resolving stats at this point will cause issues. Required due to def behaviour
    
                // gs.plObj.def -= actionMod
                resolveCharge(gs.sourceAction)
                resolvePlayerStats()
    
            }else if(paKey =='a33'){// healing potion
                
                //Heal value
                gs.lifeRestoredByPlayer += Math.round((gs.plObj.flatLife - gs.plObj.life) / 100 * actionMod)

                //Log
                gs.logMsg.push(`Heling potion: +${gs.lifeRestoredByPlayer}  life.`)  
                 
            }else if(paKey =='a61'){// bandages
                
                //Heal value
                gs.lifeRestoredByPlayer += actionMod

                //Log
                gs.logMsg.push(`Bandages: +${actionMod}  life.`)  
                 
            }else if(paKey =='a34'){// (def+) fortification

                //Resolve stat change
                changeStat('def', actionMod, 'player')
    
            }
             else if(paKey =='a35'){// dodge % evasion "leather cape"
    
                let dodgePercent = gs.plObj.roll * actionMod
                let dodgeRoll = rng(100)
    
                if(dodgeRoll < dodgePercent){
                    gs.enObj.dmgDone = -99999 // add something better for dodge later
                }
    
            }else if(paKey =='a37'){// SP: buff next attack with piercing "leather gloves"

                //Action cost
                if(gs.plObj.power < 1) return showAlert('Not enough power to pay for action cost.')

                //Resolve stat change
                changeStat('power', -1, 'player') 
    
                gs.plObj.piercing = true
                gs.sourceAction.cooldown = 0

            }else if(paKey =='a38'){// static "cape"
    
                if(gs.plObj.roll < 8) return showAlert('This action requires roll greater than 8.')
    
                //Resolve stat change
                changeStat('power', 2, 'player')
                    
            }else if(paKey =='a39'){// sprint "woolen boots"

                //Resolve stat change
                changeStat('roll', 2, 'player')
    
            }else if(paKey =='a40'){// water potion "water potion"

                //Resolve stat change
                changeStat('power', actionMod, 'player')
    
            }else if(paKey =='a41'){// poison
                
                //Marker
                gs.plObj.poisonBuff = true

                //Log
                gs.logMsg.push('Applied poison to weapons.<br>')
    
            }else if(paKey =='a42'){// 'block' 'shield'
    
                gs.enObj.dmgDone -= gs.plObj.roll

                //Log
                gs.logMsg.push(`Blocked ${gs.plObj.roll} dmg.`)
    
            }else if(paKey =='a44'){// "restoration" "scroll of restoration"

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
    
            }else if(paKey =='a45'){// club attack
    
                gs.plObj.dmgDone += 3 + gs.plObj.power

                //Log
                gs.logMsg.push(`Club: dealt ${gs.plObj.power} dmg.`)
    
            }else if(paKey =='a48'){// "focus" "wooden staff"

                //Resolve stat change
                changeStat('power', Math.floor(1 * gs.plObj.roll / 4), 'player')
    
            }
             else if(paKey =='a49'){// zealotry
    
                //Resolve stat change
                changeStat('power', gs.plObj.roll, 'player')
                changeStat('def', -gs.plObj.roll, 'player')
    
            }else if(paKey =='a50'){// defensive stance
            
                //Resolve stat change
                changeStat('roll', -1, 'player')
                
                gs.sourceAction.cooldown = 0
     
            }else if(paKey =='a52'){// hook/swap
            
                let rollRef = gs.plObj.roll
                gs.plObj.roll = gs.enObj.roll
                gs.enObj.roll = rollRef
    
                //Log
                gs.logMsg.push(`rolls swapped (Result: P${gs.plObj.roll}/E${gs.enObj.roll})`)
    
                //RECALC ENEMY INTENDED ACTION: if player mods roll or power as extra action.
                recalcEneAction()
            }else if(paKey =='a53'){// "transmute" "alchemists paKey"
                
                //Condition check
                if(gs.plObj.roll != 1 && gs.plObj.roll != 2) return showAlert('Transmute requires roll 1 or 2.')
    
                //Stat mod
                gs.plObj.coins += gs.plObj.roll
                
                //Log
                gs.logMsg.push(`transmute: added ${gs.plObj.roll} coins`)
    
            }else if(paKey =='a54'){// "inferno" "scroll of inferno"
    
                //Dmg
                gs.plObj.dmgDone += gs.plObj.power * gs.plObj.coins
    
                //Log
                gs.logMsg.push(`inferno: dealt ${gs.plObj.coins} dmg, and consued ${gs.plObj.coins} coins`)
    
                //Cost
                gs.plObj.coins = 0
    
            }else if(paKey =='a55'){// "fear" "wizards head"

                //Marker
                gs.enObj.state = 'fear'
                gs.sourceAction.cooldown = 0
                
                //Set variable cooldown.  
                let referenceActionObj = findByProperty(actionsRef, 'keyId', gs.sourceAction.keyId) //Find action reference
                referenceActionObj.cooldown = rng(4,2)

                //Log
                gs.logMsg.push(`fear: enamy will block during the next turn (fear reacharge:${referenceActionObj.cooldown})`)

            }else if(paKey =='a57'){// "heal" "book of order"

                //Cost
                if(gs.plObj.power < 0) return showAlert('Not enough power to pay for action cost.')
                
                //Resolve stat change
                changeStat('power', -1, 'player') 

                gs.lifeRestoredByPlayer += actionMod + gs.plObj.power + gs.plObj.def
                
                //Log
                gs.logMsg.push(`heal: +${gs.lifeRestoredByPlayer} life, -1 power.`)
                
            }else if(paKey =='a60'){// heavy block "towerbuckler"
    
                gs.enObj.dmgDone -= gs.plObj.def * (actionMod/100) 

                //Log
                gs.logMsg.push(`Hevy block: blocked ${gs.plObj.def * (actionMod/100)} dmg.`)
    
            }else if(paKey =='a62'){// punch

                //Calc
                gs.plObj.dmgDone += actionMod + gs.plObj.power
    
                //Log
                gs.logMsg.push(`${gs.sourceAction.actionName}: deals ${actionMod + gs.plObj.power} dmg.`)
    
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
                
                //PASSIVES CHEC: oh-hit passies
                resolveOnHitPassives()

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
                    gs.enObj.dmgDone -= gs.plObj.def

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
            //On death passives
            if(gs.plObj.life < 1){
                resolveOnDeathPassives()
            }
            if(gs.plObj.life < 1 || gs.plObj.actions.length < 1){
                clearSavedGame()
                openStateScreen('game-end')
            }
            // VICTORY.
            else if (gs.enObj.life < 1){

                //End game screen stat counter
                gs.enemyCounter++

                //Add exerience and recalculate level
                resolveExpAndLvl()

                //End encounter
                if(gs.encounter == gs.playerLocationTile.enemyQuant){

                    gs.encounter = 'end'

                    //PASSIVES CHECK: end of encounter
                    resolveEndOfCombatPassives()

                    //Lock screen
                    document.body.classList.add('lock-actions', 'darken')
    
                    //Run gen reward after delay
                    window.setTimeout(
                        function(){
    
                            //Open reward screen
                            genRewards(gs.flatItemReward + gs.playerLocationTile.enemyQuant)
    
                            //Unlock screen
                            document.body.classList.remove('lock-actions', 'darken')
    
                            //Reset flat stats
                            resetFlatStats()
                        },
                        1000
                    )
                }
                //Next fight
                else{
                    gs.encounter++ 

                    initiateCombat()
                    runAnim(el('enemy-sprite'), 'enemyEntrance') 
                }     
            }
            // NEXT TURN.
            else if (gs.sourceAction.actionType !== "extra-action" || gs.plObj.roll < 1){
                //Check if player can attack
                checkIfPlayerCanAttack()

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

            // toggleModal('reward-screen')         
            screen('reward-screen')        
        }

    //* COMBAT MISC
        function resetFlatStats(){
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
        }
    

//GAME START
    //Checks if LS save exists
    loadGame()
    initGame()

    //Configs for testing
    if(config.testCombat == true){
        initiateCombat() //Disable if not testing combat

        el('map').classList.add('hide')
    }

    if(config.clearLs == true){
        localStorage.clear();
        console.log('Local storage cleared.');
    }

    if(config.showScreen != false){
        screen(config.showScreen)
    }
    // el('map').scrollTo(0, 9999); // Sets map position to view unit.