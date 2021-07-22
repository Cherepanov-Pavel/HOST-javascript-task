/*
    класс Config предназначен для конфигурации приложения
 */

export default class Config{

    constructor() {

        this.production = false; //переключатель на работу с настоящим backend. false - синтетические данные. true - backend.

        this.base_url = ''; //базовый url для отправки запросов на сервер


    }

}