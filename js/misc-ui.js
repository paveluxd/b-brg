//UI
    function syncUi(){
        // console.log(`UI was synced.`);

        syncActionTiles()
        syncCharPage()
        syncItemCards()
        // generateSkillTree()

        //Combat screen: Log stats at the top
            if(gs.inCombat){
                //Top left log
                el('log').innerHTML = `
                    Enc: ${gs.encounter}/${gs.playerLocationTile.enemyQuant}<br>
                    Ene: lvl ${gs.enObj.level} ${gs.enObj.profile.profileId}<br>
                    ` 
                    // Loc: ${gs.playerLocationTile.tileId}
                    // Tur: ${gs.combatTurn}<br>
                    // Lvl: ${gs.plObj.lvl} / Exp:${gs.plObj.exp}

                //Enemy floating number
                //gs.enemyAction -> Previous action

                // if(gs.enObj.dmgTaken > 0){//Attack
                //     floatText('en',`-${gs.enObj.dmgTaken} life`)
                // }else if(gs.enObj.action.key === 'fortify'){
                //     floatText('en',`+${gs.enObj.action.stat} def`)
                // }else if(gs.enObj.action.key === 'empower'){
                //     floatText('en',`+${gs.enObj.action.stat} power`)
                // }else if(gs.enObj.action.key === 'rush'){
                //     floatText('en',`+${gs.enObj.action.stat} dice`)
                // }else if(gs.enObj.action.key === 'sleep'){
                //     floatText('en',`Zzzzz`)
                // }else if(gs.enObj.action.key === 'block'){
                //     floatText('en',`Blocked ${gs.enObj.action.stat}`)
                // }else if(gs.enObj.action.key === 'recover'){
                //     floatText('en',`Recovered ${gs.enObj.action.stat} ${gs.enObj.action.actionVal}`)
                // }

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

                //Life 5 ico indication
                    //Pl   
                    if      (gs.plObj.life / gs.plObj.flatLife < 0.2){
                        el('p-life-icon').setAttribute('src', './img/ico/life-20.svg')
                    }else if(gs.plObj.life / gs.plObj.flatLife < 0.4){
                        el('p-life-icon').setAttribute('src', './img/ico/life-40.svg')
                    }else if(gs.plObj.life / gs.plObj.flatLife < 0.6){
                        el('p-life-icon').setAttribute('src', './img/ico/life-60.svg')
                    }else if(gs.plObj.life / gs.plObj.flatLife < 0.8){
                        el('p-life-icon').setAttribute('src', './img/ico/life-80.svg')
                    }else{
                        el('p-life-icon').setAttribute('src', './img/ico/life.svg')
                    } 
                    //Ene
                    if      (gs.enObj.life / gs.enObj.flatLife < 0.2){
                        el('e-life-icon').setAttribute('src', './img/ico/life-20.svg')
                    }else if(gs.enObj.life / gs.enObj.flatLife < 0.4){
                        el('e-life-icon').setAttribute('src', './img/ico/life-40.svg')
                    }else if(gs.enObj.life / gs.enObj.flatLife < 0.6){
                        el('e-life-icon').setAttribute('src', './img/ico/life-60.svg')
                    }else if(gs.enObj.life / gs.enObj.flatLife < 0.8){
                        el('e-life-icon').setAttribute('src', './img/ico/life-80.svg')
                    }else{
                        el('e-life-icon').setAttribute('src', './img/ico/life.svg')
                    }

                //Control stat vis
                    // if(gs.enObj.poisonStacks > 0){
                    //     el('poison-stat').classList.remove('hide')
                    // }else{
                    //     el('poison-stat').classList.add('hide')
                    // }

                //Enemy stats
                    el('life').innerHTML    =`${gs.enObj.life}`
                    el('def').innerHTML     =`${gs.enObj.def}`
                    el('dice').innerHTML    =`${gs.enObj.roll}<span>/${gs.enObj.dice}</span>`
                    el('power').innerHTML   =`${gs.enObj.power}`        

                //Enemy intent indicator
                    // console.log(gs.enObj.action);
                    el('intent').innerHTML = `${gs.enObj.action.desc} <p id="status-fx"></p>`

                //Add reflect indicator
                    if(gs.enObj.action.key == 'sleep'){ //Sleep
                        el('status-fx').innerHTML += `
                            <span id='action-tag'>
                                Will idle 
                            </span>
                        `
                    }else if(gs.enObj.action.key == 'combo'){ //Combo
                        el('status-fx').innerHTML += `
                            <span id='action-tag'>
                                Multistrike x3
                            </span>
                        `
                    }
                    else if(gs.enObj.action.key == 'charge'){ //Combo
                        el('status-fx').innerHTML += `
                            <span id='action-tag'>
                                ${gs.enObj.action.actionVal} turns
                            </span>
                        `
                    }
                    if(gs.enObj.reflect){ //Reflect
                        el('status-fx').innerHTML += `
                            <span id='reflect-tag'>
                                Reflects ${gs.enObj.dice}+
                            </span>
                        `
                    }
                    if(gs.enObj.bannedAction != undefined){ //Banned action
                        el('status-fx').innerHTML += `
                            <span id='ban-tag'>
                                Can't ${gs.enObj.bannedAction}
                            </span>
                        `
                    }
                    if(gs.enObj.poisonStacks > 0){ //Poison
                        el('status-fx').innerHTML += `
                            <span id='poison-tag'>
                                <img src='./img/ico/poison.svg'>
                                ${gs.enObj.poisonStacks} 
                            </span>
                        `
                    }
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
        //Update exp bar indicator
            el('.exp-progress').setAttribute('style',`width:${gs.plObj.exp / gs.plObj.lvlUpExp * 100}%`)
            el('.lvl-indicator').innerHTML = gs.plObj.lvl
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
        // console.log(`Screen() was triggered by:`, elemId);

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

        //Show page
        el(elemId).classList.remove('hide') 
    }

    //Screen that offers a choice of item, action etc
    //So far only for a67 carabiner
    function chooseOne(argument, choiceId){

        //Clear container
        el('choose-one-body').innerHTML = ``

        gs.plObj.inventory.forEach(item => {
            if(item.equipped) return

            let chooseOneItemCard = genItemCard(item, 'item-to-choose')
            el('choose-one-body').append(chooseOneItemCard)
        })

        //Open a screen
        screen('choose-one')

        //Resolve the choice
        if(argument == 'resolve'){
            //Save equipped item to reequip at the end of the combat
            gs.plObj.carabiner.push(choiceId)

            //Equip item
            equipUnequipItem(choiceId)

            //Close screen
            screen('combat')

            //Regen action cards
            syncActionTiles()
        }
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
        if(target == 'player'){
            el('player-sprite').innerHTML = `
                <img src="./img/character/shade.svg">
                <img src="./img/character/${rng(3,1)}-back.svg">
                <img src="./img/character/${rng(3,1)}-back-arm.svg">
                <img src="./img/character/${rng(4,1)}-legs.svg">
                <img src="./img/character/${rng(4,1)}-torso.svg">
                <img src="./img/character/${rng(3,1)}-front-arm.svg">
                <img src="./img/character/${rng(5,1)}-head.svg">
                <img id='p-ghost' src="">
            `
        }
        else if(target == 'enemy'){

            // console.log(gs.enObj.profile);
            if(Object.keys(profileRef.boss).includes(gs.enObj.profile.profileId)){
            // if(gs.playerLocationTile.boss){

                el('enemy-sprite').innerHTML = `
                    <img src="./img/character/shade.svg">
                    <img src="./img/enemy/boss/${gs.enObj.profile.profileId}.svg">
                    <img id='e-ghost' src="">
                ` 

                el('e-img-column').classList.add('boss')
            }
            else{

                let enemySpriteParts

                if      (gs.enObj.profile.profileId == 'mage'){
                    enemySpriteParts = `
                        <img src="./img/enemy/mage/${rng(2,1)}-back-arm.svg">
                        <img src="./img/enemy/mage/${rng(2,1)}-legs.svg">
                        <img src="./img/enemy/mage/${rng(2,1)}-torso.svg">
                        <img src="./img/enemy/mage/${rng(2,1)}-front-arm.svg">
                        <img src="./img/enemy/mage/${rng(3,1)}-head.svg">
                    `
                }else if(gs.enObj.profile.profileId == 'minion'){
                    enemySpriteParts = `
                        <img src="./img/enemy/minion/${rng(2,1)}-back-arm.svg">
                        <img src="./img/enemy/minion/${rng(2,1)}-legs.svg">
                        <img src="./img/enemy/minion/${rng(2,1)}-torso.svg">
                        <img src="./img/enemy/minion/${rng(2,1)}-front-arm.svg">
                        <img src="./img/enemy/minion/${rng(2,1)}-head.svg">
                    `
                }else if(gs.enObj.profile.profileId == 'gladiator'){
                    enemySpriteParts = `
                        <img src="./img/enemy/gladiator/${rng(1,1)}-back-arm.svg">
                        <img src="./img/enemy/gladiator/${rng(1,1)}-legs.svg">
                        <img src="./img/enemy/gladiator/${rng(1,1)}-torso.svg">
                        <img src="./img/enemy/gladiator/${rng(1,1)}-front-arm.svg">
                        <img src="./img/enemy/gladiator/${rng(1,1)}-head.svg">
                    `
                }else if(gs.enObj.profile.profileId == 'assassin'){
                    enemySpriteParts = `
                        <img src="./img/enemy/assassin/${rng(2,1)}-back-arm.svg">
                        <img src="./img/enemy/assassin/${rng(3,1)}-legs.svg">
                        <img src="./img/enemy/assassin/${rng(3,1)}-torso.svg">
                        <img src="./img/enemy/assassin/${rng(2,1)}-front-arm.svg">
                        <img src="./img/enemy/assassin/${rng(2,1)}-head.svg">
                    `
                }else{ //sets balanced enemy profile
                    enemySpriteParts = `
                        <img src="./img/enemy/balanced/${rng(3,1)}-back-arm.svg">
                        <img src="./img/enemy/balanced/${rng(2,1)}-legs.svg">
                        <img src="./img/enemy/balanced/${rng(2,1)}-torso.svg">
                        <img src="./img/enemy/balanced/${rng(3,1)}-front-arm.svg">
                        <img src="./img/enemy/balanced/${rng(5,1)}-head.svg">
                    `
                }

                el('enemy-sprite').innerHTML = ` 
                    <img src="./img/character/shade.svg">
                        ${enemySpriteParts}
                    <img id='e-ghost' src="">
                ` 
                el('e-img-column').classList.remove('boss')
            }
        }
    }



//MISC
    //Game state screen
    function openStateScreen(type){
        //Starvation
        if(type == 'starved'){
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