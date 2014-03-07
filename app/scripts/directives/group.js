angular.module("metroApp").directive("group", function () {
    return {
        restrict: "E",
        transclude: true,
        replace: true,
        scope:{
            gConfig: "="
        },
        templateUrl: "templates/group.html",
        link: function(scope, element, attrs) {
            var tiles = scope.gConfig.tiles;

            var layout = {};

            //group's default row and column number, starts from 0
            var maxRow = 2;
            var maxCol = 2;
            //sort tiles by cords, meanwhile get the max cord-x

            angular.forEach(tiles, function (tile) {
                var row = tile.cords[0];
                var col = tile.cords[1];
                maxCol = maxCol > col ? maxCol : col;
                layout["cords"+row+col] = tile;
                if(tile.size ==2){
                    //occupied, but don't need placeholder
                    layout["cords"+row+(col+1)] = false;
                }
            });

            scope.size = maxCol+1;

            for(var x=0; x<=maxRow; x++){
                for(var y=0; y<=maxCol; y++){
                    if(!layout.hasOwnProperty("cords"+x+y)){
                        layout["cords"+x+y] = {"cords": [x, y]};
                    }
                }
            }

            var tilesAndPlaceholders = [];
            angular.forEach(layout, function (tile) {
                if(angular.isObject(tile)){
                    tilesAndPlaceholders.push(tile);
                }
            })

            scope.layout = tilesAndPlaceholders;
            console.log(layout);

        },
        controller: function ($scope, $element, $attrs, $transclude) {
        }

    }
})