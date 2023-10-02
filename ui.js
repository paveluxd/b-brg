//Gen tabs
function genTabs(){

    //Clear tabs
    el('tabs').innerHTML = ''

    //Add hidden close button
    let tab = document.createElement('button')
    tab.setAttribute('onclick', `screen('combat', this, "overlay")`)
    tab.classList.add('hide')
    tab.innerHTML = 'X'
    tab.id = 'close-tab'
    el('tabs').append(tab)

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


        el('tabs').append(tab)
    })
}

//Manage screens
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

//
function syncUi(){
    syncActionTiles()
    syncCharPage()
    syncTree()
    syncInventory()

    //Log stats at the top
    if(typeof combatState !== 'undefined'){

        //In combat game log at the top left corner
        el('log').innerHTML = `
            Encounter: ${gameState.encounter} / ${gameState.bossFrequency} <br> 
            Stage: ${gameState.stage}
            Turn: ${combatState.turn} <br>
            Lvl: ${playerObj.lvl} / Exp:${playerObj.exp}
        ` 

        //Enemy floating number
        if(combatState.dmgTakenByEnemy > 0){//Attack
            floatText('en',`-${combatState.dmgTakenByEnemy} life`)
        }else if(combatState.enemyAction[0] === 'Fortify'){
            floatText('en',`+${combatState.enemyAction[1]} def`)
        }else if(combatState.enemyAction[0] === 'Empower'){
            floatText('en',`+${combatState.enemyAction[1]} power`)
        }else if(combatState.enemyAction[0] === 'Rush'){
            floatText('en',`+${combatState.enemyAction[1]} dice`)
        }else if(combatState.enemyAction[0] === 'Sleep'){
            floatText('en',`Zzzzz`)
        }else if(combatState.enemyAction[0] === 'Block'){
            floatText('en',`Blocked ${combatState.enemyAction[1]}`)
        }else if(combatState.enemyAction[0] === 'Recover'){
            floatText('en',`Recovered ${combatState.enemyAction[1]} ${combatState.enemyAction[2]}`)
        }

        combatState.enemyAction = []
        
        //Player floating number
        if(combatState.dmgTakenByPlayer > 0){
            floatText('pl',`-${combatState.dmgTakenByPlayer} life`)
        }

        //Player stats
        el('p-life').innerHTML = `${playerObj.life}`
        el('p-def').innerHTML = `${playerObj.def}`
        el('p-dice').innerHTML = `${playerObj.roll}<span style="color: var(--green50);">/${playerObj.dice}</span>`
        el('p-power').innerHTML = `${playerObj.power}`        

        //Enemy stats
        el('life').innerHTML = `${enemyObj.life}`
        el('def').innerHTML = `${enemyObj.def}`
        el('dice').innerHTML = `${enemyObj.roll}<span style="color: var(--green50);">/${enemyObj.dice}</span>`
        el('power').innerHTML = `${enemyObj.power}`        

        //Enemy intent indicator
        if      (enemyObj.action === 'Attack'){
            el('intent').innerHTML = `${eneActionRef[enemyObj.action].desc} for ${enemyObj.roll + enemyObj.power}`
        }else if(enemyObj.action === 'Block'){
            el('intent').innerHTML = `${eneActionRef[enemyObj.action].desc} ${enemyObj.roll} damage`
        }else if(enemyObj.action === 'Detonate'){
            el('intent').innerHTML = `Will ${eneActionRef[enemyObj.action].desc} for ${enemyObj.flatLife} damage`
        }else{
            el('intent').innerHTML = `${eneActionRef[enemyObj.action].desc}`
        }
    }
}

