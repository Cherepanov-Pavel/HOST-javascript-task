export default class InputToConsumerMapper {
    constructor(input, consumer) {
        this.input = input;
        this.consumer = consumer;
    }

    map(){
        let newConsumer = new this.consumer();
        for(let elem in this.input ) {
            newConsumer[elem] = this.input[elem];
        }
        return newConsumer;
    }
}