/**
 * 날짜를 원하는 구분자로 출력한다.
 * @param {*} date 
 * @param {*} delimiter 
 */
const convertDate = (date, delimiter) => {
    if(date == undefined || date == null){
        return '';
    }
    if(date.length != 8){
        return date;
    }
    if(delimiter === undefined){
        delimiter = '.';
    }
    let year = date.substring(0,4);
    let month = date.substring(4,6);
    let day = date.substring(6,8)
    return year + delimiter + month + delimiter + day ; 
}

const convertGermanStyleDate = (date, delimiter) => {
    if(date == undefined || date == null){
        return '';
    }
    if(date.length != 8){
        return date;
    }
    if(delimiter === undefined){
        delimiter = '.';
    }
    let year = date.substring(0,4);
    let month = date.substring(4,6);
    let day = date.substring(6,8)
    return day + delimiter + month + delimiter + year ; 
}

const convertKoreanStyleDate = (date) => {
    if(date == undefined || date == null){
        return '';
    }
    if(date.length != 8){
        return date;
    }
    let year = date.substring(0,4);
    let month = date.substring(4,6);
    let day = date.substring(6,8)
    return year + '년 ' + month + '월 ' + day + '일' ; 
}

/**
 * 문서정보맵에서 원하는 값을 찾아준다.
 * @param {*} documentInfo 
 * @param {*} itemId 
 */
const findItemValue = (documentInfo, itemId) => {
    if(!documentInfo) return '';
    try {
        for(let i=0; i<documentInfo.length; i++){
            let doc = documentInfo[i];            
            if(doc.itemId === itemId){
                return doc.itemValue;
            }
        }
    } catch (error) {
        Log.error(`값을 찾을 수 없음`);
        return null;
    }
}

const getDocuNo = (issued) => {
    return issued.issuedDate + '-' + issued.documentType + '-' + issued.seqNo
}

/**
 * 납입증명서, 기부금영수증에 들어거는 기간
 */
const getDuration = () => {
    const delimiter = '.';
    let d = new Date();
    let month = d.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    let day = d.getDate();
    day = day < 10 ? "0"+day : day;
    let currentDate = month + delimiter + day + delimiter + d.getFullYear() ; 
    let duration = "01.01." + d.getFullYear();
    return duration += " ~ " + currentDate; 
}

/**
 * 유로화 형식으로 출력한다.
 * @param {*} a 
 */
const money =  (a) => {
    let result =  parseFloat(a);
    result = result.toFixed(2);
    result = result.split('.')[0].replace(/,/gi, ".") + ',' + result.split('.')[1]
    return result;
}

/**
 * 기부금영수증에서 금액의 유로화 단위의 숫자를 문자로 변경한다.
 * @param {*} money 
 */
const moneyString = (money) => {
    let temp = new String(money);
    let left = temp.split(".")[0];
    let right = temp.split(".")[1];
    let arr = left.split("");
    let element = [];
    for(let i=0; i<arr.length; i++){
      switch(parseInt(arr[i])){
        case 0: element.push("null"); break;
        case 1: element.push("eins"); break;
        case 2: element.push("zwei"); break;
        case 3: element.push("drei"); break;
        case 4: element.push("vier"); break;
        case 5: element.push("fünf"); break;
        case 6: element.push("sechs"); break;
        case 7: element.push("sieben"); break;
        case 8: element.push("acht"); break;
        case 9: element.push("neun"); break;
      }//switch
    }//for
    left = element.join("-");
    
    money = left + "," + right;
    return money;
  }

module.exports = {
    convertDate,
    findItemValue,
    money,
    convertGermanStyleDate,
    convertKoreanStyleDate,
    getDuration,
    getDocuNo,
    moneyString
}