'use strict';

angular.module('metroApp')
    .directive('tile', function ($location, $timeout, metro) {
        return {
            transclude: true,
            replace: true,
            templateUrl: function(){
                console.log('url', arguments);
            },
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
                    if(dropped.size === 1){
                        if(Math.floor(dropped.order) === Math.floor(dragged.order) || (!metro.tileHasSibling(dropped) && dragged.size === 1)){
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
                element.attr("draggable", true);
                element.bind('click',function (e) {
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
