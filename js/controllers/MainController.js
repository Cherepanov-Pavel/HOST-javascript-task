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

export default class MainController {
    getConsumers() {
        if(conf.production === true){
            let consumersList = new ConsumersList();
            let json_request = new JSONRequest(conf.base_url + consumersList.url, consumersList.type);
            return new Promise(function(resolve, reject) {
                json_request.request().then(function success(JSON){
                    let mapper = new JSONToConsumerMapper(JSON, Consumer);
                    resolve(mapper.map());
                });
            });
        } else {
            return new Promise(function(resolve, reject) {
				let i = document.cookie;
                let result = i.match(/"id":"\d+"/g);
                //if the user has never visited the page before, it is necessary to create new synthetic data
                if(result === "") {
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

                    let cookie = new Cookies();
                    consumers.forEach(function (item, i) {
                        cookie.setCookie(i, JSON.stringify(item));
                    });

                    let mapper = new JSONToConsumerMapper(consumers, Consumer);
                    resolve(mapper.map());
                } else {
                    let cookie = new Cookies();
                    let consumers = cookie.get_all_cookies();
                    let mapper = new CoockieToConsumerMapper(consumers, Consumer);
                    resolve(mapper.map());
                }
            });
        }
    }

    deleteConsumer(consumerId) {
        if(conf.production === true){
            let deleteConsumer = new DeleteConsumer();
            let json_request = new JSONRequest(conf.base_url + deleteConsumer.url, deleteConsumer.type, consumerId);
            json_request.request();
        } else {
            let cookie = new Cookies();
            cookie.deleteCookie(consumerId.id);
        }
    }

    createConsumer(consumerInput) {
        if(conf.production === true) {
            let mapper = new InputToConsumerMapper(consumerInput, Consumer);
            let consumer = mapper.map();
            let createConsumer = new CreateConsumer();
            let json_request = new JSONRequest(conf.base_url + createConsumer.url, createConsumer.type, consumer);
            return new Promise(function (resolve, reject) {
                json_request.request().then(function success(JSON) {
                    consumer.id = JSON[0].id;
                    let consumers = [consumer];
                    resolve(consumers);
                });
            });
        } else {
            return new Promise(function (resolve, reject) {
                let i = document.cookie;
                let result = i.match(/"id":"\d+"/g);
                let idList = [];
                for (let i = 0; i < result.length; i++) {
                    let id = result[i].match(/\d/g);
                    idList.push(parseInt(id));
                }

                let sortNumeric = new SortNumeric();

                idList.sort(sortNumeric.sort);
                let lastId = idList[idList.length - 1];
                let mapper = new InputToConsumerMapper(consumerInput, Consumer);
                let consumer = mapper.map();
                consumer.id = String(lastId + 1);
                let cookie = new Cookies();
                cookie.setCookie(consumer.id, JSON.stringify(consumer));
                let consumers = [consumer];
                resolve(consumers);
            });
        }
    }

    changeConsumer(consumerInput) {
        if(conf.production === true) {
            let mapper = new InputToConsumerMapper(consumerInput, Consumer);
            let consumer = mapper.map();

            let changeConsumer = new ChangeConsumer();

            let json_request = new JSONRequest(conf.base_url + changeConsumer.url, changeConsumer.type, consumer);
            return new Promise(function (resolve, reject) {
                json_request.request().then(function success(JSON) {
                    let consumers = [consumer];
                    resolve(consumers);
                });
            });
        } else {
            return new Promise(function (resolve, reject) {
                let mapper = new InputToConsumerMapper(consumerInput, Consumer);
                let consumer = mapper.map();
                let cookie = new Cookies();
                cookie.setCookie(consumer.id, JSON.stringify(consumer));
                let consumers = [consumer];
                resolve(consumers);

            });
        }
    }

    checkConsumerForErrors(consumerInput) {
        let mapper = new InputToConsumerMapper(consumerInput, Consumer);
        let consumer = mapper.map();
        let errors = consumer.validate();
        return errors;
    }
}