import Const from '/js/vendor/Const.js';

export default class ConsumersList{
    constructor() {
        this.url = 'consumers_list.php'; 
        this.type = new Const().request_type_list.POST;
    }

}