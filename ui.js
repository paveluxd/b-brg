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

        el('map-desc').innerHTML = `Stage ${gs.stage}`

        //Modify inventroy slide heading.
        el('inventorySlideDesc').innerHTML = `
            Inventory capacity: ${gs.plObj.inventory.length} / ${gs.plObj.inventorySlots}<br>
            Equipped items: ${calcEquippedItems()} / ${gs.plObj.equipmentSlots}
        `
    }

    //Gen tabs
    function genTabs(){

        //Clear tabs
        el('tab-container').innerHTML = `
            <div id="stat-indicator">
                <p id="map-desc"></p>
            
                <div>
                    <img src='./img/ico/fish.svg'>
                    <p id='pl-food' class="mono-m">${gs.plObj.food}</p>
                </div>
                <div>
                    <img src='./img/ico/power.svg'>
                    <p id='pl-power' class="mono-m">${gs.plObj.power}</p>
                </div>
                <div>
                    <img src='./img/ico/life.svg'>
                    <p id='pl-life' class="mono-m">${gs.plObj.life}</p>
                </div>
                <div>
                    <img src='./img/ico/coin.svg'>
                    <p id='pl-coins' class="mono-m">${gs.plObj.coins}</p>
                </div>
            </div>
        `

        //Add hidden close button
        let tab = document.createElement('button')
        tab.setAttribute('onclick', `screen('combat', this, "overlay")`)
        tab.classList.add('hide')
        tab.innerHTML = `<img src="./img/ico/tab-hide.svg">Hide`
        tab.id = 'close-tab'
        el('tab-container').append(tab)

        let screens = [
            ['map','map-tab'], 
            ['character', 'character-tab'], 
            ['inventory','inventory-tab'],
            ['tree','tree-tab']
        ]

        //Gen map tabs
        screens.forEach(elem => {
            let tab = document.createElement('button')
            tab.setAttribute('onclick',`screen('${elem[0]}')`)

            tab.innerHTML = `<img src="./img/ico/${elem[0]}.svg">${upp(elem[0])}`
            tab.id = `${elem[0]}-tab`

            el('tab-container').append(tab)
        })
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
        el('.screen', 'all').forEach(elem => elem.classList.add('hide'));//screens
        el('.modal', 'all').forEach(elem => elem.classList.add('hide')); //modals
        el('.external-tabs', 'all').forEach(elem => elem.classList.add('hide'));  //tabs containers
        

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

        else if(elemId == 'reward-screen'){

            el('reward-tabs').classList.remove('hide')   
            
            //Remove all active classes
            clearClassOfAll('active')

            //Set page button to active
            el(`rw-rewards-btn`).classList.add('active')

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


//INVENTORY
    //Move item card generation to a separate function
    function syncItemCards(){
        
        //Set inventory heading
        el('inventory-heading').innerHTML = `Inventory ${gs.plObj.inventory.length}/${gs.plObj.inventorySlots}`
        
        //Sync inventory
        el('inventory-list').innerHTML = ''
        gs.plObj.inventory.forEach(item => {
            el('inventory-list').append(genItemCard(item))
        })

        //Sync market 
        el('items-to-sell').innerHTML = ``
        gs.plObj.inventory.forEach(item => {
            el('items-to-sell').append(genItemCard(item, 'item-to-sell'))
        })

        //Sync blacksmith
        el('items-to-enhance').innerHTML = ``
        gs.plObj.inventory.forEach(item => {
            el('items-to-enhance').append(genItemCard(item, 'item-to-enhance'))
        })
        el('items-to-repair').innerHTML = ``
        gs.plObj.inventory.forEach(item => {
            el('items-to-repair').append(genItemCard(item, 'item-to-repair'))
        })
    }

    //Gen item card
    function genItemCard(item, type){
        //Creates card container
            let card = document.createElement('div')
            card.classList.add('item-card', 'body-12')
            let cardId = item.itemId

            //Top container on click
            let                   clickAttr =`onclick="toggleModal('item-modal'), genItemModal('${item.itemId}')"`
            if(type === 'reward'){clickAttr =`onclick="toggleModal('item-modal'), genItemModal('${item.itemId}', 'reward')"`}

            //Image key
            let                                imgKey = item.itemName
            if     (imgKey.includes('scroll')){imgKey = 'magic scroll'} //scroll
            else if(imgKey.includes('curse') ){imgKey = 'curse scroll'} //curse

            //Item type
            let itemSlot = ``
            if(item.itemSlot !== 'generic'){itemSlot = ` (${item.itemSlot})`}

            //Added actions
            let actionSet = ``
            item.actions.forEach(action =>{
                if(action.actionType == 'passive'){
                    actionSet += `<p>${upp(action.desc)} (passive).</p>`
                }
                else {
                    actionSet += `<p>${upp(action.actionName)} (x${action.actionCharge}) - ${upp(action.desc)}.</p>`
                }
            }) 

            //Passive stats
            let passiveSet = ``
            item.passiveStats.forEach(stat =>{
                passiveSet += `<div><img src="./img/ico/${stat.stat}.svg"> ${stat.value}</div>`
            })

            //Btns
            let btn1 = `<button class="drop-button body-12" onclick="removeItem('${item.itemId}'), this.remove()">
                            <img src="./img/ico/item-x.svg"> <p>Drop</p>
                        </button>`

            let btn2 = `<button class="equip-button body-12" onclick="equipItem('${item.itemId}'), this.classList.toggle('equipped')">
                            <p>Equip</p> <img src="./img/ico/item-equip-no.svg">
                        </button>`

            if(type === 'reward'){
                // btn1 = `<button class="drop-button body-12" onclick="toggleModal('item-modal'), genItemModal('${item.itemId}', 'reward')">
                //             <img src="./img/ico/item-view.svg"> <p>View</p>
                //         </button>`

                btn2 = `<button class="equip-button body-12" onclick="resolveChoosingOfferedItem('${item.itemId}', 'reward'), screen('map')">
                            <p>Pick</p> <img src="./img/ico/item-pick.svg">
                        </button>`
            }
            else if(type == 'item-to-buy'){
                // btn1 = `<button class="drop-button body-12" onclick="toggleModal('item-modal'), genItemModal('${item.itemId}', 'reward')">
                //             <img src="./img/ico/item-view.svg"> <p>View</p>
                //         </button>`

                btn2 = `<button class="equip-button body-12" onclick="resolveChoosingOfferedItem('${item.itemId}', 'purchase')">
                            <p>Buy for ${item.cost}</p> <img src="./img/ico/coin.svg">
                        </button>`
            }
            else if(type == 'item-to-sell'){
                btn2 = `<button class="drop-button body-12" onclick="sellItem('${item.itemId}')">
                            <p>Sell for ${item.cost}</p> <img src="./img/ico/coin.svg">
                        </button>`

                // btn1 = `<button class="equip-button body-12" onclick="equipItem('${item.itemId}'),  this.classList.toggle('equipped')">
                //             <p>Equip</p> <img src="./img/ico/item-equip-no.svg">
                //         </button>`
                cardId += '-to-sell'//Adjust id to avoid conflicts
            }
            else if(type == 'item-to-enhance'){
                btn1 = ``

                btn2 = `<button class="equip-button body-12" onclick="modifyItem('${item.itemId}', 'enhance')">
                            <p>Enhance for ${calcCost('enhance', item.itemId)}</p> <img src="./img/ico/coin.svg">
                        </button>`
                cardId += '-to-enhance'//Adjust id to avoid conflicts
            }
            else if(type == 'item-to-repair'){
                btn2 = `<button class="equip-button body-12" onclick="modifyItem('${item.itemId}', 'repair')">
                            <p>Repair for ${calcCost('repair', item.itemId)}</p> <img src="./img/ico/coin.svg">
                        </button>`
                cardId += '-to-repair'//Adjust id to avoid conflicts
            }

            //Update equip state for inventory item
            if(['item-to-enhance', 'item-to-repair', 'item-to-sell'].indexOf(type) > -1 == false){
                if(item.equipped){ 
                    btn2 = `<button class="equip-button body-12 equipped" onclick="equipItem('${item.itemId}'), this.classList.toggle('equipped')">
                                <p>Equip</p> <img src="./img/ico/item-equip-yes.svg">
                            </button>`
                }
            }

            card.id = cardId //has to be here, if declared aboce, it will bind html elemnts with the same id (inventory and market)
            card.innerHTML =`
                                <div class="top-container" ${clickAttr}>
                                   
                                    
                                    <h3>${upp(item.itemName)}${itemSlot}</h3>
                                    ${actionSet}
                                

                                    <div class="passive-container">${passiveSet}</div>
                                </div>
                                
                                <div class="bottom-container">
                                    <img src="./img/items/${imgKey}.svg">
                                    
                                    ${btn2}
                                </div>`

            return card
    }

    //Item details modal
    function genItemModal(itemId, source){
        let itemModal = el('item-modal')

        //Find item object
        let itemObj = findByProperty(gs.plObj.inventory, 'itemId', itemId)

        //Search reward pool if reward
        if(source === 'reward'){
            itemObj = findByProperty(gs.plObj.offeredItemsArr, 'itemId', itemId)
        }

        //Get actions
        let actionSet = ``

        if(itemObj.actions.length > 0){
            actionSet = `
                <br><br>
                <h3>Adds actions</h3>
            `
            itemObj.actions.forEach(action => {
                actionSet += `
                    <div class="action-ref">
                        <h3>${upp(action.actionName)} (x${action.actionCharge})</h3>
                        <p>${upp(action.desc)}.</p>
                    </div>
                `
            })
        }

        //Get passives
        let passiveSet = ``

        if(itemObj.passiveStats.length > 0){
            passiveSet = `
                <br><br>
                <h3>Passive stat mods</h3>
            `
            itemObj.passiveStats.forEach(passive => {
                passiveSet += `
                    <div class="stat">
                        <img src=./img/ico/${passive.stat}.svg> 
                        ${upp(passive.stat)}: ${passive.value}
                    </div>`
            })
        }


        //Gen button
        let btn = `
            <button  onclick="removeItem('${itemId}'), toggleModal('item-modal')">
                <img src="./img/ico/unequip.svg">
                Destroy item
            </button>
        `

        //Swap button if reward
        if(source === 'reward'){
            btn = `
            <button onclick="removeItem('${itemId}'), toggleModal('item-modal')">
                <img src="./img/ico/equip.svg">
                Pick item
            </button>
            `
        }

        itemModal.innerHTML = `
            <div id="item-modal-tabs" class="tab-container">

                
                ${btn}
        
                <button onclick="toggleModal('item-modal')">
                    <img src="./img/ico/tab-hide.svg">
                    Close
                </button>
            </div>

            <div class="modal-container tab-margin">
                <img class="item-img" src="./img/items/${itemObj.itemName}.svg">
                <h2>${upp(itemObj.itemName)}</h2>

                <br>
                Item type: ${upp(itemObj.itemSlot)}

                ${actionSet}
                ${passiveSet}
            </div>
        `
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
                        <li>Reached stage ${gs.stage}.</li>
                        <li>Survived ${gs.turnCounter} turn(s).</li> 
                        <li>Defeated ${gs.enemyCounter}/${gs.totalEnemies} enemies.</li>
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
                        <li>Survived ${gs.turnCounter} turn(s).</li> 
                        <li>Defeated ${gs.enemyCounter}/${gs.totalEnemies} enemies.</li>
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

//TREE
    function syncTree(){
        //Update points counter
        el('skill-points-indicator').innerHTML = `Skill tree point: ${gs.plObj.treePoints}/${gs.plObj.treePoints + gs.plObj.treeNodes.length}`

        //Clear tree container
        el('skill-tree').innerHTML = ``

        treeRef.forEach(node => {
            let btn = document.createElement('button')
            btn.setAttribute('onclick', `addTreeNode("${node.id}")`)
        
            let description = ''
        
            if(node.desc !== undefined){
                description = upp(node.desc) + '.'
            }
        
            btn.id = node.id
            btn.innerHTML = `
                <img src ="./img/ico/item-equip-no.svg">

                <div>
                    <h3>${upp(node.id)}</h3> 
                    <p>${description}</p>
                </div>
            `
            el('skill-tree').append(btn)

            //Set allocated nodes as disabled
            if(findByProperty(gs.plObj.treeNodes, 'id', node.id)){
                btn.classList.add('allocated-tree-node')
                
                btn.innerHTML = `
                <img src ="./img/ico/item-equip-yes.svg">

                <div>
                    <h3>${upp(node.id)}</h3> 
                    <p>${description}</p>
                </div>
            `
            el('skill-tree').append(btn)
            }
        })


        gs.plObj.treeNodes.forEach(node => {
            el(node.id).disabled = true
        })

        // Adjust label if there are unspent skill tree points.
        if(gs.plObj.treePoints > 0){
            el('map-character-btn').innerHTML = `<img src="./img/ico/character-active.svg">Character`
            el('tree-btn').innerHTML = `<img src="./img/ico/tree-active.svg">Tree`
        } else {
            el('map-character-btn').innerHTML = `<img src="./img/ico/character.svg">Character`
            el('tree-btn').innerHTML = `<img src="./img/ico/tree.svg">Tree`
        }

        
    }
