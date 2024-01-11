//Confign for posting
let config = {
    //Player
        life:      40, //40
        power:      0,
        def:        0,
        dice:       6,
        inventory: 99,
        slots:      5,
        class:      'guardian',

    //Progression
        expBase: 2,
        expMult: 1,
        expExpo: 0.8,
        basePassieSkillPoints: 0,

    //Game
        // showCombatInfoLog: true,
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
        coins: 0,
        food:  4,

    //Enemy
        eneLife: 3, //8
        enSpawnFrequency: 35,

    //Combat UI
        bgCounter: 3, //1 per saved combat bg for rng.

    //Map
        mapX:             3,  //1
        mapY:            12, //Vertical
        exitDefenders:    3,
        enemyPartyCap:    3, //25% item reward per enemy
        mandatoryTiles:  [],

    //Items
        chargeFloor: 0.5     //Lowes % for item action charge
}

// Test config
config = {
    //Player
        life:       40, //40
        power:       0,
        def:         0,
        dice:        6,
        inventory:  40,
        slots:       5,
        class:      'guardian',

    //Progression
        expBase: 2,
        expMult: 1,
        expExpo: 0.8,
        basePassieSkillPoints: 0,

    //Game
        // testCombat: true, //Initiates combat at the start (for testing).
        showScreen: 'tree', 
        clearLs: true,
        showCombatInfoLog: true,
        fadeTime: 40,


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
        coins: 0, //rng(12,6),
        food:  6, //rng(4,2),

    //Enemy
        eneLife: 8, //8
        // forceEnemyProfile: 'assassin',
        // forceEnemyAction: 'wound',
        enSpawnFrequency: 40,

    //Combat UI
        bgCounter: 3, //1 per saved combat bg for rng.

    //Map
        mapX:             3, //1
        mapY:            12, //Vertical
        exitDefenders:    3,
        enemyPartyCap:    3, //25% item reward per enemy
        mandatoryTiles: [
            // {tileId:`2-${this.yAxis}`, tileType: 'casino', enemyUnit: true, boss: true, enemyQuant: 1},
            // {tileId:`11-3`, tileType: 'dungeon-1', enemyUnit: false},
            // {tileType: 'enchanter-1', enemyUnit: false},
            // {tileType: 'merchant-1'},
            // {tileType:'monument-1', tileId:`1-2`, loreEvent: 9},
            // {tileType:'lake-1', tileId:`12-2`},
        ],

    //Items
        chargeFloor: 0.5     //Lowes % for item action charge
}