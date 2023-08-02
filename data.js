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
        //Core
        this.initialLife    = 100
        this.initLifeMod    = 1
        this.maxLifeMod     = this.initLifeMod
        this.maxLife        = this.initialLife
        this.life           = this.maxLife

        this.flatPower      = 0
        this.power          = 0
        this.flatDef        = 0   
        this.def            = 0

        //Dice
        this.initialDice    = 6 //needed as ref in case flat dice is modified by item
        this.flatDice       = this.initialDice
        this.dice           = this.initialDice
        this.roll           = rng(this.initialDice) //initial roll
        this.rollBonus      = 0

        //Inventory
        this.inventorySlots = 20 
        this.equipmentSlots = 6
        this.inventory      = [] //Items gained as rewards
        this.startingItems  = ['sword', 'spellBook']

        //Skills
        this.actionSlots    = 6
        this.actions        = [] //Actions gained from items
        this.draftActions   = [] //Draft actions gained from items

        //Sub-stats
        this.gold           = 0

        //Progression
        this.exp            = 0
        this.lvl            = 4
        this.treeNodes      = []
        this.treePoints     = 0
    }
}

//
class EnemyObj {
    constructor(){
        this.life  = gameState.enemyLifeBase
        this.maxLife = this.life

        this.power = Math.ceil(rng(gameState.stage * 0.5, 0)),
        this.def   = Math.ceil(rng(gameState.stage * 0.3, 0)),

        this.dice  = 4 + Math.round(gameState.stage * 0.2),
        
        this.level = gameState.stage
        this.image = `./img/enemy/${gameState.stage}.png`
        el('enemyImg').classList.remove('boss')


        //Create boss every 10 levels
        if(gameState.stage % gameState.bossFrequency === 0){
            gameState.enemyLifeBase+= 4 //Enemies +4 life after boss is killed

            this.life  = Math.round(gameState.enemyLifeBase * 1.25)
            this.maxLife = this.life

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
    constructor(itemKey, iLvl){

        //Static properties taken from reference
        this.actions = []

        //Gen item actions
        itemsRef[itemKey].actions.forEach(actionKey =>{
            this.actions.push(new ActionObj(actionKey))
        })

        //set iLvl to stage val
        if(iLvl === undefined && gameState !== undefined){
            iLvl = gameState.stage
        }else{
            iLvl = 1
        } 

        //Variable properties generated
        let props = [
            {key:'itemName'    ,val: upp(itemKey)},
            {key:'itemId'      ,val: "it" + Math.random().toString(8).slice(2)},//gens unique id
            {key:'durability'  ,val: 10},
            {key:'cost'        ,val: 12}, 
            {key:'itemType'    ,val: 'generic'},
        ]


        //Resolves extra properties that either have default from above or gain value from ref object
        props.forEach(property => {
            if(itemsRef[itemKey][property.key] === undefined){
                this[property.key] = property.val //if no prop, set it to extra props vlaue
            }
            else {
                this[property.key] = itemsRef[itemKey][property.key] //if exists in ref, set it as red.
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
            {key:'desc'        ,val: ''}
        ]

        //Resolves extra props
        props.forEach(property => {
            if(actionsRef[actionKey].actionType === 'passive' && property.key === 'actionCharge'){
                this.actionCharge = 1 //set action charge of all passive items to 1.
            } 
            else if(actionsRef[actionKey][property.key] === undefined){
                this[property.key] = property.val //if no prop, set it to extra props vlaue
            }
            else {
                this[property.key] = actionsRef[actionKey][property.key] //if exists in ref, set it as red.
            }
        })
    }
}

let itemsRef = {
    sword:     {actions:['attack'], itemType:'weapon',},
    shiled:    {actions:['block'],},
    spellBook: {actions:['fireball'],},
}

//item = action
let actionsRef = {
    //Item key is used as 'action' string
    attack:      {desc: "deal damage equal to dice roll value", actionCharge:12 },
    extraAttack: {desc: "deal 1 damage as extra action", actionType:'extra'}, //add varioation with cd and cost
    repair:      {desc: 'restore action charge to all different type actions', actionMod: 2,},
    fireball:    {desc: 'deal damage equal to (roll x empty item slots)', actionCharge: 6,},
    dodge:       {desc: 'skip turn to keep half of your roll for the next turn', },

    block:       {desc: 'block damage equal to dice roll value', },
    //block that gives def if broken
    barrier:     {desc: `reduce incomming damage by 75%, cd:3`, cooldown: 3, },
    
    //Player stats
    heal:        {desc: "restore 12 life", actionCharge: 3, actionMod: 12},
    fortify:     {desc: 'increase def until the end of this fight', actionCharge:1, actionMod: 3,},
    reroll:      {desc: "instant action: Reroll your dice.", actionCharge: 10, actionType:'extra'},
    // Focus:   {desc: 'Increase next turn roll'},
    // Rage:    {desc: 'Increase power until the end of this fight'},

    //Enemy states
    weaken:      {desc: 'reduce enemy power', actionCharge: 3,},
    break:       {desc: 'reduce enemy defence', actionCharge: 3,},
    counter:     {desc: 'prevent enemy action', actionCharge: 3},
    root:        {desc: 'reduce enemy dice by 2', actionCharge: 3, actionMod: 3,},
    // Stun:     {desc: 'Prevent enemy for acting during this turn'},

    //Passive items
    shield:      {desc: 'add 3 def while in inventory (passive)'                ,actionType: 'passive', actionMod: 3,},
    amulet:      {desc: 'add 2 power while in inventory (passive)'              ,actionType: 'passive', actionMod: 2,},
    belt:        {desc: 'add 20 max life while in inventory (passive)'          ,actionType: 'passive', actionMod: 20,},
    leatherBelt: {desc: 'add 20% max life while in inventory (passive)'         ,actionType: 'passive', actionMod: 0.2,},
    d8:          {desc: 'use d8 for rolls while this is in inventory (passive)' ,actionType: 'passive', actionMod: 8,}

    //Misc
    //Town-portal item, escape combat.
    //Resurect with 1 hp item.
}

//Rewards
let rewardRef = [
    {rewardType:'Item', freq: 1, desc: 'Get random item (requires empty slot)'}, 
    {rewardType:'Item', freq: 1, desc: 'Get random item (requires empty slot)'}, 
    {rewardType:'Item', freq: 1, desc: 'Get random item (requires empty slot)'}, 
    {rewardType:'Item', freq: 1, desc: 'Get random item (requires empty slot)'}, 
    {rewardType:'Item', freq: 1, desc: 'Get random item (requires empty slot)'}, 
    {rewardType:'Item', freq: 1, desc: 'Get random item (requires empty slot)'}, 

    {rewardType:'Train'   ,freq: 1, desc: 'Increase maximum life'},
    {rewardType:'Enhance' ,freq: 1, desc: 'Increase defence'},
    {rewardType:'Power'   ,freq: 1, desc: 'Increase power by 1'},
    {rewardType:'Heal'    ,freq: 1, desc: 'Restore life'},
    {rewardType:'Repair'  ,freq: 1, desc: 'Repair random item'},
    {rewardType:'Bag'     ,freq: 1, desc: 'Gain an additional actions slot'},
    {rewardType:'Gold'    ,freq: 1, desc: 'Gold rewad'},
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
    {id:'add-life'      ,desc:'add 10 base life'         ,nodeType:'baseLife'    ,nodeMod: 10  },
    {id:'percent-life'  ,desc:'increse base life by 25%' ,nodeType:'percentLife' ,nodeMod: 0.25},
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
]