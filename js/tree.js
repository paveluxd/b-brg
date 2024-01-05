let prefix = 'treenode_'


//Spend tree points
//Adds tree node obj to playerObj
    function addTreeNode(nodeId, treeHtmlElemId){
        //Allocate new node
        if(gs.plObj.treePoints > 0){
            let node = findByProperty(treeRef, 'id', nodeId)

            // Add skill node to player obj    
            gs.plObj.treeNodes.push(node)    
            
            gs.plObj.treePoints--

            allocateTreeNode(treeHtmlElemId)

            resolvePlayerStats()
            saveGame()
            syncUi()
        }
        //Not enough points
        else{
            showAlert(`All passive skill points are allocated.`)
        }
    }


//Changes state of a tree node in UI
    function allocateTreeNode(nodeElemId){
        //Find node in gs.treeObj
        gs.treeObj[nodeElemId].allocated = true

        //Add class to highlight allocated node and paths
        el(nodeElemId).classList.add('node-allocated')

        //Highlight connectors for each direction
        gs.treeObj[nodeElemId].tileConnectors.forEach(connector => {
            highlightPath(nodeElemId, connector)
        })

        //Highlight adjacent nodes
    }

    //Add class to highlight the path
    function highlightPath(elemId, direction){

        let treeElem = el(findAdjacentTile(elemId, direction))
        let n = 1

        //Repeats untill all paths are highlighted
        while(n < 5 && treeElem.classList.contains('path')){
            n++
            treeElem.classList.add('active-path')
            treeElem = el(findAdjacentTile(treeElem.id, direction))
        }
    }

    //Returns id of an adjacent cell based on direction
    function findAdjacentTile(tileId, direction){
        let column = tileId.split('_')[1].split('-')[0] * 1
        let row    = tileId.split('_')[1].split('-')[1] * 1

        if      (direction == 'TT'){
            return `${prefix}${column    }-${row - 1}`
        }else if(direction == 'RR'){
            return `${prefix}${column + 1}-${row    }`
        }else if(direction == 'DD'){
            return `${prefix}${column    }-${row + 1}`
        }else if(direction == 'LL'){
            return `${prefix}${column - 1}-${row    }`
        }else if(direction == 'RD'){
            return `${prefix}${column + 1}-${row + 1}`
        }else if(direction == 'LD'){
            return `${prefix}${column - 1}-${row + 1}`
        }else if(direction == 'RT'){
            return `${prefix}${column + 1}-${row - 1}`
        }else if(direction == 'LT'){
            return `${prefix}${column - 1}-${row - 1}`
        }
    }


