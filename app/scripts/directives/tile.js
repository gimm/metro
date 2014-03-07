'use strict';

angular.module('metroApp')
    .directive('tile', function () {
        return {
            priority: -1,
            transclude: true,
            replace: true,
            templateUrl: "templates/tile.html",
            restrict: 'E',
            require: "^group",
            scope: {
                tConfig: "="
            },
            link: function postLink(scope, element, attrs) {
            }
        };
    });
