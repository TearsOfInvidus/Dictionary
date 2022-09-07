'use strict'

const addPairBtn = document.getElementById('add-pair-btn')
const wordPairInput = document.getElementById('word')
const translation = document.getElementById('translation')
const pairsWrapper = document.querySelector('.pairs-wrapper')

//массив пар
let pairs;
!localStorage.pairs ? pairs = [] : pairs = JSON.parse(localStorage.getItem('pairs'));

let pairItemElements = [];

//Конструктор пар 
function Pair(word, translation) {
    this.word = word;
    this.translation = translation;
    this.checked = false;
} 

//создание html
const createTemplate = (pair, index) => {
    return `
        <div class="pair-item ${pair.checked ? 'checked' : ''}">
            <div class="WoTrText">${pair.word} / ${pair.translation}</div>
            <div class="buttons">
                <input type="checkbox" onclick="checkPair(${index})" class="btn-checked"${pair.checked ? 'checked' : ''}>
                <button class="btn-delete" onclick="deletePair(${index})">Delete</button>
            </div>
        </div>
    `
}

//заполнение html
const fillHtmlList = () => {
    pairsWrapper.innerHTML = '';
    if(pairs.lenght != 0) {
        pairs.forEach((item, index) => {
            pairsWrapper.innerHTML += createTemplate(item, index);
        });
        pairItemElements = document.querySelectorAll('.pair-item')
        console.log(pairItemElements)
    }
}
fillHtmlList();

//обновление localStorage
const updateLocal = () => {
    localStorage.setItem('pairs', JSON.stringify(pairs));
}

//отмечает пару
const checkPair = index => {
    console.log('tut')
    pairs[index].checked = !pairs[index].checked;
    if(pairs[index].checked) {
        pairItemElements[index].classlist += 'checked'
    }else{
        pairItemElements[index].classlist -= 'checked'
    }
    updateLocal();
    fillHtmlList();
}

//Удаление пары
const deletePair = index => {
    pairs.splice(index, 1);
    updateLocal();
    fillHtmlList();
}

//добавление пары
addPairBtn.addEventListener('click', () => {
    pairs.push(new Pair(wordPairInput.value, translation.value))
    updateLocal();
    fillHtmlList();
    wordPairInput.value = '';
    translation.value = '';
})

//console.log(pairs)