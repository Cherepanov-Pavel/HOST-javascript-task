/*
    класс Eroor слежит для описания соглашения, как должны выглядеть ошибки в нашем приложении
 */
export default class Error{

    constructor(errorField, errorText) {

        this.errorField = errorField;

        this.errorText = errorText;

    }

}