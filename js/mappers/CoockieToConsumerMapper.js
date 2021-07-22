/*
    класс CookieToConsumerMapper предназначен для преобразование данных из Coockie в массив объектов Consumer
 */
export default class CoockieToConsumerMapper {


    constructor(cookie, consumer) {

        this.cookie = cookie; //данные из coockie

        this.consumer = consumer; // класс Consumer

    }

    map(){
        let consumerList = [];
        // в цикле перебираем массив из cookie
        for (let number in this.cookie) {
            // создаём новый экземпляр класса Consumer
            let newConsumer = new this.consumer();
            // парсим данные из coockie, получаем ассоциативный массив
            let consumerObj = JSON.parse(this.cookie[number]);
			if(typeof consumerObj == "object"){
				// перебираем ассоциативный массив и заполняем данными экземпляр класса Consumer
				for(let elem in consumerObj ) {
					newConsumer[elem] = consumerObj[elem];
				}
				// добавляем получившийся Consumer в массив
				consumerList.push(newConsumer);
			}
        }
        return consumerList;
    }

}