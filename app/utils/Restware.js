/**
 * Created by s3lab. on 1/13/2017.
 */
'use strict';

// our components 
const Config = require('../config/Global');

// third party components
const Fs = require('fs');

const sendSuccessOne = function (res, data, iHttpCode) {
    if (!res) {
        return;
    }

    let httpStatus = iHttpCode ? iHttpCode : 200;
    let out = {};

    if(data){
        out.data = data;
    }

    out.message = '';
    out.result = 'ok';

    if (process.env.NODE_ENV !== 'production') {
        console.log(out);
    }

    res.status(httpStatus);
    res.contentType('json');

    return res.json(out);
};

const sendSuccessMany = function (res, data, iHttpCode) {
    if (!res) {
        return;
    }

    let httpStatus = iHttpCode ? iHttpCode : 200;
    let out = {};

    if(data){
        out = data;
    }

    out.message = '';
    out.result = 'ok';

    if (process.env.NODE_ENV !== 'production') {
        console.log(out);
    }

    res.status(httpStatus);
    res.contentType('json');

    return res.json(out);
};

const sendSuccessDownload = function (res, absPath, isUrl) {
    let bFail = true;
    if (!res) {
        return;
    }

    if(isUrl){
        if(absPath && typeof absPath === 'string'){
            const result = absPath.replace('storage.googleapis.com/', '');
            res.status(200);
            bFail = false;
            return res.redirect(result);
        }
    }else{
        if(Fs.existsSync(absPath)){
            res.status(200);
            bFail = false;
            return res.download(absPath);
        }
    }

    if( bFail ){
        res.status(400);
        res.contentType('json');
        let out = {};
        out.code = 5002;
        out.message = 'unavailable_file';
        out.desc = 'the file does not exist';

        if (process.env.NODE_ENV !== 'production') {
            console.log(out);
        }
        return res.json(out);
    }
};

const sendSuccessWebContent = function (res, data, iHttpCode) {
    if (!res) {
        return;
    }

    let httpStatus = iHttpCode ? iHttpCode : 200;
    let out = {};

    if( data ){
        out = data;
    }

    res.status(httpStatus);
    res.contentType('text/html');
    return res.end(out);
};

const sendSuccessToken = function (res, token, user) {
    if (!res) {
        return;
    }

    let out = {};
    let data = {};

    data.token = token;
    data.id = user.id;
    data.username = user.username;
    data.fullName = user.fullName;
    data.email = user.email;
    data.phoneNumber = user.phoneNumber;
    data.avatar = user.avatar;
    data.userRole = user.userRole;
    data.bucketUrl = Config.fileurl;
    data.awsConfig = Config.aws;
    data.s3BucketName = Config.s3BucketName;

    out.data = data;
    out.message = '';
    out.result = 'ok';

    if (process.env.NODE_ENV !== 'production') {
        console.log(out);
    }

    res.status(200);
    res.contentType('json');
    return res.json(out);
};

const sendError = function (res, code, message, httpCode, description, errors) {
    if (!res) {
        return;
    }

    let out = {};
    out.code = code;
    out.message = message ? message.toString() : "none";

    if (process.env.NODE_ENV !== 'production') {
        if (description) {
            out.desc = description.toString();
        } else if (errors) {
            out.errors = errors;
        }
    }

    console.log(out);

    let status = httpCode ? httpCode : 500;

    res.status(status);
    res.contentType('json');
    return res.json(out);
};

module.exports = {
    sendSuccessOne,
    sendSuccessMany,
    sendError,
    sendSuccessToken,
    sendSuccessDownload,
    sendSuccessWebContent
};
