//MAP
//Background image ids
let tileTypesA = 'empty-1'.split(', ') //castle
let tileTypesB = 'monument-1, monument-2, chest-1'.split(', ') //dungeon, 
let tileTypesC = 'empty-1, empty-2, empty-3, empty-4'.split(', ')
let tileTypesD = 'grave, house-1, lake-1, lake-2, lake-3'.split(', ') //mine
let forests    = 'forest-1, forest-2, forest-3'.split(', ')

class MapObj{
    constructor(){
        this.xAxis = gameState.mapColumns
        this.yAxis = gameState.mapRows

        this.tiles = []

        let yAxis = 0 
        let xAxis = 1 //Offset because i know js yes


        //Generates tiles
        for(let i = 0; i < this.yAxis * this.xAxis; i++){

            let tile = {}
            let roll = rng(100)

            //Modify id to match rows and columns
            if(i % this.xAxis === 0){
                xAxis = 1
                yAxis++
            }
            tile.tileId = `${xAxis++}-${yAxis}`

            //% distriburion of tilesType
            if       (roll > 98){
                tile.tileType = tileTypesA[rng((tileTypesA.length - 1), 0)]
            }else if (roll > 90){
                tile.tileType = tileTypesD[rng((tileTypesD.length - 1), 0)]
            }else if (roll > 85){
                tile.tileType = tileTypesB[rng((tileTypesB.length - 1), 0)]
            }else if (roll > 75){
                tile.tileType = forests[rng((forests.length - 1), 0)]
            }else               {
                tile.tileType = tileTypesC[rng((tileTypesC.length - 1), 0)]
            }

            //Add player & enemies
            if (1 === rng(gameState.enemySpawnFrequency)){ //Add enemy units 30%
                let eneQuant = rng(gameState.enemyPartyCap)
                tile.enemyUnit = true
                tile.enemyQuant = eneQuant
                gameState.totalEnemies += eneQuant //Counts total enemies
            }
            
            //Flip tiles
            if(1 === rng(2)){
                tile.flip = true
            }

            //LORE: Add event id to event tiles
            if(tile.tileType.startsWith('monument')){tile.loreEvent = rng(eventRef.length)}

            this.tiles.push(tile)
        }


        //MANDATORY TILES
        //Map position is set in last main.js
        let overrides = [
            //Mandatory tiles
            {tileId:`1-${gameState.mapRows}`, playerUnit: true, enemyUnit: false}, //Player
            {tileId:`${gameState.mapColumns}-1`, tileType: 'portal-1', enemyUnit: true, enemyQuant: gameState.portalDefencers},
            // {tileId:`2-${gameState.mapRows}`, tileType: 'monument-1', loreEvent: 6,},
            {tileType: 'blacksmith'},
            {tileType: 'merchant'},

            //For testing
            // {tileId:'2-1',tileType: 'lake-1', enemyQuant: 2},
        ]

        overrides.forEach(reqTile => {
        
            //Find tile by id
            let tile = findByProperty(this.tiles, 'tileId', reqTile.tileId)
            // console.log(reqTile, tile);

            //If tiles overlap, pick new random id.
            //Inf loop will check for new random id
            if(tile == undefined || tile.required){
                while(true){
                    reqTile.tileId = `${rng(gameState.mapColumns)}-${rng(gameState.mapRows)}`
                    tile = findByProperty(this.tiles, 'tileId', reqTile.tileId)

                    if(!tile.required){
                        break;
                    }
                }
            }

            //Add required tile for loop above
            tile.required = true

            //Set properties
            //Gets all props and checks for defined ones.
            //***Add this for all other class object overrides.
            Object.getOwnPropertyNames(reqTile).forEach(property =>{
                if(reqTile[property] != undefined){
                    tile[property] = reqTile[property]
                }
            })
        })
    }
}



