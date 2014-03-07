'use strict';

angular.module('metroApp')
    .controller('MainCtrl', function ($scope, apps) {
        $scope.groups = apps;
    });
