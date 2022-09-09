const setsWrapper = document.querySelector('.sets-wrapper')
const setsBtn = document.getElementById('set-btn')

//переход в сеты
setsBtn.addEventListener('click', () => {
    if(setsWrapper.style.display == '' || setsWrapper.style.display == 'none') {
        cardWrapper.style.display = 'none'
        pairsWrapper.style.display = 'none'
        setsWrapper.style.display = 'block'
    }else{
        cardWrapper.style.display = 'flex'
        pairsWrapper.style.display = 'none'
        setsWrapper.style.display = 'none'
    }
})

let sets;
!localStorage.sets ? sets = [] : sets = JSON.parse(localStorage.getItem('sets'));

let setsElements = [];

//кнопка set
let setBtn = document.getElementById('add-set-btn');
setBtn.addEventListener('click', () => {
    //создание нового сета и добавление в массив
    sets.push(new Set(wordPairInput.value, JSON.parse(localStorage.getItem('currentSet'))))
    updateLocal();
    fillHtmlListSets()
})

function Set(name = 'name', currentSet = []) {
    this.name = name
    this.currentSet = []
    this.currentSet = currentSet;
}
 
//создание html set-item
const createTemplateSets = (set, index, text) => {
    return `
        <div class="set-item">
            <h2 class="set-item-header">${set.name}</h2>
            <div class="WoTrBlock">
                ${text}
            </div>
            <div class="buttons set-buttons">
                <button class="set-button" onclick="setCurrentSetFromSet(${index})">Set</button>
                <button class="btn-delete set-button" onclick="deleteSet(${index})">Delete</button>
            </div>
        </div>
    `
}
 

//заполнение html set
const fillHtmlListSets = () => {
    setsWrapper.innerHTML = '';
    if(sets.length > 0) {
        sets.forEach((item, index) => {
            let text=''
            for(let i = 0; i < item.currentSet.length; i++){
                text += item.currentSet[i].word + ' / '
                text += item.currentSet[i].translation + ' <br>'
            }
            setsWrapper.innerHTML += createTemplateSets(item, index, text);
        });
        setsElements = document.querySelectorAll('.set-item')
    }
}
fillHtmlListSets();

//Удаление сета
const deleteSet = index => {
    sets.splice(index, 1);
    updateLocal();
    fillHtmlListSets();
}

function setCurrentSetFromSet(index) {
    currentSet = JSON.parse(JSON.stringify(sets[index].currentSet));
    console.log(currentSet)
    updateLocal();
}