//MAP UI
    //Adds images and builds the map elem
    function genMap(){

        // console.table(mapRef)
        let map = el('map-container')
        map.innerHTML = ``

        //Sets map size & description (+1 due to border)
        el('map-container').setAttribute('style', 
        `
            min-width:${120 * gameState.mapColumns +1}px; min-height:${120 * gameState.mapRows}px;
            width:${120 * this.gameState.mapColumns +1}px; height:${120 * gameState.mapRows}px;
            max-width:${120 * this.gameState.mapColumns +1}px; max-height:${120 * gameState.mapRows}px;
        `)

        //Add unit
        let unit = document.createElement('div')
        unit.id = 'map-unit'
        map.append(unit)

        //Gen tiles
        mapRef.forEach(tile => {

            let tileElem = document.createElement('button')
            tileElem.id = tile.tileId
            tileElem.classList.add('map-tile')
            
            //Tile bg image
            tileElem.innerHTML = `<img src="./img/map/${tile.tileType}.svg">`

            //Player unit image
            if(tile.playerUnit){

                tileElem.innerHTML += `
                    <div id="player-unit" class="map-unit">
                        <img src="./img/map/player-unit-flag.svg" id="player-unit-flag">
                        <img src="./img/map/player-unit-body.svg" id="player-unit-body">
                        <img src="./img/map/player-unit-arms.svg" id="player-unit-arms">
                    </div>
                `
                gameState.playerLocationTile = tile

            }

            //Ene unit image
            else if(tile.enemyUnit && tile.enemyQuant === 1){

                tileElem.innerHTML += `
                    <img src="./img/map/enemy-unit-${rng(3)}.svg" class="map-unit"> 
                    <p class="unit-quant">${tile.enemyQuant}</p>
                `

            } else if(tile.enemyUnit){
                tileElem.innerHTML += `
                <img src="./img/map/enemy-unit-${4}.svg" class="map-unit"> 
                <p class="unit-quant">${tile.enemyQuant}</p>
            `
            }

            //50% flip image
            if(tile.flip){
                tileElem.firstChild.setAttribute('style', 'transform: scale(-1, 1);') 
            }

            //Events
            map.append(tileElem)
        })

        resolveMove()
    }
    
    function movePlayerUnit(elem){

        mapRef.forEach(tile => {
            //add player unit to target tile
            if(tile.playerUnit){ 
                tile.playerUnit = false
            }
            //remove enemy unit from target tile
            else if(tile.tileId === elem.id){ 
                tile.playerUnit = true
            }
        })

        //Resolve cost per movement
            if(playerObj.food > 0){
                playerObj.food--
            }else if(playerObj.power > 0){
                playerObj.power--
            }else if(playerObj.life > 1){
                playerObj.life--
            }else{
                openStateScreen('starved')
            }

        
        //Readjust the viewport
        //Get current tile X
            let startIdRef = []
            //Add current tile location id values as int to startIdRef
            gameState.playerLocationTile.tileId.split('-').forEach(val =>{
                startIdRef.push(parseInt(val))
            })

        //Get target tile Y
            let targetIdRef = []
            findByProperty(mapRef, 'tileId', elem.id).tileId.split('-').forEach(val =>{
                targetIdRef.push(parseInt(val))
            })

        //PAN MAP
            //Right
            if(startIdRef[0] < targetIdRef[0]){
                el('map').scrollBy(120,0)
            }
            // Left
            else if(startIdRef[0] > targetIdRef[0]){
                el('map').scrollBy(-120,0)
            }
            //Bottom
            else if(startIdRef[1] < targetIdRef[1]){
                el('map').scrollBy(0,120)
            }
            //Top
            else if(startIdRef[1] > targetIdRef[1]){
                el('map').scrollBy(0,-120)
            }

        gameState.turnCounter++
        gameState.playerLocationTile = findByProperty(mapRef, 'tileId', elem.id)
        
        resolveMove()
        syncUi() 
    }

    //Adds movement events to tiles.
    function resolveMove(){
        //Converts id to intigers
        let tileIdRef = []
        gameState.playerLocationTile.tileId.split('-').forEach(val =>{
            tileIdRef.push(parseInt(val))
        })

        //Adds movement events to map tiles
        mapRef.forEach(tile => {
            // console.log(tile.tileId);

            //Relocate player image
            if(tile.playerUnit && tile.enemyUnit){
                el(tile.tileId).append(el('player-unit'))

                //Remove existing unit
                el(tile.tileId).childNodes[2].remove() //remove unit image
                el(tile.tileId).childNodes[3].remove() //remove unit quantity
                tile.enemyUnit = false
                
                gameState.playerLocationTile = tile
            }
            else if(tile.playerUnit){
                el(tile.tileId).append(el('player-unit'))

                gameState.playerLocationTile = tile
            }

            //Add event if adjacent
            if(
                tile.tileId == gameState.playerLocationTile.tileId || //Player tile

                tile.tileId == `${tileIdRef[0]}-${tileIdRef[1]+1}` || //+1 row
                tile.tileId == `${tileIdRef[0]}-${tileIdRef[1]-1}` || //-1 row
                tile.tileId == `${tileIdRef[0]+1}-${tileIdRef[1]}` || //+1 col
                tile.tileId === `${tileIdRef[0]-1}-${tileIdRef[1]}`    //-1 col

                // tile.tileId == `${tileIdRef[0]+1}-${tileIdRef[1]+1}` ||
                // tile.tileId == `${tileIdRef[0]-1}-${tileIdRef[1]-1}` ||
                // tile.tileId == `${tileIdRef[0]+1}-${tileIdRef[1]-1}` ||
                // tile.tileId == `${tileIdRef[0]-1}-${tileIdRef[1]+1}`    
            ){

                //Clear all events
                el(tile.tileId).removeAttribute("onmousedown")

                //Combat envet
                if(tile.enemyUnit && tile.tileId != gameState.playerLocationTile.tileId){
                    el(tile.tileId).setAttribute("onmousedown", 'initiateCombat()')
                }
                //Portal event
                else if(tile.tileType.startsWith('portal')){
                    el(tile.tileId).setAttribute('onmousedown', 'openStateScreen("completed")')
                }
                //POI event
                else if(!tile.tileType.startsWith('empty') || !tile.tileType.startsWith('forest')){
                    if(tile == gameState.playerLocationTile){
                        el(tile.tileId).setAttribute('onmousedown', 'mapEvent()')
                    }
                }
                
                //Move event
                if(tile.tileId != gameState.playerLocationTile.tileId){
                    
                    el(tile.tileId).setAttribute("onmousedown", `movePlayerUnit(this), ${el(tile.tileId).getAttribute('onmousedown')}`)
                }
            }

            //Remove event from other tiles.
            else{
                el(tile.tileId).removeAttribute("onmousedown")
            }
        })
    }

    //Merchant event.
    function merchantMapEvent(){
        
    }

    //Generic event.
    function mapEvent(){
        
        let eventType = gameState.playerLocationTile.tileType

        if(eventType.startsWith('lake')){
            if(gameState.playerLocationTile.visited != true){
                let numberOfFish = rng(parseInt(gameState.playerLocationTile.tileId[0]) + parseInt(gameState.playerLocationTile.tileId[2]))
                playerObj.food += numberOfFish
                el('event-cover').setAttribute('src','./img/bg/lake.svg')
                el('event-desc').innerHTML =`You found ${numberOfFish} <img src="./img/ico/fish.svg">`

                syncUi()
            }else{
                el('event-cover').setAttribute('src','./img/bg/lake.svg')
                el('event-desc').innerHTML =`You spent few hours trying to catch more fish, but it seems that there is no more left.`
            }
            screen('event-screen')
        }
        else if(eventType.startsWith('chest')){
            if(gameState.playerLocationTile.visited != true){
                let val = rng(parseInt(gameState.playerLocationTile.tileId[0]) + parseInt(gameState.playerLocationTile.tileId[2]) + 12, 6)
                playerObj.coins += val
                el('event-cover').setAttribute('src','./img/bg/chest.svg')
                el('event-desc').innerHTML =`You found ${val} <img src="./img/ico/coin.svg">`
                syncUi()
            }else{
                el('event-cover').setAttribute('src','./img/bg/chest.svg')
                el('event-desc').innerHTML =`The chest is empty.`
            }

            screen('event-screen')
        }
        else if(eventType.startsWith('merchant')){
            //Generate shop.
            el('merchant-container').innerHTML = ``

            //Swap for testing
            // genOfferedItemList("all", 'merchant')
            genOfferedItemList(gameState.merchantQuant, 'merchant')

            //Regen item cards for 'sell' page.
            el('items-to-sell').innerHTML = ``
            playerObj.inventory.forEach(item => {
                el('items-to-sell').append(genItemCard(item, 'item-to-sell'))
            })

            //Open merchant screen.
            screen('merchant')
        }
        else if(eventType.startsWith('blacksmith')){
            //Generate items-to-enhance.
            el('items-to-enhance').innerHTML = ``
            playerObj.inventory.forEach(item => {
                el('items-to-enhance').append(genItemCard(item, 'item-to-enhance'))
            })

            //Generate items-to-repair
            el('items-to-repair').innerHTML = ``
            playerObj.inventory.forEach(item => {
                el('items-to-repair').append(genItemCard(item, 'item-to-repair'))
            })

            //Open merchant screen
            screen('blacksmith')
        }
        //Lore
        else if(eventType.startsWith('monument')){
            
            let event = eventRef[gameState.playerLocationTile.loreEvent]

            if(event.img != undefined){
                el('event-cover').setAttribute('src',`./img/lore/${event.img}.svg`)
            }
            else{
                el('event-cover').setAttribute('src',`./img/lore/event-${event.eventId}.svg`)
            }

            el('event-desc').innerHTML =`${event.eventDesc}`
            screen('event-screen')

        }
        else{
            showAlert(`You look around.<br>There is nothing to see here.`)
        }

        //Check if visited.
        gameState.playerLocationTile.visited = true
    }

    let eventRef =[
        {
            'eventId': 0,
            'eventDesc': `
                You notice a monolith, but it is heavily damaged. 
                Something was depicted on it, but it's very hard to decipher.
            `
        },
        {
            'eventId': 1,
            'eventDesc': `
                You notice a large dark monolith in the middle of the area.
                You approach it and see an engraved image...
            `
        },
        {
            'eventId': 2,
            'eventDesc': `
                You notice a large dark monolith in the middle of the area.
                You approach it and see an engraved image...
            `
        },
        //Monolith
        {
            'eventId': 3,
            'img': 'event-text',
            'eventDesc': `
                You find a monolith, it is mostly damaged, but you manage to decipher a phrase...<br>
                <h3>"This palce is not a place of honour..."</h3>
            `
        },
        {
            'eventId': 4,
            'img': 'event-text',
            'eventDesc': `
                You find a monolith, it is mostly damaged, but you manage to decipher a phrase...<br>
                <h3>"No highly esteemed deed is commemorated here. Nothing valued...</h3>

            `
        },
        {
            'eventId': 5,
            'img': 'event-text',
            'eventDesc': `
                You find a monolith, it is mostly damaged, but you manage to decipher a phrase...<br>
                <h3>"Nothing valued is here. What is here..."</h3>
            `
        },
        {
            'eventId': 6,
            'img': 'event-text',
            'eventDesc': `
                You find a monolith, it is mostly damaged, but you manage to decipher a phrase...<br>
                <h3>"What is here is dangerous and repulsive to us. This message..."</h3>
            `
        },
        {
            'eventId': 7,
            'img': 'event-text',
            'eventDesc': `
                You find a monolith, it is mostly damaged, but you manage to decipher a phrase...<br>
                <h3>"This message is a warning..."</h3>
            `
        },
        {
            'eventId': 8,
            'img': 'event-text',
            'eventDesc': `
                You find a monolith, it is mostly damaged, but you manage to decipher a phrase...<br>
                <h3>"...warning about danger..."</h3>
            `
        },
    ]