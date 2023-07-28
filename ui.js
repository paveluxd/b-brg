import {Utility} from "./utility.js"
let utility = new Utility()

import { 
    combatState, playerObj, enemyObj 
} from "/main.js"
import {
    Item, PlayerObj, EnemyObj, CombatState, GameState, itemsRef, rewardRef, enemyActions, gameState
} from "./data.js"


let playerActionContainer = utility.el('playerActionContainer')

//UI



export function floatText(target, string){

    if(target === 'en'){
        utility.el('enDmgInd').innerHTML = string
        utility.runAnim(utility.el('enDmgInd'), 'float-num')
    }
    else{
        utility.el('plDmgInd').innerHTML = string
        utility.runAnim(utility.el('plDmgInd'), 'float-num')
    }


    //if positive -> text green etc
    if(string[0] === '-'){
        utility.el('enDmgInd').setAttribute('style', 'color:red;')
        utility.el('plDmgInd').setAttribute('style', 'color:red;')

    }
    else{
        utility.el('enDmgInd').setAttribute('style', 'color:white;')
        utility.el('plDmgInd').setAttribute('style', 'color:white;')

    }
}

export function updateUi(){
    //log
    utility.el('log').innerHTML = `Stage: ${gameState.stage} <br> Turn: ${combatState.turn}` 

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
    utility.el('p-life').innerHTML = `${playerObj.life}/${playerObj.maxLife}`
    utility.el('p-def').innerHTML = `${playerObj.def}`
    utility.el('p-dice').innerHTML = `${playerObj.roll} (d${playerObj.dice})`
    utility.el('p-power').innerHTML = `${playerObj.power}`        

    //Enemy stats
    utility.el('life').innerHTML = `${enemyObj.life}/${enemyObj.maxLife}`
    utility.el('def').innerHTML = `${enemyObj.def}`
    utility.el('dice').innerHTML = `${enemyObj.roll} (d${enemyObj.dice})`
    utility.el('power').innerHTML = `${enemyObj.power}`        

    if(enemyObj.action === 'Attack'){
        utility.el('intent').innerHTML = `${enemyActions[enemyObj.action].desc} for ${enemyObj.roll + enemyObj.power}`
    }
    else if(enemyObj.action === 'Block'){
        utility.el('intent').innerHTML = `${enemyActions[enemyObj.action].desc} ${enemyObj.roll} damage`
    }
    else if (enemyObj.action === 'Detonate'){
        utility.el('intent').innerHTML = `Will ${enemyActions[enemyObj.action].desc} for ${enemyObj.maxLife} damage`
    }
    else{
        console.log(enemyActions[enemyObj.action]);
        utility.el('intent').innerHTML = `${enemyActions[enemyObj.action].desc}`
    }
}

//Action buttons
export function genCards(){
    playerActionContainer.innerHTML = ''
    
    //Add buyyons per player item
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
        
        if(item.cooldown !== undefined && item.cooldown < itemsRef[item.action].cooldown){
            item.cooldown++
            button.disabled = true
        }

        playerActionContainer.append(button)
    })

    //Add empty item slots
    let emptySlots = playerObj.maxInventory - playerObj.inventory.length
    for (let i =0; i < emptySlots; i++){
        let button = document.createElement('button')
        button.innerHTML = `[ ]`
        button.disabled = true
        button.classList.add('action', 'empty-slot')
        playerActionContainer.append(button) 
    }

}

export function updateBtnLabel(buttonElem, itemObj){
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