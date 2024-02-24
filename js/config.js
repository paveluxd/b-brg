//Confign for posting
let config = {
        version:    3,

    //Player
        life:      40, //40
        power:      0,
        def:        0,
        dice:       6,
        inventory: 40,
        slots:      5,
        class:      'guardian',
        coins:      0,
        food:       12,

    //Progression
        expBase: 2,
        expMult: 1,
        expExpo: 0.4,
        basePassieSkillPoints: 0,

    //Game
        fadeTime: 400,

    //Starting items
        stGuardian: [
            'club',
            'shield',
        ],
        stCrusader: [
            'sword',
            'bandages',
        ],
        stWanderer: [
            'bow',
            'cape',
        ],
        

    //Enemy
        eneLife: 6, //8
        enSpawnFrequency: 35,

    //Combat UI
        bgCounter: 3, //1 per saved combat bg for rng.

    //Map
        mapX:             3, //1
        mapY:            12, //Vertical
        enemyPartyCap:    4, //25% item reward per enemy
        mandatoryTiles:  [],

    //Items
        chargeFloor: 0.5,     //Lowes % for item action charge
        merchantQuant: 10,
}

// Test config
if(0 == 1){
    config.power = 0
    config.def   = 0
    config.dice  = 6
    config.slots = 9
    config.class = 'wanderer'
    config.coins = 90
    config.food  = 12

    //Progression
    config.basePassieSkillPoints = 9

    //Game
    config.testCombat        = true //Initiates combat at the start (for testing).
    config.showScreen        = 'combat' 
    config.clearLs           = true
    // config.showCombatInfoLog = true
    // config.stage             = 4

    //Starting items
    config.stGuardian = [
            'club',
            'shield',

    ]
    config.stCrusader = [
        'club',
        'wooden shield',   
    ]
    config.stWanderer = [
        'bow',
        'cape',
        'bag',
        'kite shield',
        'spear',
        "leather boots",
        'bandages'
    ]
    
    //Enemy
    config.forceEnemyProfile = ['boss','boss4']
    config.forceEnemyAction  = 'sleep'

    //Map
    config.mapX           = 3, //1
    config.mapY           = 6, //Vertical
    config.mandatoryTiles = [
        // {tileId:`2-${this.yAxis}`, tileType: 'casino', enemyUnit: true, boss: true, enemyQuant: 1},
        // {tileId:`1-12`, tileType: 'dungeon-1', enemyUnit: false},
        // {tileType: 'enchanter-1', enemyUnit: false},
        // {tileType: 'merchant-1', tileId:`1-12`,enemyUnit: false},
        // {tileType:'monument-1', tileId:`1-2`, loreEvent: 9},
        // {tileType:'camp-1', tileId:`1-12`,enemyUnit: false},
    ]

    //Items
    config.merchantQuant = 'all'
}