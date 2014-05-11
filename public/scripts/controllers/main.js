'use strict';

angular.module('metroApp')
    .controller('MainCtrl', function ($scope, grid, Group) {
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

        /**
         * create a new group when tile dragged into group splitter
         */
        $scope.newGroup = function (newGroupOrder) {
            var newChild = $scope.target;
            console.log('new group', newChild, newGroupOrder);
            $scope.groups.forEach(function (group) {
                if(group.order >= newGroupOrder){
                    group.order += 1;
                }
            });
            var newGroup = {
                id: 'g' + new Date().getTime(),
                order: newGroupOrder,
                title: 'New Group',
                tiles: [newChild]
            };
            $scope.$apply(function () {
                newChild.group = newGroup.id;
                newChild.order = 1;
                $scope.groups.push(newGroup);
            });
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

        $scope.$watchCollection('groups', function (newValue, oldValue) {
            console.log('groups changed');
        },true);
    });
