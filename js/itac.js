//ACTIONS
    //Resolve action charges
    function resolveCharge(action){
        action.actionCharge--

        if(action.actionCharge < 1){

            //Remove action
            removeFromArr(gs.plObj.actions, action)
            removeFromArr(gs.plObj.tempActions, action)

            //Resolve item on 0 charge
            let item = findItemByAction(action)
            //Delete id consumable
            if(
                item.itemName.includes('potion') ||
                item.itemName.includes('scroll') ||
                item.itemName.includes('curse')
            ){
                removeItem(item.itemId)
            }
            //Else unequip
            else if(item.passiveStats.length === 0){
                equipItem(item.itemId)
            }

            
            //Loose passive stat
            resolvePlayerStats()  
        }
    }
    //Resolve stats
    //Recalc stats & adds actions from items
    function resolvePlayerStats(){

        //Resets actions
        //Regen action list if the item was added, removed, equipped, unequipped
        gs.plObj.actions = []

        //Adds actions from items to players actions array.
        gs.plObj.inventory.forEach(item => {

            //Check all equipped items
            if(item.equipped){

                //Add all actions from equipped item.
                item.actions.forEach(action => {
                    if(gs.plObj.actionSlots < gs.plObj.actions.length) return
                    if(action.actionCharge < 1) return

                    //Add action to player actions
                    gs.plObj.actions.push(action)  
                })
            }
        })

        //Add temporary actions to players actions array.
        gs.plObj.tempActions.forEach(action => {
            if(gs.plObj.actionSlots > gs.plObj.actions.length){
                gs.plObj.actions.push(action)
            }
        })



        //Resolve life  
        //Add reclaculation for all stats
        let baseLife = gs.plObj.baseLife + gs.plObj.flatLifeMod //Flat life mod for max life spell fx
        let flatLife = 0
        let lifeMultiplier = 1
        let lifeDeviation = gs.plObj.life - gs.plObj.flatLife// See if temporary bonuses should be included.

        let basePower = gs.plObj.basePower
        let flatPower = 0
        let powerDeviation = gs.plObj.power - gs.plObj.flatPower

        let baseDef = gs.plObj.baseDef
        let flatDef   = 0
        let defDeviation = gs.plObj.def - gs.plObj.flatDef

        let baseDice = gs.plObj.baseDice
        let flatDice = baseDice
        let diceDeviation = gs.plObj.dice - gs.plObj.flatDice

        let flatSlots = gs.plObj.baseSlots

        //Extracts stats
        function extractPassiveStats(obj){{
            obj.passiveStats.forEach(statObj => {
        
                //Flat life
                if(statObj.stat === 'life'){
                    flatLife += statObj.value
                }
        
                //% life
                else if(statObj.stat === 'life%'){
                    lifeMultiplier += (statObj.value / 100)
                }

                //Flat power
                else if(statObj.stat === 'power'){
                    flatPower += statObj.value
                }

                //
                else if(statObj.stat === 'def'){
                    flatDef += statObj.value
                }

                //Replace dice
                else if(statObj.stat === 'dice'){
                    flatDice = statObj.value
                }

                else if(statObj.stat === 'dice-mod'){
                    flatDice += statObj.value
                }

                //Item slots
                else if(statObj.stat === 'slots'){
                    flatSlots += statObj.value
                }
            })
        }}

        //Check items
        gs.plObj.inventory.forEach(item => {
            if(item.passiveStats.length > 0 && item.equipped){
                extractPassiveStats(item)
            }
        })

        //Check actions
        gs.plObj.actions.forEach(action => {
            if(action.passiveStats.length > 0){
            extractPassiveStats(action)
            }
        })

        //Check tree nodes
        gs.plObj.treeNodes.forEach(node => {
            if(node.passiveStats !== undefined && node.passiveStats.length > 0){
                extractPassiveStats(node)
            }
        })

        //Life final calculation
        //(base + flat) + deviation + temporary
        //Temporayr not yet implemented
        gs.plObj.flatLife= Math.round((baseLife + flatLife) * lifeMultiplier)
        gs.plObj.life = gs.plObj.flatLife+ lifeDeviation  

        //Power final calculation
        //(base + flat) + deviation + temporary
        gs.plObj.flatPower = basePower + flatPower
        gs.plObj.power = gs.plObj.flatPower + powerDeviation

        //Def final calc
        gs.plObj.flatDef = baseDef + flatDef
        gs.plObj.def = gs.plObj.flatDef + defDeviation

        //Dice
        gs.plObj.flatDice = flatDice
        gs.plObj.dice = gs.plObj.flatDice + diceDeviation

        //Slots 
        gs.plObj.equipmentSlots = flatSlots
        gs.plObj.actionSlots = flatSlots
    }
    //Resolve post-roll passives
    function resolvePostRollPassives(){
        gs.plObj.actions.forEach(action => {
            if     (action.keyId == 'a58'){ // power surge
                if(gs.plObj.roll == 8){
                    gs.plObj.power += action.actionMod
                    gs.logMsg.push(`Power surge: +1 power (passive).`)
                    el('p-power').innerHTML = gs.plObj.power
                }
            }
            else if(action.keyId == 'a59'){ // armor up
                if(gs.plObj.roll == 4){
                    gs.plObj.def += action.actionMod
                    gs.logMsg.push(`Armor up: ${action.actionMod} def (passive).`)
                    el('p-def').innerHTML = gs.plObj.def
                }
            }
        })
    }



