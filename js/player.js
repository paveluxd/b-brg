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