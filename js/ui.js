//UI
    function syncUi(){
        syncActionTiles()
        syncCharPage()
        syncItemCards()
        syncTree()

        //Combat screen: Log stats at the top
        if(gs.inCombat){

            //Top left log
            el('log').innerHTML = `
                Enc: ${gs.encounter}/${gs.playerLocationTile.enemyQuant}<br>
                Ene: lvl ${gs.enObj.level} ${gs.enObj.profile}<br>
                ` 
                // Loc: ${gs.playerLocationTile.tileId}
                // Tur: ${gs.combatTurn}<br>
                // Lvl: ${gs.plObj.lvl} / Exp:${gs.plObj.exp}

            //Enemy floating number
            //gs.enemyAction -> Previous action

            if(gs.enObj.dmgTaken > 0){//Attack
                floatText('en',`-${gs.enObj.dmgTaken} life`)
            }else if(gs.enObj.action.key === 'fortify'){
                floatText('en',`+${gs.enObj.action.stat} def`)
            }else if(gs.enObj.action.key === 'empower'){
                floatText('en',`+${gs.enObj.action.stat} power`)
            }else if(gs.enObj.action.key === 'rush'){
                floatText('en',`+${gs.enObj.action.stat} dice`)
            }else if(gs.enObj.action.key === 'sleep'){
                floatText('en',`Zzzzz`)
            }else if(gs.enObj.action.key === 'block'){
                floatText('en',`Blocked ${gs.enObj.action.stat}`)
            }else if(gs.enObj.action.key === 'recover'){
                floatText('en',`Recovered ${gs.enObj.action.stat} ${gs.enObj.action.actionVal}`)
            }

            gs.enemyAction = []
            
            //Player floating number
            if(gs.plObj.dmgTaken > 0){
                floatText('pl',`-${gs.plObj.dmgTaken} life`)
            }

            //Player stats
            el('p-life').innerHTML  =`${gs.plObj.life}`
            el('p-def').innerHTML   =`${gs.plObj.def}`
            el('p-dice').innerHTML  =`${gs.plObj.roll}<span>/${gs.plObj.dice}</span>`
            el('p-power').innerHTML =`${gs.plObj.power}`        

            //Enemy stats
            el('life').innerHTML    =`${gs.enObj.life}`
            el('def').innerHTML     =`${gs.enObj.def}`
            el('dice').innerHTML    =`${gs.enObj.roll}<span>/${gs.enObj.dice}</span>`
            el('power').innerHTML   =`${gs.enObj.power}`        

            //Enemy intent indicator
            el('intent').innerHTML = `${gs.enObj.action.desc}`
        }

        //Modify map stat indicator
        ['food', 'power','life','coins'].forEach(stat => {
            el(`pl-${stat}`).innerHTML = gs.plObj[stat]
        })

        //Modify inventroy slide heading.
        el('inventorySlideDesc').innerHTML = `
            Inventory capacity: ${gs.plObj.inventory.length} / ${gs.plObj.inventorySlots}<br>
            Equipped items: ${calcEquippedItems()} / ${gs.plObj.equipmentSlots}
        `
    }

    //Manage slider tabs
    function slideTo(screen, sourceElem){
        location.href=`#${screen}`

        //Remove previous tab selection
        clearClassOfAll('active')

        //Set new tab selection
        console.log(sourceElem);
        el(sourceElem.id).classList.add('active')
    }

    //Manage screens.
    function screen(elemId){

        //For target bug
        console.log(`Screen() was triggered by:`, elemId);

        //Removes animation classes to prevent trigger when page is opened.
        clearClassOfAll('stat-float')
        clearClassOfAll('ghost-trigger')

        //Hide everything
        el('map').classList.add('hide')
        el('.screen',        'all').forEach(elem => elem.classList.add('hide')) //screens
        el('.modal',         'all').forEach(elem => elem.classList.add('hide')) //modals
        el('.external-tabs', 'all').forEach(elem => elem.classList.add('hide')) //tabs containers

        //Display appropriate tab container
        if(elemId =='map'){
            el('map-tabs').classList.remove('hide')
        }
        else if(['character','inventory', 'tree'].indexOf(elemId) > -1){

            el('character-tabs').classList.remove('hide')

            //Remove all active classes
            clearClassOfAll('active')

            //Set page button to active
            el(`${elemId}-btn`).classList.add('active')
        }
        else if(['reward-screen','reward-screen-inventory'].indexOf(elemId) > -1){
            el('reward-tabs').classList.remove('hide')   
        }
        else if(['merchant','merchant-sell'].indexOf(elemId) > -1){
            el('merchant-tabs').classList.remove('hide')
        }
        else if(['blacksmith','blacksmith-repair'].indexOf(elemId) > -1){
            el('blacksmith-tabs').classList.remove('hide')
        }

        //Show page
        el(elemId).classList.remove('hide') 
    }