//Tree UI
    function generateSkillTree(){

        //Update points counter
        // el('skill-points-indicator').innerHTML = `Skill tree point: ${gs.plObj.treePoints}/${gs.plObj.treePoints + gs.plObj.treeNodes.length}`
        
        el('skill-tree').innerHTML = ``

        let treeRows      = 13
        let treeColumns   = 29
        let column        = 0
        let row           = 0
        let nodeType
        let node

        
        //Build saved tree from gs.treeObj
            if(Object.keys(gs.treeObj).length > 0){
                Object.keys(gs.treeObj).forEach(node => {
                    console.log(gs.treeObj[node]);
                    let treeNode = gs.treeObj[node]
                    createTreeCell(treeNode.tileColumn, treeNode.tileRow, treeNode.tileType)
                })
            }
        //Build new from treeStructure
            else{
                treeStructure.forEach(tile => {
    
                    nodeType = undefined
    
                    //Split data string
                    let tileContent = tile.split('_') // 11-4_lif_TT-RR-DD-LL

                    //Create tile object 
                    gs.treeObj[prefix + tileContent[0]] = {}
                    
                    //Set tile object properties
                    node                = gs.treeObj[prefix + tileContent[0]] // this causes gs.treeObj obj to be updated
                    node.tileColumn     = parseInt(tileContent[0].split('-')[0])
                    node.tileRow        = parseInt(tileContent[0].split('-')[1])
                    node.tileType       = tileContent[1]            //'T12'
                    node.tileConnectors = tileContent[2].split('-') //creates array of tile connector markers TT,BB etc.
                    node.imgPath        = tileContent[1]            //sets tile image
    
                    createTreeCell(node.tileColumn, node.tileRow, nodeType)
                })
            }

        //Build base tree
            for(i=0; i < treeRows * treeColumns; i++){

                //Cell creation trigger
                let createCell = false

                //Set row Y id
                column++
                if(column > treeColumns){column = 1}

                //Set column X id
                if(i % treeColumns == 0){row ++}

                //Set tile images
                //Rows 
                let refRows = [1,5,9,13]

                if(
                       refRows.includes(row)
                    || [3].includes(column) && [2].includes(row)
                ){
                    createCell = true
                    nodeType = 'horizontal-path'
                }

                //Columns 
                let refColumns = [1,5,9,13,17,21,25,29]
                if(
                        refColumns.includes(column) 
                    || [2,4].includes(column) && [3].includes(row) 
                    || [18,20].includes(column) && [2].includes(row)
                ){
                    createCell = true
                    nodeType = 'vertical-path'
                }

                //Clears
                if(
                       [6,7,8, 14,15,16, 22,23,24,  27].includes(column) && row == 1 //1st row
                    || [2,3,4].includes(column) && row == 5                          //Guardian 2nd row
                    || [17,21].includes(column) && [1,2,3].includes(row)             //Wanderer
                    || [24].includes(column) && [5].includes(row)
                ){
                    createCell = false
                }

                //Abort if cell exists
                if(el(`${prefix}${column}-${row}`) != undefined){
                    createCell = false
                }

                //Set cell content
                if(createCell){
                    createTreeCell(column, row, nodeType)
                }
            }

        //Preallocate class node
            if      (gs.plObj.class == 'guardian'){

                gs.treeObj[`${prefix}3-1`] = {
                    tileColumn: 3,
                    tileRow: 1,
                    tileType: 'sta',
                    tileConnectors: ['RR','LL'],
                    allocated: true,
                    imgPath:'sta'
                }

                createTreeCell(3, 1)

            }else if(gs.plObj.class == 'crusader'){

                gs.treeObj[`${prefix}11-1`] = {
                    tileColumn: 11,
                    tileRow: 1,
                    tileType: 'sta',
                    tileConnectors: ['RR','LL'],
                    allocated: true,
                    imgPath:'sta'
                }

                createTreeCell(11, 1)
                el(`${prefix}10-1`).childNodes[1].classList.add('tree-path-active')
                el(`${prefix}12-1`).childNodes[1].classList.add('tree-path-active')

            }else if(gs.plObj.class == 'wanderer'){

                gs.treeObj[`${prefix}19-1`] = {
                    tileColumn: 19,
                    tileRow: 1,
                    tileType: 'sta',
                    tileConnectors: ['RR','LL'],
                    allocated: true,
                    imgPath:'sta'
                }

                createTreeCell(19, 1)

            }

        //Creates tree tile elem
            function createTreeCell(column, row, node){
                //Override node if paths were added in treeStructure
                if(node == 'ver'){ 
                    node = 'vertical-path'
                }

                //Gen path tile
                if(node == 'vertical-path' || node == 'horizontal-path'){

                    if(node == 'horizontal-path'){
                        el('skill-tree').innerHTML += `
                            <div id="${prefix}${column}-${row}" class='tree-tile path'>
                                <div class="tree-path" style="transform: rotate(90deg)"></div>
                            </div>
                        `
                    } else {
                        el('skill-tree').innerHTML += `
                            <div id="${prefix}${column}-${row}" class='tree-tile path'>
                                <div class="tree-path"></div>
                            </div>
                        `
                    }

                    el(`${prefix}${column}-${row}`).setAttribute('style',`grid-column-start:${column}; grid-row-start:${row}`)

                } 
                
                //Gen empty tile
                else if(node == 'empty'){
                    el('skill-tree').innerHTML += `
                        <div id="${prefix}${column}-${row}" class='tree-tile'></div>
                    `
                    el(`${prefix}${column}-${row}`).setAttribute('style',`grid-column-start:${column}; grid-row-start:${row}`)

                } 
                
                //Gen node
                else {
                    //Find matching obj in gs.treeObj
                    // console.log(`${prefix}${column}-${row}`);
                    let treeObjNode = gs.treeObj[`${prefix}${column}-${row}`]

                    //Set cell content
                        //Add directional connectors  
                        let directionLineElems = ''             
                        treeObjNode.tileConnectors.forEach(direction => {
                            directionLineElems  += `<div class='${direction}'></div>`
                        })
                        

                        let cellContent = `
                            <img class="btn--ico" src="./img/tree/${treeObjNode.imgPath}.svg"> 
                            ${directionLineElems}
                        `
        
                    //Creates new tile
                    if(el(`${prefix}${column}-${row}`) == undefined){
                        
                        //Set elem type
                        let elemType = 'button'
                        if(node == 'div'){elemType = 'div'}
                    
                        //Set content
                        el('skill-tree').innerHTML += `
                            <${elemType} id="${prefix}${column}-${row}" class='tree-tile'>
                                ${cellContent}
                            </${elemType}>
                        `
        
                        //Set elem to a particular grid tile
                        el(`${prefix}${column}-${row}`).setAttribute('style',`grid-column-start:${column}; grid-row-start:${row}`)

                        //Add onclick event
                        el(`${prefix}${column}-${row}`).setAttribute('onclick', `nodePreview(this)`)
                    }
        
                    //Updates existing tile
                    else{
                        el(`${prefix + column}-${row}`).innerHTML = cellContent
                    }
                }
            }

        // Adjust tab tree icon if there are unspent skill tree points.
            if(gs.plObj.treePoints > 0){
                el('map-character-btn').innerHTML = `<img src="./img/ico/character-active.svg">Character`
                el('tree-btn').innerHTML = `<img src="./img/ico/tree-active.svg">Tree`
            } 
            else {
                el('map-character-btn').innerHTML = `<img src="./img/ico/character.svg">Character`
                el('tree-btn').innerHTML = `<img src="./img/ico/tree.svg">Tree`
            }

        //Highlight allocated nodes
            Object.keys(gs.treeObj).forEach(node => {
                if(gs.treeObj[node].allocated){
                    allocateTreeNode(node)
                }
            })
    }


