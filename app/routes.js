/**
 * Created by Ngo Le Hanh Dung. on 2023-03-17.
 **/
module.exports = function (app) {
    require('./route/User')(app);
    require('./route/Dish')(app);
    require('./route/Menu')(app);
    require('./route/MenuItem')(app);
    require('./route/Hall')(app);
    require('./route/Map')(app);
    require('./route/Event')(app);
    require('./route/EvtItem')(app);
    require('./route/EvtExpense')(app);
    require('./route/RestaurantInfo')(app);
    require('./route/WeddingPageInfo')(app);
    require('./route/Album')(app);
    require('./route/Image')(app);
    require('./route/RsvpGuest')(app);
};
