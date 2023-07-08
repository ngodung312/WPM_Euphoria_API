/**
 * Created by s3lab. on 1/13/2017.
 */
'use strict';

const genRandomString = function ( length )
{
    let sResult = "";
    const sPossible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( let i = 0; i < length; i++ ) {
        sResult += sPossible.charAt(Math.floor(Math.random() * sPossible.length));
    }
    return sResult;
};

const genRandomStringOfNumber = function ( length )
{
    let sResult = "";
    const sPossible = "0123456789";

    for( let i = 0; i < length; i++ ) {
        sResult += sPossible.charAt(Math.floor(Math.random() * sPossible.length));
    }
    return sResult;
};

// type: string, number, object, function, undefined, boolean
/**
 * @return {boolean}
 */
const VariableBaseTypeChecking = function ( value, type, length )
{
    let bResult;
    let minLength = 0;
    if(length !== null && length !== undefined){
        minLength = length;
    }
    bResult = !(typeof value !== type || value == null || value.length <= minLength);
    return bResult;
};

/**
 * @return {boolean}
 */
const VariableEnumChecking = function ( value, arrayData )
{
    let bResult;
    if( !VariableBaseTypeChecking(value, 'string') ){
        bResult = false;
    }else{
        bResult = !((arrayData.indexOf(value) < 0) && (arrayData.indexOf(value.toUpperCase()) < 0));
    }
    return bResult;
};

/**
 * @return {boolean}
 */
const ValidObjectEnum = function ( value, object )
{
    let result = false;
    for(const propertyName in object) {
        if(value === object[propertyName]){
            result = true;
            break;
        }
    }
    return result;
};

const safelyParseJSON = function (json) {
    let parsed;
    try {
        parsed = JSON.parse(json);
    } catch (e) {
        parsed = null;
    }finally {
        if(parsed === null || typeof parsed === "undefined"){
            parsed = json;
        }
    }
    return parsed;
};

const safelyParseJSON1 = function (json) {
    let parsed;
    try {
        parsed = JSON.parse(json);
    } catch (e) {
        parsed = null;
    }finally {
        if( (parsed === null) || (typeof parsed === "undefined") ){
            parsed = null;
        }
    }
    return parsed;
};

const splitAndAssignValueForKey = function (availableObject, stringArray, assignValue) {
    let oReturn = availableObject;
    if( VariableBaseTypeChecking(stringArray, 'string')){
        let keyArray = stringArray.split(",");
        let i;
        for(i = 0; i < keyArray.length; i++) {
            if(oReturn && !oReturn[keyArray[i]]) {
                oReturn[keyArray[i]] = assignValue;
            }
        }
    }
    return oReturn;
};

const splitAndAssignValueForSort = function (availableObject, stringArray) {
    if( VariableBaseTypeChecking(stringArray, 'string') ){
        let keyArray = stringArray.split(",");
        let iValue;
        let i;
        //if(keyArray && keyArray.length > 0){
        //    if(availableObject === null){
        //        availableObject = {};
        //    }
        //}
        for(i = 0; i < keyArray.length; i++) {
            // - -> DESC | ASC
            if(keyArray[i].charAt(0)==='-'){
                keyArray[i] = keyArray[i].substr(1);
                //iValue = -1;
                iValue = 'DESC';
            }else {
                //iValue = 1;
                iValue = 'ASC';
            }
            //availableObject[keyArray[i]] = iValue;
            availableObject.push([keyArray[i], iValue]);
        }
    }
};

const pushArrayIfNotExist = function (objectArray, element) {
    try {
        if( !objectArray ){
            objectArray = [];
            objectArray.push(element);
        }else{
            let i;
            for(i = 0; i < objectArray.length; i++) {
                if(objectArray[i].id && element.id && objectArray[i].id.toString() === element.id.toString()) {
                    break;
                }
            }
            if(i === objectArray.length){
                objectArray.push(element);
            }
        }
    } catch (e) {
        return null;
    }
    return objectArray;
};

