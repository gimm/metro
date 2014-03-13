'use strict';

angular.module('metroApp')
    .directive('scroll', function ($document) {
        return {
            restrict: 'A',

            link: function (scope, element, attrs) {
                var delta = 100;
                $document.on("wheel", function (e) {
                    var direction = e.deltaY > 0 ? 1 : -1;
                    scroll(element[0], delta*direction);
                });
                $document.on("keydown", function (e) {
                    var direction = 0;
                    if(e.keyCode==37 || e.keyCode==38){
                        direction = -1;
                    }else if(e.keyCode==39 || e.keyCode==40){
                        direction = 1;
                    }
                    direction && scroll(element[0], delta*direction);
                });

            }
        };
        function scroll(element, delta) {
            element.scrollLeft += delta;
        }
    });
