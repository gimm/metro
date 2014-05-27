angular.module("metroApp").directive("group", function (metro) {
    return {
        restrict: "A",
        transclude: true,
        replace: true,

        templateUrl: "templates/group.html",
        controller: function ($scope, $element) {
            this.tileById = function(id){
                return $scope.group.tiles.filter(function (tile) {
                     return tile.identity === id;
                }).pop();
            };
            this.tell = function () {
                console.log('group directive function:', $scope.group.title);
            };
        },
        link: function(scope, element, attrs) {
        }
    }
});