//Action tiles
function syncActionTiles(){
    el('playerActionContainer').innerHTML = ''
    
    //Add button per player item
    playerObj.actions.forEach(action => {

        // Section that contains name and desc
        let content = document.createElement('section')  

        let referenceAction = findByProperty(actionsRef, 'keyId', action.keyId);

        //Create button elem
        let button = document.createElement('button')
        button.setAttribute('onclick', `turnCalc(this)`) // On click run next turn
        button.setAttribute('actionId', action.actionId)       // Add a unique id
        button.classList.add('action')
        
        
        //Updates button labels based on actions
        //Modifies 'content' section
        button.append(content) //Add content section to button

        //!!! REPACE WITH keyID

        //Cooldonw management
        let cooldownCounter = ''

        //If action is on cooldown disable the button
        if(typeof action.cooldown !== 'undefined' && action.cooldown < referenceAction.cooldown){
            cooldownCounter = `(cd:${action.cooldown})` 
            button.disabled = true
        }

        if     (['attack'].indexOf(referenceAction.actionName) > -1){
            button.querySelector('section').innerHTML = `
            <span>
            <h3>${action.actionName} for ${playerObj.roll + playerObj.power}</h3> 
            <p>x${action.actionCharge}</p>
            </span>
            <p class='desc'>${action.desc}.</p>
            `   
        }
        else if(['fireball'].indexOf(referenceAction.actionName) > -1){        
            button.querySelector('section').innerHTML = `
            <span>
            <h3>${upp(action.actionName)} for ${playerObj.roll * (playerObj.actionSlots - playerObj.actions.length)}</h3> 
            <p>x${action.actionCharge}</p>
            </span>
                <p class='desc'>${upp(action.desc)}.</p>
                `
        }
        else if(['block', 'Break'].indexOf(referenceAction.actionName) > -1){
                button.querySelector('section').innerHTML = `
                <span>
                <h3>${upp(action.actionName)} ${playerObj.roll}</h3> 
                <p>x${action.actionCharge}</p>
                </span>
                <p class='desc'>${upp(action.desc)}.</p>
                `      
        }
        else{
            button.querySelector('section').innerHTML = `
                <span>
                    <h3>${upp(action.actionName)}</h3> 
                    <p>x${action.actionCharge}${cooldownCounter}</p>
                </span>
                <p class='desc'>${upp(action.desc)}.</p>
            `        
        }



        el('playerActionContainer').append(button)
    })


    //Add empty item slots
    let emptySlots = playerObj.actionSlots - playerObj.actions.length
    for (let i =0; i < emptySlots; i++){
        let button = document.createElement('button')
        button.innerHTML = `[ ]`
        button.disabled = true
        button.classList.add('action', 'empty-slot')
        el('playerActionContainer').append(button) 
    }
}

//Gen skill-tree page
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

//Character page
function syncCharPage(){
    playerObj.treePoints = playerObj.lvl - playerObj.treeNodes.length -1

    let cont = el('character-content')

    

    //Add placeholders for actions
    // 
    

    //Add text
    cont.innerHTML =`
        <h2>Character</h2>

        <div id="stat-block" class = "grey-card body-14">
            <div>
                <p>Life: ${playerObj.life} / ${playerObj.flatLife}</p>
                <p>Dice: d${playerObj.flatDice}</p>
                <p>Power: ${playerObj.power}</p>
                <p>Def: ${playerObj.def}</p>
            </div>

            <div>
                <p>Stage: ${gameState.stage} / Level: ${playerObj.lvl} (exp: ${playerObj.exp})</p>
                <p>Inventroy: ${playerObj.inventory.length}/${playerObj.inventorySlots}</p>
                <p>Equipped: ${calcEquippedItems()}/${playerObj.equipmentSlots}</p>
                <p>Actions: ${playerObj.actions.length}/${playerObj.actionSlots}</p>
            </div>
        </div>

        <div id="actions-list"></div>
    `
    // <br>Passive skill points: ${playerObj.treePoints}
    // <br>Gold: ${playerObj.gold} 


    //Build actions array
    playerObj.actions.forEach(action => {
        el('actions-list').innerHTML += `
        <div class ="grey-card body-14">
            <p>
                <span class="name">${upp(action.actionKey)}</span>    
                - ${upp(action.desc)}.
            </p>

            <span class="charges">x${action.actionCharge}</span>
        </div>`
    })
}