//CHARACTER
    function syncCharPage(){
    
        //Add text
        el('stat-block').innerHTML =`
            <section>
                <div class='stat'>
                    <img src="./img/ico/life.svg">
                    <p>Life: ${gs.plObj.life} / ${gs.plObj.flatLife}</p>
                </div>

                <div class='stat'>
                    <img src="./img/ico/dice.svg">
                    <p>Dice: d${gs.plObj.flatDice}</p>
                </div>

                <div class='stat'>
                    <img src="./img/ico/power.svg">
                    <p>Power: ${gs.plObj.power}</p>
                </div>

                <div class='stat'>
                    <img src="./img/ico/def.svg">
                    <p>Def: ${gs.plObj.def}</p>
                </div>
            </section>

            <section>
                <div class='stat'>
                    <img src="./img/ico/fish.svg">
                    <p>Food: ${gs.plObj.food}</p>
                </div>
                
                <div class='stat'>
                    <img src="./img/ico/slots.svg">
                    <p>Equipment: ${calcEquippedItems()}/${gs.plObj.equipmentSlots}</p>
                </div>
                
                <div class='stat'>
                    <img src="./img/ico/coin-sm.svg">
                    <p>Coins: ${gs.plObj.coins}</p>
                </div>     
                
                <div class='stat'>
                    <img src="./img/ico/placeholder.svg">
                    <p>Inventory: ${gs.plObj.inventory.length}/${gs.plObj.inventorySlots}</p>
                </div>    
            </section>
                
            <section>
                <div class='stat'>
                    <img src="./img/ico/placeholder.svg">
                    <p>Level: ${gs.plObj.lvl}</p>
                </div>

                <div class='stat'>
                    <img src="./img/ico/placeholder.svg">
                    <p>Exp: ${gs.plObj.exp}</p>
                </div>

                <div class='stat'>
                    <img src="./img/ico/placeholder.svg">
                    <p>Sill points:  ${gs.plObj.treePoints}/${gs.plObj.treePoints + gs.plObj.treeNodes.length}</p>
                </div>

                <div class='stat'>
                    <img src="./img/ico/placeholder.svg">
                    <p>Next lvl exp:  ${gs.plObj.lvlUpExp}</p>
                </div>

                <div class='stat'>
                    <img src="./img/ico/placeholder.svg">
                    <p>World stage:  ${gs.stage}</p>
                </div>
            </section>
        `

        //Add action cards
        el('action-list').innerHTML = ``
        el('passive-list').innerHTML = ``

        gs.plObj.actions.forEach(action => {
            if(action.actionType != 'passive'){
                el('action-list').append(genActionCard(action, 'card'))
            } else {
                el('passive-list').append(genActionCard(action, 'card'))
            }         
        })

    }