//Trigger node pop-up
    function nodePreview(nodeElem){

        //Find related node
            let node = findByProperty(treeRef, 'id', gs.treeObj[nodeElem.id].tileType)
            let objNode = gs.treeObj[nodeElem.id]

        //See if adjacent nodes are allocated
            let adjacentNodeIsAllocated = false
            let nodeConnectors = gs.treeObj[nodeElem.id].tileConnectors
            let adjacentNode, newColumnVal, newRowVal

            nodeConnectors.forEach(connector => {
                //Find next node
                if(        connector == 'TT'){

                    newColumnVal = objNode.tileColumn
                    newRowVal    = objNode.tileRow - 1

                    adjacentNode = gs.treeObj[`${prefix}${newColumnVal}-${newRowVal}`]

                    while(adjacentNode == undefined){
                        newRowVal--
                        adjacentNode = gs.treeObj[`${prefix}${newColumnVal}-${newRowVal}`] 
                    }

                    if(adjacentNode.allocated){
                        adjacentNodeIsAllocated = true
                    }

                    // console.log(el(`${prefix}${newColumnVal}-${newRowVal}`));

                } else if (connector == 'RR' && adjacentNodeIsAllocated == false){

                    newColumnVal = objNode.tileColumn + 1
                    newRowVal    = objNode.tileRow

                    adjacentNode = gs.treeObj[`${prefix}${newColumnVal}-${newRowVal}`]

                    while(adjacentNode == undefined){
                        newColumnVal++
                        adjacentNode = gs.treeObj[`${prefix}${newColumnVal}-${newRowVal}`] 
                    }

                    if(adjacentNode.allocated){
                        adjacentNodeIsAllocated = true
                    }

                    // console.log(el(`${prefix}${newColumnVal}-${newRowVal}`));

                } else if (connector == 'DD' && adjacentNodeIsAllocated == false){

                    newColumnVal = objNode.tileColumn
                    newRowVal    = objNode.tileRow + 1

                    adjacentNode = gs.treeObj[`${prefix}${newColumnVal}-${newRowVal}`]

                    while(adjacentNode == undefined){
                        newRowVal++
                        adjacentNode = gs.treeObj[`${prefix}${newColumnVal}-${newRowVal}`] 
                    }

                    if(adjacentNode.allocated){
                        adjacentNodeIsAllocated = true
                    }

                    // console.log(el(`${prefix}${newColumnVal}-${newRowVal}`));

                } else if (connector == 'LL' && adjacentNodeIsAllocated == false){

                    newColumnVal = objNode.tileColumn - 1
                    newRowVal    = objNode.tileRow

                    adjacentNode = gs.treeObj[`${prefix}${newColumnVal}-${newRowVal}`]

                    while(adjacentNode == undefined){
                        newColumnVal--
                        adjacentNode = gs.treeObj[`${prefix}${newColumnVal}-${newRowVal}`] 
                    }

                    if(adjacentNode.allocated){
                        adjacentNodeIsAllocated = true
                    }

                    // console.log(el(`${prefix}${newColumnVal}-${newRowVal}`));

                } 
                  else if (connector == 'RD' && adjacentNodeIsAllocated == false){

                    newColumnVal = objNode.tileColumn + 1
                    newRowVal    = objNode.tileRow + 1

                    adjacentNode = gs.treeObj[`${prefix}${newColumnVal}-${newRowVal}`]

                    while(adjacentNode == undefined){
                        newColumnVal++
                        newRowVal++
                        adjacentNode = gs.treeObj[`${prefix}${newColumnVal}-${newRowVal}`] 
                    }

                    if(adjacentNode.allocated){
                        adjacentNodeIsAllocated = true
                    }

                    // console.log(el(`${prefix}${newColumnVal}-${newRowVal}`));

                } else if (connector == 'LD' && adjacentNodeIsAllocated == false){

                    newColumnVal = objNode.tileColumn - 1
                    newRowVal    = objNode.tileRow + 1

                    adjacentNode = gs.treeObj[`${prefix}${newColumnVal}-${newRowVal}`]

                    while(adjacentNode == undefined){
                        newColumnVal--
                        newRowVal++
                        adjacentNode = gs.treeObj[`${prefix}${newColumnVal}-${newRowVal}`] 
                    }

                    if(adjacentNode.allocated){
                        adjacentNodeIsAllocated = true
                    }

                    // console.log(el(`${prefix}${newColumnVal}-${newRowVal}`));

                } else if (connector == 'RT' && adjacentNodeIsAllocated == false){

                    newColumnVal = objNode.tileColumn + 1
                    newRowVal    = objNode.tileRow - 1

                    adjacentNode = gs.treeObj[`${prefix}${newColumnVal}-${newRowVal}`]

                    while(adjacentNode == undefined){
                        newColumnVal++
                        newRowVal--
                        adjacentNode = gs.treeObj[`${prefix}${newColumnVal}-${newRowVal}`] 
                    }

                    if(adjacentNode.allocated){
                        adjacentNodeIsAllocated = true
                    }

                    // console.log(el(`${prefix}${newColumnVal}-${newRowVal}`));

                } else if (connector == 'LT' && adjacentNodeIsAllocated == false){

                    newColumnVal = objNode.tileColumn - 1
                    newRowVal    = objNode.tileRow - 1

                    adjacentNode = gs.treeObj[`${prefix}${newColumnVal}-${newRowVal}`]

                    while(adjacentNode == undefined){
                        newColumnVal--
                        newRowVal--
                        adjacentNode = gs.treeObj[`${prefix}${newColumnVal}-${newRowVal}`] 
                    }

                    if(adjacentNode.allocated){
                        adjacentNodeIsAllocated = true
                    }

                    // console.log(el(`${prefix}${newColumnVal}-${newRowVal}`));

                }
                                
            })

        //Update pop-up content
            if(gs.treeObj[nodeElem.id].allocated || adjacentNodeIsAllocated == false){

                el('tree-node-popup').innerHTML = `
                    <div>
                        <h4>${upp(node.name)}</h4>
                        <p> ${upp(node.desc)}.</p>
                    </div>
                `
            } 
            else {

                el('tree-node-popup').innerHTML = `
                    <div>
                        <h4>${upp(node.name)}</h4>
                        <p> ${upp(node.desc)}.</p>
                    </div>
                    <button class="btn--ico" onclick="addTreeNode('${node.id}', '${nodeElem.id}')">
                        <img src="./img/ico/add.svg">
                    </button>
                `
            }
        
        el('tree-node-popup').classList.remove('hide')
    }


