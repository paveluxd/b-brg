//Game data for skill tree?
class GameData {
    // SkillTree() {
    //     constructor(){

    //     }
    // }
}

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
        this.maxLife      = 999 
        this.life         = this.maxLife
        this.flatPower    = 0
        this.power        = 0
        this.flatDef      = 0   
        this.def          = 0

        this.defaultDice  = 6 //needed as ref in case flat dice is modified by item
        this.flatDice     = this.defaultDice
        this.dice         = this.defaultDice

        this.roll         = rng(this.defaultDice) //initial roll
        this.rollBonus    = 0

        this.maxInventory = 8
        this.inventory    = []

        //Sub-stats

        //Misc-stats
        this.gold         = 0
        this.exp          = 0
        this.lvl          = 7
        this.passiveNodes  = []
        this.passivePoints = this.lvl - this.passiveNodes -1
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
class Item {
    constructor(key, iLvl){
        //Static properties taken from reference
        if(iLvl === undefined && gameState !== undefined){iLvl = gameState.stage}else{iLvl = 1}
        this.action = key
        this.desc = itemsRef[key].desc
        this.type = itemsRef[key].type


        //Variable properties generated
        let extraProps = [
            {key:'name', val: `${key} scroll`},
            {key:'itemid', val: "id" + Math.random().toString(8).slice(2)},//gens unique id
            {key:'durability', val: 10},
            {key:'effectMod', val: 0},
            {key:'cost', val: 12}, 
            {key:'cooldown', val: undefined},
        ]


        //Resolves extra properties that either have default from above or gain value from ref object
        extraProps.forEach(property => {
            if(itemsRef[key].type === 'passive' && property.key === 'durability'){
                this.durability = 1 //set dur of all passive items to 1.
            } 
            else if(itemsRef[key][property.key] === undefined){
                this[property.key] = property.val 
            }
            else {
                this[property.key] = itemsRef[key][property.key]
            }
        })
    }
}



//item = action
let itemsRef = {
    //Item key is used as 'action' string
    Attack:  {desc: "Deal damage equal to dice roll value", durability:12 },
    ExtraAttack:  {desc: "Deal 1 damage as extra action", type:'extra'}, //add varioation with cd and cost
    Repair:  {desc: 'Restore durability to all different type items', effectMod: 2,},
    Fireball:{desc: 'Deal damage equal to (roll x empty item slots)', durability: 6,},
    Dodge:   {desc: 'Skip turn to keep half of your roll for the next turn', },

    Block:   {desc: 'Block damage equal to dice roll value', },
    Barrier:  {desc: `Reduce incomming damage by 75%, cd:3`, cooldown: 3, },
    
    //Player stats
    Heal:    {desc: "Restore 12 life", durability: 3, effectMod: 12},
    Fortify: {desc: 'Increase def until the end of this fight', durability:1, effectMod: 3,},
    // Rage:    {desc: 'Increase power until the end of this fight'},
    // Focus:   {desc: 'Increase next turn roll'},
    Reroll: {desc: "Instant action: Reroll your dice.", durability: 10, type:'extra'},

    //Enemy states
    Weaken:  {desc: 'Reduce enemy power', durability: 3,},
    Break:   {desc: 'Break enemy defence', durability: 3,},
    Counter: {desc: 'Prevent enemy action', durability: 3},
    Root:    {desc: 'Reduce enemy dice by 2', durability: 3, effectMod: 3,},
    // Stun:    {desc: 'Prevent enemy for acting during this turn'},

    //Passive items
    Shield:  {desc: '+3 def while in inventory (passive)', type: 'passive', effectMod: 3,},
    Amulet:  {desc: '+2 power while in inventory (passive)', type: 'passive', effectMod: 2,},
    Belt:    {desc: '+20 max life while in inventory (passive)', type: 'passive', effectMod: 20,},
    d8:      {desc: 'Use d8 for rolls while this is in inventory (passive)', type: 'passive', effectMod: 8,}
}

//Rewards
let rewardRef = [
    {type:'Item', freq: 1, desc: 'Get random item (requires empty slot)'}, 
    {type:'Item', freq: 1, desc: 'Get random item (requires empty slot)'}, 
    {type:'Item', freq: 1, desc: 'Get random item (requires empty slot)'}, 
    {type:'Item', freq: 1, desc: 'Get random item (requires empty slot)'}, 
    {type:'Item', freq: 1, desc: 'Get random item (requires empty slot)'}, 
    {type:'Item', freq: 1, desc: 'Get random item (requires empty slot)'}, 

    {type:'Train', freq: 1, desc: 'Increase maximum life'},
    {type:'Enhance', freq: 1, desc: 'Increase defence'},
    {type:'Power', freq: 1, desc: 'Increase power by 1'},
    {type:'Heal', freq: 1, desc: 'Restore life'},
    {type:'Repair', freq: 1, desc:'Repair random item'},
    {type:'Bag', freq: 1, desc: 'Gain an additional inventory slot'},
    {type:'Gold', freq: 1, desc: 'Gold rewad'},
]

//Ene actions
let enemyActions = {
    Attack:      {        action: 'Attack',  desc: `Attack`},
    Block:       {rate:1, action: 'Block',   desc: `Block`},
    Multistrike: {rate:2, action: 'Multistrike', desc: `Multistrike`},
    Fortify:     {rate:3, action: 'Fortify', desc: `Armor up!`},
    Empower:     {rate:2, action: 'Empower', desc: `More POWER!`},
    Rush:        {rate:2, action: 'Rush', desc: `Larger dice!`},

    Sleep:       {rate:1, action: 'Sleep', desc: `Zzzz...`,}, //Make sure all rates are there, else error
    Detonate:     {rate:1,  action: 'Detonate', desc: `Detonate on death`},
    Recover:      {action: 'Recover', desc:`Recover`},

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
let skillTreeRef = [
    //Core stats
    {id:'add-life', desc:'add 10 base life'},
    {id:'add-def'},
    {id:'add-power'},
    {id:'add-dice'},
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