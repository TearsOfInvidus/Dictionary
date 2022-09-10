'use strict'

const addPairBtn = document.getElementById('add-pair-btn')
const wordPairInput = document.getElementById('word')
const translation = document.getElementById('translation')
const pairsWrapper = document.querySelector('.pairs-wrapper')
const card = document.querySelector('.flashcard')
const toDictionary = document.getElementById('toDictionary-btn')
const nextBtn = document.getElementsByClassName('next-btn')[0]
const saveBtn = document.getElementById('save-pair-btn')
const readBtn = document.getElementById('read-pair-btn')
const push = document.getElementById('push-pair-btn')
const cardWrapper = document.querySelector('.card-wrapper')
const menuBtn = document.getElementById('menu') 

//массив пар
let pairs = [];
!localStorage.pairs ? pairs = [] : pairs = JSON.parse(localStorage.getItem('pairs'));

//массив сета
let currentSet = [];
!localStorage.set ? currentSet = [] : currentSet = JSON.parse(localStorage.getItem('currentSet'));

let pairItemElements = [];

//Конструктор пар 
function Pair(word, translation) {
    this.word = word;
    this.translation = translation;
    this.checked = false;
}

//создание html pair-item
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
    if(pairs.length > 0) {
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
    localStorage.setItem('currentSet', JSON.stringify(currentSet));
    localStorage.setItem('sets', JSON.stringify(sets));
    //console.log('tut')
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

    currentSet = [];

    if(pairs.lenght != 0) {
        pairs.forEach((item) => {
            if(item.checked == true) {
                currentSet.push(item);
            }
        });
    }


    updateLocal();
    fillHtmlList();
}

/* 
//запись currentSet
function setCurrentSet () {
    currentSet = [];

    if(pairs.lenght != 0) {
        pairs.forEach((item) => {
            if(item.checked == true) {
                currentSet.push(item);
            }
        });
    }
}
 */

//Удаление пары
const deletePair = index => {
    pairs.splice(index, 1);
    currentSet.splice(index, 1);
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
    if(pairsWrapper.style.display == '' || pairsWrapper.style.display == 'none') {
        cardWrapper.style.display = 'none'
        setsWrapper.style.display = 'none'
        pairsWrapper.style.display = 'block'
    }else{
        cardWrapper.style.display = 'flex'
        setsWrapper.style.display = 'none'
        pairsWrapper.style.display = 'none'
    }
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
    
    currentSet = JSON.parse(localStorage.getItem('currentSet'))    

    setPairToCard(currentSet[getRandomInt(0, currentSet.length)])

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

let json = [];

//скачивание файла 
function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

//сохранение пар в json
saveBtn.addEventListener('click', () => {
    json[0] = pairs;
    json[1] = sets;
    json = JSON.stringify(json)
    download(json, 'pairs.txt', 'text/plain');
})
 
//чтение файла
function readFile(object) {
    let file = object.files[0]
    let reader = new FileReader()

    reader.onload = function() {
        json = JSON.parse(reader.result)
        console.log(json)
        return (reader.result)
    }
    reader.readAsText(file)
  }

readBtn.addEventListener('change', () => {
    readFile(readBtn)

    setTimeout(() => {
        console.log(json)
        pairs = json[0]
        sets = json[1]
        updateLocal()
        fillHtmlList()
        fillHtmlListSets()
    },2000)
})

//Чтение файла и добавление к существующим
push.addEventListener('change', () => {
    readFile(push)

    setTimeout(() => {
        let newPairs = parsePairs(json)
        //console.log(newPairs)

        for(let i = 0; i < newPairs.length; i++) {
            pairs.push(newPairs[i])
        }

        updateLocal();
        fillHtmlList();
    },2000)
})

//Парсинг слов 
function parsePairs (text) {
    let textPairs = [];
    textPairs = text.split('\n');  
    let newPairs = [];


    for(let i = 0; i < textPairs.length; i++) {
        newPairs[i] = new Pair(textPairs[i].split('\t')[0], textPairs[i].split('\t')[1]);
        //console.log(newPairs)
    }
    return newPairs;
}