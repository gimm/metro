'use strict';
angular.module('metro.directive', [])
//group directive
    .directive("group", function (metro) {
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
    })
//group splitter directive
    .directive("groupSplitter", function (metro) {
        return {
            restrict: "A",
            transclude: true,
            replace: true,

            templateUrl: "templates/groupSplitter.html",
            controller: function ($scope, $element) {
                this.hello = function () {
                    console.log('hello');
                };
            },
            link: function(scope, element, attrs) {
                element.attr("draggable", true);
                element.bind('dragenter',function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.classList.add('over');
                    }
                ).bind('dragover',function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                ).bind('dragleave',function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.classList.remove('over');
                    }
                ).bind('drop', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('dropped!');
                        scope.newGroup(scope.group.id);
                    }
                );
            }
        }
    })
//right click directive
    .directive('rightClick', function ($parse) {
        return function (scope, element, attrs) {
            var fn = $parse(attrs.rightClick);
            element.bind('contextmenu', function (event) {
                scope.$apply(function () {
                    event.preventDefault();
                    fn(scope, {$event: event});
                });
            });
        };
    })
//scroll directive
    .directive('scroll', function ($document) {
        return {
            restrict: 'A',

            link: function (scope, element, attrs) {
                var delta = 100;
                $document.on("wheel", function (e) {
                    var direction = e.deltaY > 0 ? 1 : -1;
                    scroll(element[0], delta*direction);
                });
                $document.on("keydown", function (e) {
                    var direction = 0;
                    if(e.keyCode==37 || e.keyCode==38){
                        direction = -1;
                    }else if(e.keyCode==39 || e.keyCode==40){
                        direction = 1;
                    }
                    direction && scroll(element[0], delta*direction);
                });

            }
        };
        function scroll(element, delta) {
            console.log("scroll", delta);
            element.scrollLeft += delta;
        }
    })
//tile directive
    .directive('tile', function ($location, $timeout, $compile, $http, $templateCache, metro) {
        var getTemplate = function(app, size) {
            var templateLoader,
                templateUrl = '/apps/' + app + '/templates/tile.html';

            templateLoader = $http.get(templateUrl, {cache: $templateCache});

            return templateLoader;

        };
        return {
            replace: false,
//            templateUrl: 'templates/tile.html',
            restrict: 'E',
            require: "^group",
            controller: function ($scope, $element) {
                $scope.dragenter = function (dropped) {
                    var dragged = $scope.target;
                    var dropped = dropped;

                    console.log(dragged.identity, '=', dragged.order,'|' , dropped.identity,'=', dropped.order);
                    var draggedCopy = angular.copy(dragged);
                    var droppedCopy = angular.copy(dropped);

                    var change = {};

                    //extraction
                    var decreasePoint = dragged.order;
                    if(metro.tileHasSibling(dragged)){
                        decreasePoint = undefined;
                    }
                    //insertion
                    var increasePoint = dropped.order;
                    if(dropped.size === 'default'){
                        if(Math.floor(dropped.order) === Math.floor(dragged.order) || (!metro.tileHasSibling(dropped) && dragged.size === 'default')){
                            increasePoint = undefined;
                        }
                    }

                    if(increasePoint && decreasePoint){
                        change.increase = decreasePoint > increasePoint;
                        change.start = change.increase ? increasePoint : decreasePoint;
                        change.end = change.increase ? decreasePoint : increasePoint;
                    }else if(increasePoint){
                        change.increase = true;
                        change.start = increasePoint;
                    }else if(decreasePoint){
                        change.increase = false;
                        change.start = decreasePoint;
                    }


                    $scope.changeOrders($scope.group.tiles, change.increase, change.start, change.end);


                    $scope.$apply(function () {
                        //fixes for special cases
                        var targetOrder = droppedCopy.order;
                        if(dropped.order%1 && dragged.size===2){
                            targetOrder = Math.floor(targetOrder);
                        }else if(!increasePoint){
                            if(dropped.order%1){
                                dropped.order -= 0.5;
                            }else{
                                dropped.order += 0.5;
                            }
                            if(decreasePoint && draggedCopy.order < droppedCopy.order){
                                targetOrder -= 1;
                            }
                        }
                        dragged.order = targetOrder;
                    });
                };
            },
            link: function (scope, element, attrs, groupCtrl) {
                var loader = getTemplate(scope.tile.identity, scope.tile.size);

                var promise = loader.success(function(html) {
//                    element.html(html);
                    element.append($compile(html)(scope));
                }).then(function (response) {
                });

                    element.attr("draggable", true);
                    element.bind('click',function (e) {
                            console.log('click');

                            if(scope.operation === 'customize'){
                                this.classList.add('selected');
                                e.stopPropagation();
                                scope.operate(groupCtrl.tileById(this.dataset.appId), 'customize');
                            }else {
                                $location.url('/' + this.dataset.appId);
                            }
                        }
                    ).bind('contextmenu', function (e) {
                            if (e.stopPropagation) {
                                e.stopPropagation();
                            }
                            if (e.preventDefault) {
                                e.preventDefault();
                            }
                            scope.operate(groupCtrl.tileById(this.dataset.appId), 'customize');
                            return false;
                        }
                    ).bind('dragstart',function (e) {
                            console.log('dragstart');
                            e.dataTransfer.setData("Text", 'this is required by firefox');
                            e.dataTransfer.effectAllowed = 'move';
                            var tile = groupCtrl.tileById(this.dataset.appId);
                            scope.operate(tile, 'reorder');
                            this.classList.add('drag');
                            return false;
                        }
                    ).bind('dragend',function (e) {
                            this.classList.remove('drag');
                            e.preventDefault();
                            return false;
                        }
                    ).bind('dragover',function (e) {
                            e.dataTransfer.dropEffect = 'move';
                            // allows us to drop
                            e.preventDefault();
                            this.classList.add('over');
                            return false;
                        }
                    ).bind('dragenter',function (e) {
                            this.classList.add('over');
                            if(scope.target.id !== this.dataset.appId) {
                                if(!metro.vars.moving){
                                    metro.vars.moving = true;
                                    scope.dragenter(groupCtrl.tileById(this.dataset.appId));
                                    var timer = $timeout(function () {
                                        console.log('timeout');
                                        metro.vars.moving = false;
                                    }, metro.vars.delay).then(function () {
                                        $timeout.cancel(timer);
                                    });
                                }else{
                                    console.log('skip');
                                }
                            }
                            e.preventDefault();
                            return false;
                        }
                    ).bind('dragleave',function (e) {
                            this.classList.remove('over');
    //                        groupCtrl.leave(this.dataset.appId);
                            return false;
                        }
                    ).bind('drop', function (e) {
                            e.preventDefault();
                            this.classList.remove('over');
    //                        scope.drop(this.dataset.appId);
                            return false;
                        }
                    );

            }
        };
    });