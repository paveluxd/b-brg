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

    //Exp and lvl
    function resolveExpAndLvl(){

        //Add 1 exp for winning
        gs.plObj.exp++                                  

        //Recalc player lvl
        gs.plObj.lvl = Math.floor(gs.plObj.exp / config.expRequiredPerLvl + 1) 

        //Calc exp until lvl up
        gs.plObj.lvlUpExp = (gs.plObj.lvl - 1) * config.expRequiredPerLvl + config.expRequiredPerLvl

        //Calc available tree points?
        //-1 for initial lvl 1
        gs.plObj.treePoints = gs.plObj.lvl - gs.plObj.treeNodes.length - 1
    }

    //UI
    function syncTree(){
        //Update points counter
        el('skill-points-indicator').innerHTML = `Skill tree point: ${gs.plObj.treePoints}/${gs.plObj.treePoints + gs.plObj.treeNodes.length}`

        //Clear tree container
        el('skill-tree').innerHTML = ``

        treeRef.forEach(node => {
            let btn = document.createElement('button')
            btn.setAttribute('onclick', `addTreeNode("${node.id}")`)
        
            //Description
            let description = ''
            if(node.desc != undefined){description = `${upp(node.desc)}.`}
        
            btn.id = node.id
            btn.innerHTML = `
                <img src ="./img/ico/item-equip-no.svg">
                <div>
                    <h3>${upp(node.name)}</h3> 
                    <p>${description}</p>
                </div>
            `
            el('skill-tree').append(btn)

            //Set allocated nodes as disabled
            if(findByProperty(gs.plObj.treeNodes, 'id', node.id)){
                btn.classList.add('allocated-tree-node')
                btn.innerHTML = `
                    <img src ="./img/ico/item-equip-yes.svg">
                    <div>
                        <h3>${upp(node.name)}</h3> 
                        <p>${description}</p>
                    </div>
                `
                el('skill-tree').append(btn)
            }
        })


        gs.plObj.treeNodes.forEach(node => {
            el(node.id).disabled = true
        })

        // Adjust label if there are unspent skill tree points.
        if(gs.plObj.treePoints > 0){
            el('map-character-btn').innerHTML = `<img src="./img/ico/character-active.svg">Character`
            el('tree-btn').innerHTML = `<img src="./img/ico/tree-active.svg">Tree`
        } 
        else {
            el('map-character-btn').innerHTML = `<img src="./img/ico/character.svg">Character`
            el('tree-btn').innerHTML = `<img src="./img/ico/tree.svg">Tree`
        }   
    }

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

    //Tree nodes
    let treeRef = [
          {id:'t1', name:'life' 
            ,desc:'add 6 base life' ,passiveStats:[{stat:'life',  value:6}],
        },{id:'t2', name:'life' 
            ,desc:'increse base life by 10%' ,passiveStats:[{stat:'life%', value:10}],
        },{id:'t3', name:'def',
            desc:'gain 2 base def'           ,passiveStats:[{stat:'def',   value:2}],
        },{id:'t4', name:'power',
            desc:'gain 1 base power'        ,passiveStats:[{stat:'power', value:1}],
        },{id:'t5', name:'dice',
            desc:'gain 1 to base dice'       ,passiveStats:[{stat:'dice-mod',  value:1}],
        },{id:'t6', name:'slots',
            desc:'gain 1 equipment slots'   ,
            passiveStats:[{stat:'slots', value:1}],
        },

          {id:'t7', name:'recovery',
            desc:'restore 3 life at end of the combat',
            val:3,
        },{id:'t8', name:'leech',
            desc:'restore 1 life whenever you hit an enemy',
            val:1,
        },{id:'t9', name:'reborn',
            desc:'once per encounter, when you reach 0 life, survive with 1 life',
            val:1,
        },{id:'t10',name:'careful use',
            desc:'25% chance to avoid loosing an action charge on action use',
            val:25,
        },{id:'t11',name:'librarian',
            desc:'25% chance to gain 1 action charge when you use a scroll',
            val:25,
        },
        
        //On hit effects
            // {id:'ext-dmg'}, //Deal +1 damage
            // {id:"ext-def-break-dmg"}, //Break 1 def on hit.
        //Extra defences
            // {id:'add-def-per-power'}, //+1 def per point of power.
        //Action specific
            // {id:'improve-barrier'}, //improve barrier by 25%
        //Cooldown actions
            // {id:'less-cd'}, //Cooldowns recover 1 turn faster
        //Extra actions
        //Gold
        //Exp
        //Aaction charge
            // {id:'chance-save-ac'}, //20% chance to not loose actionCharge on use <item type>
        //Ideas
            //All fireballs that you draft have +5 charge.
    ]