//Dealing with offered items
    //Gen list
    function genOfferedItemList(quant, event) {

        gs.plObj.offeredItemsArr = []
        let generatedReward

        if(quant == undefined){quant = gs.flatItemReward}//Resolve undefined quant

        if(quant == "all"){//all items for testing
            itemsRef.forEach(item => {
                generatedReward =  new ItemObj(item.itemName)
                gs.plObj.offeredItemsArr.push(generatedReward.itemName)
                

                //Add card to container
                el('merchant-container').append(genItemCard(generatedReward, 'item-to-buy'))
            })
        }else{

            //Gen item per quant value in function
            for(i = 0; i < quant; i++){ 
    
                generatedReward =  new ItemObj()
    
                //Add item to reward pool, to find them after item card is selected from html
                gs.plObj.offeredItemsArr.push(generatedReward)
                
                //Add html cards per item
                if(event == 'reward'){
                    //Gen item html card elem
                    let rewardElem = genItemCard(generatedReward, 'reward')
    
                    //Add card to container
                    el('reward-container').append(rewardElem)
                }
                else if(event == 'merchant'){
                    //Gen item html card elem
                    let rewardElem = genItemCard(generatedReward, 'item-to-buy')
    
                    //Add card to container
                    el('merchant-container').append(rewardElem)
                }
            }
        }

    }
    //Resolve
    function resolveChoosingOfferedItem(itemId, event){   

        //Find item with matching id
        gs.plObj.offeredItemsArr.forEach(targetItem => {

            if(targetItem.itemId == undefined || targetItem.itemId != itemId) return false

            //If no slots return
            if(gs.plObj.inventory.length == gs.plObj.inventorySlots){ 
                showAlert('No inventory slots.') 
                return
            }

            if(event == 'reward'){
                //Add item to players inventory & auto-equip
                gs.plObj.inventory.push(targetItem)
                equipItem(targetItem.itemId)
    
                //Move inventory list back to it's page
                el('inventory').childNodes[1].append(el('inventory-list'))
                
                //screen() is ran from the button.
            }
            else if(event == 'purchase'){
                if(resolvePayment(targetItem.cost) == false) return
                
                //Destroy item card
                el(itemId).remove()

                //Update coins indicator
                el('merchant-coins-indicator').innerHTML = `You have: ${gs.plObj.coins}<img src="./img/ico/coin.svg">`

                showAlert(`${upp(targetItem.itemName)} purchased for ${targetItem.cost} and added to the inventory.`)

                gs.plObj.inventory.push(targetItem)

                equipItem(targetItem.itemId)
            }

        })
    }



