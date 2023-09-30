//Misc vars -> move to game obj?
let playerObj, enemyObj, combatState
let rewardPool = []


//Game state
class GameState{
    constructor(){
        this.stage = 1
        this.enemyLifeBase = 6
        this.bossFrequency = 5
        this.encounter = 1
    }
}

//
class CombatState {
    constructor(){
        this.turn = 1
        this.enemyDmgTaken = 0
        this.playerDmgTaken = 0
        this.enemyAction = []
        this.playerAction = []
    }
}

//
class PlayerObj {
    constructor(){
        //Life
        this.baseLife       = 16            //Lvl 1 char life
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

        this.roll           = rng(this.baseDice) //initial roll
        this.rollBonus      = 0

        //Inventory
        this.inventorySlots = 12 
        this.equipmentSlots = 6
        this.inventory      = [] //Items gained as rewards
        this.startingItems  = ['sword','shield']

        //Actions
        this.actionSlots    = 6
        this.actions        = [] //Actions gained from items
        this.tempActions    = [] //Temporary actions

        // this.draftActions   = [] //Draft actions gained from items

        //Sub-stats
        this.gold           = 0

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
        this.life     = gameState.enemyLifeBase
        this.flatLife = this.life

        this.power = Math.ceil(rng(gameState.stage * 0.5, 0)),
        this.def   = Math.ceil(rng(gameState.stage * 0.3, 0)),

        this.dice  = 4 + Math.round(gameState.stage * 0.2),
        
        this.level = gameState.stage
        this.image = `./img/enemy/${gameState.stage}.png`
        el('enemyImg').classList.remove('boss')


        //Create boss every N levels
        if(gameState.stage % gameState.bossFrequency === 0){
            gameState.enemyLifeBase+= 4 //Enemies +4 life after boss is killed

            this.life  = Math.round(gameState.enemyLifeBase * 1.25)
            this.flatLife= this.life

            this.power = Math.ceil(rng(gameState.stage * 0.3, 0)),
            this.def   = Math.ceil(rng(gameState.stage * 0.3, 0)),

            this.dice  = 12
            
            this.level = gameState.stage
            this.image = `./img/boss/${gameState.stage/gameState.bossFrequency}.png`
            el('enemyImg').classList.add('boss')
        }
    }
}

//Classes
class ItemObj {
    constructor(itemName, iLvl){

        //Static properties taken from reference
        this.actions = []

        //Finds item by item name property
        let itemData = findByProperty(itemsRef, 'itemName', itemName)
        
        //Gen item actions
        if(itemData.actions !== undefined){
            itemData.actions.forEach(actionKey =>{
                this.actions.push(new ActionObj(actionKey))
            })
        }

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
            if(itemData[property.key] === undefined){
                this[property.key] = property.val //if no prop, set it to extra props value
            }
            else {
                this[property.key] = itemData[property.key] //if exists in ref, set it as ref.
            }
        })
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
            {key:'id',          val: '???'}
        ]

        //Resolves extra props
        props.forEach(property => {
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

//Ene actions
let eneActionRef = {
    Attack:      {        action: 'Attack'     ,desc: `Attack`},
    Block:       {rate:1, action: 'Block'      ,desc: `Block`},
    Multistrike: {rate:2, action: 'Multistrike',desc: `Multistrike`},
    Fortify:     {rate:3, action: 'Fortify'    ,desc: `Armor up!`},
    Empower:     {rate:2, action: 'Empower'    ,desc: `More POWER!`},
    Rush:        {rate:2, action: 'Rush'       ,desc: `Larger dice!`},

    Sleep:       {rate:1, action: 'Sleep'      ,desc: `Zzzz...`,},
    Detonate:    {rate:1, action: 'Detonate'   ,desc: `Detonate on death`},
    Recover:     {        action: 'Recover'    ,desc: `Recover`},

    // "poi att":  {rate:1,   desc: `Will attack with poison for ${dmgVal}`},
    // "fire att": {rate:1,   desc: `Will attack with fire for ${dmgVal}`},
    // "crit":     {rate:1,   desc: `Will crit for ${Math.ceil(dmgVal * 2)} after this turn`},
    
    // "recover":  {rate:1,   desc: `Will recover lost stats`},
    // "def break":{rate:1,   desc: `Will reduce your def by ${dmgVal}`},
    // "buff":     {rate:1,   desc: `Will use random buff spell`},
    // "debuff":   {rate:1,   desc: `Will use random debuff spell`},
    

    // "recruits": {rate:1,   desc: `Will call reinforcements`},
    
    // "spell":    {rate:1,   desc: `Will cast a <random spell>`},
    // "reflect":  {rate:1,   desc: `Will reflect any spell or attack to character that targets this`},
    // "disarm":   {rate:1,   desc: `Will steal item used against it during the next turn`},
    // "theft":    {rate:1,   desc: `Will steal random item`},   
    // "command":  {rate:1,   desc: `Will redirect actions of all enemies on you`},
    // "consume":  {rate:1,   desc: `Enemy will consume a random consumable from targets inventory`},
    // "escape":   {rate:1,   desc: `Will escape`},
    //"crit":
}

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