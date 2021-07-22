import MainController from '/js/controllers/MainController.js';
import Error from '/js/vendor/Error.js';

//когда страница загружена
document.addEventListener('DOMContentLoaded', () =>{
    let mainController = new MainController();
    //запрашиваем список потребителей
    mainController.getConsumers().then(function success(consumers){
        //и добавляем их на страницу
        addConsumersInPage(consumers);
    });
});

//если произошёл клик по кнопке "добавить нового потребителя"
document.getElementById('newConsumer').addEventListener('click', () => {
    //ищем tbody и добавляем туда вёрстку для добавления нового пользователя
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

//так как данные в таблице потребителей меняются динамически, вешаем обработчик события клик на саму таблицу,
//а там уже определяем, куда конкретно этот клик был произведён
document.getElementById("consumersTable").addEventListener("click",(event) => {
    let target = event.target;
    //если клик был по кнопке "удалить потребителя"
    if(target.classList.contains('deleteConsumer')){
        //находим родительский tr
        let parentTR = target.parentElement.parentElement;
        //и удаляем его
        parentTR.parentElement.removeChild(parentTR);
        //если родительский элемент имел аттрибут data-id т.е. не является производной клика по кнопке
        //"добавить нового потребителя", а является реально сущетсвующим потребителем
        if(parentTR.hasAttribute('data-id')){
            let mainController = new MainController();
            //вызываем метод deleteConsumer для удаления потребителя
            mainController.deleteConsumer({'id' : parentTR.dataset.id});
        }
    }
    //если клик был по кнопке "создать потребителя"
    else if(target.classList.contains('createConsumer')){
        //находим родительский tr
        let parentTR = target.parentElement.parentElement;
        //чистим родительский tr от старых ошибок валидации, которые могли там присутствовать
        cleanErrors(parentTR);
        //берём данные заполненных полей и создаём ассоциативный массив вида {'id': id,'name': name,
        //'type': type, 'number': number};
        let newConsumer = createConsumerObj(parentTR);
        let mainController = new MainController();
        //проверяем данные введённые пользователем на ошибки
        let errorResult = mainController.checkConsumerForErrors(newConsumer);
        //если ошибки были найдены, выводим их на страницу
        if(typeof errorResult[0] !== "undefined" && errorResult[0] instanceof Error){
            for (let i = 0; i < errorResult.length; i++) {
                parentTR.getElementsByClassName(errorResult[i].errorField)[0].parentElement.getElementsByClassName('error')[0].innerHTML = errorResult[i].errorText;
            }
        }
        //если ошибок нет, создаём нового потребителя
        else{
            mainController.createConsumer(newConsumer).then(function success(consumer){
                //удаляем tr с inputами
                parentTR.parentElement.removeChild(parentTR);
                //добавляем на страницу нового потребителя
                addConsumersInPage(consumer);
            });
        }
    }
    //если клик был по кнопке "изменить"
    else if (target.classList.contains('changeConsumer')){
        //находим родительский tr
        let parentTR = target.parentElement.parentElement;
        //и меняем в нём обычный текст на inputы и selectы
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
        }
        else if (type == 2){
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
    }
    //если клик был по кнопке "сохранить изменения"
    else if (target.classList.contains('confirmСhangeConsumer')){
        //находим родительский tr
        let parentTR = target.parentElement.parentElement;
        //чистим родительский tr от старых ошибок валидации, которые могли там присутствовать
        cleanErrors(parentTR);
        //берём данные заполненных полей и создаём ассоциативный массив вида {'id': id,'name': name,
        //'type': type, 'number': number};
        let newConsumer = createConsumerObj(parentTR, parentTR.dataset.id);
        let mainController = new MainController();
        //проверяем данные, введённые пользователем, на ошибки
        let errorResult = mainController.checkConsumerForErrors(newConsumer);
        //если найдены ошибки, выводим
        if(typeof errorResult[0] !== "undefined" && errorResult[0] instanceof Error) {
            for (let i = 0; i < errorResult.length; i++) {
                parentTR.getElementsByClassName(errorResult[i].errorField)[0].parentElement.getElementsByClassName('error')[0].innerHTML = errorResult[i].errorText;
            }
        }
        //если ошибок не найдено, то посылаем запрос на изменение потребителя, и полученные данные вставляем на страницу
        else{
            mainController.changeConsumer(newConsumer).then(function success(consumer){
                addConsumersInPage(consumer, parentTR);
            });
        }
    }
});
//метод проверяющий, чтобы в поле number была возможность вводить только цифры
document.getElementById("consumersTable").addEventListener("input",function(event){
    let target = event.target;
    if(target.classList.contains('number')){
        target.value = target.value.replace(/\D/g,'');
    }
});

document.getElementById('filterJurist').addEventListener('click', () => {
    typeFilter(2);
});

document.getElementById('filterPhysical').addEventListener('click', () => {
    typeFilter(1);
});

document.getElementById('cleanFilter').addEventListener('click', () => {
    cleanFilter();
});

//метод добавляющий нового пользователя на страницу
//принимает массив объектов Consumer и tr, куда необходимо вставить данные
//если такого tr нет, то вставляет данные в конец
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

//метод чистящий ошибки валидации, принимает родительский элемент, в котором ищет класс error,
//и из этих error удаляет текст ошибок
function cleanErrors(errorsHTMLParent) {
    let errorBlocks = errorsHTMLParent.getElementsByClassName('error');
    for(let i = 0; i < errorBlocks.length; i++){
        errorBlocks[i].innerHTML = '';
    }
}

//метод создающий нового потребителя, принимает в себя родительский элемент,
//в котором расположены inputы и selectы, и consumerId, если такой есть
//возвращает ассоциативный массив

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

//метод производящий фильтрацию записей, принимает в себя параметр фильтра ( 1 - физическое лицо и 2 - юридическое лицо)
//ищет элементы с классом type, после того как найдёт сверяет data-id элемента с полученным параметром
//и если он не совпадает, то родительский tr скрывается display: none

function typeFilter(filterParam) {
    cleanFilter();
    let elements = document.getElementsByClassName('type');
    for(let i = 0; i < elements.length; i++){
        if(elements[i].dataset.id != filterParam && elements[i].dataset.id != null){
            elements[i].parentElement.style.display = "none";
        }
    }
}
//метод очищающий выбранные фильтры, просто присваивает всем tr display table-row
function cleanFilter() {
    let trElements = document.getElementById('consumersTable').getElementsByTagName("tr");
    for(let i = 0; i < trElements.length; i++){
        trElements[i].style.display = "table-row";
    }
}