//ITEMS
    //Add item (to player inventory based on arguments).
    function addItem(key, iLvl){

        //Check if there are slots in the inventory.
        if(gs.plObj.inventory.length < gs.plObj.inventorySlots){

            // console.log(key);

            //Create new item obj
            let newItem = new ItemObj(key, iLvl)

            //If empty equippment slots, equip item automatically.
            if(gs.plObj.equipmentSlots > calcEquippedItems()){
                newItem.equipped = true
            }

            //Add item to the inventory.
            gs.plObj.inventory.push(newItem)

            //Resolve stats and actions added by item?
            // resolvePlayerStats()
        }

        else{
            showAlert('Inventory is full.')
        }
    }
    //Equip/unequip item.
    function equipItem(itemId){

        //Find item by id
        let item = findItemById(itemId)

        //Get item types to prevent staking
        let itemSlots = []
        gs.plObj.inventory.forEach(invItem => {
            if(!invItem.equipped || invItem.itemSlot == 'generic') return false
            itemSlots.push(invItem.itemSlot)
        })


        //Equip
        if(
            !item.equipped &&                         //check if equipped
            gs.plObj.equipmentSlots > calcEquippedItems() &&  //check if there are slots
            !itemSlots.includes(item.itemSlot)        //check if unique type
        )
        {
            item.equipped = true
        } 
        //Unequip item
        else if (item.equipped == true){
            item.equipped = false
        }
        else if(itemSlots.includes(item.itemSlot)){
            showAlert("Can't equip two items of the same type.")
        }
        else {
            showAlert('No equippment slots.')
        }

        resolvePlayerStats()//Adjust this to recalc all items
        syncUi()
    }
    //Remove/drop item (inventory).
    function removeItem(itemId){
        let item = findByProperty(gs.plObj.inventory, 'itemId', itemId)
        
        //Remove item actions
        item.actions.forEach(action => {
            removeFromArr(gs.plObj.actions, action)
        })

        //Remove from inventory
        removeFromArr(gs.plObj.inventory, item)

        syncUi()
    }
    //Sell item (merchant).
    function sellItem(itemId){
        let item = findItemById(itemId)
        
        gs.plObj.coins += item.cost
        
        removeItem(itemId)

        showAlert(`${upp(item.itemName)} sold for ${item.cost} coins.`)
    }
    //Enhance item (blacksmith).
    function modifyItem(itemId, type){
        //Find item
        let targetItem = findItemById(itemId)

        if(type == 'enhance'){
            if(resolvePayment(calcCost('enhance', itemId)) == false) return

            //Item enchance logic
                 //Add passive mod
                let addedStat = rarr([{stat:'life',value:6}, {stat:'power',value:1}, {stat:'def',value:2}])

                //If no mods add.
                if(targetItem.passiveStats.length < 1){
                    targetItem.passiveStats.push(addedStat)
                }
                //Check if matching stat exists -> increase stat
                else{
                    let matchingStat

                    targetItem.passiveStats.forEach(statObj =>{
                        if(addedStat.stat != statObj.stat) return false
                
                        matchingStat = true
                        statObj.value += addedStat.value  
                    })

                    //Else add stat
                    if(!matchingStat){
                        targetItem.passiveStats.push(addedStat)
                    }
                }

                //Increase ench quant to increase cost per enhant of the same item.
                targetItem.enhancementQuantity++

            resolvePlayerStats()//Recalculates passive stats
            showAlert('Item enhancement.')
        }
        else if(type == 'repair'){
            //Find 1st action
            let action = targetItem.actions[0]

            //If no actions return
            if(action == undefined) return showAlert("This item can't be repaired.")

            //If can't pay return
            if(resolvePayment(calcCost('repair', itemId)) == false) return

            //Add 50% of max charges
            action.actionCharge += Math.ceil(action.flatActionCharge / 2)

            //Increase ench quant to increase cost per enhant of the same item.
            targetItem.repairQuantity++

            //item repair logic
            showAlert('Item repaired.')
        }

        syncUi()
    }
    //Move function for purchasing and item here.

    //Util: resolve payment.
    function resolvePayment(cost){
        if(gs.plObj.coins < cost){
            showAlert(`You can't afford this. You need <img src="./img/ico/coin.svg"> ${cost - gs.plObj.coins} more.`)
            return false
        }
        else{
            gs.plObj.coins -= cost
            showAlert(`You paid <img src="./img/ico/coin.svg"> ${cost} coins.`)
        }
    }
    //Util: find item by action.
    function findItemByAction(action){
        let itemWihtAction

        gs.plObj.inventory.forEach(item => {

            item.actions.forEach(itemAction => {

                if(itemAction.actionId === action.actionId){

                    itemWihtAction = item

                }

            })

        })

        return itemWihtAction
    }
    //Util: find item by id.
    function findItemById(itemId, sourceArr){
        let targetItem

        if(sourceArr == undefined){
            sourceArr = gs.plObj.inventory
        }

        sourceArr.forEach(item => {
            if(item.itemId != itemId) return false
            targetItem = item
        })

        if(targetItem == undefined){
            gs.plObj.offeredItemsArr

            sourceArr.forEach(item => {
                if(item.itemId != itemId) return false
                targetItem = item
            })
        }

        return targetItem
    }