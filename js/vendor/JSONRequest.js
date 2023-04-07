import Const from '/js/vendor/Const.js';

export default class JSONRequest {
    constructor(url, type, params = {}) {
        this.url = url;
        this.type = type;
        this.params = params;
    }

    request(){
        let request = new XMLHttpRequest();
        let request_params = '';
        if(this.type === new Const().request_type_list.GET && this.params !== {}){
            request_params += '?';
        }
        let x = false;

        for (let param in this.params){
            if(typeof this.params[param] !== "undefined") {
                if (x === true) {
                    request_params += '&';
                } else {
                    x = true;
                }
                request_params += param + '=' + this.params[param];
            }
        }

        request.responseType =	"json";

        const mytype = this.type;
        const myurl = this.url;
        return new Promise(function(resolve, reject) {
            request.addEventListener("readystatechange", () => {
                if (request.readyState === 4 && request.status === 200) {
                    resolve(request.response);
                }
            });
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