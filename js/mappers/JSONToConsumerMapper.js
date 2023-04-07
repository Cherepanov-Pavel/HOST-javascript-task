export default class JSONToConsumerMapper {
    constructor(JSON, consumer) {
        this.JSON = JSON;
        this.consumer = consumer;
    }

    map(){
        let consumerList = [];
        for (let number in this.JSON) {
            let newConsumer = new this.consumer();
            for(let elem in this.JSON[number] ) {
                newConsumer[elem] = this.JSON[number][elem];
            }
            consumerList.push(newConsumer);
        }
        return consumerList;
    }
}