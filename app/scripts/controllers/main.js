'use strict';

angular.module('metroApp')
    .controller('MainCtrl', function ($scope, grid) {
        $scope.groups = grid.groups;
    });
