let config = {
    //Player
        life:      30, //32
        power:      0,
        def:        0,
        dice:       6,
        inventory: 99,
        slots:      5,

    //Progression
        expRequiredPerLvl: 2,
        basePassieSkillPoints: 2,

    //Game
        testCombat: false, //Initiates combat at the start (for testing).
        showScreen: '', 
        clearLs: true,

    //Items
        startingItems: [
            'club',
            'shield',
            'bandages',

            "scroll of fortification",
            'mace',
            'pauldron',
            'adrenaline pen'
        ],

        coins: rng(12,6),
        food:  rng(5,3),

    //Enemy
        eneLife: 6, //8

    //Combat UI
        bgCounter: 3, //1 per saved combat bg for rng.

    //Map
        stage:           0,
        mapX:            6,
        mapY:            6,
        portalDefenders: 1,
        mandatoryTiles: [
            // {tileId:`2-${this.yAxis}`, tileType: 'casino', enemyUnit: false},
            // {tileType: 'blacksmith'},
            // {tileType: 'merchant'},
            // {tileType: 'monument-1'},
        ],

        bossFrequency:   3, //Every Nth stage

        //Rewards
        flatItemReward:  2, //Base rewards
        flatFoodReward:  1, //Food per round +1 per enemy
        flatCoinsReward: 6, 

        //Merchant
        merchantQuant:  10,    
}