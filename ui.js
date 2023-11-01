//UI
    function syncUi(){
        syncActionTiles()
        syncCharPage()
        syncItemCards()
        // syncTree()

        //Combat screen: Log stats at the top
        if(typeof combatState !== 'undefined'){

            //Top left log
            el('log').innerHTML = `
                Enc: ${gameState.encounter}/${gameState.playerLocationTile.enemyQuant}<br>
                Tur: ${combatState.turn}<br>
                Ene: lvl ${enemyObj.level} ${enemyObj.profile}<br>
                Loc: ${gameState.playerLocationTile.tileId}
                ` 
            // Lvl: ${playerObj.lvl} / Exp:${playerObj.exp}

            //Enemy floating number
            //combatState.enemyAction -> Previous action

            if(combatState.dmgTakenByEnemy > 0){//Attack
                floatText('en',`-${combatState.dmgTakenByEnemy} life`)
            }else if(enemyObj.action.key === 'fortify'){
                floatText('en',`+${enemyObj.action.stat} def`)
            }else if(enemyObj.action.key === 'empower'){
                floatText('en',`+${enemyObj.action.stat} power`)
            }else if(enemyObj.action.key === 'rush'){
                floatText('en',`+${enemyObj.action.stat} dice`)
            }else if(enemyObj.action.key === 'sleep'){
                floatText('en',`Zzzzz`)
            }else if(enemyObj.action.key === 'block'){
                floatText('en',`Blocked ${enemyObj.action.stat}`)
            }else if(enemyObj.action.key === 'recover'){
                floatText('en',`Recovered ${enemyObj.action.stat} ${enemyObj.action.actionVal}`)
            }

            combatState.enemyAction = []
            
            //Player floating number
            if(combatState.dmgTakenByPlayer > 0){
                floatText('pl',`-${combatState.dmgTakenByPlayer} life`)
            }

            //Player stats
            el('p-life').innerHTML  =`<img src="./img/ico/life.svg"><p>${playerObj.life}</p>`
            el('p-def').innerHTML   =`<img src="./img/ico/def.svg"><p>${playerObj.def}</p>`
            el('p-dice').innerHTML  =`<img src="./img/ico/dice.svg"><p>${playerObj.roll}<span>/${playerObj.dice}</span></p>`
            el('p-power').innerHTML =`<img src="./img/ico/power.svg"><p>${playerObj.power}</p>`        

            //Enemy stats
            el('life').innerHTML    =`<img src="./img/ico/life.svg"><p>${enemyObj.life}</p>`
            el('def').innerHTML     =`<img src="./img/ico/def.svg"><p>${enemyObj.def}</p>`
            el('dice').innerHTML    =`<img src="./img/ico/dice.svg"><p>${enemyObj.roll}<span>/${enemyObj.dice}</span></p>`
            el('power').innerHTML   =`<img src="./img/ico/power.svg"><p>${enemyObj.power}</p>`        

            //Enemy intent indicator
            el('intent').innerHTML = `${enemyObj.action.desc}`
        }

        //Modify map stat indicator
        ['food', 'power','life','coins'].forEach(stat => {
            el(`pl-${stat}`).innerHTML = playerObj[stat]
        })

        //Modify inventroy slide heading.
        el('inventorySlideDesc').innerHTML = `
            Inventory capacity: ${playerObj.inventory.length} / ${playerObj.inventorySlots}<br>
            Equipped items: ${calcEquippedItems()} / ${playerObj.equipmentSlots}
        `
    }

    //Gen tabs
    function genTabs(){

        //Clear tabs
        el('tab-container').innerHTML = `
            <div id="stat-indicator">
                <p id="map-desc" class='italic'></p>
            
                <div>
                    <img src='./img/ico/fish.svg'>
                    <p id='pl-food' class="mono-m">${playerObj.food}</p>
                </div>
                <div>
                    <img src='./img/ico/power.svg'>
                    <p id='pl-power' class="mono-m">${playerObj.power}</p>
                </div>
                <div>
                    <img src='./img/ico/hp-bb-red.svg'>
                    <p id='pl-life' class="mono-m">${playerObj.life}</p>
                </div>
                <div>
                    <img src='./img/ico/coin.svg'>
                    <p id='pl-coins' class="mono-m">${playerObj.coins}</p>
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
            ['inventory','inventory-tab']
        ] // add 'tree' , 'inventory','inventory' to arr to enable tree tab

        //Gen map tabs
        screens.forEach(elem => {
            let tab = document.createElement('button')
            tab.addEventListener('click', function(){screen(elem[0])})

            tab.innerHTML = `<img src="./img/ico/${elem[1]}.svg">${upp(elem[0])}`
            tab.id = `${elem[0]}-tab`

            el('tab-container').append(tab)
        })
    }

    //Manage screens.
    function screen(id, mod){

        //Hide everything
        el('.screen', 'all').forEach(t => t.classList.add('hide')); //screens
        el('.modal', 'all').forEach(t => t.classList.add('hide'));//screens
        el('tab-container').classList.add('hide')  //tabs
        
        //Show tabs                     
        if(el(id).classList.contains('tab')){//if it's a tab, show tabs
        el('tab-container').classList.remove('hide')
        }


        if(mod === 'combat-menu'){//switch visible tabs
        el('character').classList.remove('hide');//display screen with id
        el('close-tab').classList.remove('hide')
        el('map-tab').classList.add('hide')
        //    el('inventory-tab').classList.add('hide')
        }
        else{
        el(id).classList.remove('hide');//display screen with id
        }
    }


//CHARACTER
    function syncCharPage(){
        // playerObj.treePoints = playerObj.lvl - playerObj.treeNodes.length -1
    
        //Add text
        el('character-content').innerHTML =`
            <h2>Character</h2>

            <div id="stat-block" class = "grey-card body-14">
                <div>
                    <p><img src="./img/ico/hp-bb-red.svg">Life: ${playerObj.life} / ${playerObj.flatLife}</p>
                    <p><img src="./img/ico/dice.svg">Dice: d${playerObj.flatDice}</p>
                    <p><img src="./img/ico/item-power.svg">Power: ${playerObj.power}</p>
                    <p><img src="./img/ico/item-def.svg">Def: ${playerObj.def}</p>
                </div>

                <div>
                    <p><img src="./img/ico/placeholder.svg">Inventory: ${playerObj.inventory.length}/${playerObj.inventorySlots}</p>
                    <p><img src="./img/ico/item-slots.svg">Equi. slots: ${calcEquippedItems()}/${playerObj.equipmentSlots}</p>
                    <p><img src="./img/ico/fish.svg">Food: ${playerObj.food}</p>
                    <p><img src="./img/ico/coin-sm.svg">Coins: ${playerObj.coins}</p>
                </div>
            </div>
                
            <div class ="column" style="gap:8px; align-items:flex-start;">
                <p class="body-14 italic b50">Combat actions from equipment</p>
                <div id="actions-list"></div>
            </div>
        `
                // <p><img src="./img/ico/placeholder.svg"> 
                //     Level: ${playerObj.lvl} (exp: ${playerObj.exp})</p>

        //Add action cards
        el('actions-list').innerHTML = ``
        playerObj.actions.forEach(action => {
            let actionCard = genActionCard(action, 'card')
            el('actions-list').append(actionCard)
        })

        for(i=0; i < playerObj.equipmentSlots - playerObj.actions.length; i++){
            let actionCard = document.createElement('button')
            actionCard.innerHTML = '<section><span>[ ]</span></section>'
            actionCard.classList.add('action')
            el('actions-list').append(actionCard)
        }
    }


//INVENTORY
    //Move item card generation to a separate function
    function syncItemCards(){
        
        //Set inventory heading
        el('inventory-heading').innerHTML = `Inventory ${playerObj.inventory.length}/${playerObj.inventorySlots}`
        
        //Sync inventory
        el('inventory-list').innerHTML = ''
        playerObj.inventory.forEach(item => {
            el('inventory-list').append(genItemCard(item))
        })

        //Sync market 
        el('items-to-sell').innerHTML = ``
        playerObj.inventory.forEach(item => {
            el('items-to-sell').append(genItemCard(item, 'item-to-sell'))
        })

        //Sync blacksmith
        el('items-to-enhance').innerHTML = ``
        playerObj.inventory.forEach(item => {
            el('items-to-enhance').append(genItemCard(item, 'item-to-enhance'))
        })
        el('items-to-repair').innerHTML = ``
        playerObj.inventory.forEach(item => {
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
                actionSet += `<p>${upp(action.actionName)} (x${action.actionCharge}) - ${upp(action.desc)}.</p>`
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
        let itemModal = el('item-modal-body')
        let itemObj = findByProperty(playerObj.inventory, 'itemId', itemId)

        if(source === 'reward'){
            itemObj = findByProperty(playerObj.offeredItemsArr, 'itemId', itemId)
        }

        itemModal.innerHTML = `${itemObj.itemName} (${itemObj.itemSlot})<br><br>Adds actions: <br>`

        itemObj.actions.forEach(action => {
            itemModal.innerHTML += `<br> ${action.actionName} (x${action.actionCharge}): ${upp(action.desc)}.<br>`
        })

        //Add drop item button
        let btn = document.createElement('button')

        if(source === 'reward'){
            btn.innerHTML = 'Pick item'
            btn.setAttribute('onclick',`removeItem("${itemId}"), toggleModal('item-modal')`)
        }
        else{
            btn.innerHTML = 'Drop item'
            btn.setAttribute('onclick',`removeItem("${itemId}"), toggleModal('item-modal')`)
        }

        //Add close button
        let closeBtn = document.createElement('button')
        closeBtn.innerHTML = 'Close'
        closeBtn.setAttribute('onclick', 'toggleModal("item-modal")')

        itemModal.append(btn, closeBtn)
    }

    


//COMBAT
    //Animation
    function floatText(target, string){

        if(target === 'en'){
            el('enDmgInd').innerHTML = string
            runAnim(el('enDmgInd'), 'float-num')
        }
        else{
            el('plDmgInd').innerHTML = string
            runAnim(el('plDmgInd'), 'float-num')
        }

        //if positive -> text green etc
        if(string[0] === '-'){
            el('enDmgInd').setAttribute('style', 'color:red;')
            el('plDmgInd').setAttribute('style', 'color:red;')
        }
        else{
            el('enDmgInd').setAttribute('style', 'color:white;')
            el('plDmgInd').setAttribute('style', 'color:white;')
        }
    }

    //Sprite builder
    function spriteBuilder(target){
        if(target === 'player'){
            el('player-sprite').innerHTML = `
                <img src="./img/character/${rng(3,1)}-back.svg">
                <img src="./img/character/${rng(3,1)}-back-arm.svg">
                <img src="./img/character/${rng(4,1)}-legs.svg">
                <img src="./img/character/${rng(4,1)}-torso.svg">
                <img src="./img/character/${rng(3,1)}-front-arm.svg">
                <img src="./img/character/${rng(4,1)}-head.svg">
            `
        }
        else if(target === 'enemy'){
            if(rng(4) === 4){
                el('enemy-sprite').innerHTML = `
                    <img src="./img/enemy/boss/${rng(3,1)}.svg">
                ` 
            }
            else{
                el('enemy-sprite').innerHTML = ` 
                    <img src="./img/enemy/balanced/${rng(3,1)}-back-arm.svg">
                    <img src="./img/enemy/balanced/${rng(2,1)}-legs.svg">
                    <img src="./img/enemy/balanced/${rng(2,1)}-torso.svg">
                    <img src="./img/enemy/balanced/${rng(3,1)}-front-arm.svg">
                    <img src="./img/enemy/balanced/${rng(5,1)}-head.svg">
                ` 
            }
        }
    }
    //ACTIONS
        //Gen action set
        function syncActionTiles(){
            el('cards-row').innerHTML = ''

            //Set #cards-row width to display cards in two rows.
            el('cards-row').setAttribute('style',`width:${149 * (Math.floor(playerObj.actions.length/2) + 1)}px;`)
            
            //Add button per player item
            playerObj.actions.forEach(action => {
                let actionCard = genActionCard(action)
                el('cards-row').append(actionCard)
            })

            //Add empty item slots
                // let emptySlots = playerObj.actionSlots - playerObj.actions.length
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
            if(type !== 'card'){
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

            if      (['block'].indexOf(referenceAction.actionName) > -1){
                heading = `${upp(action.actionName)} ${playerObj.roll}`
            }else if(['bow attack'].indexOf(referenceAction.actionName) > -1){
                heading = `${upp(action.actionName)} for ${playerObj.roll + playerObj.power}`
            }else if(['sword attack'].indexOf(referenceAction.actionName) > -1){
                heading = `${upp(action.actionName)} for ${3 + playerObj.power}(+${playerObj.swordDmgMod})`
            }else if(['inferno'].indexOf(referenceAction.actionName) > -1){
                heading = `${upp(action.actionName)} (${playerObj.power * playerObj.coins} dmg)`
            }

            button.querySelector('section').innerHTML = `
                <span>
                    <h3>${heading}</h3> 
                    <p>x${action.actionCharge}</p>
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
        if     (type == 'completed'){
            el('state-screen').innerHTML = `
                <div class="modal-container"> 
                    <img id="end-img" src="./img/bg/victory.svg" alt="" class="illustration">
                    <p id="end-desc" class="body-14">
                        You succeeded. You played for <span class="bold">${gameState.turnCounter} turns</span>,<br>
                        and defeated <span class="bold">${gameState.enemyCounter}/${gameState.totalEnemies} enemies</span>.
                    </p>
                    <p class="body-14 italic b50">Tap to restart</p>
                </div>`
            
            el('state-screen').setAttribute('onclick', "initGame(), screen('map')")
        }
        else if(type == 'starved'){
            el('state-screen').innerHTML = `
                <div class="modal-container"> 

                    <img id="end-img" src="./img/bg/starvation.svg" alt="" class="illustration">

                    <p id="end-desc" class="body-14">
                        You starved to death. You lasted <span class="bold">${gameState.turnCounter} turns</span>,<br>
                        and defeated <span class="bold">${gameState.enemyCounter}/${gameState.totalEnemies} enemies</span>.
                    </p>

                    <p class="body-14 italic b50">Tap to restart</p>

                </div>`
            
            el('state-screen').setAttribute('onclick', "initGame(), screen('map')")
        }
        else if(type == 'game-end'){
            el('state-screen').innerHTML = `
                <div class="modal-container"> 
                    <img id="end-img" src="./img/bg/end.svg" alt="" class="illustration">
                    <p id="end-desc" class="body-14">
                        You have been defeated. You lasted <span class="bold">${gameState.turnCounter} turns</span>,<br>
                        and defeated <span class="bold">${gameState.enemyCounter}/${gameState.totalEnemies} enemies</span>.
                    </p>
                    <p class="body-14 italic b50">Tap to restart</p>
                </div>`
            
            el('state-screen').setAttribute('onclick', "initGame(), screen('map')")
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
        el('skill-tree').innerHTML = `Available passive point: ${playerObj.treePoints}`

        treeRef.forEach(node => {
            let btn = document.createElement('button')
            btn.addEventListener('click', function(){addTreeNode(node)})
        
            let description = ''
        
            if(node.desc !== undefined){
                description = upp(node.desc) + '.'
            }
        
            btn.id = node.id
            btn.innerHTML = `${upp(node.id)} <br> ${description}`
            el('skill-tree').append(btn)
        })

        playerObj.treeNodes.forEach(node => {
            el(node.id).disabled = true
        })
    }
