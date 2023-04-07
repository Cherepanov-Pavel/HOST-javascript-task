export default class Cookies{

    setCookie(name, value) {
        document.cookie = name + "=" + value;
    }
    getCookie(name) {
        let r = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
        if (r) return r[2];
        else return "";
    }
    deleteCookie(name) {
        let date = new Date();
        date.setTime(date.getTime() - 1);
        document.cookie = name += "=; expires=" + date.toGMTString();
    }
    get_all_cookies() {
        let cookies = { };
        if (document.cookie && document.cookie != '') {
            let split = document.cookie.split(';');
            for (let i = 0; i < split.length; i++) {
                let name_value = split[i].split("=");
                name_value[0] = name_value[0].replace(/^ /, '');
                cookies[decodeURIComponent(name_value[0])] = decodeURIComponent(name_value[1]);
            }
        }
        return cookies;
    }

}