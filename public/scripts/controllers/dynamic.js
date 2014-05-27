'use strict';

angular.module('metroApp')
    .controller('DynamicCtrl', function ($scope, $routeParams) {
        var identity = $routeParams.app;
        $scope.templateUrl = 'xxx.html';
    });
