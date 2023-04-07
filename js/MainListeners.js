import MainController from './controllers/MainController.js';
import Error from '/js/vendor/Error.js';

document.addEventListener('DOMContentLoaded', () =>{
    let mainController = new MainController();
    mainController.getConsumers().then(function success(consumers){
        addConsumersInPage(consumers);
    });
});

document.getElementById('newConsumer').addEventListener('click', () => {
    let el = document.getElementById('consumersTable').getElementsByTagName('tbody');
    el[0].insertAdjacentHTML(
        'beforeend',
        '<tr>' +
        '<td><input class = "name" maxlength="255" type = "text"><p class = "error"></p></td>' +
        '<td >' +
        '<select class = "type">' +
        '<option value = 1>Физическое лицо</option>' +
        '<option value = 2>Юридическое лицо</option>' +
        '</select>' +
        '</td>' +
        '<td ><input class = "number" maxlength="13" ><p class = "error"></p></td>' +
        '<td><button class = "createConsumer">Создать</button></td>' +
        '<td><button class = "deleteConsumer">Удалить</button></td></tr>'
    );
});

document.getElementById("consumersTable").addEventListener("click",(event) => {
    let target = event.target;
    if(target.classList.contains('deleteConsumer')){
        let parentTR = target.parentElement.parentElement;
        parentTR.parentElement.removeChild(parentTR);
        //  If the parent element had the data-id attribute, i.e. it is not a derivative of the button click
        //  "add a new consumer", but is a real existing consumer
        //  we need to call deleteConsumer method 
        if(parentTR.hasAttribute('data-id')){
            const mainController = new MainController();
            mainController.deleteConsumer({'id' : parentTR.dataset.id});
        }
    } else if(target.classList.contains('createConsumer')){
        let parentTR = target.parentElement.parentElement;
        cleanErrors(parentTR);
        let newConsumer = createConsumerObj(parentTR);
        let mainController = new MainController();
        let errorResult = mainController.checkConsumerForErrors(newConsumer);
        if(typeof errorResult[0] !== "undefined" && errorResult[0] instanceof Error){
            for (let i = 0; i < errorResult.length; i++) {
                parentTR.getElementsByClassName(errorResult[i].errorField)[0].parentElement.getElementsByClassName('error')[0].innerHTML = errorResult[i].errorText;
            }
        } else{
            mainController.createConsumer(newConsumer).then(function success(consumer){
                parentTR.parentElement.removeChild(parentTR);
                addConsumersInPage(consumer);
            });
        }
    } else if (target.classList.contains('changeConsumer')){
        let parentTR = target.parentElement.parentElement;

        let name = parentTR.getElementsByClassName('name')[0].textContent;
        parentTR.getElementsByClassName('name')[0].innerHTML = '<input value = "' + name + '" maxlength="255" class = "name" type = "text"><p class = "error"></p>';
        parentTR.getElementsByClassName('name')[0].classList.remove('name');

        let type = parentTR.getElementsByClassName('type')[0].dataset.id;
        if(type == 1){
            parentTR.getElementsByClassName('type')[0].innerHTML =
                '<select class = "type">' +
                '<option selected value = 1>Физическое лицо</option>' +
                '<option value = 2>Юридическое лицо</option>' +
                '</select>';
        } else if (type == 2){
            parentTR.getElementsByClassName('type')[0].innerHTML =
                '<select class = "type">' +
                '<option value = 1>Физическое лицо</option>' +
                '<option selected value = 2>Юридическое лицо</option>' +
                '</select>';
        }
        parentTR.getElementsByClassName('type')[0].classList.remove('type');

        let number = parentTR.getElementsByClassName('number')[0].textContent;
        parentTR.getElementsByClassName('number')[0].innerHTML = '<input value = "' + number + '" maxlength="13" type = "text" class = "number"><p class = "error"></p>';
        parentTR.getElementsByClassName('number')[0].classList.remove('number');

        parentTR.getElementsByClassName('changeConsumer')[0].parentElement.innerHTML = '<button class = "confirmСhangeConsumer">Сохранить изменения</button>';
    } else if (target.classList.contains('confirmСhangeConsumer')){
        let parentTR = target.parentElement.parentElement;
        cleanErrors(parentTR);
        let newConsumer = createConsumerObj(parentTR, parentTR.dataset.id);
        let mainController = new MainController();
        let errorResult = mainController.checkConsumerForErrors(newConsumer);
        if(typeof errorResult[0] !== "undefined" && errorResult[0] instanceof Error) {
            for (let i = 0; i < errorResult.length; i++) {
                parentTR.getElementsByClassName(errorResult[i].errorField)[0].parentElement.getElementsByClassName('error')[0].innerHTML = errorResult[i].errorText;
            }
        } else {
            mainController.changeConsumer(newConsumer).then(function success(consumer){
                addConsumersInPage(consumer, parentTR);
            });
        }
    }
});

