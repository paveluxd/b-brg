//Confign for posting
let config = {
    //Player
        life:      40, //40
        power:      0,
        def:        0,
        dice:       6,
        inventory: 80,
        slots:      5,

    //Progression
        expRequiredPerLvl: 2,
        basePassieSkillPoints: 0,

    //Game
        // showCombatInfoLog: true,
        fadeTime: 400,

    //Items
        startingItems: [
            'club',
            'shield',
            'bandages',
        ],

        coins: 0,
        food:  4,

    //Enemy
        eneLife: 8, //8
        enSpawnFrequency: 40,

    //Combat UI
        bgCounter: 3, //1 per saved combat bg for rng.

    //Map
        mapX:             3,  //1
        mapY:            12, //Vertical
        exitDefenders:    3,
        enemyPartyCap:    3, //25% item reward per enemy
        mandatoryTiles:  [],
}

// Test config
config = {
    //Player
        life:       40, //40
        power:       0,
        def:         0,
        dice:        6,
        inventory:  80,
        slots:       5,

    //Progression
        expRequiredPerLvl: 2,
        basePassieSkillPoints: 11,

    //Game
        // testCombat: true, //Initiates combat at the start (for testing).
        showScreen: 'tree', 
        clearLs: true,
        showCombatInfoLog: true,
        fadeTime: 40,


    //Items
        startingItems: [
            'club',
            'shield',
            'bandages'
        ],

        coins: 0, //rng(12,6),
        food:  6, //rng(4,2),

    //Enemy
        eneLife: 8, //8
        // forceEnemyProfile: 'assassin',
        // forceEnemyAction: 'sleep',
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
            // {tileType:'monument-1', tileId:`2-2`, loreEvent: 8},
        ],
}