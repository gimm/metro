'use strict';

angular.module('metroApp')
    .controller('MainCtrl', function ($scope, grid) {
        grid.init();
        $scope.size = grid.vars.size;
        $scope.groups = grid.groups;
        $scope.operation = 'none';
        $scope.target = undefined;  //current tile

        $scope.clicked = function (event) {
            if($scope.operation === 'none' && event.button === 2){//enter customize mode
                $scope.operation = 'customize';
            }else{//reset mode to 'none'
                $scope.operation = 'none';
                if($scope.target){
                    delete $scope.target.selected;
                    delete $scope.target;
                }
            }
            console.log('panaroma clicked!!');
        };

        $scope.coords = function (tile) {
            var r = Math.floor((tile.order-1) % grid.MAX_ROW);
            var c = (Math.ceil(Math.floor(tile.order) / grid.MAX_ROW) - 1) * 2;
            if (tile.order%1) {
                c += 1;
            }

            return ['s' + tile.size, 'r' + r, 'c' + c].join(' ');
        };

        $scope.operate = function (appId, operation) {
            console.log('customize', appId);
            $scope.reset();
            $scope.target = grid.tileById(appId);
            if(operation === 'customize'){
                $scope.target.selected = true;
            }
            $scope.$apply(function () {
                $scope.operation = operation;
            });
            $scope.dragged = grid.tileById(appId);
        };

        $scope.resize = function () {
            if($scope.target.size === 1){
                $scope.target.size = 2;
                if(!grid.isSingle($scope.target)){
                    var params = {increase: true};
                    params.start = $scope.target.order;
                    $scope.changeOrders(grid.tileByGroup($scope.target.group), params);
                }
            }else{
                $scope.target.size = 1;
            }
            console.log('resize', $scope.target);
//            $scope.$apply();
        };
        $scope.uninstall = function () {
//            $scope.target.size = 0;
            console.log('uninstall');
            var group = $scope.groups.filter(function (group) {
                return group.id === $scope.target.group;
            }).pop();
            group.tiles.forEach(function (tile, index) {
                if(tile.id === $scope.target.id){
                    group.tiles.splice(index, 1);
                }
            });
        };

        $scope.enter = function (appId) {
            var dragged = $scope.dragged;
            var dropped = grid.tileById(appId);

            var draggedCopy = angular.copy(dragged);
            var droppedCopy = angular.copy(dropped);

            var draggedGroup = grid.tileByGroup(dragged.group);
            var droppedGroup = grid.tileByGroup(dropped.group);

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

        /**
         * reset operation state to 'none'
         */
        $scope.reset = function () {
            if($scope.operation !== 'none'){
                $scope.operation = 'none';
                if($scope.target){
                    delete $scope.target.selected;
                    delete $scope.target.selected;
                }
            }
        };

        /**
         * change tiles' order according to params
         * @param tiles tile array, must be ordered by 'order'
         * @param params {start:0, increase: true, end: Number.MAX_VALUE}
         */
        $scope.changeOrders = function (tiles, increase, start, end) {
            if(increase !== undefined) {
                start = Math.floor(start || 0);
                end = Math.ceil((end || Number.MAX_VALUE) + 0.5);
                console.log('change', start, end);
                tiles.filter(function (tile) {
                    return tile.order >= start && tile.order < end;
                }).forEach(function (tile) {
                    if (increase) {
                        tile.order += 1;
                    } else {
                        tile.order -= 1;
                    }
                });

                //resize group
                if(end > 1000){//if it's MAX_NUMBER
                    grid.groupById($scope.target.group).size = grid.groupSize($scope.target.group);

                    $scope.size = 0;
                    angular.forEach($scope.groups, function (group) {
                        $scope.size += (group.size*10 +2);
                    });
                }
            }
        };
    });
