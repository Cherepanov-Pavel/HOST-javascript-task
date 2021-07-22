/*
    класс JSONToConsumerMapper предназначен для преобразование данных JSON, пришедших с сервера, в массив объектов Consumer
 */
export default class JSONToConsumerMapper {

    constructor(JSON, consumer) {

        this.JSON = JSON;

        this.consumer = consumer;

    }

    map(){
        let consumerList = [];
        // в цикле перебираем массив из JSON
        for (let number in this.JSON) {
            // создаём новый экземпляр класса Consumer
            let newConsumer = new this.consumer();
            //  перебираем ассоциативный массив
            for(let elem in this.JSON[number] ) {
                // заполняем данными Consumer
                newConsumer[elem] = this.JSON[number][elem];
            }
            consumerList.push(newConsumer);
        }
        return consumerList;
    }

}