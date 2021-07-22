/*
    класс Const является классом, содержащим в себе список констант нашего приложения
    пока тут есть только request_type_list определяющая типы запросов на сервер
 */

export default class Const{

    constructor() {

        this.request_type_list = {
            'GET': 'GET',
            'POST': 'POST',
            'PUT': 'PUT',
            'DELETE': 'DELETE'
    };

    }

}