//Inventory
//Move item card generation to a separate function
function syncInventory(){
    let content = el('inventory-list')
    content.innerHTML = ''

    
    playerObj.inventory.forEach(item => {
        //Set inventory heading
        el('inventory-heading').innerHTML = `Inventory ${playerObj.inventory.length}/${playerObj.inventorySlots}`

        //Creates card container
        let card = document.createElement('div')
        card.classList.add('item-card', 'body-12')
        
        //Creates body btn
        let topContainer = document.createElement('div')
        topContainer.addEventListener('click', function(){toggleModal('item-modal'), genItemModal(item.itemId)})
        topContainer.classList.add('top-container')
        let bottomContainer = document.createElement('div')
        bottomContainer.classList.add('bottom-container')


        //Item image
        let img = document.createElement('img')
        img.setAttribute('src',`./img/items/${item.itemName}.svg`)
        topContainer.append(img)


        //Desctioption
            //Create container
            let descSection = document.createElement('div')
            descSection.classList.add('desc-section')
        
            //Add item type, only if it is non-generic
            let itemType = ''
            if(item.itemType !== 'generic'){
                itemType = ` (${item.itemType})`
            }

            //Add title and type
            descSection.innerHTML = `<h3>${upp(item.itemName)}${itemType}</h3>`

            //Added actions
            item.actions.forEach(action =>{
                descSection.innerHTML += `<p>${upp(action.actionName)} (x${action.actionCharge}) - ${upp(action.desc)}.</p>`
            })

            topContainer.append(descSection)


        //Add drop button
            let dropBtn = document.createElement('button')
            dropBtn.innerHTML = '<img src="./img/ico/item-x.svg"> <p>Drop</p>'
            dropBtn.classList.add('drop-button', 'body-12')

            //Removes the item
            dropBtn.addEventListener('click', function(){
                this.remove()
                removeItem(item.itemId)
            })


        //Add passive stats
            let pasiveStatContainer = document.createElement('div')
            pasiveStatContainer.classList.add('passive-container')

            //Add passives
            item.passiveStats.forEach(stat =>{
                //Add icon
                let img = document.createElement('img')
                img.setAttribute('src', `./img/ico/item-${stat.stat}.svg`)
                pasiveStatContainer.append(img)
                pasiveStatContainer.innerHTML += `${stat.value} <br> `
            })


        //Add equip button
            let equipBtn = document.createElement('button')
            equipBtn.innerHTML = '<p>Equip</p> <img src="./img/ico/item-equip-no.svg">'
            equipBtn.classList.add('equip-button', 'body-12')

            // Keeps equip indicator even if buttons are redrawn with syncUi()
            if(item.equipped){ 
                equipBtn.classList.add('equipped')
                equipBtn.innerHTML = '<p>Equip</p> <img src="./img/ico/item-equip-yes.svg">' //Update checbox icon
            }

            equipBtn.addEventListener('click', function(){equipItem(item),  this.classList.toggle('equipped')})
        
        
        bottomContainer.append(dropBtn, pasiveStatContainer, equipBtn)
        card.append(topContainer, bottomContainer)
        content.append(card)         
    })
}

//Item modal
function genItemModal(itemId){
    let itemModal = el('item-modal-body')
    let itemObj = findByProperty(playerObj.inventory, 'itemId', itemId)

    itemModal.innerHTML = `${itemObj.itemName} (${itemObj.itemType})<br><br>Adds actions: <br>`

    itemObj.actions.forEach(action => {
        itemModal.innerHTML += `<br> ${action.actionName} (x${action.actionCharge}): ${upp(action.desc)}.<br>`
    })

    //Add drop item button
    let btn = document.createElement('button')
    btn.innerHTML = 'Drop item'
    btn.setAttribute('onclick',`removeItem("${itemId}"), toggleModal('item-modal')`)

    //Add close button
    let closeBtn = document.createElement('button')
    closeBtn.innerHTML = 'Close'
    closeBtn.setAttribute('onclick', 'toggleModal("item-modal")')

    itemModal.append(btn, closeBtn)
}

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

//Calc equipped items
function calcEquippedItems(){
    let equipped = 0
    playerObj.inventory.forEach(item => {
        if(item.equipped === true){
            equipped++
        }
    })

    return equipped
}