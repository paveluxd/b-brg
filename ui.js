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

    let screens = ['map', 'character', 'inventory'] // add 'tree' , 'inventory','inventory' to arr to enable tree tab

    //Gen map tabs
    screens.forEach(elem => {
        let tab = document.createElement('button')
        tab.addEventListener('click', function(){screen(elem)})
        tab.innerHTML = upp(elem)
        tab.id = `${elem}-tab`
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

    
        el('log').innerHTML = `
            Encounter: ${gameState.encounter} / ${gameState.bossFrequency} <br> 
            Stage: ${gameState.stage}
            Turn: ${combatState.turn} <br>
            Lvl: ${playerObj.lvl} / Exp:${playerObj.exp}
        ` 

        //Enemy floating number
        if(combatState.enemyDmgTaken > 0){//Attack
            floatText('en',`-${combatState.enemyDmgTaken} life`)
        }
        else if(combatState.enemyAction[0] === 'Fortify'){
            floatText('en',`+${combatState.enemyAction[1]} def`)
        }
        else if(combatState.enemyAction[0] === 'Empower'){
            floatText('en',`+${combatState.enemyAction[1]} power`)
        }
        else if(combatState.enemyAction[0] === 'Rush'){
            floatText('en',`+${combatState.enemyAction[1]} dice`)
        }
        else if(combatState.enemyAction[0] === 'Sleep'){
            floatText('en',`Zzzzz`)
        }
        else if(combatState.enemyAction[0] === 'Block'){
            floatText('en',`Blocked ${combatState.enemyAction[1]}`)
        }
        else if(combatState.enemyAction[0] === 'Recover'){
            floatText('en',`Recovered ${combatState.enemyAction[1]} ${combatState.enemyAction[2]}`)
        }

        combatState.enemyAction = []
        
        //Player floating number
        if(combatState.playerDmgTaken > 0){
            floatText('pl',`-${combatState.playerDmgTaken} life`)
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

        //Enemy intent
        if(enemyObj.action === 'Attack'){
            el('intent').innerHTML = `${eneActionRef[enemyObj.action].desc} for ${enemyObj.roll + enemyObj.power}`
        }
        else if(enemyObj.action === 'Block'){
            el('intent').innerHTML = `${eneActionRef[enemyObj.action].desc} ${enemyObj.roll} damage`
        }
        else if (enemyObj.action === 'Detonate'){
            el('intent').innerHTML = `Will ${eneActionRef[enemyObj.action].desc} for ${enemyObj.maxLife} damage`
        }
        else{
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


        //Create button elem
        let button = document.createElement('button')
        button.setAttribute('onclick', `turnCalc(this)`) // On click run next turn
        button.setAttribute('actionId', action.actionId)       // Add a unique id
        button.classList.add('action')
        
        
        //Updates button labels based on actions
        //Modifies 'content' section
        button.append(content) //Add decorative bar and content section to button

        if     (['attack'].indexOf(action.actionKey) > -1){
            button.querySelector('section').innerHTML = `
            <span>
            <h3>${action.actionName} for ${playerObj.roll + playerObj.power}</h3> 
            <p>x${action.actionCharge}</p>
            </span>
            <p class='desc'>${action.desc}.</p>
            `   
        }
        else if(['fireball'].indexOf(action.actionKey) > -1){        
            button.querySelector('section').innerHTML = `
            <span>
            <h3>${upp(action.actionName)} for ${playerObj.roll * (playerObj.actionSlots - playerObj.actions.length)}</h3> 
            <p>x${action.actionCharge}</p>
            </span>
                <p class='desc'>${upp(action.desc)}.</p>
                `
        }
        else if(['block', 'Break'].indexOf(action.actionKey) > -1){
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
                    <p>x${action.actionCharge}</p>
                </span>
                <p class='desc'>${upp(action.desc)}.</p>
            `        
        }


        //If item is on cooldown, increase cd counter
        if(typeof action.cooldown !== 'undefined' && action.cooldown < actionsRef[action.actionKey].cooldown){
            action.cooldown++
            button.disabled = true
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

    //Build actions array
    let actions = ``
    playerObj.actions.forEach(action => {
        actions += `<li>${upp(action.actionKey)} (x${action.actionCharge}): ${upp(action.desc)}.</li>`
    })

    //Add placeholders for actions
    // 
    

    //Add text
    cont.innerHTML =`
        Life: ${playerObj.life} / ${playerObj.flatLife} <br>
        Def: ${playerObj.def} <br>
        Power: ${playerObj.power} <br>
        Dice: d${playerObj.flatDice} <br>

        <br>
        Level: ${playerObj.lvl} (exp: ${playerObj.exp}) / Stage: ${gameState.stage}<br>
        Inventroy: ${playerObj.inventory.length}/${playerObj.inventorySlots} / Equipped: ${calcEquippedItems()}/${playerObj.equipmentSlots}

        <br>
        <br><h3>Actions ${playerObj.actions.length}/${playerObj.actionSlots}</h3> 
        <ul>${actions}</ul>
    `
    // <br>Passive skill points: ${playerObj.treePoints}
    // <br>Gold: ${playerObj.gold} 
}

//Inventory
function syncInventory(){
    let content = el('inventory-list')
    content.innerHTML = ''

    
    playerObj.inventory.forEach(item => {

        //Creates card container
        let card = document.createElement('div')
        card.classList.add('item-card')

        //Creates body btn
        let btn = document.createElement('button')
        btn.addEventListener('click', function(){toggleModal('item-modal'), genItemModal(item.itemId)})

        let itemDesc = `<h3>${item.itemName} (${item.itemType})</h3><br>`

        //Added actions
        item.actions.forEach(action =>{
            itemDesc += `${action.actionName}(x${action.actionCharge}) - ${upp(action.desc)}.`
        })

        //Added stats
        item.passiveStats.forEach(stat =>{
            itemDesc += `${upp(stat.stat)}: ${stat.value} <br> `
        })

        btn.innerHTML = itemDesc

        //Add equip button
        let equipBtn = document.createElement('button')
        equipBtn.innerHTML = 'Equipped'
        equipBtn.classList.add('equip-button')

        if(item.equipped){ // Keeps equip indicator even if buttons are redrawn with syncui()
            equipBtn.classList.add('equipped')
        }

        equipBtn.addEventListener('click', function(){equipItem(item),  this.classList.toggle('equipped')})
        
        //Add drop button
        let dropBtn = document.createElement('button')
        dropBtn.innerHTML = 'Drop'
        dropBtn.classList.add('drop-button')

        //Removes the item
        dropBtn.addEventListener('click', function(){
            this.remove()
            removeItem(item.itemId)
        })

        card.append(btn, equipBtn, dropBtn)
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