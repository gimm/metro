angular.module("metroApp").directive("group", function (grid) {
    return {
        restrict: "A",
        transclude: true,
        replace: true,

        templateUrl: "templates/group.html",
        controller: function ($scope, $element) {
            $scope.tell = function () {
                console.log('group directive function:', $scope.title);
            };
        },
        link: function(scope, element, attrs) {
        }
    }
})