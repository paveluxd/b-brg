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

//Enemy
    class EnemyObj {
        constructor(){
            this.level = gs.stage //tileIdRef[1] prev. value.
            
            //Misc
            this.poisonStacks = 0
            this.crit = false
            this.state = '' //Used for stun, fear etc.

            this.actionRef = []
            this.acctionMod = ''

            //Choose enemy profile
            let profiles = 'balanced, tank, assassin'.split(', ') //, tank, assassin, minion
            let randomEnemyProfile = rarr(profiles)
            let powerMod, defMod, diceMod, imgPath, lifeMod
            // el('enemyImg').classList.remove('boss')

            if      (randomEnemyProfile == 'balanced'){
                lifeMod  = 1
                powerMod = 1
                defMod   = 1
                diceMod  = 1

                this.profile = 'balanced'
                imgPath  = `balanced/${rng(17,1)}` //Sprite builder is now in ui.js

            }else if(randomEnemyProfile == 'tank'){
                lifeMod  = 1.5
                powerMod = 0.5
                defMod   = 3.5
                diceMod  = 0.5

                this.profile = 'tank'
                imgPath  = `tank/${rng(1,1)}`

            }else if(randomEnemyProfile == 'assassin'){
                lifeMod  = 1.2
                powerMod = 1.5
                defMod   = 0.5
                diceMod  = 1

                this.profile = 'assassin'
                imgPath  = `assassin/${rng(1,1)}`

            }else if(randomEnemyProfile == 'minion'){
                lifeMod  = 0.7
                powerMod = 0.5
                defMod   = 0.5
                diceMod  = 0.5

                this.profile = 'minion'
                imgPath  = `minion/${rng(1,1)}`
                
            }

            //Set boss mods
            // if(gs.stage % gs.bossFrequency === 0){//boss
            //     // lifeMod  += 0.5
            //     // powerMod += 0.25
            //     // defMod   += 0.25
            //     // diceMod  += 0.25

            //     this.profile = 'boss'
            // }

            //Set stats
            //Get column value to scale mobs
            let tileIdRef = []
            gs.playerLocationTile.tileId.split('-').forEach(val =>{
                tileIdRef.push(parseInt(val))
            })

            // mod(0.5) -> Get +1 every 2 stages
            this.life        = 0 + Math.round((config.eneLife   + this.level) * lifeMod )
            this.flatLife    = this.life
            this.dmgDone     = 0 // For dmg calc.
            this.dmgTaken    = 0 // For dmg calc.
            this.lifeChange  = 0
            this.lifeChangeMarker = false

            this.power       = 0 + Math.round((0.2 * this.level) * powerMod) 
            this.flatPower   = this.power
            this.powerChange = 0
            this.powerChangeMarker = false

            this.def         = 0 + Math.round((0.2 * this.level) * defMod)
            this.flatDef     = this.def
            this.defChange   = 0
            this.defChangeMarker = false

            this.dice        = 4 + Math.round((0.2 * this.level) * diceMod)
            this.flatDice    = this.dice 
            this.diceChange  = 0
            this.diceChangeMarker = false

            this.roll        = 0
            this.rollChange  = 0
            this.rollChangeMarker = false
        }
    }
    class EnemyActionObj {
        constructor(key){

            //Gen icon path
            function ico(icoKey){
                let path = `<img src="./img/ico/${icoKey}.svg">`
                return path
            }

            this.key = key

            //Damage
            if      (key == 'attack'){

                this.rate = 1
                this.actionVal = gs.enObj.roll + gs.enObj.power 
                // this.desc = `${ico('attack')}${this.actionVal} dmg`
                this.desc = `${ico('attack')}Will attack for ${this.actionVal}`

            }else if(key == 'combo'){       //multistrike

                this.rate = 2
                this.actionVal = 1 + gs.enObj.power 
                this.desc = `${ico('combo')}Will attack 3<br>times for ${this.actionVal}`

            }else if(key == 'block'){

                this.rate = 1
                this.actionVal = gs.enObj.roll
                this.desc = `${ico("block")}Will block ${this.actionVal} dmg`

            }else if(key == 'final strike'){//on death

                //Enable if low life
                if(gs.enObj.life < 3){
                    this.rate = 1
                }

                this.actionVal = gs.enObj.flatLife
                this.desc = `${ico('skull') + this.actionVal} dmg on death`

            }else if(key == 'charge'){      //charge crit

                this.rate = 3
                this.actionVal = rng(3)
                this.desc = `Charges an attack (${this.actionVal} turns)`

            }else if(key == 'charged strike'){

                this.actionVal = (gs.enObj.dice * 2) + gs.enObj.power
                this.desc = `Charged strike ${this.actionVal} dmg`

            }
            
            //Buff
            else if (key == 'fortify'){//+ def

                this.rate = 2
                this.stat = 'def'
                this.actionVal = Math.ceil((gs.enObj.roll) * 0.5)

                //Enable recovery if def is negative.
                if(gs.enObj.def < 0){
                    this.rate = 1
                    this.actionVal = gs.enObj.flatDef - gs.enObj.def
                }

                this.desc = `${ico('def-buff')} Will gain ${this.actionVal} def`

            }else if(key == 'empower'){//+ power

                this.rate = 3
                this.stat = 'power'
                this.actionVal = Math.round((gs.enObj.roll + gs.stage) *0.25)

                //Enable recovery if def is negative.
                if(gs.enObj.power < 0){
                    this.rate = 1
                    this.actionVal = gs.enObj.flatPower - gs.enObj.power
                }

                this.desc = `${ico('power-buff')} Will gian ${this.actionVal} power`

            }else if(key == 'rush'){   //+ dice

                this.rate = 3
                this.stat = 'dice'
                this.actionVal = Math.round(1 + (gs.stage) *0.2)

                //Enable recovery if def is negative.
                if(gs.enObj.dice < gs.enObj.flatDice){
                    this.rate = 1
                    this.actionVal = gs.enObj.flatDice - gs.enObj.dice
                }

                this.desc = `${ico('dice-buff')}Will increse dice by ${this.actionVal}`

            }else if(key == 'recover'){//+ life

                //Enable if life lost
                if(gs.enObj.flatLife > gs.enObj.life){
                    this.rate = 2
                }

                this.stat = 'life'
                this.actionVal = gs.enObj.roll * 2
                this.desc = `${ico('life-buff')}Will heal for ${this.actionVal}`

            }

            //Curse
            else if (key == 'wound'){  //- def

                this.rate = 3
                this.stat = 'def'
                this.actionVal = Math.ceil((gs.enObj.roll) * 0.25)
                this.desc = `${ico('curse-def')}Will reduce your<br>def by ${this.actionVal}`

            }else if(key == 'weaken'){ //- power

                this.rate = 2
                this.stat = 'power'
                this.actionVal = Math.round((gs.enObj.roll + gs.stage) *0.25)
                this.desc = `${ico('curse-power')}Will reduce your<br>power by ${this.actionVal}`

            }else if(key == 'slow'){   //- dice

                this.rate = 5
                this.stat = 'dice'
                this.actionVal = rng(2)
                this.desc = `${ico('curse-dice')}Will reduce your<br>dice by ${this.actionVal}`

            }else if(key == 'drain'){  //- life

                this.rate = 4
                this.stat = 'life'
                this.actionVal = Math.round(gs.enObj.roll * 1.5)
                this.desc = `${ico('curse-life')}Will reduce your<br>life by ${this.actionVal}`

            }

            //Misc
            else if (key == 'sleep'){
                let dialogueOptions = [
                    'Surrender!',
                    'Your end nears...',
                    "Accept your fate!",
                    "No mercy!",
                    "Feel my wrath!",
                    "You won't survive!",
                    "Surrender now!",
                    "Face oblivion!",
                    "Meet your doom!",
                    "Bow before me!",
                    "Prise the Hecatocore!",
                    "Dance, fool, dance!",
                    "My blade hungers.",
                    "Annihilation!",
                    "Chaos embraces you.",
                    "Face the nightmare.",
                    "SUFFER!",
                    "Hope is a lie.",
                    "Meet your reckoning.",
                    "Why so serious?",
                    "Face the truth!",
                    "Your head is mine!",
                ]
                this.rate = 2
                this.desc = `
                    <span class="italic">"${dialogueOptions[rng(dialogueOptions.length -1)]}"</span>
                    <span class="w50">(will skip turn)</span>
                `
            }
            
            //Debuff player item
            //     // "poi att":  {rate:1,   desc: `Will attack with poison for ${dmgVal}`},
            //     // "fire att": {rate:1,   desc: `Will attack with fire for ${dmgVal}`},
            //     // "def break":{rate:1,   desc: `Will reduce your def by ${dmgVal}`},
            //     // "buff":     {rate:1,   desc: `Will use random buff spell`},
            //     // "debuff":   {rate:1,   desc: `Will use random debuff spell`},
            //     // "recruits": {rate:1,   desc: `Will call reinforcements`},

            //     // "spell":    {rate:1,   desc: `Will cast a <random spell>`},
            //     // "reflect":  {rate:1,   desc: `Will reflect any spell or attack to character that targets this`},
            //     // "disarm":   {rate:1,   desc: `Will steal item used against it during the next turn`},
            //     // "theft":    {rate:1,   desc: `Will steal random item`},   
            //     // "command":  {rate:1,   desc: `Will redirect actions of all enemies on you`},
            //     // "consume":  {rate:1,   desc: `Enemy will consume a random consumable from targets inventory`},
            //     // "escape":   {rate:1,   desc: `Will escape`},  
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


//Tree -> Nodes
    let treeRef = [
        //Core stats
        {id:'add-life'      ,desc:'add 10 base life'         ,passiveStats:[{stat:'life',  value:10}],},
        {id:'percent-life'  ,desc:'increse base life by 25%' ,passiveStats:[{stat:'life%', value:25}],},

        {id:'add-def'       ,desc:'gain 2 base def'          ,passiveStats:[{stat:'def',   value:2}],},
        {id:'add-power'     ,desc:'gain 1 base power'        ,passiveStats:[{stat:'power', value:1}],},
        {id:'add-dice'      ,desc:'gain 1 to base dice'      ,passiveStats:[{stat:'dice',  value:1}],},
        {id:'add-inventory' ,desc:'gain 2 equipment slots'   ,passiveStats:[{stat:'slots', value:2}],},


        //Recovery
        // {id:'add-regen-per-turn'}, //Regen N life per turn or combat.
        // {id:'add-regen-per-combat'},
        
        // {id:'add-leech'}, //Recover % of damage dealt
        
        
        //On hit effects
        // {id:'ext-dmg'}, //Deal +1 damage
        // {id:"ext-def-break-dmg"}, //Break 1 def on hit.


        //Extra defences
        // {id:'add-def-per-power'}, //+1 def per point of power.


        //Action specific
        // {id:'improve-barrier'}, //improve barrier by 25%


        //Cooldown actions
        // {id:'less-cd'}, //Cooldowns recover 1 turn faster


        //Extra actions


        //Gold


        //Exp


        //Aaction charge
        // {id:'chance-save-ac'}, //20% chance to not loose actionCharge on use <item type>


        //Ideas
        //All fireballs that you draft have +5 charge.
    ]

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