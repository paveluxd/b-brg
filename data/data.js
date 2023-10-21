//Misc vars -> move to game obj?
let playerObj, enemyObj, combatState, mapObj
let rewardPool = []


//Game state
class GameState{
    constructor(){
        this.stage = 1
        this.encounter = 1

        // this.enemyLifeBase = 6 //N + other mods
        this.bossFrequency = 3 //Every Nth stage

        this.turnCounter = 0 //Calc turns for win stats
        this.enemyCounter = 0
        this.totalEnemies = 0

        this.mapColumns = rng(12,12)
        this.mapRows = 3
        this.portalDefencers = 3
        this.enemyPartyCap = 2
        this.enemySpawnFrequency = 3 //1 is 100%, 2 is 50%

        this.flatFoodReward = 1
    }
}

//
class CombatState {
    constructor(){
        this.turn = 1

        this.dmgDoneByEnemy = 0
        this.dmgTakenByEnemy = 0

        this.dmgDoneByPlayer = 0
        this.dmgTakenByPlayer = 0

        this.enemyAction = []
        this.playerAction = []
    }
}

//
class PlayerObj {
    constructor(){
        //Life
        this.baseLife       = 28            //Lvl 1 char life
        this.flatLife       = this.baseLife //Life cap
        this.life           = this.baseLife //Current life

        //Power
        this.basePower      = 0
        this.flatPower      = this.basePower
        this.power          = this.basePower

        //Def
        this.baseDef        = 0
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

        //Inventory
        this.inventorySlots = 20 
        this.inventory      = [] //Items gained as rewards
        this.startingItems  = [
            "bow",
            'tower shield',
            'healing potion'
        ]

        //Slots
        //Equipment slots
        this.baseSlots      = 12
        this.equipmentSlots = this.baseSlots

        //Actions
        this.actionSlots    = this.baseSlots
        this.actions        = [] //Actions gained from items
        this.tempActions    = [] //Temporary actions

        // this.draftActions   = [] //Draft actions gained from items

        //Sub-stats
        this.gold           = 0
        this.food           = 3

        //Progression
        this.exp            = 0
        this.lvl            = 1
        this.treeNodes      = []
        this.treePoints     = 0
    }
}

