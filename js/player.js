//Player
class PlayerObj {
    constructor(){
        //Life
            this.baseLife          = config.life   //Lvl 1 char life
            this.flatLifeMod       = 0
            this.flatLife          = this.baseLife //Life cap.
            this.life              = this.baseLife //Current life.
            this.dmgDone           = 0
            this.dmgTaken          = 0
            this.lifeChange        = 0
            this.lifeChangeMarker  = false
        //Power
            this.basePower         = config.power
            this.flatPower         = this.basePower
            this.power             = this.basePower
            this.powerChange       = 0
            this.powerChangeMarker = false
        //Def
            this.baseDef           = config.def
            this.flatDef           = this.baseDef
            this.def               = this.baseDef
            this.defChange         = 0
            this.defChangeMarker   = false
        //Dice
            this.baseDice          = config.dice //needed as ref in case flat dice is modified by item
            this.flatDice          = this.baseDice
            this.dice              = this.baseDice
            this.diceChange        = 0
            this.diceChangeMarker  = false
        //Roll
            this.roll              = 0
            this.rollBonus         = 0
            this.rollChange        = 0
            this.rollChangeMarker  = false

        //While in combat
            this.piercing          = false
            this.swordDmgMod       = 0
            this.poisonBuff        = false
            

        //Inventory
            this.inventorySlots = config.inventory
            this.inventory      = [] //Items gained as rewards
            this.startingItems  = config.startingItems   
        //Equipment slots
            this.baseSlots      = config.slots
            this.equipmentSlots = this.baseSlots
        //Actions
            this.actionSlots    = this.baseSlots
            this.actions        = [] //Actions gained from items
            this.tempActions    = [] //Temporary actions

        // this.draftActions   = [] //Draft actions gained from items

        //Sub-stats
            this.coins          = config.coins
            this.food           = config.food
        //Progression
            this.exp            = 0
            this.lvl            = 1
            this.lvlUpExp       = config.expRequiredPerLvl
            this.treeNodes      = []
            this.treePoints     = config.basePassieSkillPoints
        //Misc
            this.offeredItemsArr= [] //Stores rewards
            this.class          = 'crusader'
    }
}

function checkIfPlayerCanAttack(){

    //Check if player has an attack action
    let attack = false

    // console.log(gs.plObj.actions);
    gs.plObj.actions.forEach(action => {
        action.tags.split(', ').forEach(tag => {
            if(tag == 'attack'){
                attack = true
            }
        })
    })

    if(attack == false){
        // console.log(findByProperty(actionsRef, 'keyId', 'a62'));
        // gs.plObj.actions.unshift(findByProperty(actionsRef, 'keyId', 'a62'))
        gs.plObj.actions.unshift(new ActionObj('punch'))
    }

    //Add punch to actions
}

//* COMBAT MISC
function resetFlatStats(){
    //4.Set stats before combat
    //Restore sword dmg buff
    gs.plObj.swordDmgMod = 0

    //Restore flat def
    if(gs.plObj.def !== gs.plObj.flatDef){
        gs.plObj.def = gs.plObj.flatDef
    }

    //Restore flat power
    if(gs.plObj.power !== gs.plObj.flatPower){//see if power should stay betweeen combats, set sign to <
        gs.plObj.power = gs.plObj.flatPower
    } 

    //Recalc all items and actions
    resolvePlayerStats()
}

//Exp and lvl
function resolveExpAndLvl(){

    //Add 1 exp for winning
    gs.plObj.exp++  

    //TREE: On exp gain passives
    resolveOnStatChangePassives('exp')                            

    //Lvl up
    if(gs.plObj.exp >= gs.plObj.lvlUpExp){
        gs.plObj.lvl++
        gs.plObj.lvlUpExp =  Math.ceil(gs.plObj.lvlUpExp * 1.5)
        gs.plObj.exp = 0
    }

    //Recalc player lvl
    // gs.plObj.lvl = Math.floor(gs.plObj.exp / config.expRequiredPerLvl + 1) 

    // //Calc exp until lvl up
    // gs.plObj.lvlUpExp = (gs.plObj.lvl - 1) * config.expRequiredPerLvl + config.expRequiredPerLvl

    //Calc available tree points

    //-1 for initial lvl 1
    gs.plObj.treePoints = gs.plObj.lvl - gs.plObj.treeNodes.length - 1
}