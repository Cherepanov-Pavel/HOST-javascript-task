import Config from '../config/Config.js';
import JSONRequest from  '../vendor/JSONRequest.js';
import Cookies from  '../vendor/Cookies.js';
import SortNumeric from  '../vendor/SortNumeric.js';
import CoockieToConsumerMapper from '../mappers/CoockieToConsumerMapper.js';
import JSONToConsumerMapper from '../mappers/JSONToConsumerMapper.js';
import InputToConsumerMapper from '../mappers/InputToConsumerMapper.js';
import Consumer from  '../models/Сonsumer.js';
import ConsumersList from '../config/path/Consumers/ConsumersList.js';
import DeleteConsumer from "../config/path/Consumers/DeleteConsumer.js";
import CreateConsumer from "../config/path/Consumers/CreateConsumer.js";
import ChangeConsumer from "../config/path/Consumers/ChangeConsumer.js";

let conf = new Config();
/*
    класс MainController предназначен для обработки запросов с main.html
 */

export default class MainController {

    /*
    метод getConsumers() предназначен для получения списка потребителей
    возвращает массив объектов Consumer экземпляром класса Promise
    */

    getConsumers() {
        //если работаем с backend
        if(conf.production === true){
            //создаём экземпляр класса ConsumersList для получения url запроса и типа запроса
            let consumersList = new ConsumersList();
            //создаём экземпляр класса JSONRequest для отправки JSON запроса на сервер и запролняем его данными
            let json_request = new JSONRequest(conf.base_url + consumersList.url, consumersList.type);
            return new Promise(function(resolve, reject) {
                //методом request() отправляем запрос на сервер
                json_request.request().then(function success(JSON){
                    //создаём экземпляр класса JSONToConsumerMapper для преобразования полученных JSON данных в массив объектов Consumer
                    let mapper = new JSONToConsumerMapper(JSON, Consumer);
                    //методом map() преобразовываем данные, и возращаем из функции
                    resolve(mapper.map());
                });
            });
        }
        //если работаем с синтетическими данными
        else{
            return new Promise(function(resolve, reject) {
                //если до этого пользователь ни разу не заходил на страницу, и у него не записано никаких потребителей в coockie
				let i = document.cookie;
                let result = i.match(/"id":"\d+"/g);
                if(result === "") {
                    //создаём синтетические данные
                    let consumers = [];
                    consumers[1] = {
                        "id": "1",
                        "name": "Анна",
                        "type": "1",
                        "number": "9999999999999"
                    }
                    consumers[2] = {
                        "id": "2",
                        "name": "Павел",
                        "type": "2",
                        "number": "9999999999998"
                    }
                    consumers[3] = {
                        "id": "3",
                        "name": "Илья",
                        "type": "1",
                        "number": "9999999999997"
                    }
                    consumers[4] = {
                        "id": "4",
                        "name": "Борис",
                        "type": "2",
                        "number": "9999999999996"
                    }
                    consumers[5] = {
                        "id": "5",
                        "name": "Надежда",
                        "type": "1",
                        "number": "9999999999995"
                    }
                    //создаём экземпляр класса Cookies для работы с куками
                    let cookie = new Cookies();
                    //в цикле перебираем данные и записываем в cookie, предварительно "упаковав" их в JSON
                    consumers.forEach(function (item, i) {
                        cookie.setCookie(i, JSON.stringify(item));
                    });
                    //создаём экземпляр класса JSONToConsumerMapper для преобразования синтетических данных в массив объектов Consumer
                    let mapper = new JSONToConsumerMapper(consumers, Consumer);
                    //методом map() преобразовываем данные, и возращаем из функции
                    resolve(mapper.map());
                }
                //если пользователь заходил до этого на страницу
                else{
                    //создаём экземпляр класса Cookies для работы с куками
                    let cookie = new Cookies();
                    //получаем все данные из coockie
                    let consumers = cookie.get_all_cookies();
                    //создаём экземпляр класса CoockieToConsumerMapper для преобразования данных из coockie в массив объектов Consumer
                    let mapper = new CoockieToConsumerMapper(consumers, Consumer);
                    //методом map() преобразовываем данные, и возращаем из функции
                    resolve(mapper.map());
                }
            });
        }
    }


