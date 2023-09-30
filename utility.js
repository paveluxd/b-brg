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
    if(mod === 'all' && id.startsWith('.')){
        return document.querySelectorAll(id)
    }
    else if(id.startsWith('.')){
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

function findByProperty(dataArr, propertyName, propertyValue){ //Used to find items by id in array
    let foundItem
    dataArr.forEach(item => {
        if(item[propertyName] === propertyValue){
            // log(item)
            foundItem = item
        }
    })

    return foundItem
}

//var csv is the CSV file with headers
function csvJSON(csv){

    var lines=csv.split("\n");
  
    var result = [];
  
    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step 
    // (you might convert them to &&& or something, then covert them back later)
    var headers=lines[0].split(",");
  
    for(var i=1;i<lines.length;i++){
  
        var obj = {};
        var currentline=lines[i].split(",");
  
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
  
        result.push(obj);
  
    }
  
    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
}