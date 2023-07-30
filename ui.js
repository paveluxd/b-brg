import  xxut from "./utility.js"
import xxDa from './data.js'


//UI
//Manage tabs

//Generate tabs
function genTabs(){
    //Clear tabs
     xxut.el('tabs').innerHTML = ''
    let screens = ['map', 'character', 'inventory', 'tree']
    //Gen map tabs
    screens.forEach(elem => {
        let tab = document.createElement('button')
        tab.addEventListener('click', function(){screen(elem)})
        tab.innerHTML =  xxut.upp(elem)
         xxut.el('tabs').append(tab)
    })
    
    //Add hidden close button
    let tab = document.createElement('button')
    tab.setAttribute('onclick', `screen('combat', this, "overlay")`)
    tab.classList.add('hide')
    tab.innerHTML = 'Close'
     xxut.el('tabs').append(tab)
}

genTabs()

//Change screens
window.screen = function(id){

    //Hide everything
    document.querySelectorAll('.screen').forEach(t => t.classList.add('hide')); //screens
        xxut.el('tab-container').classList.add('hide')  //tabs
    
    //Show tabs                     
    if(xxut.el(id).classList.contains('tab')){//if it's a tab, show tabs
        xxut.el('tab-container').classList.remove('hide')
    }

    if(id === 'combat-menu'){
        xxut.el('character').classList.remove('hide');//display screen with id
        xxut.el('tab-container').lastChild.classList.remove('hide')
        xxut.el('tab-container').firstChild.classList.add('hide')

    }
    else{
        xxut.el(id).classList.remove('hide');//display screen with id
    }
}


function floatText(target, string){

    if(target === 'en'){
         xxut.el('enDmgInd').innerHTML = string
         xxut.runAnim( xxut.el('enDmgInd'), 'float-num')
    }
    else{
         xxut.el('plDmgInd').innerHTML = string
         xxut.runAnim( xxut.el('plDmgInd'), 'float-num')
    }


    //if positive -> text green etc
    if(string[0] === '-'){
         xxut.el('enDmgInd').setAttribute('style', 'color:red;')
         xxut.el('plDmgInd').setAttribute('style', 'color:red;')

    }
    else{
         xxut.el('enDmgInd').setAttribute('style', 'color:white;')
         xxut.el('plDmgInd').setAttribute('style', 'color:white;')

    }
}

function updateUi(){
    //log
     xxut.el('log').innerHTML = `
        Encounter: ${xxDa.gameState.encounter} / ${xxDa.gameState.bossFrequency} <br> 
        Stage: ${xxDa.gameState.stage}
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
     xxut.el('p-life').innerHTML = `${playerObj.life}/${playerObj.maxLife}`
     xxut.el('p-def').innerHTML = `${playerObj.def}`
     xxut.el('p-dice').innerHTML = `${playerObj.roll} (d${playerObj.dice})`
     xxut.el('p-power').innerHTML = `${playerObj.power}`        

    //Enemy stats
     xxut.el('life').innerHTML = `${enemyObj.life}/${enemyObj.maxLife}`
     xxut.el('def').innerHTML = `${enemyObj.def}`
     xxut.el('dice').innerHTML = `${enemyObj.roll} (d${enemyObj.dice})`
     xxut.el('power').innerHTML = `${enemyObj.power}`        

    if(enemyObj.action === 'Attack'){
         xxut.el('intent').innerHTML = `${xxDa.enemyActions[enemyObj.action].desc} for ${enemyObj.roll + enemyObj.power}`
    }
    else if(enemyObj.action === 'Block'){
         xxut.el('intent').innerHTML = `${xxDa.enemyActions[enemyObj.action].desc} ${enemyObj.roll} damage`
    }
    else if (enemyObj.action === 'Detonate'){
         xxut.el('intent').innerHTML = `Will ${xxDa.enemyActions[enemyObj.action].desc} for ${enemyObj.maxLife} damage`
    }
    else{
         xxut.el('intent').innerHTML = `${xxDa.enemyActions[enemyObj.action].desc}`
    }
}

//Action buttons
function genCards(){
     xxut.el('playerActionContainer').innerHTML = ''
    
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
        
        if(item.cooldown !== undefined && item.cooldown < xxDa.itemsRef[item.action].cooldown){
            item.cooldown++
            button.disabled = true
        }

         xxut.el('playerActionContainer').append(button)
    })

    //Add empty item slots
    let emptySlots = playerObj.maxInventory - playerObj.inventory.length
    for (let i =0; i < emptySlots; i++){
        let button = document.createElement('button')
        button.innerHTML = `[ ]`
        button.disabled = true
        button.classList.add('action', 'empty-slot')
         xxut.el('playerActionContainer').append(button) 
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

export default{
    screen,
    floatText,
    updateUi,
    genCards,
    updateBtnLabel
}