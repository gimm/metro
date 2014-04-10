angular.module("metroApp").directive("group", function (grid) {
    return {
        restrict: "A",
        transclude: true,
        replace: true,
//        scope:{
//            group: "="
//        },
        templateUrl: "templates/group.html",
        controller: function ($scope, $element, reorder) {
            var root = $element[0];
            this.start = function (dragged) {
                reorder.init(dragged, $scope);
                $scope.dragged = dragged;
            };

            this.enter = function (entered) {
                reorder.enter(entered);
            };
            this.leave = function (leaved) {
                reorder.leave(leaved);
            };
            this.drop = function (dropped) {
                var dragged = root.querySelector("[data-app-id='"+reorder.dragged+"']");
                var dropped = root.querySelector("[data-app-id='"+dropped+"']");
                console.log("drop", reorder.dragged, dropped);
                //check cords from apps
            };
        },
        link: function(scope, element, attrs) {
//            var layout = grid.render(scope.group.id);
//
//            scope.size = layout.size;
//            scope.items = layout.items;
        }
    }
})