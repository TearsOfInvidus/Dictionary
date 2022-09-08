const setsWrapper = document.querySelector('.sets-wrapper')

let sets = [];
let setsElements = [];

//кнопка set
let setBtn = document.getElementById('add-set-btn');
setBtn.addEventListener('click', () => {
    //создание нового сета и добавление в массив
    sets.push(new Set('ttt', JSON.parse(localStorage.getItem('currentSet'))))
    console.log(sets.length)
    fillHtmlListSets()
})

function Set(name = 'name', currentSet = []) {
    this.name = name
    this.currentSet = []
    this.currentSet = currentSet;
}
 
//создание html set-item
const createTemplateSets = (set, index) => {
    return `
        <div class="set-item">
            <div class="WoTrBlock">
                <div class="WoTrBlock-item">わたし / Я</div>
            </div>
            <div class="buttons">
                <button class="btn-delete" onclick="deleteSet(${index})">Delete</button>
            </div>
        </div>
    `
}
 

//заполнение html set
const fillHtmlListSets = () => {
    setsWrapper.innerHTML = '';
    if(sets.length > 0) {
        sets.forEach((item, index) => {
            setsWrapper.innerHTML += createTemplateSets(item, index);
        });
        setsElements = document.querySelectorAll('.set-item')
    }
}
fillHtmlListSets();

//Удаление сета
const deleteSet = index => {
    sets.splice(index, 1);
    fillHtmlListSets();
}