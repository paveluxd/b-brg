let config = {
    //Player
        life:      320, //32
        power:      10,
        def:        0,
        dice:       6,
        inventory: 80,
        slots:      5,

    //Progression
        expRequiredPerLvl: 2,
        basePassieSkillPoints: 0,

    //Game
        testCombat: false, //Initiates combat at the start (for testing).
        showScreen: '', 
        clearLs: true,

    //Items
        startingItems: [
            'club',
            'shield',
            'bandages',
        ],

        coins: rng(12,6),
        food:  rng(5,3),

    //Enemy
        eneLife: 6, //8

    //Combat UI
        bgCounter: 3, //1 per saved combat bg for rng.

    //Map
        stage:           0,
        mapX:            3,
        mapY:            3,
        exitDefenders: 1,
        mandatoryTiles: [
            {tileId:`2-${this.yAxis}`, tileType: 'casino', enemyUnit: true, boss: true},
            {tileType: 'dungeon-1', enemyUnit: false},
            // {tileType: 'enchanter-1', enemyUnit: false},
            // {tileType: 'merchant'},
            // {tileType: 'campfire-1'},
        ],

        bossFrequency:   3, //Every Nth stage

        //Rewards
        flatItemReward:  2, //Base rewards
        flatFoodReward:  1, //Food per round +1 per enemy
        flatCoinsReward: 6, 

        //Merchant
        merchantQuant:  10,    
}