/**
 * Created by s3lab. on 1/17/2017.
 */
const DELETED = {
    NO: 0,
    YES: 1
};

const ACTIVATED = {
    NO: 0,
    YES: 1
};

const SYSTEM = {
    NO: 0,
    YES: 1
};

const USER_ROLE = {
    GUEST: 1,
    EVENT_HOST: 2,
    MANAGER: 3,
    ADMIN: 4,
};

const DISH_TYPE = {
    APPETIZER: 1,
    MAIN: 2,
    DESSERT: 3,
};

module.exports = {
    DELETED,
    ACTIVATED,
    USER_ROLE,
    DISH_TYPE,
    SYSTEM,
    THUMBNAIL_NAME_SUFFIX:'_thumb',
    CONTENT_TYPE_ENUM: ['*', 'bestProduct','video','advertiseText'],
    MAX_ASSET_SIZE_ALLOW: 1073741824,
    MAX_THUMB_SIZE_ALLOW: 1048576,
    DEFAULT_PAGING_SIZE: 25,
    DEFAULT_USER: 1
};
