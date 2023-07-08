/**
 * Created by Ngo Le Hanh Dung on 2023-03-20.
 **/

let APIROOT_URL;
let WEBROOT_URL;
let FILE_BUCKET;

if (process.env.NODE_ENV === 'production') {
    APIROOT_URL = 'http://localhost:8000/';
    WEBROOT_URL = 'http://localhost:8000/';
    FILE_BUCKET = 'https://wpm-images.s3.ap-southeast-1.amazonaws.com';
} else {
    APIROOT_URL = 'http://localhost:8000/';
    WEBROOT_URL = 'https://localhost:8000/';
    FILE_BUCKET = 'https://wpm-images.s3.ap-southeast-1.amazonaws.com';
}

module.exports = {
    https: false,
    appname: 'wpm_api',
    port: process.env.PORT || 8000,
    url: APIROOT_URL,
    weburl: WEBROOT_URL,
    fileurl: FILE_BUCKET,
    jwtAuthKey: 'nlhdwpmuitbcusmeraldo',
    sockIOAuthKey: 'fhskjfenfnhpploemjase',
    paths:{
        public: '/public',
        tmp: '/tmp',
        userdata: '/userdata',
        devicedata: '/devicedata',
        snapshot: '/snapshot',
        avatar: '/avatar',
        docs:'/docs',
        tag:'/tag'
    },
    redis: {
        host: '',
        port: '',
        password: ''
    },
    s3BucketName: 'wpm-images',
    aws: {
        accessKeyId: 'AKIAXIKRGTDGPNTFHMHV',
        secretAccessKey: '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',
        region: 'ap-southeast-1',
        signatureVersion: 'v4'
    },
    socialNetwork: {
        // OAuth 2.0
        facebook:{
            key: process.env.FACEBOOK_OAUTH_KEY || '',
            secret: process.env.FACEBOOK_OAUTH_SECRET || ''
        },
        google:{
            key: process.env.GOOGLE_OAUTH_KEY || '',
            secret: process.env.GOOGLE_OAUTH_KEY || ''
        },
        github:{
            key: process.env.GITHUB_OAUTH_KEY || '',
            secret: process.env.GITHUB_OAUTH_SECRET || ''
        },
        twitter: {
            key: process.env.TWITTER_OAUTH_KEY || '',
            secret: process.env.TWITTER_OAUTH_SECRET || ''
        },
        tumblr: {
            key: process.env.TUMBLR_OAUTH_KEY || '',
            secret: process.env.TUMBLR_OAUTH_SECRET || ''
        },
        instagram: {
            key: process.env.INSTAGRAM_OAUTH_KEY || '',
            secret: process.env.INSTAGRAM_OAUTH_SECRET || ''
        },
        linkedin: {
            key: process.env.LINKEDIN_OAUTH_KEY || '',
            secret: process.env.LINKEDIN_OAUTH_SECRET || ''
        }
    }
};
