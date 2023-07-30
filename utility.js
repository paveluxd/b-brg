function runAnim(elem, animClass){//Allows to run css animation mutliple times
    elem.classList.remove(animClass)
    void elem.offsetWidth; // trigger reflow
    elem.classList.add(animClass)
}

function toggleModal(id){//modal
    document.getElementById(id).classList.toggle('hide')
    this.runAnim(el(id).firstElementChild, 'modal-slide')
}

function rng(maxValue, minValue){//Random number
    if(minValue === undefined){minValue = 1}
    return Math.floor(Math.random() * (maxValue - minValue + 1) + minValue)
}

function rarr(arr){//Random arr item
    return arr[Math.floor(Math.random() * arr.length)]
}

function shuffle(array) {//Suffle arr
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

function findObj(data, prop, val){ //Don't remember what this did / Data is obj.
    return data.find(x => x[prop] === val) 
}

function removeFromArr(data, elem){ //Removes elem from array
        let index = data.indexOf(elem);
            if (index > -1) { // only splice array when item is found
                data.splice(index, 1); // 2nd parameter means remove one item only
        }
}

function el(id, mod){//Returns gtml elem by id
    if(id.startsWith('.')){
        return document.querySelector(id)
    }
    else{
        return document.getElementById(id)
    }
}

function cloneArr(arr){//Make a detached copy of an array
    return JSON.parse(JSON.stringify(arr));
}

function objContainsByPropValue(object, propery, value){// See if obj contains element with a particular value of a particular property.
    return Object.values(object).some(obj => obj[propery] === value)
}

function upp(string){//Sets 1st letter to uppercase
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function log(val){
    console.log(val)
}

export default{
    runAnim,
    toggleModal,
    rng,
    rarr,
    shuffle,
    findObj,
    removeFromArr,
    el,
    cloneArr,
    objContainsByPropValue,
    upp,
    log,
}