//Resolve passive checks
    //On-hit check
    function resolveOnHitPassives(){
        gs.plObj.treeNodes.forEach(node => {
            if(node.id == 't8'){//leech
                restoreLife(node.val)

                //Log
                gs.logMsg.push(`${node.name}: ${node.desc}`) 
            }
        })
    }
    //On-action use
    function resolveOnUsePassives(){
        gs.plObj.treeNodes.forEach(node => {
            if(node.id == 't10'){
                if(rng(100) < node.val){

                    //Check item type (due to itemless actions)
                    let item = findItemByAction(gs.sourceAction)
                    if(item == undefined) return

                    gs.sourceAction.actionCharge++
                }
            }
            if(node.id == 't11'){
                if(rng(100) < node.val){

                    //Check item type (due to itemless actions)
                    let item = findItemByAction(gs.sourceAction)
                    if(item == undefined) return
                    if(item.itemType.includes('scroll') == false) return

                    gs.sourceAction.actionCharge += 2
                }
            }
            if(node.id == 't12'){
                
                if(!gs.sourceAction.tags.includes('block')) return
                if(gs.plObj.roll != gs.enObj.roll) return
                if(['attack', 'combo', 'charged strike'].indexOf(gs.enObj.action.key) > -1 == false) return

                //Check item type (due to itemless actions)
                gs.enObj.power -= node.val

                //Log
                gs.logMsg.push(`${node.name}: ${node.desc}`) 
                
            }
            if(node.id == 't13'){
                
                if(!gs.sourceAction.tags.includes('attack')) return
                if(gs.plObj.roll != gs.enObj.roll) return
                if(['block'].indexOf(gs.enObj.action.key) > -1 == false) return

                //Check item type (due to itemless actions)
                gs.enObj.forcedAction = 'sleep'

                //Log
                gs.logMsg.push(`${node.name}: ${node.desc}`) 
                
            }
        })
        
    }
    //End of combat check
    function resolveEndOfCombatPassives(){
        gs.plObj.treeNodes.forEach(node => {
            if(node.id == 't7'){//recovery

                restoreLife(node.val)

                //Log
                gs.logMsg.push(`${upp(node.name)} ${node.desc}.`)
            }
        }) 
    }
    //On death
    function resolveOnDeathPassives(){
        gs.plObj.treeNodes.forEach(node => {
            if(node.id == 't9' && node.activated != true){//recovery

                gs.plObj.life = node.val

                //Set variable
                node.activated = true

                //Log
                gs.logMsg.push(`${upp(node.name)} ${node.desc}.`)
            }
        }) 
    }
    //On death
    function resolveOnStatChangePassives(stat, value){
        let val = 0

        gs.plObj.treeNodes.forEach(node => {
            if    (node.id == 't14' && stat == 'exp' && rng(100) < node.chance){//scholar

                //Calc
                gs.plObj.exp += node.val

                //Log
                gs.logMsg.push(`${upp(node.name)} ${node.desc}.`)
            }
            else if(node.id == 't15' && stat == 'def' && value > 0){//bastion
                //Set return value
                val = node.val

                //Log
                gs.logMsg.push(`${upp(node.name)} ${node.desc}.`)
            }
        }) 

        return val
    }
    //On dice roll
    function resolvePostRollTreePassives(){
        gs.plObj.treeNodes.forEach(node => {
            if    (node.id == 't16' && gs.plObj.roll == 1){//scholar
                let negativeStats = []

                //Check if player has a negative stat
                if(gs.plObj.def < 0){
                    negativeStats.push('def')
                }else if (gs.plObj.power < 0){
                    negativeStats.push('power')
                }

                let randomStat = rarr(negativeStats)

                changeStat(randomStat, Math.round((gs.plObj[randomStat]/2) * -1), 'player' )

                //Log
                gs.logMsg.push(`${upp(node.name)} ${node.desc}.`)
            }
        }) 
    }


