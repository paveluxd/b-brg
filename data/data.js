let gs //game state object

//Game
    class GameState {
        constructor(){
            this.stage = config.stage
            this.encounter = 1

            //Encounter
            this.inCombat = false
            this.combatTurn = 1
            this.logMsg = []      // Combat log messages.
            this.statChange = []  // Stats for UI indicator.
            this.enemyAction = [] // Last enemy action.
            
            //Map data obj.
            this.mapObj
            
            //Stats for end game screen.
            this.turnCounter = 0 //Calc turns for win stats.
            this.enemyCounter = 0
            this.totalEnemies = config.exitDefenders + this.stage
            this.totalCombatTurns = 0
            
            //Merchant config.
            this.merchantQuant = config.merchantQuant

            //Casino bets.
            //TBA

            //Combat config.
            this.enemySpawnFrequency = 30 //30%
            this.dungeonEnemySpawnFrequency = 100
            this.enemyPartyCap = 2

            this.bossFrequency   = 3 // Every Nth stage legacy.
            this.flatItemReward  = 2 // Base rewards.
            this.flatFoodReward  = 1 // Food per round +1 per enemy.
            this.flatCoinsReward = 6 
        }
    }

//Saving
    function saveGame(){
        //Increase stage to scale enemies
        // gs.mapObj = new MapObj //Generate a mapObj for the next stage

        localStorage.setItem('gameState', JSON.stringify(gs))        
        console.log('Game saved');
    }

    function clearSavedGame(){
        localStorage.removeItem('gameState')
        console.log('Game save removed');
    }

    function loadGame(){
        let gameObj = JSON.parse(localStorage.getItem('gameState'))

        if (gameObj == undefined){
            // gs = new GameState

            // gs.plObj = new PlayerObj
            // //Resolve ititial items
            // gs.plObj.startingItems.forEach(key => {addItem(key)})

            console.log('New game started');
        }
        else {
            gs = gameObj
            console.log('Game loaded');
        }
    }