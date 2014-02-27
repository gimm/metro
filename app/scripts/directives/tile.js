'use strict';

angular.module('metroApp')
  .directive('tile', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the tile directive');
      }
    };
  });