//Tree structure
    let treeStructure = [
        // OBJECT PROPERTIES
        // tile-Id    (i:)
        // tile-type  (t:)
        // connectors (c:)  

        // NOTATION for c:
        // TT -> top   / col--
        // RR -> right / row++
        // DD -> down  / col++
        // LL -> left  / row--

        // RD -> 45    / row++ col++
        // RT -> 45    / row++ col--
        // LD -> 45    / row-- col++
        // LT -> 45    / row-- col--

        // FORMAT
        // column(x)-row(y)_id_connectors
        // '**-**_G00_TT-RR-DD-LL',
        // '**-**_G00_TT-RR-DD'   ,
        // '**-**_G00_TT-RR'      ,
        // '**-**_G00_TT'         ,
        // /*--------------------*/

        // GUARDIAN 
        //      1                        2                        3                        4                        5
        /* 1*/ '1-1_T17_RR-DD'        , /*--------------------*/ /*--------------------*/ /*--------------------*/ '5-1_T03_DD-LL'        ,
        /* 2*/ /*--------------------*/ '2-2_tra_RR-DD'        , /*--------------------*/ '4-2_T05_DD-LL'        , /*--------------------*/
        /* 3*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/
        /* 4*/ '1-4_def_TT-RR-DD'     , '2-4_def_TT-LL-RD'     , /*--------------------*/ '4-4_def_TT-RR-LD'     , '5-4_def_TT-DD-LL'     ,
        /* 5*/ '1-5_tra_TT-DD'        , /*--------------------*/ '3-5_T12_RT-LT'        , /*--------------------*/ '5-5_tra_TT-RR-DD'     ,
        
        /* 6*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/
        /* 7*/ '1-7_tra_TT-RR-DD'     , '2-7_T18_LL'           , /*--------------------*/ /*--------------------*/ '5-7_tra_TT-RR-DD'     ,
        /* 8*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/
        /* 9*/ '1-9_pow_TT-RR-DD'     , /*--------------------*/ '3-9_pow_RR-DD-LL'     , /*--------------------*/ '5-9_pow_TT-RR-DD-LL'  ,

        /*10*/ /*--------------------*/ /*--------------------*/ '3-10_pow_TT-DD'       , /*--------------------*/ /*--------------------*/
        /*11*/ /*--------------------*/ /*--------------------*/ '3-11_T19_TT'          , /*--------------------*/ /*--------------------*/
        /*12*/ /*--------------------*/ '2-12_T15_LD'          , /*--------------------*/ /*--------------------*/ /*--------------------*/
        /*13*/ '1-13_pow_TT-RT-RR'    , /*--------------------*/ /*--------------------*/ /*--------------------*/ '5-13_pow_TT-RT-RR-LL' ,
    

        // Guardian - Crusader intersection 
        //                               6                        7                        8
        /* 5*/ /*                    */ /*--------------------*/ '7-5_lif_RR-LL'        , '8-5_lif_RR-LL'        ,
        /* 6*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */
        /* 7*/ /*                    */ '6-7_T02_LL'           , /*--------------------*/ /*--------------------*/ /*                    */
        /* 8*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */
        /* 9*/ /*                    */ /*--------------------*/ '7-9_lif_RR-DD-LL'     , /*--------------------*/ /*                    */

        /*10*/ /*                    */ /*--------------------*/ '7-10_lif_TT-DD'       , /*--------------------*/ /*                    */
        /*11*/ /*                    */ /*--------------------*/ '7-11_T20_TT'          , /*--------------------*/ /*                    */
        /*12*/ /*                    */ '6-12_tra_LD'          , /*--------------------*/ /*--------------------*/ /*                    */
        /*13*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */


        // CRUSADER 
        //      9                        10                       11                       12                       13
        /* 1*/ '9-1_T07_RR-DD'        , /*--------------------*/ /*--------------------*/ /*--------------------*/ '13-1_tra_DD-LL'       ,
        /* 2*/ '9-2_lif_TT-DD'        , /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/
        /* 3*/ /*--------------------*/ /*--------------------*/ '11-3_tra_DD'          , /*--------------------*/ /*--------------------*/
        /* 4*/ /*--------------------*/ '10-4_tra_RR'          , '11-4_lif_TT-RR-DD-LL' , '12-4_T01_LL'          , /*--------------------*/
        /* 5*/ '9-5_lif_TT-RR-DD-LL'  , /*--------------------*/ '11-5_lif_TT-RR-DD-LL' , /*--------------------*/ '13-5_lif_TT-RR-DD-LL' ,

        /* 6*/ /*--------------------*/ /*--------------------*/ '11-6_lif_TT-DD'       , /*--------------------*/ /*--------------------*/
        /* 7*/ /*--------------------*/ /*--------------------*/ '11-7_tra_TT'          , /*--------------------*/ '13-7_lif_TT-DD'       ,
        /* 8*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/
        /* 9*/ '9-9_cha_TT-RR-DD-LL'  , /*--------------------*/ '11-9_cha_RR-DD-LL'    , /*--------------------*/ '13-9_cha_TT-RR-DD-LL' ,

        /*10*/ /*--------------------*/ /*--------------------*/ '11-10_cha_TT-DD'      , /*--------------------*/ /*--------------------*/
        /*11*/ /*--------------------*/ /*--------------------*/ '11-11_tra_TT'         , /*--------------------*/ /*--------------------*/
        /*12*/ /*--------------------*/ '10-12_T13_LD'         , /*--------------------*/ /*--------------------*/ /*--------------------*/
        /*13*/ '9-13_cha_TT-RR-LL-RT' , /*--------------------*/ /*--------------------*/ /*--------------------*/ '13-13_cha_TT-RR-LL-RT',


        // Crusader - Wanderer intersection 
        //                               14                       15                       16
        /* 5*/ /*                    */ /*--------------------*/ '15-5_inv_RR-LL'       , '16-5_inv_RR-LL'       , /*                    */ 
        /* 6*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */
        /* 7*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */
        /* 8*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */
        /* 9*/ /*                    */ /*--------------------*/ '15-9_tra_RR-DD-LL'    , /*--------------------*/ /*                    */

        /*10*/ /*                    */ /*--------------------*/ '15-10_tra_TT-DD'      , /*--------------------*/ /*                    */
        /*11*/ /*                    */ /*--------------------*/ '15-11_tra_TT'         , /*--------------------*/ /*                    */
        /*12*/ /*                    */ '14-12_T21_LD'         , /*--------------------*/ /*--------------------*/ /*                    */
        /*13*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */


        // WANDERER
        //      17                       18                       19                       20                       21
        /* 1*/ /*--------------------*/ '18-1_T16_RR-DD'       , /*--------------------*/ '20-1_T10_DD-LL'       , /*--------------------*/
        /* 2*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/, /*--------------------*/
        /* 3*/ '17-3_tra_RR-DD'       , '18-3_tra_TT-DD-LL'    , /*--------------------*/ '20-3_tra_TT-RR-DD'    , '21-3_pas_DD-LL'       ,
        /* 4*/ /*--------------------*/ '18-4_T06_TT-DD'       , /*--------------------*/ '20-4_pas_TT-DD'       , /*--------------------*/
        /* 5*/ '17-5_inv_TT-RR-DD-LL' , '18-5_inv_TT-RR-LL'    , /*--------------------*/ '20-5_dic_TT-RR-LL'    , '21-5_dic_TT-RR-DD-LL' ,

        /* 6*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/
        /* 7*/ '17-7_tra_TT-DD'       , /*--------------------*/ /*--------------------*/ /*--------------------*/ '21-7_tra_TT-DD'       ,
        /* 8*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/
        /* 9*/ '17-9_slo_TT-RR-DD-LL' , /*--------------------*/ '19-9_slo_RR-DD-LL'    , /*--------------------*/ '21-9_slo_TT-RR-DD-LL' ,

        /*10*/ /*--------------------*/ /*--------------------*/ '19-10_pas_TT'         , /*--------------------*/ /*--------------------*/
        /*11*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/
        /*12*/ /*--------------------*/ '18-12_tra_LD-RR'      , '19-12_T08_LL'         , /*--------------------*/ /*--------------------*/
        /*13*/ '17-13_slo_TT-RR-LL-RT', /*--------------------*/ /*--------------------*/ /*--------------------*/ '21-13_slo_TT-RR-LL-RT',


        // Wanderer - Scholar intersection 
        //                               22                       23                       24
        /* 5*/ /*                    */ '22-5_dic_RR-LL'       , '23-5_dic_LL'          , /*--------------------*/ /*                    */
        /* 6*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */
        /* 7*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */
        /* 8*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */
        /* 9*/ /*                    */ /*--------------------*/ '23-9_tra_RR-LL'       , /*--------------------*/ /*                    */

        /*10*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */
        /*11*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */
        /*12*/ /*                    */ '22-12_T14_LD'         , /*--------------------*/ /*--------------------*/ /*                    */
        /*13*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */


        // SCHOLAR
        //      25                       26                       27                       28                       29
        /* 1*/ '25-1_tra_RR-DD'       , /*--------------------*/ /*--------------------*/ /*--------------------*/ '29-1_tra_LL-DD'       ,
        /* 2*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/                                                                                                                                       
        /* 3*/ '25-3_tra_TT-DD'       , /*--------------------*/ '27-3_tra_DD'          , /*--------------------*/ '29-3_tra_TT-DD'       ,       
        /* 4*/ /*--------------------*/ /*--------------------*/ '27-4_tra_TT-DD'       , /*--------------------*/ /*--------------------*/                                                                                                                                           
        /* 5*/ '25-5_tra_TT-RR-DD'    , /*--------------------*/ '27-5_tra_TT-RR-LL'    , /*--------------------*/ '29-5_tra_TT-DD-LL'    , 

        /* 6*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ 
        /* 7*/ '25-7_tra_TT-DD'       , /*--------------------*/ /*--------------------*/ '28-7_pas_RR'          , '29-7_tra_TT-DD-LL'    ,  
        /* 8*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ 
        /* 9*/ '25-9_tra_TT-RR-DD-LL' , /*--------------------*/ '27-9_tra_RR-LL-DD'    , /*--------------------*/ '29-9_tra_TT-DD-LL'    , 

        /*10*/ /*--------------------*/ /*--------------------*/ '27-10_T11_TT'         , /*--------------------*/ /*--------------------*/ 
        /*11*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ 
        /*12*/ /*--------------------*/ '26-12_pas_LD'         , /*--------------------*/ '28-12_pas_RD'         , /*--------------------*/ 
        /*13*/ '25-13_tra_TT-RR-LL-RT', /*--------------------*/ /*--------------------*/ /*--------------------*/ '29-13_tra_TT-LT-LL'   , 
    ]

