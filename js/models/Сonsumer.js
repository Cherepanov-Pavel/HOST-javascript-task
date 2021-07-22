import Error from '../vendor/Error.js';

/*
    класс Consumer является моделью потребителя, в конструкторе принимает набор его полей, а
    в методе validate проверяет данные поля на соответствие требованиям
 */

export default class Consumer {

    constructor(id, name, type, number) {

        this.id = id;

        this.name = name;

        this.type = type;

        this.number = number;

    }

    validate(){
        let errors = [];

        if(this.name === ''){
            errors.push(new Error('name', 'Поле обязательно к заполнению'));
        }else if(this.name.length > 255){
            errors.push(new Error('name', 'Имя не должно превышать 255 символов'));
        }
        if(this.number === ''){
            errors.push(new Error('number', 'Поле обязательно к заполнению'));
        }else if(isNaN(Number(this.number))){
            errors.push(new Error('number', 'В поле разрешено вводить только числа'));
        }else if(this.number.length !== 13){
            errors.push(new Error('number', 'В номере должно быть 13 цифр'));
        }
        return errors;
    }
}