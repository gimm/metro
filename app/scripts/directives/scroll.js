'use strict';

angular.module('metroApp')
    .directive('scroll', function ($document) {
        return {
            restrict: 'A',

            link: function (scope, element, attrs) {
                $document.on("wheel", function (e) {
                    scroll(element[0], e.deltaY);
                    console.log("scroll1", e.deltaX, e.deltaY, e.wheelDelta, e.detail);
                });
                $document.on("keydown", function (e) {
                    scroll(element[0], e.deltaY);
                    console.log("keydown1", e);
                });

            }
        };
        function scroll(element, delta) {
            element.scrollLeft += delta;
        }
    });