//COMBAT
    //Animation
    function floatText(target, string){

        // if(target === 'en'){
        //     el('enDmgInd').innerHTML = string
        //     runAnim(el('enDmgInd'), 'float-num')
        // }
        // else{
        //     el('plDmgInd').innerHTML = string
        //     runAnim(el('plDmgInd'), 'float-num')
        // }

        // //if positive -> text green etc
        // if(string[0] === '-'){
        //     el('enDmgInd').setAttribute('style', 'color:red;')
        //     el('plDmgInd').setAttribute('style', 'color:red;')
        // }
        // else{
        //     el('enDmgInd').setAttribute('style', 'color:white;')
        //     el('plDmgInd').setAttribute('style', 'color:white;')
        // }
    }

    //Sprite builder
    function spriteBuilder(target){
        if(target === 'player'){
            el('player-sprite').innerHTML = `
                <img src="./img/character/shade.svg">
                <img src="./img/character/${rng(3,1)}-back.svg">
                <img src="./img/character/${rng(3,1)}-back-arm.svg">
                <img src="./img/character/${rng(4,1)}-legs.svg">
                <img src="./img/character/${rng(4,1)}-torso.svg">
                <img src="./img/character/${rng(3,1)}-front-arm.svg">
                <img src="./img/character/${rng(4,1)}-head.svg">
                <img id='p-ghost' src="">
            `
        }
        else if(target === 'enemy'){
            if(rng(4) == 99){
                el('enemy-sprite').innerHTML = `
                    <img src="./img/character/shade.svg">
                    <img src="./img/enemy/boss/${rng(2,1)}.svg">
                ` 
            }
            else{
                el('enemy-sprite').innerHTML = ` 
                    <img src="./img/character/shade.svg">
                    <img src="./img/enemy/balanced/${rng(3,1)}-back-arm.svg">
                    <img src="./img/enemy/balanced/${rng(2,1)}-legs.svg">
                    <img src="./img/enemy/balanced/${rng(2,1)}-torso.svg">
                    <img src="./img/enemy/balanced/${rng(3,1)}-front-arm.svg">
                    <img src="./img/enemy/balanced/${rng(5,1)}-head.svg">
                    <img id='e-ghost' src="">
                ` 
            }
        }
    }
    //ACTIONS
        //Gen action set
        function syncActionTiles(){
            el('cards-row').innerHTML = ''

            //Set #cards-row width to display cards in two rows.
            // el('cards-row').setAttribute('style',`width:${149 * (Math.floor(gs.plObj.actions.length/2) + 1)}px;`)
            
            //Add button per player item
            gs.plObj.actions.forEach(action => {
                if(action.actionType == 'passive') return //Skip passives
                let actionCard = genActionCard(action)
                el('cards-row').append(actionCard)
            })

            //Add empty item slots
                // let emptySlots = gs.plObj.actionSlots - gs.plObj.actions.length
                // let button = document.createElement('button')
                // button.innerHTML = `[ ]x${emptySlots}`
                // button.disabled = true
                // button.classList.add('action', 'empty-slot')
                // el('cards-row').append(button)    
        }

        //Gen action card
        function genActionCard(action, type){

            //Section that contains name and desc.
            let content = document.createElement('section')  

            //Find action in actionsRef
            let referenceAction = findByProperty(actionsRef, 'keyId', action.keyId);

            //Create button elem.
            let button = document.createElement('button')
            if(type != 'card'){
                button.setAttribute('onclick', `turnCalc(this)`) // On click run next turn
            }

            //Add a unique id.
            button.setAttribute('actionId', action.actionId)       
            button.classList.add('action')
            
            
            //Updates button labels based on actions
            //Modifies 'content' section
            button.append(content) //Add content section to button

            //!!! REPACE WITH keyID

            //Card item image
            let itemString = findItemByAction(action).itemName
            if(itemString.includes('scroll')){
                itemString = 'magic scroll'
            }
            else if(itemString.includes('curse')){
                itemString = 'curse scroll'
            }

            //Cooldonw management.
            let cooldownCounter = ``

            //If action is on cooldown disable the button.
            if(typeof action.cooldown != 'undefined' && action.cooldown < referenceAction.cooldown){
                cooldownCounter = `<p class='cooldown-indicator'>Recharge: ${referenceAction.cooldown - action.cooldown} turn(s)</p>` 
                button.disabled = true
            }


            let heading = `${upp(action.actionName)}`

            if(type != 'card'){//Remove numbers if generated for character page.
                if      (['block'].indexOf(referenceAction.actionName) > -1){
                    heading = `${upp(action.actionName)} ${gs.plObj.roll}`
                }else if(['bow attack'].indexOf(referenceAction.actionName) > -1){
                    heading = `${upp(action.actionName)} for ${gs.plObj.roll + gs.plObj.power}`
                }else if(['sword attack'].indexOf(referenceAction.actionName) > -1){
                    heading = `${upp(action.actionName)} (${3 + gs.plObj.power}+${gs.plObj.swordDmgMod})`
                }else if(['inferno'].indexOf(referenceAction.actionName) > -1){
                    heading = `${upp(action.actionName)} (${gs.plObj.power * gs.plObj.coins} dmg)`
                }
            }

            button.querySelector('section').innerHTML = `
                <span>
                    <h3>${heading}</h3> 
                    <p class="charge-indicator">x${action.actionCharge}</p>
                    ${cooldownCounter}
                </span>
                <p class='desc'>${upp(action.desc)}.</p>
                <img src="./img/items/${itemString}.svg">
            `
            return button
        }


