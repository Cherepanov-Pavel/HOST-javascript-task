import Const from '/js/vendor/Const.js';

let constanta = new Const();

/*
    класс JSONRequest предназначен для отправки json запросов на сервер
    принимает в конструкторе url, куда необходимо выполнить запрос
    тип запроса (GET, POST и т.д.)
    и массив с параметрами запроса
 */

export default class JSONRequest {

    constructor(url, type, params = {}) {
        this.url = url;
        this.type = type;
        this.params = params;
    }

    request(){
        let request = new XMLHttpRequest();
        let request_params = '';
        //если запрос является GET, то необходимо добавить ? перед перечислением параметров запроса
        if(this.type === constanta.request_type_list.GET && this.params !== {}){
            request_params += '?';
        }
        let x = false;
        //формируем url с параметрами запроса
        for (let param in this.params){
            if(typeof this.params[param] !== "undefined") {
                //если это не первый параметр, то добавляем &
                if (x === true) {
                    request_params += '&';
                } else {
                    x = true;
                }
                request_params += param + '=' + this.params[param];
            }
        }
        //указываем тип запроса как json
        request.responseType =	"json";
        //создаём переменные, для использования их в функции Promise
        let mytype = this.type;
        let myurl = this.url;
        return new Promise(function(resolve, reject) {
            //вышаем обработчик, который реагирует на изменения состояния запроса и когда состояние будет 4 т.е. запрос отправлен
            //и ответ получен, возвращаем ответ
            request.addEventListener("readystatechange", () => {
                if (request.readyState === 4 && request.status === 200) {
                    resolve(request.response);
                }
            });
            //если запрос является get, то параметры запроса необоходимо указывать в url
            //если нет, то указывать их необходимо при отправке
            if(mytype === constanta.request_type_list.GET) {
                request.open(mytype, myurl + request_params);
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                request.send();
            }else{
                request.open(mytype, myurl);
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                request.send(request_params);
            }
        });
    }
}