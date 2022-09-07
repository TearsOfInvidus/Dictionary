'use strict'

const addPairBtn = document.getElementById('add-pair-btn')
const wordPairInput = document.getElementById('word')
const translation = document.getElementById('translation')
const pairsWrapper = document.querySelector('.pairs-wrapper')
const card = document.querySelector('.flashcard')
const addSet = document.getElementById('add-set-btn')
const toDictionary = document.getElementById('toDictionary-btn')
const nextBtn = document.getElementsByClassName('next-btn')[0]

//массив пар
let pairs;
!localStorage.pairs ? pairs = [] : pairs = JSON.parse(localStorage.getItem('pairs'));

//массив сета
let set;
!localStorage.set ? set = [] : set = JSON.parse(localStorage.getItem('set'));

let pairItemElements = [];

//let rotation = ['rotateX(0deg)','rotateY(0deg)']

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
        //console.log(pairItemElements)
    }
}
fillHtmlList();

//обновление localStorage
const updateLocal = () => {
    localStorage.setItem('pairs', JSON.stringify(pairs));
    localStorage.setItem('set', JSON.stringify(set));
    console.log('tut')
}

//отмечает пару
const checkPair = index => {
    //console.log('tut')
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

//поворот карточки
card.addEventListener('click',() => {
    if(card.style.transform == '') {
        card.style.transform = 'rotateX(0deg) rotateY(0deg)'
    }

    let rotations = card.style.transform.split(' ');

    if(card.style.transform.split(' ')[1] == 'rotateY(0deg)') {
        card.style.transform = rotations[0] + ' ' + 'rotateY(180deg)'
    }else{
        card.style.transform = rotations[0] + ' ' + 'rotateY(0deg)'
    }
})

//переход к словарю
toDictionary.addEventListener('click',() => {
    const cardWrapper = document.querySelector('.card-wrapper')
    //console.log(cardWrapper.style.display)
    if(cardWrapper.style.display == '' || cardWrapper.style.display == 'flex') {
        
        cardWrapper.style.display = 'none'
        pairsWrapper.style.display = 'block' 
    }else{
        pairsWrapper.style.display = 'none'
        cardWrapper.style.display = 'flex'
    }    
})

//заполнение set
addSet.addEventListener('click', () => { 

    set = [];

    if(pairs.lenght != 0) {
        pairs.forEach((item) => {
            if(item.checked == true) {
                set.push(item);
            }
        });
    }

    updateLocal();
})

//Получение случайного целого числа
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

//замена текста на карточке
function setPairToCard(pair) {
    card.firstElementChild.textContent = pair.word
    card.lastElementChild.textContent = pair.translation
}

//клик по кнопке next
nextBtn.addEventListener('click', () => {
    setPairToCard(set[getRandomInt(0, set.length)])

    if(card.style.transform == '') {
        card.style.transform = 'rotateX(0deg) rotateY(0deg)'
    }

    let rotations = card.style.transform.split(' ');

    if(card.style.transform.split(' ')[0] == 'rotateX(0deg)') {
        card.style.transform = 'rotateX(360deg)' + ' ' + rotations[1]
    }else{
        card.style.transform = 'rotateX(0deg)' + ' ' + rotations[1]
    }

})
