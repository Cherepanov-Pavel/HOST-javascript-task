import Const from '/js/vendor/Const.js';

let constanta = new Const();
/*
    класс ConsumersList предназначен для настройки отправки запросов на получения списка потребителей с сервера.
 */

export default class ConsumersList{

    constructor() {

        this.url = 'consumers_list.php'; // url метода контроллера обрабатывающего данный запрос на сервере.
        this.type = constanta.request_type_list.POST; // тип запроса

    }

}