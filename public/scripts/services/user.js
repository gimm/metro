//drag and drop service
angular.module("metroApp").factory("User", function ($resource) {
    return $resource('user/:id', {}, {
        login: {
            method: 'POST',
            url: 'user/login',
            responseType: 'json'
        },
        tiles: {
            method: 'GET',
            url: 'user/tiles',
            isArray: true,
            responseType: 'json',
            transformResponse: function (groups, headersGetter) {
                console.log(groups);
                groups.forEach(function (group) {
                    group.tiles.forEach(function (tile) {
                        tile._id = tile.app._id;
                        tile.title = tile.app.title;
                        tile.identity = tile.app.identity;
                        delete tile.app;
                    });
                });
                return groups;
            }
        }
    });
});