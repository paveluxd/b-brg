//Global vars 
//Move to game obj?
let playerObj, enemyObj, combatState


//Game
    class GameState {
        constructor(){
            this.stage = 0 //Keep at 0, it is increased during generation.
            this.encounter = 1
            
            //Map data obj
            this.mapObj                                   
            
            //Stats for end game screen
            this.turnCounter = 0 //Calc turns for win stats
            this.enemyCounter = 0
            this.totalEnemies = config.portalDefenders + this.stage
            this.totalCombatTurns = 0
            
            //Merchant config
            this.merchantQuant = 6

            //Casino bets
            //TBA

            //Combat config
            this.enemySpawnFrequency = 3 //1 is 100%, 2 is 50%
            this.enemyPartyCap = 2
            this.portalDefenders = 4

            this.bossFrequency = 3 //Every Nth stage legacy
            this.flatItemReward = 2 //Base rewards
            this.flatFoodReward = 1 //Food per round +1 per enemy
            this.flatCoinsReward = 6 
        }
    }

//Combat
    class CombatState {
        constructor(){
            this.turn = 1

            this.dmgDoneByEnemy = 0
            this.dmgTakenByEnemy = 0

            this.dmgDoneByPlayer = 0
            this.dmgTakenByPlayer = 0

            this.enemyAction = []
            this.playerAction = []
            this.logMsg = [] //combat log messages
        }
    }

//Player
    class PlayerObj {
        constructor(){
            //Life
                this.baseLife       = config.baseLife //Lvl 1 char life
                this.flatLife       = this.baseLife   //Life cap
                this.life           = this.baseLife   //Current life
            //Power
                this.basePower      = config.basePower
                this.flatPower      = this.basePower
                this.power          = this.basePower
            //Def
                this.baseDef        = config.baseDef
                this.flatDef        = this.baseDef
                this.def            = this.baseDef
            //Dice
                this.baseDice       = 6 //needed as ref in case flat dice is modified by item
                this.flatDice       = this.baseDice
                this.dice           = this.baseDice
                this.roll           = 0
                this.rollBonus      = 0
            //Temporary buffs
                this.piercing       = false
                this.swordDmgMod    = 0
                this.poisonBuff     = false

            //Inventory
                this.inventorySlots = 20 
                this.inventory      = [] //Items gained as rewards
                this.startingItems  = [
                    'bow',
                    'shield',
                    'healing potion',
                ]
            //Equipment slots
                this.baseSlots      = 6
                this.equipmentSlots = this.baseSlots
            //Actions
                this.actionSlots    = this.baseSlots
                this.actions        = [] //Actions gained from items
                this.tempActions    = [] //Temporary actions

            // this.draftActions   = [] //Draft actions gained from items

            //Sub-stats
                this.coins          = rng(12,6)
                this.food           = rng(5,1)
            //Progression
                this.exp            = 0
                this.lvl            = 1
                this.treeNodes      = []
                this.treePoints     = 0
            //Misc
                this.offeredItemsArr     = [] //Stores rewards
        }
    }

