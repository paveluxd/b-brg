//Actions DATA
    class ActionObj {
        constructor(actionKey){
            //Static props
            this.actionKey = actionKey
            

            //Variable properties generated
            let props = [
                {key:'actionName'  ,val: upp(actionKey)},
                {key:'actionId'    ,val: "ac" + Math.random().toString(8).slice(2)},//gens unique id
                {key:'actionCharge',val: 10},
                {key:'actionMod'   ,val: 0},
                {key:'cooldown'    ,val: undefined},
                {key:'actionType'  ,val: 'generic'},
                {key:'desc'        ,val: ''},
                {key:'passiveStats',val: []},
                {key:'keyId'       ,val: '???'},
                {key:'tags'        ,val: ''}
            ]

            //Resolves extra props
            props.forEach(property => {

                // console.log(property)

                //Find action by actionName
                let actionData = findByProperty(actionsRef, 'actionName', actionKey)

                //if no prop, set it to extra props vlaue
                if(typeof actionData[property.key] == 'undefined' || actionData[property.key] == ''){

                    this[property.key] = property.val 

                }
                //Randomize AC values
                else if (property.key == 'actionCharge') {
                    let actionChargeValue = rng(actionData[property.key], actionData[property.key] * config.chargeFloor)
                    if(actionChargeValue < 1){actionChargeValue = 1}
                    this[property.key] = actionChargeValue 
                } 
                //if exists in ref, set it as in ref.
                else {
                    this[property.key] = actionData[property.key] 
                }

                //Set action charge of all passive items to 1.
                if(actionData.actionType === 'passive' && property.key === 'actionCharge'){
                    this.actionCharge = 1 
                } 
            })

            // this.actionCharge = 100 //for testing

            //Static props
            this.flatActionCharge = this.actionCharge
        }

        
    }

    class Test{
        combatCacl(item) {
            console.log(item, 'mace action');
        }
    }

//Convert action id to strings
    actionsRef.forEach(action => {
        action.keyId = `a${action.keyId}`
    })

//Converts passiveStat to objects
    function convertStringsToArr(arr){
        arr.forEach(item => {
            //Convert passiveStat to arr
            //Check if there are passive stats
            if(item.passiveStats.length > 1){
                let passivesArr = item.passiveStats.split(', ')
                item.passiveStats = []
        
                passivesArr.forEach(stat =>{
                    statArr = stat.split(':')
                    item.passiveStats.push({'stat':statArr[0], 'value': parseInt(statArr[1])})
                })
                // console.log(item);
            }

            //Conver actions to arr
            if(item.actions == undefined) return false

            if(item.actions == ''){
                item.actions = []
            }
            else{
                item.actions = item.actions.split(', ')
            }
        })
    }
//Convert passiveStat, actions property to objects.
    convertStringsToArr(itemsRef)
    convertStringsToArr(actionsRef) 


//ACTIONS UI
    //Gen combat action set
    function syncActionTiles(){
        el('cards-row').innerHTML = ''

        //Set #cards-row width to display cards in two rows.
        // el('cards-row').setAttribute('style',`width:${149 * (Math.floor(gs.plObj.actions.length/2) + 1)}px;`)
        
        //Add button per player item
        gs.plObj.actions.forEach(action => {

            if(action.actionType == 'passive') return //Skip passives

            let actionCard = genActionCard(action)

            if(action.tags.includes('attack')){//Adds action at the start of the actions set
                el('cards-row').insertBefore(actionCard, el('cards-row').firstChild);
            }
            else{
                el('cards-row').append(actionCard)
            }

        })   
    }

    //Gen a single combat action card
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
        //If item does not exist, use placeholder image
        let itemString
        let itemRef = findItemByAction(action)

        // console.log(action);

        if (action.keyId == 'a62'){//punch
            itemString = 'punch'
        } 
        else if(itemRef == undefined){
            itemString = 'placeholder'
        }
        else{
            itemString = itemRef.itemName
        }

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
        let desc = `${upp(action.desc)}`

        //Rewrites headings for calc
        //See if you can merge it all with action obj/functions
        if(type != 'card'){//Remove numbers if generated for character page.
            if      (['block'].indexOf(referenceAction.actionName) > -1){
                heading = `${upp(action.actionName)} ${gs.plObj.roll} dmg`
            }else if(['bow attack'].indexOf(referenceAction.actionName) > -1){
                heading = `${upp(action.actionName)} for ${gs.plObj.roll + gs.plObj.power}`
            }else if(['sword attack'].indexOf(referenceAction.actionName) > -1){
                heading = `${upp(action.actionName)} (${3 + gs.plObj.power}+${gs.plObj.swordDmgMod})`
            }else if(['inferno'].indexOf(referenceAction.actionName) > -1){
                heading = `${upp(action.actionName)} (${gs.plObj.power * gs.plObj.coins} dmg)`
            }else if(['axe attack'].indexOf(referenceAction.actionName) > -1){

    
                //Cost
                //Deal with negative power
                let powerMod = gs.plObj.power
                if (powerMod < 0){powerMod = 0}
                
                let cost = (referenceAction.actionMod + powerMod) * -1
                let dmg
                let maxLife = gs.plObj.life 
    
                //If max life is lower than max life pre combat, set max life to pre combat value
                if(gs.plObj.flatLife > gs.plObj.life){
                    maxLife = gs.plObj.flatLife
                }
    
                dmg = Math.ceil((gs.plObj.flatLife - gs.plObj.life - cost)/2)
                heading = `${upp(action.actionName)} for ${dmg}`

                desc = `Pay ${cost * -1} life, deal 1 dmg per 2 missing life`
            }
        }

        button.querySelector('section').innerHTML = `
            <span>
                <h3>${heading}</h3> 
                <p class="charge-indicator">x${action.actionCharge}</p>
                ${cooldownCounter}
            </span>
            <p class='desc'>${desc}.</p>
            <img src="./img/items/${itemString}.svg">
        `
        return button
    }

    function resolveEndOfCombatPassiveActions(){
        gs.plObj.actions.forEach(action => {
            if(action.keyId == 'a66'){
                //Heal value
                restoreLife(action.actionMod)
                
                //Log
                gs.logMsg.push(`${action.actionName}: ${action.desc}`)  
            }
        })
    }