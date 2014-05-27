//drag and drop service
angular.module("metroApp").factory("User", function ($resource) {
    return $resource('user/:id', {}, {
        login: {
            method: 'POST',
            url: 'user/auth',
            responseType: 'json'
        },
        populate: {
            method: 'POST',
            url: 'user/populate',
            responseType: 'json',
            transformResponse: function (user, headersGetter) {
                user.groups.forEach(function (group) {
                    group.tiles.forEach(function (tile) {
                        tile._id = tile.app._id;
                        tile.title = tile.app.title;
                        tile.identity = tile.app.identity;
                        delete tile.app;
                    });
                });
                return user;
            }
        }
    });
});