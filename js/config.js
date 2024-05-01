//Confign for posting
let config = {
        version:    5,

    //Player
        life:      60, //40
        power:      0,
        def:        0,
        dice:       6,
        inventory: 40,
        slots:      5,
        class:      'guardian',
        coins:      12,
        food:       30,

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
        eneLife: 4, //8

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
if(1 == 2){
    // config.life = 110
    config.power = 0
    config.def   = 0
    config.dice  = 6
    config.slots = 20
    config.class = 'guardian'
    config.coins = 90

    //Progression
    config.basePassieSkillPoints = 9

    //Game
    config.showScreen        = 'map' 
    if(config.showScreen    == 'combat'){config.testCombat = true} //Initiates combat at the start (for testing).
    config.clearLs           = true
    config.showCombatInfoLog = true
    // config.stage             = 1
    config.skipTutorial      = true

    //Starting items
    config.stGuardian = [
            'club',
            'pendant',
            'bag',
            'spiked shield',
            'gonfalon',
            'poison potion',
            'gambison',
            'robe'
    ]
    config.stCrusader = [
        'sword',
        'wooden shield',   
    ]
    config.stWanderer = [
        'bow',
        'cape',
        'bag',
        'helmet',
        'spiked shield',
        'wizards head',
        'wizards hand',
    ]
    
    //Enemy
    // config.forceEnemyProfile = ['enemy','gladiator']
    // config.forceEnemyProfile = ['boss','boss3']
    // config.forceEnemyAction  = 'block'

    //Map
    config.mandatoryTiles = [
        // {tileId:`2-${this.yAxis}`, tileType: 'casino', enemyUnit: true, boss: true, enemyQuant: 1},
        // {tileId:`1-12`, tileType: 'dungeon-1', enemyUnit: false},
        {tileType: 'enchanter-1',tileId:`3-9`, enemyUnit: false},
        {tileType: 'merchant-1', tileId:`1-9`,enemyUnit: false},
        // {tileType:'monument-1', tileId:`1-2`, loreEvent: 9},
        // {tileType:'house-1', tileId:`1-12`,enemyUnit: false},
    ]

    //Items
    config.merchantQuant = 'all'
}