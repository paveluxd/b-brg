//Gen tabs
function genTabs(){
    //Clear tabs
    el('tabs').innerHTML = ''
    let screens = ['map', 'character', 'inventory', 'tree']
    //Gen map tabs
    screens.forEach(elem => {
        let tab = document.createElement('button')
        tab.addEventListener('click', function(){screen(elem)})
        tab.innerHTML = upp(elem)
        el('tabs').append(tab)
    })
    
    //Add hidden close button
    let tab = document.createElement('button')
    tab.setAttribute('onclick', `screen('combat', this, "overlay")`)
    tab.classList.add('hide')
    tab.innerHTML = 'Close'
    el('tabs').append(tab)
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

    if(mod === 'combat-menu'){
       el('character').classList.remove('hide');//display screen with id
       el('tabs').lastChild.classList.remove('hide')
       el('tabs').firstChild.classList.add('hide')
    }
    else{
       el(id).classList.remove('hide');//display screen with id
    }
}


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

//
function updateUi(){
    updateCharPage()
    updateTree()

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
        el('p-life').innerHTML = `${playerObj.life}/${playerObj.maxLife}`
        el('p-def').innerHTML = `${playerObj.def}`
        el('p-dice').innerHTML = `${playerObj.roll} (d${playerObj.dice})`
        el('p-power').innerHTML = `${playerObj.power}`        

        //Enemy stats
        el('life').innerHTML = `${enemyObj.life}/${enemyObj.maxLife}`
        el('def').innerHTML = `${enemyObj.def}`
        el('dice').innerHTML = `${enemyObj.roll} (d${enemyObj.dice})`
        el('power').innerHTML = `${enemyObj.power}`        

        //Enemy intent
        if(enemyObj.action === 'Attack'){
            el('intent').innerHTML = `${enemyActions[enemyObj.action].desc} for ${enemyObj.roll + enemyObj.power}`
        }
        else if(enemyObj.action === 'Block'){
            el('intent').innerHTML = `${enemyActions[enemyObj.action].desc} ${enemyObj.roll} damage`
        }
        else if (enemyObj.action === 'Detonate'){
            el('intent').innerHTML = `Will ${enemyActions[enemyObj.action].desc} for ${enemyObj.maxLife} damage`
        }
        else{
            el('intent').innerHTML = `${enemyActions[enemyObj.action].desc}`
        }
    }
}

//Action buttons
function genCards(){
    el('playerActionContainer').innerHTML = ''
    
    //Add buttons per player item
    playerObj.inventory.forEach(item => {
        let button = document.createElement('button')

        //add top decorative bar
        let bar = document.createElement('div')
        bar.innerHTML = `
                    <svg height="4" width="4" style="fill: black;">
                        <polygon points="0,0 0,4 4,0"/>
                    </svg>
                    <svg height="4" width="4" style="fill: black;">
                        <polygon points="4,0 0,0 4,4"/>
                    </svg>
                    `

        let content = document.createElement('section')
        
        button.setAttribute('onclick', `turnCalc(this)`)
        button.setAttribute('itemid', item.itemid) // add item id
        button.classList.add('action')

        button.append(bar, content)
        updateBtnLabel(button, item)
        
        if(item.cooldown !== undefined && item.cooldown < itemsRef[item.action].cooldown){
            item.cooldown++
            button.disabled = true
        }

        el('playerActionContainer').append(button)
    })

    //Add empty item slots
    let emptySlots = playerObj.maxInventory - playerObj.inventory.length
    for (let i =0; i < emptySlots; i++){
        let button = document.createElement('button')
        button.innerHTML = `[ ]`
        button.disabled = true
        button.classList.add('action', 'empty-slot')
        el('playerActionContainer').append(button) 
    }

}


function updateBtnLabel(buttonElem, itemObj){
    if(itemObj.action === 'Attack'){
        buttonElem.querySelector('section').innerHTML = `
        <span>
            <h3>${itemObj.action} for ${playerObj.roll + playerObj.power}</h3> 
            <p>x${itemObj.durability}</p>
        </span>
        <p class='desc'>${itemObj.desc}</p>
    `   
    }
    else if(itemObj.action === 'Fireball'){        
        buttonElem.querySelector('section').innerHTML = `
            <span>
                <h3>${itemObj.action} for ${playerObj.roll * (playerObj.maxInventory - playerObj.inventory.length)}</h3> 
                <p>x${itemObj.durability}</p>
            </span>
            <p class='desc'>${itemObj.desc}</p>
        `
    }
    else if (['Block', 'Break'].indexOf(itemObj.action) > -1){
        buttonElem.querySelector('section').innerHTML = `
            <span>
                <h3>${itemObj.action} ${playerObj.roll}</h3> 
                <p>x${itemObj.durability}</p>
            </span>
            <p class='desc'>${itemObj.desc}</p>
        `      
    }
    else{
        buttonElem.querySelector('section').innerHTML = `
            <span>
                <h3>${itemObj.action}</h3> 
                <p>x${itemObj.durability}</p>
            </span>
            <p class='desc'>${itemObj.desc}</p>
        `        
    }
}

//Gen skill-tree page
function updateTree(){
    el('skill-tree').innerHTML = `Available passive point: ${playerObj.passivePoints}`

    skillTreeRef.forEach(node => {
        let btn = document.createElement('button')
        btn.addEventListener('click', function(){addPassivePoint(node)})
    
        let description = ''
    
        if(node.desc !== undefined){
            description = upp(node.desc) + '.'
        }
    
        btn.innerHTML = `${upp(node.id)} <br> ${description}`
        el('skill-tree').append(btn)
    })
}

//Gen character page
function updateCharPage(){
    let cont = el('character-content')

    //Build actions array
    let actions = []
    playerObj.inventory.forEach(item => {
        actions.push(`<br>${item.action} (x${item.durability})`)
    })

    for(let i = 0; i < playerObj.maxInventory - playerObj.inventory.length; i++){
        actions.push('<br>[....................]')
    }

    //Add text
    cont.innerHTML =`
        Stage: ${gameState.stage}
        <br>Level: ${playerObj.lvl} (exp: ${playerObj.exp})
        <br>Gold: ${playerObj.gold} 
        <br>

        <br>Life: ${playerObj.life} / ${playerObj.maxLife}
        <br>Def: ${playerObj.def} 
        <br>Power: ${playerObj.power} 
        <br>Dice: d${playerObj.flatDice} 
        <br>

        <br>Inventory: ${actions}
    `
}