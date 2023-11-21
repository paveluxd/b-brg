let gs //game state object


//Game
    class GameState {
        constructor(){
            this.stage = config.stage
            this.encounter = 1

            //Encounter
            this.inCombat = false
            this.combatTurn = 1
            this.logMsg = []      // Combat log messages.
            this.statChange = []  // Stats for UI indicator.
            this.enemyAction = [] // Last enemy action.
            
            //Map data obj.
            this.mapObj                                   
            
            //Stats for end game screen.
            this.turnCounter = 0 //Calc turns for win stats.
            this.enemyCounter = 0
            this.totalEnemies = config.portalDefenders + this.stage
            this.totalCombatTurns = 0
            
            //Merchant config.
            this.merchantQuant = config.merchantQuant

            //Casino bets.
            //TBA

            //Combat config.
            this.enemySpawnFrequency = 3 //1 is 100%, 2 is 50%.
            this.enemyPartyCap = 2

            this.bossFrequency   = 3 // Every Nth stage legacy.
            this.flatItemReward  = 2 // Base rewards.
            this.flatFoodReward  = 1 // Food per round +1 per enemy.
            this.flatCoinsReward = 6 
        }
    }

//Player
    class PlayerObj {
        constructor(){
            //Life
                this.baseLife          = config.life   //Lvl 1 char life
                this.flatLifeMod       = 0
                this.flatLife          = this.baseLife //Life cap.
                this.life              = this.baseLife //Current life.
                this.dmgDone           = 0
                this.dmgTaken          = 0
                this.lifeChange        = 0
                this.lifeChangeMarker  = false
            //Power
                this.basePower         = config.power
                this.flatPower         = this.basePower
                this.power             = this.basePower
                this.powerChange       = 0
                this.powerChangeMarker = false
            //Def
                this.baseDef           = config.def
                this.flatDef           = this.baseDef
                this.def               = this.baseDef
                this.defChange         = 0
                this.defChangeMarker   = false
            //Dice
                this.baseDice          = config.dice //needed as ref in case flat dice is modified by item
                this.flatDice          = this.baseDice
                this.dice              = this.baseDice
                this.diceChange        = 0
                this.diceChangeMarker  = false
            //Roll
                this.roll              = 0
                this.rollBonus         = 0
                this.rollChange        = 0
                this.rollChangeMarker  = false

            //While in combat
                this.piercing          = false
                this.swordDmgMod       = 0
                this.poisonBuff        = false
                

            //Inventory
                this.inventorySlots = config.inventory
                this.inventory      = [] //Items gained as rewards
                this.startingItems  = config.startingItems   
            //Equipment slots
                this.baseSlots      = config.slots
                this.equipmentSlots = this.baseSlots
            //Actions
                this.actionSlots    = this.baseSlots
                this.actions        = [] //Actions gained from items
                this.tempActions    = [] //Temporary actions

            // this.draftActions   = [] //Draft actions gained from items

            //Sub-stats
                this.coins          = config.coins
                this.food           = config.food
            //Progression
                this.exp            = 0
                this.lvl            = 1
                this.lvlUpExp       = config.expRequiredPerLvl
                this.treeNodes      = []
                this.treePoints     = config.basePassieSkillPoints
            //Misc
                this.offeredItemsArr     = [] //Stores rewards
        }
    }

//Items
    class ItemObj {
        constructor(itemName, iLvl){

            //Static properties taken from reference.
            this.actions = []

            //If no itemName -> get random
            if(itemName == undefined){
                let refNo = rng(itemsRef.length - 1, 0)
                itemName = itemsRef[refNo].itemName
            }

            //Finds item data in csv itensRef
            let itemData = findByProperty(itemsRef, 'itemName', itemName)
            
            //Set iLvl to stage val
            if(iLvl === undefined && gs !== undefined){
                iLvl = gs.stage
            }else{
                iLvl = 1
            } 

            //Gen variable properties
            let props = [
                {key:'itemName'    ,val: upp(itemName)},
                {key:'itemSlot'    ,val: 'generic'},
                {key:'itemId'      ,val: "it" + Math.random().toString(8).slice(2)},//gens unique id
                {key:'equipped'    ,val: false},
                {key:'passiveStats',val: []},
                {key:'cost'        ,val: rng(12, 6)},
                {key:'desc'        ,val: undefined},
                // {key:'durability'  ,val: 10},
            ]
            //Resolve props via default value above, or value from reference object
            props.forEach(property => {

                if(itemData[property.key] === undefined || itemData[property.key] === ''){
                    this[property.key] = property.val //if no prop, set it to extra props value
                }
                else {
                    this[property.key] = itemData[property.key] //if exists in ref, set it as ref.
                }
            })

            //Static props
            this.enhancementQuantity = 0 //Increases cost per enhancement.
            this.repairQuantity = 0

            //Resolve actions
            if(itemData.actions.length == 0 || itemData.actions == undefined){
                itemData.actions = []
            }
            else{
                itemData.actions.forEach(actionKey => {
                    this.actions.push(new ActionObj(actionKey))
                })    
            }
        }
    }
    //Calc equipped items
    function calcEquippedItems(){
        let equipped = 0
        gs.plObj.inventory.forEach(item => {
            if(item.equipped){
                equipped++
            }
        })

        return equipped
    }
    //Calculates cost for ench repair etc.
    function calcCost(type, itemId){
        let targetItem = findItemById(itemId)
        let cost

        if(type == 'enhance'){
            cost = targetItem.cost * (targetItem.enhancementQuantity + 1)
        }
        else if(type == 'repair'){
            cost = targetItem.cost * (targetItem.repairQuantity + 1)
        }

        return cost
    }

//Actions
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
                {key:'keyId'       ,val: '???'}
            ]

            //Resolves extra props
            props.forEach(property => {

                // console.log(property)

                //Find action by actionName
                let actionData = findByProperty(actionsRef, 'actionName', actionKey)

                if(typeof actionData[property.key] === 'undefined' || actionData[property.key] === ''){
                    this[property.key] = property.val //if no prop, set it to extra props vlaue
                }
                else {
                    this[property.key] = actionData[property.key] //if exists in ref, set it as red.
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



//Saving
    function saveGame(){
        //Increase stage to scale enemies
        gs.stage++ 
        gs.mapObj = new MapObj //Generate a mapObj for the next stage

        localStorage.setItem('gameState', JSON.stringify(gs))        
        console.log('Game saved');
    }

    function clearSavedGame(){
        localStorage.removeItem('gameState')
        console.log('Game save removed');
    }

    function loadGame(){
        let gameObj = JSON.parse(localStorage.getItem('gameState'))

        if (gameObj == undefined){
            // gs = new GameState

            // gs.plObj = new PlayerObj
            // //Resolve ititial items
            // gs.plObj.startingItems.forEach(key => {addItem(key)})

            console.log('New game started');
        }
        else {
            gs = gameObj
            console.log('Game loaded');
        }
    }