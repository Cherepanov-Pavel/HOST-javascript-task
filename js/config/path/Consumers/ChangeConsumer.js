import Const from '/js/vendor/Const.js';

let constanta = new Const();
/*
    класс ChangeConsumer предназначен для настройки отправки запросов на изменение потребителя на сервер.
 */
export default class ChangeConsumer{

    constructor() {

        this.url = 'consumers_list.php'; // url метода контроллера обрабатывающего данный запрос на сервере.
        this.type = constanta.request_type_list.PUT; // тип запроса

    }

}