document.getElementById("consumersTable").addEventListener("input", function(event){
    let target = event.target;
    if(target.classList.contains('number')){
        target.value = target.value.replace(/\D/g,'');
    }
});

function addConsumersInPage(consumers, parentTR = null) {
    let html = '';
    for (let i = 0; i < consumers.length; i++) {
        if(parentTR == null) {
            html += '<tr data-id = "' + consumers[i]['id'] + '">';
        }
        for(let elem in consumers[i] ) {
            if(elem != 'id' && elem != 'type'){
                html += '<td class = "' + elem +'">' + consumers[i][elem] + '</td>';
            }else if (elem == 'type') {
                if(consumers[i][elem] == 1){
                    html += '<td data-id = "1" class = "Valign type" ' + elem +'"><span>Ф</span> <img class = "questionImage" src = "img/question.png" title="Физическое лицо"></td>';
                }else if (consumers[i][elem] == 2){
                    html += '<td data-id = "2" class = "Valign type" ' + elem +'"> Ю <img class = "questionImage" src = "img/question.png" title="Юридическое лицо"></td>';
                }
            }
        }
        html += '<td><button class = "changeConsumer">Изменить</button></td>';
        html += '<td><button class = "deleteConsumer">Удалить</button></td>';
        html += '</tr>';
    }
    if(parentTR == null) {
        let el = document.getElementById('consumersTable').getElementsByTagName('tbody');
        el[0].insertAdjacentHTML('beforeend', html);
    }else{
        parentTR.innerHTML = html;
    }
}

function cleanErrors(errorsHTMLParent) {
    let errorBlocks = errorsHTMLParent.getElementsByClassName('error');
    for(let i = 0; i < errorBlocks.length; i++){
        errorBlocks[i].innerHTML = '';
    }
}

function createConsumerObj(consumerHTMLParent, consumerId = false) {
    let consumer = [];
    let name = consumerHTMLParent.getElementsByClassName('name')[0].value;
    let type = consumerHTMLParent.getElementsByClassName('type')[0].value;
    let number = consumerHTMLParent.getElementsByClassName('number')[0].value;
    if(consumerId !== false){
        let id = consumerId;
        consumer = {'id': id,'name': name, 'type': type, 'number': number};
    }else{
        consumer = {'name': name, 'type': type, 'number': number};
    }
    return consumer;
}

document.getElementById('filterJurist').addEventListener('click', () => {
    typeFilter(2);
});

document.getElementById('filterPhysical').addEventListener('click', () => {
    typeFilter(1);
});

document.getElementById('cleanFilter').addEventListener('click', () => {
    cleanFilter();
});
function typeFilter(filterParam) {
    cleanFilter();
    let elements = document.getElementsByClassName('type');
    for(let i = 0; i < elements.length; i++){
        if(elements[i].dataset.id != filterParam && elements[i].dataset.id != null){
            elements[i].parentElement.style.display = "none";
        }
    }
}
function cleanFilter() {
    let trElements = document.getElementById('consumersTable').getElementsByTagName("tr");
    for(let i = 0; i < trElements.length; i++){
        trElements[i].style.display = "table-row";
    }
}