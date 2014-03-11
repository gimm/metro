'use strict';

angular.module('metroApp')
    .directive('tile', function () {
        return {
            transclude: true,
            replace: true,
            templateUrl: "templates/tile.html",
            restrict: 'E',
            require: "^group",
            scope: {
                tConfig: "="
            },
            link: function (scope, element, attrs) {
            }
        };
    });
