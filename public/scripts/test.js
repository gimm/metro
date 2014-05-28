angular.module('test', []).provider('test', function () {
    this.hello = function (x) {
        console.log('hello', x);
    };
    this.$get = function () {
        return {
            name: 'test'
        };
    };
});

angular.module('myApp', ['test'])
.config(function (testProvider) {
        testProvider.hello('world!');
    });