//MISC
    //Game state screen
    function openStateScreen(type){
        //Victory
        if     (type == 'completed'){
            el('state-screen').innerHTML = `
                <div class="modal-container"> 
                    <img id="end-img" src="./img/bg/victory.svg" alt="" class="illustration">

                    <ul>
                        <li>Completed stage ${gs.stage}.</li>
                        <li>Survived for ${gs.turnCounter} turn(s).</li> 
                        <li>Defeated ${gs.enemyCounter} enemies.</li>
                    </ul>

                    <p class="body-14 italic b50">Tap to continue</p>

                </div>`
            
            el('state-screen').setAttribute('onclick', "saveGame(), initGame(), screen('map')")
        }
        //Starvation
        else if(type == 'starved'){
            el('state-screen').innerHTML = `
                <div class="modal-container"> 

                    <img id="end-img" src="./img/bg/starvation.svg" alt="" class="illustration">
                    
                    <ul>
                        <li>Reached stage ${gs.stage}.</li>
                        <li>Survived ${gs.turnCounter} turn(s).</li> 
                        <li>Defeated ${gs.enemyCounter}/${gs.totalEnemies} enemies.</li>
                    </ul>

                    <p class="body-14 italic b50">Tap to restart</p>
                </div>`
            
            el('state-screen').setAttribute('onclick', "location.reload()")
        }
        //Combat death
        else if(type == 'game-end'){
            el('state-screen').innerHTML = `
                <div class="modal-container"> 

                    <img id="end-img" src="./img/bg/end.svg" alt="" class="illustration">

                    <ul>
                        <li>Reached stage ${gs.stage}.</li>
                        <li>Survived for ${gs.turnCounter} turn(s).</li> 
                        <li>Defeated ${gs.enemyCounter} enemies.</li>
                    </ul>

                    <p class="body-14 italic b50">Tap to restart</p>
                </div>`
            
            el('state-screen').setAttribute('onclick', "location.reload()")
        }  

        screen('state-screen')    
    }
    //Alert
    let alertTimer
    function showAlert(note){
        el('alert-note').innerHTML = note
        el('alert').classList.remove('hide')

        clearTimeout(alertTimer)
        alertTimer = setTimeout(() => {el('alert').classList.add('hide')}, 5000)
    }