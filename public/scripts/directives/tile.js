'use strict';

angular.module('metroApp')
    .directive('tile', function ($location, $timeout, grid) {
        return {
            transclude: true,
            replace: true,
            templateUrl: "templates/tile.html",
            restrict: 'E',
            require: "^group",
            controller: function ($scope, $element) {
                $scope.dragenter = function (appId) {
                    var dragged = $scope.target;
                    var dropped = grid.tileById(appId);

                    console.log(dragged.id, '=', dragged.order,'|' , dropped.id,'=', dropped.order);
                    var draggedCopy = angular.copy(dragged);
                    var droppedCopy = angular.copy(dropped);

                    var change = {};

                    //extraction
                    var decreasePoint = dragged.order;
                    if(grid.tileHasSibling(dragged)){
                        decreasePoint = undefined;
                    }
                    //insertion
                    var increasePoint = dropped.order;
                    if(dropped.size === 1){
                        if(Math.floor(dropped.order) === Math.floor(dragged.order) || (!grid.tileHasSibling(dropped) && dragged.size === 1)){
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


                    $scope.changeOrders(grid.groupById(dragged.group).tiles, change.increase, change.start, change.end);


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
                element.attr("draggable", true);

                element.bind('click',function (e) {
                        console.log('tile clicked!');
                        groupCtrl.name();
                        if(scope.operation === 'customize'){
                            this.classList.add('selected');
                            e.stopPropagation();
                            scope.operate(this.dataset.appId, 'customize');
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
                        scope.operate(this.dataset.appId, 'customize');
                        return false;
                    }
                ).bind('dragstart',function (e) {
                        e.dataTransfer.effectAllowed = 'move';
                        scope.operate(this.dataset.appId, 'reorder');
                        this.classList.add('drag');
                        return false;
                    }
                ).bind('dragend',function (e) {
                        this.classList.remove('drag');
                        return false;
                    }
                ).bind('dragover',function (e) {
                        e.dataTransfer.dropEffect = 'move';
                        // allows us to drop
                        if (e.preventDefault) e.preventDefault();
                        this.classList.add('over');
                        return false;
                    }
                ).bind('dragenter',function (e) {
                        this.classList.add('over');
                        if(scope.target.id !== this.dataset.appId) {
                            if(!grid.vars.moving){
                                grid.vars.moving = true;
                                scope.dragenter(this.dataset.appId);
                                var timer = $timeout(function () {
                                    console.log('timeout');
                                    grid.vars.moving = false;
                                }, grid.vars.delay).then(function () {
                                    $timeout.cancel(timer);
                                });
                            }else{
                                console.log('skip');
                            }
                        }

                        return false;
                    }
                ).bind('dragleave',function (e) {
                        this.classList.remove('over');
//                        groupCtrl.leave(this.dataset.appId);
                        return false;
                    }
                ).bind('drop', function (e) {
                        if (e.stopPropagation) {
                            e.stopPropagation();
                        }
                        this.classList.remove('over');
//                        scope.drop(this.dataset.appId);
                        return false;
                    }
                );
            }
        };
    });
