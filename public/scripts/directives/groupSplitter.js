angular.module("metroApp").directive("groupSplitter", function (metro) {
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