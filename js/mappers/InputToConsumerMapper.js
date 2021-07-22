/*
    класс InputToConsumerMapper предназначен для преобразование данных из html inputов в объект Consumer
 */
export default class InputToConsumerMapper {

    constructor(input, consumer) {

        this.input = input; // данные в виде ассоциативного массива {'id': id,'name': name, 'type': type, 'number': number}

        this.consumer = consumer; // класс Consumer

    }

    map(){
        let newConsumer = new this.consumer();
        for(let elem in this.input ) {
            newConsumer[elem] = this.input[elem];
        }
        return newConsumer;
    }

}