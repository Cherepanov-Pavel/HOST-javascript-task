export default class CoockieToConsumerMapper {
    constructor(cookie, consumer) {
        this.cookie = cookie;
        this.consumer = consumer;
    }

    map(){
        let consumerList = [];
        for (let number in this.cookie) {
            let newConsumer = new this.consumer();
            let consumerObj = JSON.parse(this.cookie[number]);
			if(typeof consumerObj == "object"){
				for(let elem in consumerObj ) {
					newConsumer[elem] = consumerObj[elem];
				}
				consumerList.push(newConsumer);
			}
        }
        return consumerList;
    }
}