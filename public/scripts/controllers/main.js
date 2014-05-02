'use strict';

angular.module('metroApp')
    .controller('MainCtrl', function ($scope, grid) {
        grid.render();
        $scope.size = grid.size;
        $scope.groups = grid.groups;
        $scope.operation = 'none';
        $scope.dragged = undefined;

        $scope.clicked = function () {
            console.log('clicked!!');
            $scope.operation = 'none';
            delete $scope.tile.selected;
        };

        $scope.coords = function (tile) {
            var r = (tile.order - 1) % grid.MAX_ROW;
            var c = Math.floor((tile.order - 1) / grid.MAX_ROW) * 2;
            if (tile.side === 'right') {
                c += 1;
            }

            return ['s' + tile.size, 'r' + r, 'c' + c].join(' ');
        };

        $scope.operate = function (appId, operation) {
            console.log('customize', appId);
            if(operation === 'customize'){
                if($scope.tile){
                    delete $scope.tile.selected;
                }
                $scope.tile = grid.byId(appId);
                $scope.tile.selected = true;
                grid.render();
            }
            $scope.$apply($scope.operation = operation);
            $scope.dragged = grid.byId(appId);
        };

        $scope.resize = function () {
            if($scope.tile.size === 1){
                $scope.tile.size = 2;
            }else{
                $scope.tile.size = 1;
            }
            console.log('resize', $scope.tile);
//            $scope.$apply();
        };

        $scope.enter = function (appId) {
            var dragged = $scope.dragged;
            var dropped = grid.byId(appId);

            var draggedCopy = angular.copy(dragged);
            var droppedCopy = angular.copy(dropped);

            var draggedGroup = grid.byGroup(dragged.group);
            var droppedGroup = grid.byGroup(dropped.group);

            var increase = true;
            var start = dropped.order;
            var end = Number.MAX_VALUE;

            if (dragged.group === dropped.group) {
                if (dragged.order > dropped.order) {
                    increase = true;
                    start = dropped.order;
                    end = dragged.order;
                } else {
                    increase = false;
                    start = dragged.order;
                    end = dropped.order;
                }

                if (dragged.size === 2) {
                    angular.forEach(draggedGroup, function (tile) {
                        if (tile.order >= start && tile.order <= end) {
                            if (increase) {
                                tile.order += 1;
                            } else {
                                tile.order -= 1;
                            }
                        }
                    });
                    dragged.order = increase ? start : end;
                } else {//dragged =1
                    if (dropped.size === 1) {//dragged =1, dropped =1
                        if (dragged.order === dropped.order) {//right left switch between row
                            if(dragged.side !== dropped.side){
                                dragged.side = droppedCopy.side;
                                dropped.side = draggedCopy.side;
                            }
                        } else if (grid.isSingle(dropped)) {//target row has free space
                            dropped.side = 'right';
                            dragged.side = 'left';
                            if(grid.isSingle(dragged)){
                                start = dragged.order + 1;
                                console.log(start);
                                angular.forEach(draggedGroup, function (tile) {
                                    if (tile.order >= start) {
                                        tile.order -= 1;
                                    }
                                });
                            }
                            dragged.order = dropped.order;
                        } else {//target row is full
                            angular.forEach(draggedGroup, function (tile) {
                                if (tile.order >= start && tile.order <= end) {
                                    if (increase) {
                                        tile.order += 1;
                                    } else {
                                        tile.order -= 1;
                                    }
                                }
                            });
                            dragged.order = droppedCopy.order;
                        }
                    } else {//dragged =1, dropped =2
                        if (grid.isSingle(dragged)) {//dragged row is full
                            angular.forEach(draggedGroup, function (tile) {
                                if (tile.order >= start && tile.order <= end) {
                                    if (increase) {
                                        tile.order += 1;
                                    } else {
                                        tile.order -= 1;
                                    }
                                }
                            });
                            dragged.order = increase ? start : end;
                        } else {
                            start = dropped.order;
                            angular.forEach(draggedGroup, function (tile) {
                                if (tile.order >= start) {
                                    tile.order += 1;
                                }
                            });
                            dragged.order = start;
                        }
                    }
                }
            } else {
                if(dragged.size === 2){
                    angular.forEach(draggedGroup, function (tile) {
                        if (tile.order > draggedCopy.order) {
                            tile.order -= 1;
                        }
                    });
                    angular.forEach(droppedGroup, function (tile) {
                        if (tile.order >= droppedCopy.order) {
                            tile.order += 1;
                        }
                    });
                    dragged.group = dropped.group;
                    dragged.order = droppedCopy.order;
                }else {
                    if(grid.isSingle(dragged)){
                        angular.forEach(draggedGroup, function (tile) {
                            if (tile.order > draggedCopy.order) {
                                tile.order -= 1;
                            }
                        });
                    }
                    if(dropped.size === 2 || !grid.isSingle(dropped)){
                        angular.forEach(droppedGroup, function (tile) {
                            if (tile.order >= droppedCopy.order) {
                                tile.order += 1;
                            }
                        });
                    }else{
                        dragged.side = 'left';
                        dropped.side = 'right';
                    }
                    dragged.group = dropped.group;
                    dragged.order = droppedCopy.order;
                }
            }
            $scope.$apply(grid.render());
        };
        $scope.drop = function (appId) {
            $scope.enter(appId);
            console.log('drop', appId);
            $scope.$apply($scope.operation = 'none');
        };
    });
