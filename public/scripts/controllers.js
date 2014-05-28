'use strict';

angular.module('metro.controller', [])
//main controller
    .config(function ($routeProvider, $locationProvider, $httpProvider) {
        //set xhr to true
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/c', {
                template: 'route from controllers module!'
            })
    })
    .controller('MainCtrl', function ($scope, $q, metro, Group) {
        $scope.size = metro.vars.size;
        $scope.groups = metro.groups;
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
            var r = Math.floor((tile.order-1) % metro.MAX_ROW);
            var c = (Math.ceil(Math.floor(tile.order) / metro.MAX_ROW) - 1) * 2;
            if (tile.order%1) {
                c += 1;
            }

            return ['s' + tile.size, 'r' + r, 'c' + c].join(' ');
        };

        $scope.operate = function (operator, operation) {
            console.log('customize', operator.title);
            $scope.reset();
            $scope.target = operator;
            if(operation === 'customize'){
                $scope.target.selected = true;
            }
            $scope.$apply(function () {
                $scope.operation = operation;
            });
        };

        $scope.resize = function () {
            if($scope.target.size === 1){
                $scope.target.size = 2;
                if(metro.tileHasSibling($scope.target)){
                    var params = {increase: true};
                    params.start = $scope.target.order;
                    $scope.changeOrders(metro.tileByGroup($scope.target.group), params);
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
                    metro.groupById($scope.target.group).size = metro.groupSize($scope.target.group);

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
    })
//login controller
    .controller('LoginCtrl', function ($scope, $cookies, $location, User, metro) {
        $scope.user = {};
        if($cookies.user){
            $scope.user.name = $cookies.user;
        }
        $scope.submit = function (valid) {
            if(valid) {
                User.populate({}, $scope.user).$promise.then(
                    function (user) {
                        $scope.result = {
                            success: true,
                            message: 'Login success, rediret to home ...'
                        };
                        //set cookie
                        $cookies.user = user.name;
                        metro.user = user;
                        //redirect
                        $location.url('/');
                    },
                    function (err) {
                        console.log('err', err);
                        $scope.result = {
                            success: false,
                            message: err.data.error.err
                        };
                    }
                );
            }
        };
    })
//sign controller
    .controller('SignCtrl', function ($scope, User, $location) {
        $scope.user = {
            name: 'Gimm',
            email: 'yucc2008@gmail.com'
        };
        $scope.submit = function (valid) {
            console.log(valid);
            if(valid){
                var newUser = new User($scope.user);
                newUser.$save().then(function (user) {
                    console.log('user', user);
                    $scope.result = {
                        success: true,
                        message: 'Accunt created, redirect to home ....'
                    };
                    $location.url('/');
                }, function (err) {
                    console.log('err', err);
                    $scope.result = {
                        success: false,
                        message: err.data.error.err
                    };
                });
            }
        };
    })

    .controller('DynamicCtrl', function ($scope, $routeParams) {
        $scope.templateUrl = 'xxx.html';
    });
