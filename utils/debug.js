const { logger } = require("./log")

const PROD = false;
const DEBUG = true;

const time = () => {
    let now = new Date();
    let month = now.getMonth()>9 ? now.getMonth() : "0" + now.getMonth();
    let day = now.getDay()+1 > 9 ? now.getDay()+1 : "0" + (now.getDay()+1);
    return `${now.getFullYear()}/${month}/${day} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}}`;
}

/**
 * 디버깅 로그 출력
 * @param {*} str 
 */
const print = (str) => {
    if(DEBUG){
        try {
            console.log(`[${time()}] ${str}`);
            logger.info(`[${time()}] ${str}`);     
        } catch (error) {
            console.error(`[${time()}] ${error}`);
            logger.error(`[${time()}] ${error}`); 
        }
    }
}

/**
 * 에러 로그 출력
 * @param {*} str 
 */
const error = (error) => {
    logger.error(`[${time()}] ${error}`); 
}

module.exports = {
    print,
    error    
}