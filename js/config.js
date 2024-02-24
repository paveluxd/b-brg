//Confign for posting
let config = {
        version:    2,

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
        expExpo: 0.4,
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
config = {
        version:    2,

    //Player
        life:       40, //40
        power:       0,
        def:         0,
        dice:        6,
        slots:       5,
        inventory:  40,
        class:      'wanderer',

    //Progression
        expBase: 2,
        expMult: 1,
        expExpo: 0.4,
        basePassieSkillPoints: 9,

    //Game
        // testCombat: true, //Initiates combat at the start (for testing).
        showScreen: 'map', 
        clearLs: true,
        // showCombatInfoLog: true,
        // stage: 4,

    //Starting items
        stGuardian: [
            'club',
            'shield',

        ],
        stCrusader: [
            'club',
            'wooden shield',   
        ],
        stWanderer: [
            'bow',
            'cape',
            'bag',
        ],
        coins: 90, //rng(12,6),
        food:  6, //rng(4,2),

    //Enemy
        eneLife: 6, //8
        // forceEnemyProfile: ['boss','bossc'],
        // forceEnemyAction: 'wound',
        enSpawnFrequency: 40,

    //Combat UI
        bgCounter: 3, //1 per saved combat bg for rng.

    //Map
        mapX:             3, //1
        mapY:             6, //Vertical
        enemyPartyCap:    3, //25% item reward per enemy
        mandatoryTiles: [
            // {tileId:`2-${this.yAxis}`, tileType: 'casino', enemyUnit: true, boss: true, enemyQuant: 1},
            // {tileId:`1-12`, tileType: 'dungeon-1', enemyUnit: false},
            // {tileType: 'enchanter-1', enemyUnit: false},
            // {tileType: 'merchant-1', tileId:`1-12`,enemyUnit: false},
            // {tileType:'monument-1', tileId:`1-2`, loreEvent: 9},
            // {tileType:'camp-1', tileId:`1-12`,enemyUnit: false},
        ],

    //Items
        chargeFloor: 0.5,     //Lowes % for item action charge
        merchantQuant: 'all',
}
}