//Tree node references
//* name: should match .svg icon name
    let treeRef = [
    //PLACEHOLDERS
        {  id:'tra', name:'connector' ,
            desc:'connector node provides no passive bonuses',

        },{id:'pas', name:'passive' ,
            desc:'description',

        },{id:'sta', name:'start' ,
            desc:'description',

        },

    // TRAVEL NODES
        {  id:'lif', name:'life' ,
            desc:'add 1 base life',
            passiveStats:[{stat:'life',  value:1}],

        },{id:'dic', name:'dice' ,
            desc:'add 0.25 to dice',
            passiveStats:[{stat:'dice',  value:0.25}],

        },{id:'slo', name:'slot' ,
            desc:'add 0.25 to equipment slot',
            passiveStats:[{stat:'slot',  value:0.25}],

        },{id:'pow', name:'power' ,
            desc:'add 0.2 to base power',
            passiveStats:[{stat:'power',  value:0.2}],

        },{id:'inv', name:'inventory' ,
            desc:'add 3 to inventory capacity',
            passiveStats:[{stat:'inventory',  value:3}],

        },{id:'def', name:'defense' ,
            desc:'add 0.25 base def',
            passiveStats:[{stat:'def',  value:0.25}],

        },{id:'cha', name:'charge' ,
            desc:'add 1 charge to items',

        },

        //Passive id counter 21

    // GUARDIAN d4
        // sq1
        {  id:'T17', name:'blunt weapons',
            desc:'mace, club and hammer deal 1 extra damage',
            val:1,

        },{id:'T03', name:'superior defense',
            desc:'gain 1 base def',
            passiveStats:[{stat:'def',   value:1}],

        },{id:'T05', name:'dice',
            desc:'gain 1 to base dice',
            passiveStats:[{stat:'dice-mod',  value:1}],

        },

        // sq2
        {  id:'T12',name:'perfect block',
            desc:'blocking an enemy attack with matching dice roll, will reduce enemy power by 2',
            val:2,

        },{id:'T18',name:'def recovery',
            desc:'you can equip multiple body armors',

        },

        // sq3
        {  id:'T19',name:'layered defense',
            desc:'blocking an enemy attack with matching dice roll, will reduce enemy power by 2',
            val:2,

        },{id:'T15',name:'bastion',
            desc:'whenever you gain def, gain 1 extra point',
            val: 1,

        },

        // transition sq 1
        {  id:'T02', name:'life %',
            desc:'increse base life by 10%',
            passiveStats:[{stat:'life%', value:10}],

        },
        // transition square 2
        {  id:'T20', name:'life gain',
            desc:'whenever you gian life, gain 1 extra',

        },

    // CRUSADER d6
        // sq1
        {  id:'T01', name:'superior life' ,
            desc:'add 6 base life',
            passiveStats:[{stat:'life',  value:6}],

        },{id:'T07', name:'recovery',
            desc:'restore 3 life at end of the combat',
            val:3,

        },

        // sq2
        {  id:'T13', name:'perfect strike',
            desc:'attacking a blocking enemy with matching dice roll, will force enemy to skip the next turn',

        },{id:'T09', name:'reborn',
            desc:'once per encounter, when you reach 0 life, survive with 1 life',
            val:1,

        },

        // sq3

        //Intersection
        {  id:'T21', name:'power',
            desc:'if your power is 0, gain 1 power',

        },
        
    // WANDERER d8
        // sq1
        {  id:'T10', name:'careful use',
            desc:'25% chance to avoid losing an action charge on action use',
            val:25,

        },{id:'T16', name:'close combat',
            desc:'On a die roll of one, restore half of a random negative attribute',

        },{id:'T06', name:'slots',
            desc:'gain 1 equipment slot'   ,
            passiveStats:[{stat:'slots', value:1}],

        },

        // sq2

        // sq3
        {  id:'T08', name:'leech',
            desc:'restore 1 life whenever you hit an enemy',
            val:1,

        },

        //Intersection
        {  id:'T14', name:'scholar',
            desc:'50% chance to gain 1 extra exp point whenever you gain exp',
            val: 1,
            chance: 50,

        },

    // SCHOLAR d10
        // sq1  

        // sq2

        // sq3
        {  id:'T11', name:'librarian',
            desc:'25% chance to gain 1 action charge when you use a scroll',
            val:25,

        },

        //Prototype
        {  id:'T00', name:'def break',
            desc:'Break 1 extra def on hit',

        },{id:'T00', name:'power armor',
            desc:'Gain 1 extra def per power',

        },{id:'T00', name:'absolute barrier',
            desc:'Barrier absorbs 100% of damage.',

        },{id:'T00', name:'swift movement',
            desc:'Your cooldowns recover 1 turn faster',

        },{id:'T00', name:'speed advantage',
            desc:'Enemy skipts every 5th turn',

        }
    ]