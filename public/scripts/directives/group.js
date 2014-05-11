angular.module("metroApp").directive("group", function (grid) {
    return {
        restrict: "A",
        transclude: true,
        replace: true,
//        scope:{
//            group: "="
//        },
        templateUrl: "templates/group.html",
        controller: function ($scope, $element) {

        },
        link: function(scope, element, attrs) {
//            var layout = grid.render(scope.group.id);
//
//            scope.size = layout.size;
//            scope.items = layout.items;
        }
    }
})