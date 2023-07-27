export class Utility {
    runAnim(elem, animClass){
        elem.classList.remove(animClass)
        void elem.offsetWidth; // trigger reflow
        elem.classList.add(animClass)
    }

    toggleModal(id){//modal
        document.getElementById(id).classList.toggle('hide')
        this.runAnim(this.el(id).firstElementChild, 'modal-slide')
    }

    rng(maxValue, minValue){//random number
        if(minValue === undefined){minValue = 1}
        return Math.floor(Math.random() * (maxValue - minValue + 1) + minValue)
    }

    rarr(arr){//random arr item
        return arr[Math.floor(Math.random() * arr.length)]
    }

    shuffle(array) {//suffle arr
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

    findObj(data, prop, val){

            return data.find(x => x[prop] === val)
        
    }

    removeFromArr(data, elem){
            let index = data.indexOf(elem);
                if (index > -1) { // only splice array when item is found
                    data.splice(index, 1); // 2nd parameter means remove one item only
                }
    }

    el(id){//Returns gtml elem by id
        return document.getElementById(id)
    }

    cloneArr(arr){
        return JSON.parse(JSON.stringify(arr));
    }
}

let utility = new Utility()
window.utility = utility