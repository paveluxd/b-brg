let config = {
    //Player
        life:      32, //32
        power:      9,
        def:        0,
        dice:       6,
        inventory: 20,
        slots:      6,
        startingItems: [
            'club',
            'shield',
            "bandages",
            'dagger',
            'tetracore',
            'octocore',
            'decacore',
            'dodecacore'
            // "sigil of light",
            // 'wooden staff',
            // 'book of order',
            // 'book of lightning'
            // 'sword',
            // 'mace',
            // 'boots',
            // 'plate armor',
            // 'water potion'
        ],

        coins: rng(12,6),
        food:  rng(5,3),

    //Enemy
        eneLife: 8,

    //Game
        testCombat: false, //Initiates combat at the start (for testing).
        showScreen: 'map',
        clearLs: true,

    //Progression
        expRequiredPerLvl: 3,
        basePassieSkillPoints: 0,

    //Combat UI
        bgCounter: 3, //1 per saved combat bg for rng.

    //Map
        stage: 0,
        mapX: 1,
        mapY: 1,
        portalDefenders: 1,
        mandatoryTiles: [
            // {tileId:`2-${this.yAxis}`, tileType: 'casino', enemyUnit: false},
            // {tileType: 'blacksmith'},
            // {tileType: 'merchant'},
            {tileType: 'monument-1'},
        ],

        bossFrequency: 3, //Every Nth stage

        flatItemReward: 2, //Base rewards
        flatFoodReward: 1, //Food per round +1 per enemy
        flatCoinsReward: 6, 

        //Merchant
        merchantQuant: 10,    
}