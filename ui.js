import xut from "./utility.js"
import xda from './data.js'


//Gen tabs
function genTabs(){
    //Clear tabs
    xut.el('tabs').innerHTML = ''
    let screens = ['map', 'character', 'inventory', 'tree']
    //Gen map tabs
    screens.forEach(elem => {
        let tab = document.createElement('button')
        tab.addEventListener('click', function(){screen(elem)})
        tab.innerHTML = xut.upp(elem)
        xut.el('tabs').append(tab)
    })
    
    //Add hidden close button
    let tab = document.createElement('button')
    tab.setAttribute('onclick', `screen('combat', this, "overlay")`)
    tab.classList.add('hide')
    tab.innerHTML = 'Close'
    xut.el('tabs').append(tab)
}
genTabs()

//Manage screens
window.screen = function(id, mod){

    //Hide everything
    xut.el('.screen', 'all').forEach(t => t.classList.add('hide')); //screens
    xut.el('.modal', 'all').forEach(t => t.classList.add('hide'));//screens
    xut.el('tab-container').classList.add('hide')  //tabs
    
    //Show tabs                     
    if(xut.el(id).classList.contains('tab')){//if it's a tab, show tabs
       xut.el('tab-container').classList.remove('hide')
    }

    if(mod === 'combat-menu'){
       xut.el('character').classList.remove('hide');//display screen with id
       xut.el('tabs').lastChild.classList.remove('hide')
       xut.el('tabs').firstChild.classList.add('hide')
    }
    else{
       xut.el(id).classList.remove('hide');//display screen with id
    }
}


function floatText(target, string){

    if(target === 'en'){
        xut.el('enDmgInd').innerHTML = string
        xut.runAnim(xut.el('enDmgInd'), 'float-num')
    }
    else{
        xut.el('plDmgInd').innerHTML = string
        xut.runAnim(xut.el('plDmgInd'), 'float-num')
    }


    //if positive -> text green etc
    if(string[0] === '-'){
        xut.el('enDmgInd').setAttribute('style', 'color:red;')
        xut.el('plDmgInd').setAttribute('style', 'color:red;')

    }
    else{
        xut.el('enDmgInd').setAttribute('style', 'color:white;')
        xut.el('plDmgInd').setAttribute('style', 'color:white;')

    }
}


function updateUi(){
    //log
    xut.el('log').innerHTML = `
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
    xut.el('p-life').innerHTML = `${playerObj.life}/${playerObj.maxLife}`
    xut.el('p-def').innerHTML = `${playerObj.def}`
    xut.el('p-dice').innerHTML = `${playerObj.roll} (d${playerObj.dice})`
    xut.el('p-power').innerHTML = `${playerObj.power}`        

    //Enemy stats
    xut.el('life').innerHTML = `${enemyObj.life}/${enemyObj.maxLife}`
    xut.el('def').innerHTML = `${enemyObj.def}`
    xut.el('dice').innerHTML = `${enemyObj.roll} (d${enemyObj.dice})`
    xut.el('power').innerHTML = `${enemyObj.power}`        

    if(enemyObj.action === 'Attack'){
        xut.el('intent').innerHTML = `${xda.enemyActions[enemyObj.action].desc} for ${enemyObj.roll + enemyObj.power}`
    }
    else if(enemyObj.action === 'Block'){
        xut.el('intent').innerHTML = `${xda.enemyActions[enemyObj.action].desc} ${enemyObj.roll} damage`
    }
    else if (enemyObj.action === 'Detonate'){
        xut.el('intent').innerHTML = `Will ${xda.enemyActions[enemyObj.action].desc} for ${enemyObj.maxLife} damage`
    }
    else{
        xut.el('intent').innerHTML = `${xda.enemyActions[enemyObj.action].desc}`
    }
}

//Action buttons
function genCards(){
    xut.el('playerActionContainer').innerHTML = ''
    
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
        
        button.setAttribute('onclick', `game.turnCalc(this)`)
        button.setAttribute('itemid', item.itemid) // add item id
        button.classList.add('action')

        button.append(bar, content)
        updateBtnLabel(button, item)
        
        if(item.cooldown !== undefined && item.cooldown < xda.itemsRef[item.action].cooldown){
            item.cooldown++
            button.disabled = true
        }

        xut.el('playerActionContainer').append(button)
    })

    //Add empty item slots
    let emptySlots = playerObj.maxInventory - playerObj.inventory.length
    for (let i =0; i < emptySlots; i++){
        let button = document.createElement('button')
        button.innerHTML = `[ ]`
        button.disabled = true
        button.classList.add('action', 'empty-slot')
        xut.el('playerActionContainer').append(button) 
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
function genSkillTree(){
    xut.el('skill-tree').innerHTML = ''

    xda.skillTreeRef.forEach(node => {
        let btn = document.createElement('button')
    
        let description = ''
    
        if(node.desc !== undefined){
            description = xut.upp(node.desc) + '.'
        }
    
        btn.innerHTML = `${xut.upp(node.id)} <br> ${description}`
        xut.el('skill-tree').append(btn)
    })
}


//Gen character page
function genCharPage(){
    let cont = xut.el('character-content')

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
        <br>Level: ${playerObj.exp} (exp: ${playerObj.lvl})
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




export default{
    screen,
    floatText,
    updateUi,
    genCards,
    updateBtnLabel,
    genSkillTree,
    genCharPage,
}