//Enemy
    class EnemyObj {
        constructor(){
            this.level = gameState.stage //tileIdRef[1] prev. value.
            this.roll = 0
            
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

            
            if     (randomEnemyProfile == 'balanced'){
                lifeMod  = 1
                powerMod = 1
                defMod   = 1
                diceMod  = 1

                this.profile = 'balanced'
                imgPath  = `balanced/${rng(17,1)}`
            }
            else if(randomEnemyProfile == 'tank'){
                lifeMod  = 1.5
                powerMod = 0.5
                defMod   = 3.5
                diceMod  = 0.5

                this.profile = 'tank'
                imgPath  = `tank/${rng(1,1)}`
            }
            else if(randomEnemyProfile == 'assassin'){
                lifeMod  = 0.5
                powerMod = 2
                defMod   = 0.5
                diceMod  = 1

                this.profile = 'assassin'
                imgPath  = `assassin/${rng(1,1)}`
            }
            else if(randomEnemyProfile == 'minion'){
                lifeMod  = 0.1
                powerMod = 0.5
                defMod   = 0.5
                diceMod  = 0.5

                this.profile = 'minion'
                imgPath  = `minion/${rng(1,1)}`
            }

            //Set boss mods
            // if(gameState.stage % gameState.bossFrequency === 0){//boss
            //     // lifeMod  += 0.5
            //     // powerMod += 0.25
            //     // defMod   += 0.25
            //     // diceMod  += 0.25

            //     this.profile = 'boss'
            // }


            //Set stats
            //Get column value to scale mobs
            let tileIdRef = []
            gameState.playerLocationTile.tileId.split('-').forEach(val =>{
                tileIdRef.push(parseInt(val))
            })

            // mod(0.5) -> Get +1 every 2 stages
            this.life    = 0 + Math.round((8   + this.level) * lifeMod )
            this.power   = 0 + Math.round((0.2 * this.level) * powerMod) 
            this.def     = 0 + Math.round((0.2 * this.level) * defMod)
            this.dice    = 4 + Math.round((0.2 * this.level) * diceMod)
            
            this.flatLife = this.life
            this.flatPower = this.power
            this.flatDef = this.def
            this.flatDice = this.dice 
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
                this.actionVal = enemyObj.roll + enemyObj.power 
                this.desc = `${ico('attack')}${this.actionVal} dmg`

            }else if(key == 'combo'){       //multistrike

                this.rate = 2
                this.actionVal = 1 + enemyObj.power 
                this.desc = `${ico('combo')}${this.actionVal} dmg (x3)`

            }else if(key == 'block'){

                this.rate = 1
                this.actionVal = enemyObj.roll
                this.desc = `${ico("block")} Block for ${this.actionVal}`

            }else if(key == 'final strike'){//on death

                //Enable if low life
                if(enemyObj.life < 3){
                    this.rate = 1
                }

                this.actionVal = enemyObj.flatLife
                this.desc = `${ico('skull') + this.actionVal} dmg on death`

            }else if(key == 'charge'){      //charge crit

                this.rate = 3
                this.actionVal = rng(3)
                this.desc = `Charges an attack (${this.actionVal} turns)`

            }else if(key == 'charged strike'){

                this.actionVal = (enemyObj.dice * 2) + enemyObj.power
                this.desc = `Charged strike ${this.actionVal} dmg`

            }
            
            //Buff
            else if (key == 'fortify'){//+ def

                this.rate = 2
                this.stat = 'def'
                this.actionVal = Math.ceil((enemyObj.roll) * 0.25)

                //Enable recovery if def is negative.
                if(enemyObj.def < 0){
                    this.rate = 1
                    this.actionVal = enemyObj.flatDef - enemyObj.def
                }

                this.desc = `${ico('def-buff')} +${this.actionVal}`

            }else if(key == 'empower'){//+ power

                this.rate = 3
                this.stat = 'power'
                this.actionVal = Math.round((enemyObj.roll + gameState.stage) *0.25)

                //Enable recovery if def is negative.
                if(enemyObj.power < 0){
                    this.rate = 1
                    this.actionVal = enemyObj.flatPower - enemyObj.power
                }

                this.desc = `${ico('power-buff')} +${this.actionVal}`

            }else if(key == 'rush'){   //+ dice

                this.rate = 3
                this.stat = 'dice'
                this.actionVal = Math.round(1 + (gameState.stage) *0.2)

                //Enable recovery if def is negative.
                if(enemyObj.dice < enemyObj.flatDice){
                    this.rate = 1
                    this.actionVal = enemyObj.flatDice - enemyObj.dice
                }

                this.desc = `${ico('dice-buff')} +${this.actionVal}`

            }else if(key == 'recover'){//+ life

                //Enable if life lost
                if(enemyObj.flatLife > enemyObj.life){
                    this.rate = 2
                }

                this.stat = 'life'
                this.actionVal = enemyObj.roll * 2
                this.desc = `${ico('life-buff')} +${this.actionVal}`

            }

            //Curse
            else if (key == 'wound'){  //- def

                this.rate = 3
                this.stat = 'def'
                this.actionVal = Math.ceil((enemyObj.roll) * 0.25)
                this.desc = `${ico('curse-def')} -${this.actionVal}`

            }else if(key == 'weaken'){ //- power

                this.rate = 2
                this.stat = 'power'
                this.actionVal = Math.round((enemyObj.roll + gameState.stage) *0.25)
                this.desc = `${ico('curse-power')} -${this.actionVal}`

            }else if(key == 'slow'){   //- dice

                this.rate = 5
                this.stat = 'dice'
                this.actionVal = rng(2)
                this.desc = `${ico('curse-dice')} -${this.actionVal}`

            }else if(key == 'drain'){  //- life

                this.rate = 4
                this.stat = 'life'
                this.actionVal = Math.round(enemyObj.roll * 1.5)
                this.desc = `${ico('curse-life')} -${this.actionVal}`

            }

            //Misc
            else if (key == 'sleep'){
                this.rate = 3
                this.desc = `Zzz...`
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
            if(iLvl === undefined && gameState !== undefined){
                iLvl = gameState.stage
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
        playerObj.inventory.forEach(item => {
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
        {id:'add-life'      ,desc:'add 10 base life'         , passiveStats:[{stat:'life', value:10}],},
        {id:'percent-life'  ,desc:'increse base life by 25%' , passiveStats:[{stat:'life%', value:25}],},

        {id:'add-def'       ,desc:'gain 1 basse def'         ,nodeType:'baseDef'     ,nodeMod: 1   },
        {id:'add-power'     ,desc:'gain 1 base power'        ,nodeType:'basePower'   ,nodeMod: 1   },
        {id:'add-dice'      ,desc:'gain 2 to base dice'      ,nodeType:'baseDice'    ,nodeMod: 2   },
        {id:'add-inventory'},


        //Recovery
        {id:'add-regen-per-turn'}, //Regen N life per turn or combat.
        {id:'add-regen-per-combat'},
        
        {id:'add-leech'}, //Recover % of damage dealt
        
        
        //On hit effects
        {id:'ext-dmg'}, //Deal +1 damage
        {id:"ext-def-break-dmg"}, //Break 1 def on hit.


        //Extra defences
        {id:'add-def-per-power'}, //+1 def per point of power.


        //Action specific
        {id:'improve-barrier'}, //improve barrier by 25%


        //Cooldown actions
        {id:'less-cd'}, //Cooldowns recover 1 turn faster


        //Extra actions


        //Gold


        //Exp


        //Aaction charge
        {id:'chance-save-ac'}, //20% chance to not loose actionCharge on use <item type>


        //Ideas
        //All fireballs that you draft have +5 charge.
    ]