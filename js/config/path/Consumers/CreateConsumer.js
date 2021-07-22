import Const from '/js/vendor/Const.js';

let constanta = new Const();

/*
    класс CreateConsumer предназначен для настройки отправки запросов на создание нового потребителя
 */

export default class CreateConsumer{

    constructor() {

        this.url = 'consumers_list.php'; // url метода контроллера обрабатывающего данный запрос на сервере.
        this.type = constanta.request_type_list.POST; // тип запроса

    }

}