    /*
    метод deleteConsumer() предназначен для удаления потребителя
    принимает id потребителя
    */
    deleteConsumer(consumerId) {
        //если работаем с backend
        if(conf.production === true){
            //создаём экземпляр класса DeleteConsumer для получения url запроса и типа запроса
            let deleteConsumer = new DeleteConsumer();
            //создаём экземпляр класса JSONRequest для отправки JSON запроса на сервер и запролняем его данными
            let json_request = new JSONRequest(conf.base_url + deleteConsumer.url, deleteConsumer.type, consumerId);
            //методом request() отправляем запрос на сервер
            json_request.request();
        }
        //если работаем с синтетическими данными
        else{
            let cookie = new Cookies();
            //методом deleteCoockie удаляем coockie с пользовательским id
            cookie.deleteCookie(consumerId.id);
        }
    }
    /*
    метод createConsumer() предназначен для создания потребителя
    принимает данные о новом потребителе в виде ассоциативного массива {'id': id,'name': name, 'type': type, 'number': number}
    возвращает массив с одним объектом Consumer экземпляром класса Promise
    */
    createConsumer(consumerInput) {
        //если работаем с backend
        if(conf.production === true) {
            //создаём экземпляр класса InputToConsumerMapper преобразования полученных данных в объект Consumer
            let mapper = new InputToConsumerMapper(consumerInput, Consumer);
            //вызываем метод map() для преобразования данных
            let consumer = mapper.map();
            //создаём экземпляр класса CreateConsumer для получения url запроса и типа запроса
            let createConsumer = new CreateConsumer();
            //создаём экземпляр класса JSONRequest для отправки JSON запроса на сервер и запролняем его данными
            let json_request = new JSONRequest(conf.base_url + createConsumer.url, createConsumer.type, consumer);
            return new Promise(function (resolve, reject) {
                //методом request() делаем запрос
                json_request.request().then(function success(JSON) {
                    //дополняем объект Consumer полученным id
                    consumer.id = JSON[0].id;
                    //получившийся Consumer ложим в массив (для облегчения вывода)
                    let consumers = [consumer];
                    //возвращаем массив с одним объектом Consumer
                    resolve(consumers);
                });
            });
        }
        //если работаем с синтетическими данными
        else{
            return new Promise(function (resolve, reject) {
                //получаем все coockie
                let i = document.cookie;
                //с помощью регулярного выражения находим id пользователей
                let result = i.match(/"id":"\d+"/g);
                let idList = [];
                //в цикле получаем все id и ложим их в массив
                for (let i = 0; i < result.length; i++) {
                    let id = result[i].match(/\d/g);
                    idList.push(parseInt(id));
                }
                //сортируем массив с помощью метода sort класса SortNumeric
                // (для того чтобы данные массива сортировались как числа, а не как строки)
                let sortNumeric = new SortNumeric();
                //сортируем массив
                //(для получения последнего id и последующей вставки в coockie нового потребителя с последним id + 1)
                //(имитируем поведение БД)
                idList.sort(sortNumeric.sort);
                let lastId = idList[idList.length - 1];
                //создаём экземпляр класса InputToConsumerMapper преобразования полученных данных в объект Consumer
                let mapper = new InputToConsumerMapper(consumerInput, Consumer);
                //вызываем метод map() для преобразования данных
                let consumer = mapper.map();
                //дополняем объект Consumer полученным id
                consumer.id = String(lastId + 1);
                let cookie = new Cookies();
                //записываем нового потребителя в coockie
                cookie.setCookie(consumer.id, JSON.stringify(consumer));
                //получившийся Consumer ложим в массив (для облегчения вывода)
                let consumers = [consumer];
                //возвращаем массив с одним объектом Consumer
                resolve(consumers);
            });
        }
    }
    /*
    метод changeConsumer() предназначен для изменения потребителя
    принимает данные о потребителе, которого надо изменить в виде ассоциативного массива {'id': id,'name': name, 'type': type, 'number': number}
    возвращает массив с одним объектом Consumer экземпляром класса Promise
    */
    changeConsumer(consumerInput) {
        //если работаем с backend
        if(conf.production === true) {
            //создаём экземпляр класса InputToConsumerMapper преобразования полученных данных в объект Consumer
            let mapper = new InputToConsumerMapper(consumerInput, Consumer);
            //вызываем метод map() для преобразования данных
            let consumer = mapper.map();
            //создаём экземпляр класса ChangeConsumer для получения url запроса и типа запроса
            let changeConsumer = new ChangeConsumer();
            //создаём экземпляр класса JSONRequest для отправки JSON запроса на сервер и запролняем его данными
            let json_request = new JSONRequest(conf.base_url + changeConsumer.url, changeConsumer.type, consumer);
            return new Promise(function (resolve, reject) {
                json_request.request().then(function success(JSON) {
                    //после выполнения запроса, возвращаем те же данные, что и получили, но в массиве
                    let consumers = [consumer];
                    resolve(consumers);
                });
            });
        }
        //если работаем с синтетическими данными
        else{
            return new Promise(function (resolve, reject) {
                //создаём экземпляр класса InputToConsumerMapper преобразования полученных данных в объект Consumer
                let mapper = new InputToConsumerMapper(consumerInput, Consumer);
                //вызываем метод map() для преобразования данных
                let consumer = mapper.map();
                let cookie = new Cookies();
                //изменяем coockie с переданным consumer.id
                cookie.setCookie(consumer.id, JSON.stringify(consumer));
                //после этого, возвращаем те же данные, что и получили, но в массиве
                let consumers = [consumer];
                resolve(consumers);

            });
        }
    }
    /*
    метод checkConsumerForErrors() предназначен для проверки введённых в view данных на ошибки
    принимает данные о потребителе, которого надо изменить в виде ассоциативного массива {'id': id,'name': name, 'type': type, 'number': number}
    возвращает массив экземпляров класса Errors с ошибками или пустой массив, если ошибок нет
    */
    checkConsumerForErrors(consumerInput) {
        //создаём экземпляр класса InputToConsumerMapper преобразования полученных данных в объект Consumer
        let mapper = new InputToConsumerMapper(consumerInput, Consumer);
        //вызываем метод map() для преобразования данных
        let consumer = mapper.map();
        //вызываем метод validate() класса Consumer, для проверки на ошибки
        let errors = consumer.validate();
        //возвращаем ошибки
        return errors;
    }
}