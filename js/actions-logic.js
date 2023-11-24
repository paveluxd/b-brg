//Actions
class ActionObj {
    constructor(actionKey){
        //Static props
        this.actionKey = actionKey
        

        //Variable properties generated
        let props = [
            {key:'actionName'  ,val: upp(actionKey)},
            {key:'actionId'    ,val: "ac" + Math.random().toString(8).slice(2)},//gens unique id
            {key:'actionCharge',val: 10},
            {key:'actionMod'   ,val: 0},
            {key:'cooldown'    ,val: undefined},
            {key:'actionType'  ,val: 'generic'},
            {key:'desc'        ,val: ''},
            {key:'passiveStats',val: []},
            {key:'keyId'       ,val: '???'},
            {key:'tags'        ,val: ''}
        ]

        //Resolves extra props
        props.forEach(property => {

            // console.log(property)

            //Find action by actionName
            let actionData = findByProperty(actionsRef, 'actionName', actionKey)

            if(typeof actionData[property.key] === 'undefined' || actionData[property.key] === ''){
                this[property.key] = property.val //if no prop, set it to extra props vlaue
            }
            else {
                this[property.key] = actionData[property.key] //if exists in ref, set it as red.
            }

            //Set action charge of all passive items to 1.
            if(actionData.actionType === 'passive' && property.key === 'actionCharge'){
                this.actionCharge = 1 
            } 
        })

        // this.actionCharge = 100 //for testing

        //Static props
        this.flatActionCharge = this.actionCharge
    }
}

//Convert action id to strings
actionsRef.forEach(action => {
    action.keyId = `a${action.keyId}`
})

//Converts passiveStat to objects
function convertStringsToArr(arr){
    arr.forEach(item => {
        //Convert passiveStat to arr
        //Check if there are passive stats
        if(item.passiveStats.length > 1){
            let passivesArr = item.passiveStats.split(', ')
            item.passiveStats = []
    
            passivesArr.forEach(stat =>{
                statArr = stat.split(':')
                item.passiveStats.push({'stat':statArr[0], 'value': parseInt(statArr[1])})
            })
            // console.log(item);
        }

        //Conver actions to arr
        if(item.actions == undefined) return false

        if(item.actions == ''){
            item.actions = []
        }
        else{
            item.actions = item.actions.split(', ')
        }
    })
}
//Convert passiveStat, actions property to objects.
convertStringsToArr(itemsRef)
convertStringsToArr(actionsRef) 