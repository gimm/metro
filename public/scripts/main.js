requirejs.config({
    baseUrl: '/scripts',
    paths: {
        'app': './apps',
        'angular': '/bower_components/angular/angular',
        'angular-route': '/bower_components/angular-route/angular-route',
        'angular-resource': '/bower_components/angular-resource/angular-resource',
        'angular-cookies': '/bower_components/angular-cookies/angular-cookies'
    },
    shim: {
        'index': {
            deps: ['controllers', 'services', 'directives']
        }
    }
});

require(['index'], function (app) {
    angular.bootstrap(document.body, [app.name]);
});