//
class EnemyObj {
    constructor(){
        //Choose enemy profile
        let profiles = ['balanced', 'tank', 'assassin', 'minion'] //'minion'
        let randomEnemyProfile = rarr(profiles)
        let powerMod, defMod, diceMod, imgPath, lifeMod
        // el('enemyImg').classList.remove('boss')

        
        if      (randomEnemyProfile == 'balanced'){
            lifeMod  = 1
            powerMod = 1
            defMod   = 1
            diceMod  = 1

            this.profile = 'balanced'
            imgPath  = `balanced/${rng(17,1)}`
        }else if(randomEnemyProfile == 'tank'){
            lifeMod  = 0.5
            powerMod = 0.25
            defMod   = 3
            diceMod  = 0.25

            this.profile = 'tank'
            imgPath  = `tank/${rng(1,1)}`
        }else if(randomEnemyProfile == 'assassin'){
            lifeMod  = 0.25
            powerMod = 3
            defMod   = 0.25
            diceMod  = 1

            this.profile = 'assassin'
            imgPath  = `assassin/${rng(1,1)}`
        }else if(randomEnemyProfile == 'minion'){
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
        let tileColumn = tileIdRef[1]

        // mod(0.5) -> Get +1 every 2 stages
        this.life    = 6 + Math.round((4   + tileColumn) * lifeMod ) //+ rng(4)
        this.power   = 0 + Math.round((0.2 * tileColumn) * powerMod) 
        this.def     = 0 + Math.round((0.2 * tileColumn) * defMod)
        this.dice    = 4 + Math.round((0.2 * tileColumn) * diceMod)
        
        this.flatLife = this.life
        this.flatPower = this.power
        this.flatDef = this.def
        this.flatDice = this.dice
        
        //Misc
        this.roll = 0
        this.level    = tileColumn
        // this.image    = `./img/enemy/${imgPath}.png`
        this.poisoned = false
        this.poisonStacks = 0
        this.crit = false

        this.actionRef = []
        this.acctionMod = ''
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

        }else if(key == 'combo'){

            this.rate = 2
            this.actionVal = 1 + enemyObj.power 
            this.desc = `${ico('combo')}${this.actionVal} dmg (x3)`

        }else if(key == 'block'){

            this.rate = 2
            this.actionVal = -enemyObj.roll
            this.desc = `${ico("block")} Block for ${-1 * this.actionVal}`

        }else if(key == 'final strike'){

            //Enable if low life
            if(enemyObj.life < 3){
                this.rate = 1
            }

            this.actionVal = enemyObj.flatLife
            this.desc = `${ico('skull') + this.actionVal} dmg on death`

        }else if(key == 'charge'){

            this.rate = 3
            this.actionVal = rng(3)
            this.desc = `Charges an attack (${this.actionVal} turns)`

        }else if(key == 'charged strike'){

            this.actionVal = enemyObj.dice * 2
            this.desc = `Charged strike ${this.actionVal} dmg`

        }
        
        //Buff
         else if(key == 'fortify'){//+ def

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

            this.rate = 2
            this.stat = 'power'
            this.actionVal = Math.round((enemyObj.roll + gameState.stage) *0.25)

            //Enable recovery if def is negative.
            if(enemyObj.power < 0){
                this.rate = 1
                this.actionVal = enemyObj.flatPower - enemyObj.power
            }

            this.desc = `${ico('power-buff')} +${this.actionVal}`

        }else if(key == 'rush'){   //+ dice

            this.rate = 2
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
         else if(key == 'wound'){//- def

            this.rate = 2
            this.stat = 'def'
            this.actionVal = Math.ceil((enemyObj.roll) * 0.25)
            this.desc = `${ico('curse-def')} -${this.actionVal}`

        }else if(key == 'weaken'){//- power

            this.rate = 2
            this.stat = 'power'
            this.actionVal = Math.round((enemyObj.roll + gameState.stage) *0.25)
            this.desc = `${ico('curse-power')} -${this.actionVal}`

        }else if(key == 'slow'){   //- dice

            this.rate = 5
            this.stat = 'dice'
            this.actionVal = rng(2)
            this.desc = `${ico('curse-dice')} -${this.actionVal}`

        }else if(key == 'drain'){//- life

            this.rate = 3
            this.stat = 'life'
            this.actionVal = enemyObj.roll * 2
            this.desc = `${ico('curse-life')} -${this.actionVal}`

        }

        //Misc
        else if(key == 'sleep'){
            this.rate = 2
            this.desc = `Zzz...`
        }
         

        //     // Crit:        {rate:1, action: 'Crit'       ,desc: `Prepares to crit next turn`},
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


//Classes
class ItemObj {
    constructor(itemName, iLvl){

        //Static properties taken from reference
        this.actions = []

        //Finds item by item name property
        let itemData = findByProperty(itemsRef, 'itemName', itemName)
        
        
        //set iLvl to stage val
        if(iLvl === undefined && gameState !== undefined){
            iLvl = gameState.stage
        }else{
            iLvl = 1
        } 

        //Gen variable properties
        let props = [
            {key:'itemName'    ,val: upp(itemName)},
            {key:'itemType'    ,val: 'generic'},
            {key:'itemId'      ,val: "it" + Math.random().toString(8).slice(2)},//gens unique id
            {key:'equipped'    ,val: false},
            {key:'passiveStats',val: []},
            // {key:'durability'  ,val: 10},
            // {key:'cost'        ,val: 12}, 
        ]

        
        //Resolve props via default value above, or value from reference object
        props.forEach(property => {

            // console.log(property.key, property.val);

            if(itemData[property.key] === undefined || itemData[property.key] === ''){
                this[property.key] = property.val //if no prop, set it to extra props value
            }
            else {
                this[property.key] = itemData[property.key] //if exists in ref, set it as ref.
            }
        })


        //Gen item actions
        if(itemData.actions.length === 0){
            itemData.actions = []
        }

        if(itemData.actions !== undefined){
            itemData.actions.forEach(actionKey =>{
                this.actions.push(new ActionObj(actionKey))
            })
        }   
    }
}

//
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
    }
}

//Rewards
let rewardRef = [
    {rewardType:'Item'    ,freq: 1, desc: 'Get random item (requires empty slot)'}, 
    // {rewardType:'Action'  ,freq: 1, desc: 'Get random item (requires empty slot)'}, 

    // {rewardType:'Train'   ,freq: 1, desc: 'Increase maximum life'},
    // {rewardType:'Enhance' ,freq: 1, desc: 'Increase defence'},
    // {rewardType:'Power'   ,freq: 1, desc: 'Increase power by 1'},
    // {rewardType:'Heal'    ,freq: 1, desc: 'Restore life'},
    // {rewardType:'Repair'  ,freq: 1, desc: 'Repair random item'},
    // {rewardType:'Bag'     ,freq: 1, desc: 'Gain an additional actions slot'},
    // {rewardType:'Gold'    ,freq: 1, desc: 'Gold rewad'},
]

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

//Convert action id to strings
actionsRef.forEach(action => {
    action.keyId = `a${action.keyId}`
})


//Map
//Background image ids
let tileTypesA = 'castle'.split(' ')
let tileTypesB = 'dungeon'.split(' ')
let tileTypesC = 'empty-1 empty-2 empty-3 empty-4'.split(' ')
let tileTypesD = 'lake-1 lake-2 lake-3 house-1 grave shop mine'.split(' ')
let forests    = 'forest-1 forest-2'.split(' ')

class MapObj{
    constructor(){
        this.columns = gameState.mapColumns
        this.rows = gameState.mapRows
        this.tiles = []
        let row = 1 //Offset because i know js yes
        let column = 0


        //Generates tiles
        for(let i = 0; i < this.rows * this.columns; i++){

            let tile = {}
            let roll = rng(100)

            //Modify id to match rows and columns
            if(i % this.columns === 0){
                column++
                row = 1
            }
            tile.tileId = `${column}-${row++}`
            
            //% distriburion of tiles

            if       (roll > 98){
                tile.tileType = tileTypesA[rng((tileTypesA.length - 1), 0)]
            }else if (roll > 90){
                tile.tileType = tileTypesD[rng((tileTypesD.length - 1), 0)]
            }else if (roll > 85){
                tile.tileType = tileTypesB[rng((tileTypesB.length - 1), 0)]
            }else if (roll > 75){
                tile.tileType = forests[rng((forests.length - 1), 0)]
            }else               {
                tile.tileType = tileTypesC[rng((tileTypesC.length - 1), 0)]
            }


            //Add player & enemies
            if(i === 0){ //Add player to the 1st tile
                tile.playerUnit = true
            }
            else if (1 === rng(gameState.enemySpawnFrequency) ){ //Add enemy units 30%
                let eneQuant = rng(gameState.enemyPartyCap)
                tile.enemyUnit = true
                tile.enemyQuant = eneQuant
                gameState.totalEnemies += eneQuant //Counts total enemies
            }
            

            //Flip tiles
            if(1 === rng(2)){
                tile.flip = true
            }

            this.tiles.push(tile)
        }

        //Set portal & portal encounter
        let portalTile = findByProperty(this.tiles, 'tileId', `${rng(gameState.mapRows)}-${gameState.mapColumns}`)
        portalTile.tileType = "portal"
        portalTile.enemyUnit = true 
        portalTile.enemyQuant = gameState.portalDefencers 
        gameState.totalEnemies += gameState.portalDefencers  //Counts total enemies

    }
}


let mapRef = [
    {tileId:'a1', tileType:'empty'},
    {tileId:'a2', tileType:'castle'},
    {tileId:'a3', tileType:'forest-1'},
    {tileId:'a4', tileType:'empty'},

    {tileId:'b1', tileType:'empty'},
    {tileId:'b2', tileType:'dungeon'},
    {tileId:'b3', tileType:'forest-1'},
    {tileId:'b4', tileType:'empty'},

    {tileId:'c1', tileType:'empty'},
    {tileId:'c2', tileType:'dungeon'},
    {tileId:'c3', tileType:'forest-1'},
    {tileId:'c4', tileType:'empty'},

    {tileId:'d1', tileType:'empty'},
    {tileId:'d2', tileType:'dungeon'},
    {tileId:'d3', tileType:'forest-1'},
    {tileId:'d4', tileType:'empty'},
]