// add if not exist, if exist -> replace
const pushArrayIfNotExistExt = function (objectArray, key, element ) {
    try {
        if( !objectArray ){
            objectArray = [];
            objectArray.push(element);
        }else{
            let i;
            for(i = 0; i < objectArray.length; i++) {
                if(key){
                    if(objectArray[i][key] && element[key] && (objectArray[i][key].toString() === element[key].toString()) ) {
                        objectArray.splice(i, 1);
                        objectArray.push(element);
                        break;
                    }
                }else{
                    if(objectArray[i] && element && objectArray[i].toString() === element.toString()) {
                        objectArray.splice(i, 1);
                        objectArray.push(element);
                        break;
                    }
                }
            }
            if(i === objectArray.length){
                objectArray.push(element);
            }
        }
    } catch (e) {
        return null;
    }
    return objectArray;
};

const pullArrayIfExist = function (objectArray, elementId) {
    try {
        if(objectArray && objectArray.length > 0) {
            for (let i = 0; i < objectArray.length; i++) {
                let obj = objectArray[i];
                if (obj.id && elementId && obj.id.toString() === elementId.toString()) {
                    objectArray.splice(i, 1);
                    i--;
                }
            }
        }
    } catch (e) {
        return null;
    }

    return objectArray;
};

const pullArrayIfExistExt = function (objectArray, key, value) {
    try {
        if(objectArray && objectArray.length > 0) {
            for (let i = 0; i < objectArray.length; i++) {
                let obj = objectArray[i];
                if (obj[key] && value && obj[key].toString() === value.toString()) {
                    objectArray.splice(i, 1);
                    i--;
                }
            }
        }
    } catch (e) {
        return null;
    }
    return objectArray;
};

const pullArrayKeepExist = function (objectArray, key, value) {
    try {
        if(objectArray && objectArray.length > 0) {
            for (let i = 0; i < objectArray.length; i++) {
                let obj = objectArray[i];
                if (obj[key] && value && obj[key].toString() !== value.toString()) {
                    objectArray.splice(i, 1);
                    i--;
                }
            }
        }
    } catch (e) {
        return null;
    }
    return objectArray;
};

const findInArray = function (objectArray, findKey, findValue, resultKey) {
    let result = null;
    try {
        if(objectArray && objectArray.length > 0) {
            for (let i = 0; i < objectArray.length; i++) {
                let obj = objectArray[i];
                if (obj[findKey] && findValue && obj[findKey].toString() === findValue.toString()) {
                    result = obj[resultKey];
                    break;
                }
            }
        }
    } catch (e) {
        return null;
    }
    return result;
};

const getClientIP = function (req) {
    let result = null;
    try {
        result = (req.headers['x-forwareded-for'] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress);
        if(result){
            result = result.split(",")[0];
        }
        return result;
    } catch (e) {
        return null;
    }
};

const validPayLevel = function(payLevel, expiredDate) {
    try {
        let result = payLevel;
        let curDate = new Date();
        if(payLevel === null || expiredDate === null){
            return 'FREE';
        }
        switch (payLevel) {
            case 'COPPER':
                if (expiredDate.getTime() <= curDate.getTime()) {
                    result =  'FREE';
                }
                break;
            case 'SILVER':
                if (expiredDate.getTime() <= curDate.getTime()) {
                    result =  'FREE';
                }
                break;
            case 'GOLD':
                if (expiredDate.getTime() <= curDate.getTime()) {
                    result =  'FREE';
                }
                break;
            case 'DIAMOND':
                if (expiredDate.getTime() <= curDate.getTime()) {
                    result =  'FREE';
                }
                break;
            case 'FREE':
            default:
                result =  'FREE';
                break;
        }
    }catch(error){
        return 'FREE';
    }
};

