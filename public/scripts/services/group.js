//drag and drop service
angular.module("metroApp").factory("Group", function ($resource) {
    return $resource('group/:id', {}, {
        update: {
            method: 'PUT'
        }
    });
});