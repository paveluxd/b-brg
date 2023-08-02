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
        this.startingItems  = ['attack', 'belt','extraAttack']

        //Skills
        this.actionSlots    = 6
        this.actions        = [] //Actions gained from items

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
    constructor(key, iLvl){
        //Static properties taken from reference
        if(iLvl === undefined && gameState !== undefined){iLvl = gameState.stage}else{iLvl = 1}
        this.action = key
        this.desc = actionsRef[key].desc
        this.actionType = actionsRef[key].actionType


        //Variable properties generated
        let extraProps = [
            {key:'name'       ,val: `${key} scroll`},
            {key:'itemid'     ,val: "id" + Math.random().toString(8).slice(2)},//gens unique id
            {key:'durability' ,val: 10},
            {key:'mod'        ,val: 0},
            {key:'cost'       ,val: 12}, 
            {key:'cooldown'   ,val: undefined},
        ]


        //Resolves extra properties that either have default from above or gain value from ref object
        extraProps.forEach(property => {
            if(actionsRef[key].actionType === 'passive' && property.key === 'durability'){
                this.durability = 1 //set dur of all passive items to 1.
            } 
            else if(actionsRef[key][property.key] === undefined){
                this[property.key] = property.val //if no prop, set it to extraProps vlaue
            }
            else {
                this[property.key] = actionsRef[key][property.key] //if exists in ref, set it as red.
            }
        })
    }
}


let itemsRef = {
    sword: {
        action:['attack'], 
        draftActions:[], 
        passiveStats:[],
        passiveFx: [],
        itemType:'' //none, weapon, helm etc.
    }
}

//item = action
let actionsRef = {
    //Item key is used as 'action' string
    attack:      {desc: "deal damage equal to dice roll value", durability:12 },
    extraAttack: {desc: "deal 1 damage as extra action", actionType:'extra'}, //add varioation with cd and cost
    repair:      {desc: 'restore durability to all different type items', mod: 2,},
    fireball:    {desc: 'deal damage equal to (roll x empty item slots)', durability: 6,},
    dodge:       {desc: 'skip turn to keep half of your roll for the next turn', },

    block:       {desc: 'block damage equal to dice roll value', },
    //block that gives def if broken
    barrier:     {desc: `reduce incomming damage by 75%, cd:3`, cooldown: 3, },
    
    //Player stats
    heal:        {desc: "restore 12 life", durability: 3, mod: 12},
    fortify:     {desc: 'increase def until the end of this fight', durability:1, mod: 3,},
    reroll:      {desc: "instant action: Reroll your dice.", durability: 10, actionType:'extra'},
    // Focus:   {desc: 'Increase next turn roll'},
    // Rage:    {desc: 'Increase power until the end of this fight'},

    //Enemy states
    weaken:      {desc: 'reduce enemy power', durability: 3,},
    break:       {desc: 'reduce enemy defence', durability: 3,},
    counter:     {desc: 'prevent enemy action', durability: 3},
    root:        {desc: 'reduce enemy dice by 2', durability: 3, mod: 3,},
    // Stun:     {desc: 'Prevent enemy for acting during this turn'},

    //Passive items
    shield:      {desc: 'add 3 def while in inventory (passive)', actionType: 'passive', mod: 3,},
    amulet:      {desc: 'add 2 power while in inventory (passive)', actionType: 'passive', mod: 2,},
    belt:        {desc: 'add 20 max life while in inventory (passive)', actionType: 'passive', mod: 20,},
    leatherBelt: {desc: 'add 20% max life while in inventory (passive)', actionType: 'passive', mod: 0.2,},
    d8:          {desc: 'use d8 for rolls while this is in inventory (passive)', actionType: 'passive', mod: 8,}

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
    {rewardType:'Repair'  ,freq: 1, desc:'Repair random item'},
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
    {id:'add-life'      ,desc:'add 10 base life'         ,nodeType:'baseLife'    ,mod: 10  },
    {id:'percent-life'  ,desc:'increse base life by 25%' ,nodeType:'percentLife' ,mod: 0.25},
    {id:'add-def'       ,desc:'gain 1 basse def'         ,nodeType:'baseDef'     ,mod: 1   },
    {id:'add-power'     ,desc:'gain 1 base power'        ,nodeType:'basePower'   ,mod: 1   },
    {id:'add-dice'      ,desc:'gain 2 to base dice'      ,nodeType:'baseDice'    ,mod: 2   },
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


    //Durability
    {id:'chance-save-dur'}, //20% chance to not loose durability on use <item type>
]