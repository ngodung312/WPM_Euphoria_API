/**
 * Created by s3lab. on 1/13/2017.
 */
const Rest = require('../utils/Restware');

// CORS related  http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
module.exports = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, HEAD, PATCH, OPTIONS');
    res.header('Access-Control-Expose-Headers', 'Content-Length, X-Access-Token');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, Content-Length, Content-Language, X-Requested-With, Range, Origin, X-Access-Token');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        //const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        if(global.CLOUD_API.Config.SERVER_MAINTENANCE && global.CLOUD_API.Config.SERVER_MAINTENANCE === true){
            let resData = {};
            resData.code = 50323;
            resData.message = 'Server Maintenance';
            return Rest.sendSuccessOne(res, resData, 503);
        }else{
            return next();
        }
    }
};
