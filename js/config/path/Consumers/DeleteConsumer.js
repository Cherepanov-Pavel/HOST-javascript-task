import Const from '/js/vendor/Const.js';

let constanta = new Const();

/*
    класс DeleteConsumer предназначен для настройки отправки запросов на удаление потребителя
 */

export default class DeleteConsumer{

    constructor() {

        this.url = 'consumers_list.php'; // url метода контроллера обрабатывающего данный запрос на сервере.
        this.type = constanta.request_type_list.DELETE; // тип запроса

    }

}