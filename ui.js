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

    let screens = ['map', 'character', 'inventory', 'tree']
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
    }
    else{
       el(id).classList.remove('hide');//display screen with id
    }
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

//
function syncUi(){
    syncActionTiles()
    syncCharPage()
    syncTree()

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
    playerObj.actions.forEach(item => {

        //Add top decorative bar with cut corners
        let bar = document.createElement('div')
        bar.innerHTML = `
                    <svg height="4" width="4" style="fill: black;">
                        <polygon points="0,0 0,4 4,0"/>
                    </svg>
                    <svg height="4" width="4" style="fill: black;">
                        <polygon points="4,0 0,0 4,4"/>
                    </svg>
                    `// Creates svg triangles

        let content = document.createElement('section')  // Section that contains name and desc

        //Create button elem
        let button = document.createElement('button')
        button.setAttribute('onclick', `turnCalc(this)`) // On click run next turn
        button.setAttribute('itemid', item.itemid)       // Add a unique id
        button.classList.add('action')
        
        
        //Updates button labels based on actions
        //Modifies 'content' section
        button.append(bar, content) //Add decorative bar and content section to button
        if     (['Attack'].indexOf(item.action) > -1){
            button.querySelector('section').innerHTML = `
            <span>
            <h3>${item.action} for ${playerObj.roll + playerObj.power}</h3> 
            <p>x${item.durability}</p>
            </span>
            <p class='desc'>${item.desc}</p>
            `   
        }
        else if(['Fireball'].indexOf(item.action) > -1){        
            button.querySelector('section').innerHTML = `
            <span>
            <h3>${item.action} for ${playerObj.roll * (playerObj.actionSlots - playerObj.actions.length)}</h3> 
            <p>x${item.durability}</p>
            </span>
                <p class='desc'>${item.desc}</p>
                `
        }
        else if(['Block', 'Break'].indexOf(item.action) > -1){
                button.querySelector('section').innerHTML = `
                <span>
                <h3>${item.action} ${playerObj.roll}</h3> 
                <p>x${item.durability}</p>
                </span>
                <p class='desc'>${item.desc}</p>
                `      
        }
        else{
            button.querySelector('section').innerHTML = `
                <span>
                    <h3>${item.action}</h3> 
                    <p>x${item.durability}</p>
                </span>
                <p class='desc'>${item.desc}</p>
            `        
        }
        

        //If item is on cooldown, increase cd counter
        if(item.cooldown !== undefined && item.cooldown < actionsRef[item.action].cooldown){
            item.cooldown++
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

//Gen character page
function syncCharPage(){
    playerObj.treePoints = playerObj.lvl - playerObj.treeNodes.length -1

    let cont = el('character-content')

    //Build actions array
    let actions = []
    playerObj.actions.forEach(item => {
        actions.push(`<br>${item.action} (x${item.durability})`)
    })

    for(let i = 0; i < playerObj.actionSlots - playerObj.actions.length; i++){
        actions.push('<br>[....................]')
    }

    //Add text
    cont.innerHTML =`
        Stage: ${gameState.stage}
        <br>Level: ${playerObj.lvl} (exp: ${playerObj.exp})
        <br>Passive skill points: ${playerObj.treePoints}
        <br>Gold: ${playerObj.gold} 
        <br>

        <br>Life: ${playerObj.life} / ${playerObj.maxLife}
        <br>Def: ${playerObj.def} 
        <br>Power: ${playerObj.power} 
        <br>Dice: d${playerObj.flatDice} 
        <br>

        <br>Skills slots: ${actions}
    `
}