const validAddingDevice = function(userId, userRight, payLevel, curDeviceNo, expiredDate) {
    let result = false;
    try {
        let maxDevice = 1;
        let curDate = new Date();
        switch (userRight) {
            case 'ANONYMOUS':
                result = false;
                break;
            case 'END_USER':
                switch (payLevel) {
                    case 'COPPER':
                        if (expiredDate.getTime() <= curDate.getTime()) {
                            maxDevice = (global.CLOUD_API.Config.MAX_DEVICE?global.CLOUD_API.Config.MAX_DEVICE:1);
                            if (curDeviceNo < maxDevice) {
                                result = true;
                            }
                        } else {
                            maxDevice = (global.CLOUD_API.Config.MAX_DEVICE1?global.CLOUD_API.Config.MAX_DEVICE1:1);
                            if (curDeviceNo < maxDevice) {
                                result = true;
                            }
                        }
                        break;
                    case 'SILVER':
                        if (expiredDate.getTime() <= curDate.getTime()) {
                            maxDevice = (global.CLOUD_API.Config.MAX_DEVICE?global.CLOUD_API.Config.MAX_DEVICE:1);
                            if (curDeviceNo < maxDevice) {
                                result = true;
                            }
                        } else {
                            maxDevice = (global.CLOUD_API.Config.MAX_DEVICE2?global.CLOUD_API.Config.MAX_DEVICE2:1);
                            if (curDeviceNo < maxDevice) {
                                result = true;
                            }
                        }
                        break;
                    case 'GOLD':
                        if (expiredDate.getTime() <= curDate.getTime()) {
                            maxDevice = (global.CLOUD_API.Config.MAX_DEVICE?global.CLOUD_API.Config.MAX_DEVICE:1);
                            if (curDeviceNo < maxDevice) {
                                result = true;
                            }
                        } else {
                            maxDevice = (global.CLOUD_API.Config.MAX_DEVICE3?global.CLOUD_API.Config.MAX_DEVICE3:1);
                            if (curDeviceNo < maxDevice) {
                                result = true;
                            }
                        }
                        break;
                    case 'DIAMOND':
                        if (expiredDate.getTime() <= curDate.getTime()) {
                            maxDevice = (global.CLOUD_API.Config.MAX_DEVICE?global.CLOUD_API.Config.MAX_DEVICE:1);
                            if (curDeviceNo < maxDevice) {
                                result = true;
                            }
                        } else {
                            maxDevice = (global.CLOUD_API.Config.MAX_DEVICE4?global.CLOUD_API.Config.MAX_DEVICE4:1);
                            if (curDeviceNo < maxDevice) {
                                result = true;
                            }
                        }
                        break;
                    case 'FREE':
                    default:
                        maxDevice = (global.CLOUD_API.Config.MAX_DEVICE?global.CLOUD_API.Config.MAX_DEVICE:1);
                        if (curDeviceNo < maxDevice ) {
                            result = true;
                        }
                        break;
                }
                break;
            case 'AGENT':
                result = true;
                break;
            case 'MASTER':
                result = true;
                break;
            case 'MODERATOR':
                result = false;
                break;
            case 'ADMIN':
            case 'SUPER_ADMIN':
                result = true;
                break;
            default:
                break;

        }

        // demo, dohchung
        if( userId =='592d1d91b138731350b1d2ff'
            || userId =='5b697267b6a5490c2e0b344e'){
            result = true;
        }
        return result;
    }catch(error){
        console.log(error);
        return result;
    }
};

const dateDiffByMonths = function(oDate1, oDate2) {
    let iMonths;
    iMonths = (oDate2.getFullYear() - oDate1.getFullYear()) * 12;
    iMonths -= oDate1.getMonth() + 1;
    iMonths += oDate2.getMonth();
    return iMonths <= 0 ? 0 : iMonths;
};

const dateDiffByHours = function(oDate1, oDate2) {
    return ( Math.abs(oDate2 - oDate1) / 36e5 );
};

const dateDiffByDays = function(oDate1, oDate2) {
    return (Math.abs(oDate2 - oDate1) / 8.64e7);
};

const dateDiffByYears = function(oDate1, oDate2) {
    return ( oDate2.getFullYear() - oDate1.getFullYear() );
};

module.exports = {
    pullArrayKeepExist,
    pushArrayIfNotExist,
    pushArrayIfNotExistExt,
    pullArrayIfExist,
    pullArrayIfExistExt,
    genRandomString,
    genRandomStringOfNumber,
    safelyParseJSON,
    safelyParseJSON1,
    VariableBaseTypeChecking,
    VariableEnumChecking,
    ValidObjectEnum,
    findInArray,
    splitAndAssignValueForKey,
    splitAndAssignValueForSort,
    getClientIP,
    dateDiffByMonths,
    dateDiffByHours,
    dateDiffByDays,
    dateDiffByYears,
    validAddingDevice,
    validPayLevel
};
