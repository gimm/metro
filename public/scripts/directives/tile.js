'use strict';

angular.module('metroApp')
    .directive('tile', function ($location) {
        return {
            transclude: true,
            replace: true,
            templateUrl: "templates/tile.html",
            restrict: 'E',
            require: "^group",
            link: function (scope, element, attrs, groupCtrl) {
                element.attr("draggable", true);

                element.bind('click',function (e) {
                        console.log('tile clicked!');
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
                        scope.enter(this.dataset.appId);

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
                        scope.drop(this.dataset.appId);
                        return false;
                    }
                );
            }
        };
    });
