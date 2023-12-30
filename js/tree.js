//TREE
    //Spend tree points
    function addTreeNode(nodeId){
        if(gs.plObj.treePoints > 0){
            let node = findByProperty(treeRef, 'id', nodeId)

            // Add skill node to player obj    
            gs.plObj.treeNodes.push(node)    
            
            gs.plObj.treePoints--

            resolvePlayerStats()
            syncUi()
        }
        else{
            showAlert(`All your passive skill points are allocated.`)
        }
    }

    //UI
    function syncTree(){

        //Update points counter
        // el('skill-points-indicator').innerHTML = `Skill tree point: ${gs.plObj.treePoints}/${gs.plObj.treePoints + gs.plObj.treeNodes.length}`
        
        let treeRows      = 13
        let treeColumns   = 29
        let column        = 0
        let row           = 0
        let prefix        = 'treenode_'
        let imgPath       = ''
        let imgDirections = ''
        let nodeType


        //Add overrides from treeStructure
        treeStructure.forEach(tile => {

            nodeType = undefined
            let tileContent = tile.split('_') //split tree structure string

            //Create tile object
            gs.treeObj[tileContent[0]] = {}
            let node                   = gs.treeObj[tileContent[0]]
            node.tileColumn            = parseInt(tileContent[0].split('-')[0])
            node.tileRow               = parseInt(tileContent[0].split('-')[1])
            node.tileType              = tileContent[1]
            node.tileConnectors        = tileContent[2].split('-')
    
            //Set tile img
            if      (node.tileType == 'ver'){

                nodeType = 'vertical-path'

            }else if(node.tileType == 'non'){

                nodeType = 'empty'

            }else if(node.tileType == 'def'){

                imgPath = `def`

            }else if(node.tileType == 'pow'){

                imgPath = `power`

            }else if(node.tileType == 'sta'){

                imgPath = `start`

            }else if(node.tileType == 'dic'){

                imgPath = `dice`

            }else if(node.tileType == 'lif'){

                imgPath = `life`

            }else if(node.tileType == 'slo'){

                imgPath = `slot`

            }else if(node.tileType == 'key'){

                imgPath = `keystone`
                
            }else if(node.tileType == 'cha'){

                imgPath = `charge`
                
            }else if(node.tileType == 'inv'){

                imgPath = `inventory`
                
            }else if(node.tileType == 'die'){

                imgPath = `dice`
                
            }else if(node.tileType == 'tra'){

                imgPath = `travel`
                
            }else{//passive
                imgPath = `passive`
            }

            //Add directional connectors
            if(node.tileConnectors.length > 0){
                // console.log(tileConnectors, tileColumn,tileRow);
                imgDirections = ''
                
                node.tileConnectors.forEach(direction => {
                    imgDirections += `<div class='${direction}'></div>`
                })

            }

            // console.log(tileContent, tileColumn, tileRow, tileType, tileConnectors);
            createTreeCell(node.tileColumn,node.tileRow,nodeType)
        })

        //Build base tree
        //Remove intersections
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
            imgPath = ``
            if(
                refRows.includes(row) ||
                [3].includes(column) && [2].includes(row)
            ){
                createCell = true
                nodeType = 'horizontal-path'
            }

            //Columns 
            let refColumns = [1,5,9,13,17,21,25,29]
            if(
                refColumns.includes(column) ||
                [2,4].includes(column) && [3].includes(row) ||
                [18,20].includes(column) && [2].includes(row)
            ){
                createCell = true
                nodeType = 'vertical-path'
            }

            //Clears
            if(
                [3,  6,7,8,  11,  14,15,16,  19,  22,23,24,  27].includes(column) && row == 1 || //1st row
                [2,3,4].includes(column) && row == 5 ||                                          //Guardian 2nd row
                [17,18,20,21].includes(column) && [1,2,3].includes(row)                          //Wanderer
            ){
                createCell = false
            }

            //Abort if cell exists
            if(el(`${prefix}${column}-${row}`) != undefined){
                createCell = false
            }

            //Set cell content
            if(createCell) {createTreeCell(column, row, nodeType)}
        }

        //Creates tree tile elem
        function createTreeCell(column, row, node){

            //Show ids for testing
            // let cellContent = `
            //     <p>x${column}<br>y${row}</p> 
            //     <img class="btn--ico" src="./img/ico/${imgPath}.svg">
            //     ${imgDirections}
            // `

            if(node == 'vertical-path' || node == 'horizontal-path'){

                //Set elem to a particular grid tile
                if(node == 'horizontal-path'){
                    el('skill-tree').innerHTML += `
                        <div id="${prefix}${column}-${row}" class='tree-tile'>
                            <div class="tree-path" style="transform: rotate(90deg)"></div>
                        </div>
                    `
                } else {
                    el('skill-tree').innerHTML += `
                        <div id="${prefix}${column}-${row}" class='tree-tile'>
                            <div class="tree-path"></div>
                        </div>
                    `
                }

                el(`${prefix}${column}-${row}`).setAttribute('style',`grid-column-start:${column}; grid-row-start:${row}`)

            } else if(node == 'empty'){
                el('skill-tree').innerHTML += `
                    <div id="${prefix}${column}-${row}" class='tree-tile'>
                    
                    </div>
                `
                el(`${prefix}${column}-${row}`).setAttribute('style',`grid-column-start:${column}; grid-row-start:${row}`)

            } else {

                let cellContent = `
                    <img class="btn--ico" src="./img/tree/${imgPath}.svg"> 
                    ${imgDirections}
                `
    
                //Creates new tile
                if(el(`${prefix}${column}-${row}`) == undefined){
    
                    let elemType = 'button'
                    if(node == 'div'){elemType = 'div'}
                 
                    el('skill-tree').innerHTML += `
                        <${elemType} id="${prefix}${column}-${row}" class='tree-tile'>
                            ${cellContent}
                        </${elemType}>
                    `
    
                    //Set elem to a particular grid tile
                    el(`${prefix}${column}-${row}`).setAttribute('style',`grid-column-start:${column}; grid-row-start:${row}`)
                    el(`${prefix}${column}-${row}`).setAttribute('onclick', `nodePreview(this)`)
                }
    
                //Updates existing tile
                else{
                    el(`${prefix}${column}-${row}`).innerHTML = cellContent
                }
            }
        }


        //Build tree object for playerObj
        //Manage node states via prop
        //Move allocated nodes to playerObj?

        
        //Disables nodes in player Obj
        // gs.plObj.treeNodes.forEach(node => {
        //     el(node.id).disabled = true
        // })

        // // Adjust tree icon if there are unspent skill tree points.
        // if(gs.plObj.treePoints > 0){
        //     el('map-character-btn').innerHTML = `<img src="./img/ico/character-active.svg">Character`
        //     el('tree-btn').innerHTML = `<img src="./img/ico/tree-active.svg">Tree`
        // } 
        // else {
        //     el('map-character-btn').innerHTML = `<img src="./img/ico/character.svg">Character`
        //     el('tree-btn').innerHTML = `<img src="./img/ico/tree.svg">Tree`
        // }   
    }

    //Trigger node preview
        function nodePreview(nodeElem){
            //Find related node
            let node = treeRef[rng(3)]

            el('tree-node-popup').innerHTML = `
                <div>
                    <h4>${upp(node.name)}</h4>
                    <p> ${upp(node.desc)}.</p>
                </div>
                <button class="btn--ico">
                    <img src="./img/ico/add.svg">
                </button>
            `

            el('tree-node-popup').classList.remove('hide')
            console.log(nodeElem);
        }

    //Resolve tree passive checks
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
            /* 1*/ '1-1_pas_RR-DD'        , /*--------------------*/ '3-1_sta_RR-LL'        , /*--------------------*/ '5-1_pas_DD-LL'        ,
            /* 2*/ /*--------------------*/ '2-2_pas_RR-DD'        , /*--------------------*/ '4-2_pas_DD-LL'        , /*--------------------*/
            /* 3*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/
            /* 4*/ '1-4_def_TT-RR-DD'     , '2-4_def_TT-LL-RD'     , /*--------------------*/ '4-4_def_TT-RR-LD'     , '5-4_def_TT-DD-LL'     ,
            /* 5*/ '1-5_tra_TT-DD'        , /*--------------------*/ '3-5_pas_RT-LT'        , /*--------------------*/ '5-5_tra_TT-RR-DD'     ,
            
            /* 6*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/
            /* 7*/ '1-7_tra_TT-RR-DD'     , '2-7_pas_LL'           , /*--------------------*/ /*--------------------*/ '5-7_tra_TT-RR-DD'     ,
            /* 8*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/
            /* 9*/ '1-9_pow_TT-RR-DD'     , /*--------------------*/ '3-9_pow_RR-DD-LL'     , /*--------------------*/ '5-9_pow_TT-RR-DD-LL'  ,

            /*10*/ /*--------------------*/ /*--------------------*/ '3-10_pow_TT-DD'       , /*--------------------*/ /*--------------------*/
            /*11*/ /*--------------------*/ /*--------------------*/ '3-11_pas_TT'          , /*--------------------*/ /*--------------------*/
            /*12*/ /*--------------------*/ '2-12_pas_LD'          , /*--------------------*/ /*--------------------*/ /*--------------------*/
            /*13*/ '1-13_pow_TT-RT-RR'    , /*--------------------*/ /*--------------------*/ /*--------------------*/ '5-13_pow_TT-RT-RR-LL' ,
        

            // Guardian - Crusader intersection 
            //                               6                        7                        8
            /* 5*/ /*                    */ /*--------------------*/ '7-5_lif_RR-LL'        , '8-5_lif_RR-LL'        ,
            /* 6*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */
            /* 7*/ /*                    */ '6-7_pas_LL'           , /*--------------------*/ /*--------------------*/ /*                    */
            /* 8*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */
            /* 9*/ /*                    */ /*--------------------*/ '7-9_lif_RR-DD-LL'     , /*--------------------*/ /*                    */

            /*10*/ /*                    */ /*--------------------*/ '7-10_lif_TT-DD'       , /*--------------------*/ /*                    */
            /*11*/ /*                    */ /*--------------------*/ '7-11_pas_TT'          , /*--------------------*/ /*                    */
            /*12*/ /*                    */ '6-12_pas_LD'          , /*--------------------*/ /*--------------------*/ /*                    */
            /*13*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */


            // CRUSADER 
            //      9                        10                       11                       12                       13
            /* 1*/ '9-1_pas_RR-DD'        , /*--------------------*/ '11-1_sta_RR-LL'       , /*--------------------*/ '13-1_pas_DD-LL'       ,
            /* 2*/ '9-2_lif_TT-DD'        , /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/
            /* 3*/ /*--------------------*/ /*--------------------*/ '11-3_pas_DD'          , /*--------------------*/ /*--------------------*/
            /* 4*/ /*--------------------*/ '10-4_pas_RR'          , '11-4_lif_TT-RR-DD-LL' , '12-4_pas_LL'          , /*--------------------*/
            /* 5*/ '9-5_lif_TT-RR-DD-LL'  , /*--------------------*/ '11-5_lif_TT-RR-DD-LL' , /*--------------------*/ '13-5_lif_TT-RR-DD-LL' ,

            /* 6*/ /*--------------------*/ /*--------------------*/ '11-6_lif_TT-DD'       , /*--------------------*/ /*--------------------*/
            /* 7*/ /*--------------------*/ /*--------------------*/ '11-7_pas_TT'          , /*--------------------*/ '13-7_lif_TT-DD'       ,
            /* 8*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/
            /* 9*/ '9-9_cha_TT-RR-DD-LL'  , /*--------------------*/ '11-9_cha_RR-DD-LL'    , /*--------------------*/ '13-9_cha_TT-RR-DD-LL' ,

            /*10*/ /*--------------------*/ /*--------------------*/ '11-10_cha_TT-DD'      , /*--------------------*/ /*--------------------*/
            /*11*/ /*--------------------*/ /*--------------------*/ '11-11_pas_TT'         , /*--------------------*/ /*--------------------*/
            /*12*/ /*--------------------*/ '10-12_G00_LD'         , /*--------------------*/ /*--------------------*/ /*--------------------*/
            /*13*/ '9-13_cha_TT-RR-LL-RT' , /*--------------------*/ /*--------------------*/ /*--------------------*/ '13-13_cha_TT-RR-LL-RT',


            // Crusader - Wanderer intersection 
            //                               14                       15                       16
            /* 5*/ /*                    */ /*--------------------*/ '15-5_inv_RR-LL'       , '16-5_inv_RR-LL'       , /*                    */ 
            /* 6*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */
            /* 7*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */
            /* 8*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */
            /* 9*/ /*                    */ /*--------------------*/ '15-9_tra_RR-DD-LL'    , /*--------------------*/ /*                    */

            /*10*/ /*                    */ /*--------------------*/ '15-10_tra_TT-DD'      , /*--------------------*/ /*                    */
            /*11*/ /*                    */ /*--------------------*/ '15-11_key_TT'         , /*--------------------*/ /*                    */
            /*12*/ /*                    */ '14-12_pas_LD'         , /*--------------------*/ /*--------------------*/ /*                    */
            /*13*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */


            // WANDERER
            //      17                       18                       19                       20                       21
            /* 1*/ /*--------------------*/ '18-1_pas_RR-DD'       , '19-1_sta_RR-LL'       , '20-1_pas_DD-LL'       , /*--------------------*/
            /* 2*/ /*--------------------*/ '18-2_ver_TT-DD'       , /*--------------------*/ '20-2_ver_TT-DD'       , /*--------------------*/
            /* 3*/ '17-3_cDR_RR-DD'       , '18-3_tra_TT-DD-LL'    , /*--------------------*/ '20-3_tra_TT-RR-DD'    , '21-3_pas_DD-LL'       ,
            /* 4*/ /*--------------------*/ '18-4_pas_TT-DD'       , /*--------------------*/ '20-4_pas_TT-DD'       , /*--------------------*/
            /* 5*/ '17-5_inv_TT-RR-DD-LL' , '18-5_inv_TT-RR-LL'    , /*--------------------*/ '20-5_die_TT-RR-LL'    , '21-5_die_TT-RR-DD-LL' ,

            /* 6*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/
            /* 7*/ '17-7_tra_TT-DD'       , /*--------------------*/ /*--------------------*/ /*--------------------*/ '21-7_tra_TT-DD'       ,
            /* 8*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/
            /* 9*/ '17-9_slo_TT-RR-DD-LL' , /*--------------------*/ '19-9_slo_RR-DD-LL'    , /*--------------------*/ '21-9_slo_TT-RR-DD-LL' ,

            /*10*/ /*--------------------*/ /*--------------------*/ '19-10_pas_TT'         , /*--------------------*/ /*--------------------*/
            /*11*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/
            /*12*/ /*--------------------*/ '18-12_tra_LD-RR'      , '19-12_pas_LL'         , /*--------------------*/ /*--------------------*/
            /*13*/ '17-13_slo_TT-RR-LL-RT', /*--------------------*/ /*--------------------*/ /*--------------------*/ '21-13_slo_TT-RR-LL-RT',


            // Wanderer - Scholar intersection 
            //                               22                       23                       24
            /* 5*/ /*                    */ '22-5_die_RR-LL'       , '23-5_die_LL'          , '24-5_non_'            , /*                    */
            /* 6*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */
            /* 7*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */
            /* 8*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */
            /* 9*/ /*                    */ /*--------------------*/ '23-9_tra_RR-LL'       , /*--------------------*/ /*                    */

            /*10*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */
            /*11*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */
            /*12*/ /*                    */ '22-12_pas_LD'         , /*--------------------*/ /*--------------------*/ /*                    */
            /*13*/ /*                    */ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*                    */


            // SCHOLAR
            //      25                       26                       27                       28                       29
            /* 1*/ '25-1_tra_RR-DD'       , /*--------------------*/ /*--------------------*/ /*--------------------*/ '29-1_tra_LL-DD'       ,
            /* 2*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/                                                                                                                                       
            /* 3*/ '25-3_tra_TT-DD'       , /*--------------------*/ '27-3_key_DD'          , /*--------------------*/ '29-3_tra_TT-DD'       ,       
            /* 4*/ /*--------------------*/ /*--------------------*/ '27-4_tra_TT-DD'       , /*--------------------*/ /*--------------------*/                                                                                                                                           
            /* 5*/ '25-5_tra_TT-RR-DD'    , /*--------------------*/ '27-5_tra_TT-RR-LL'    , /*--------------------*/ '29-5_tra_TT-DD-LL'    , 

            /* 6*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ 
            /* 7*/ '25-7_tra_TT-DD'       , /*--------------------*/ /*--------------------*/ '28-7_pas_RR'          , '29-7_tra_TT-DD-LL'    ,  
            /* 8*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ 
            /* 9*/ '25-9_tra_TT-RR-DD-LL' , /*--------------------*/ '27-9_tra_RR-LL-DD'    , /*--------------------*/ '29-9_tra_TT-DD-LL'    , 

            /*10*/ /*--------------------*/ /*--------------------*/ '27-10_pas_TT'         , /*--------------------*/ /*--------------------*/ 
            /*11*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ /*--------------------*/ 
            /*12*/ /*--------------------*/ '26-12_pas_LD'         , /*--------------------*/ '28-12_pas_RD'         , /*--------------------*/ 
            /*13*/ '25-13_tra_TT-RR-LL-RT', /*--------------------*/ /*--------------------*/ /*--------------------*/ '29-13_tra_TT-LT-LL'   , 
        ]

    //Tree nodes
        let treeRef = [
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

            },

            // GUARDIAN d4
            // sq1
            {  id:'t00', name:'blunt weapons',
                desc:'mace, club and hammer deal 1 extra damage',
                val:1,

            },{id:'t03', name:'def',
                desc:'gain 1 base def',
                passiveStats:[{stat:'def',   value:1}],

            },{id:'t05', name:'dice',
                desc:'gain 1 to base dice',
                passiveStats:[{stat:'dice-mod',  value:1}],

            },

            // sq2
            {  id:'t12',name:'perfect block',
                desc:'blocking an enemy attack with matching dice roll, will reduce enemy power by 2',
                val:2,

            },{id:'t00',name:'def recovery',
                desc:'you can equip multiple body armors',

            },

            // sq3
            {  id:'t00',name:'layered defense',
                desc:'blocking an enemy attack with matching dice roll, will reduce enemy power by 2',
                val:2,

            },{id:'t15',name:'bastion',
                desc:'whenever you gain def, gain 1 extra point',
                val: 1,

            },

            // transition sq 1
            {  id:'t02', name:'life %',
                desc:'increse base life by 10%',
                passiveStats:[{stat:'life%', value:10}],

            },
            // transition square 2
            {  id:'t00', name:'life gain',
                desc:'whenever you gian life, gain 1 extra',

            },

            // CRUSADER d6
            // sq1
            {  id:'t01', name:'life' ,
                desc:'add 6 base life',
                passiveStats:[{stat:'life',  value:6}],

            },

            // sq2
            {  id:'t13', name:'perfect strike',
                desc:'attacking a blocking enemy with matching dice roll, will force enemy to skip the next turn',

            },{id:'t09', name:'reborn',
                desc:'once per encounter, when you reach 0 life, survive with 1 life',
                val:1,

            },

            // sq3
            {  id:'t07', name:'recovery',
                desc:'restore 3 life at end of the combat',
                val:3,

            },

            // WANDERER d8
            // sq1
            {  id:'t10', name:'careful use',
                desc:'25% chance to avoid losing an action charge on action use',
                val:25,

            },{id:'t16', name:'close combat',
                desc:'On a die roll of one, restore half of a random negative attribute',

            },

            // sq2
            {  id:'t06', name:'slots',
                desc:'gain 1 equipment slot'   ,
                passiveStats:[{stat:'slots', value:1}],

            },

            // sq3
            {  id:'t08', name:'leech',
                desc:'restore 1 life whenever you hit an enemy',
                val:1,

            },

            // SCHOLAR d10
            // sq1
            {  id:'t14', name:'scholar',
                desc:'50% chance to gain 1 extra exp point whenever you gain exp',
                val: 1,
                chance: 50,

            },{id:'t11', name:'librarian',
                desc:'25% chance to gain 1 action charge when you use a scroll',
                val:25,

            },

            // sq2


            // sq3




            //Prototype
            {  id:'t00',name:'def break',
                desc:'Break 1 extra def on hit',

            },{id:'t00',name:'power armor',
                desc:'Gain 1 extra def per power',

            },{id:'t00',name:'absolute barrier',
                desc:'Barrier absorbs 100% of damage.',

            },{id:'t00',name:'swift movement',
                desc:'Your cooldowns recover 1 turn faster',

            },{id:'t00',name:'speed advantage',
                desc:'Enemy skipts every 5th turn',

            },{id:'t00', name:'power',
                desc:'if your power is 0, gain 1 power',

            }
        ]