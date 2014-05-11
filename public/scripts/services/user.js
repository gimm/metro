//drag and drop service
angular.module("metroApp").factory("User", function ($resource) {
    return $resource('user/:id', {}, {
        login: {
            //TODO need a customized url here!
            method: 'POST',
            url: 'login'
        }
    });
});