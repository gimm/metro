define([], function () {
    var metro = {};
    metro.app = function (name, requires, configFn) {
        this.name = name;
        if(angular.isArray(requires)){
            if(requires.indexOf('ui.router') === -1){
                requires.push('ui.router');
            }
        }else{
            requires = [];
        }
        this.m = angular.module(name, requires, configFn);
        return this;
    };

    metro.states = function (states) {
        states = states.map(function (state) {
            if(angular.isString(state)){
                state = {
                    name: ['app', this.name, state].join('.'),
                    url: '/' + state,
                    templateUrl: '/' + this.name + '/templates/' + state + '.html'
                };
            }else{
                if(angular.isUndefined(state.url)){
                    state.url = '/' + state.name;
                }
                if(state.templateUrl){
                    if(angular.isString(state.templateUrl)){
                        state.templateUrl = '/' + this.name + '/' + state.templateUrl;
                    }
                }else if(angular.isUndefined(state.template)){
                    state.templateUrl = '/' + this.name + '/templates/' + state.name + '.html';
                }
                state.name = ['app', this.name, state.name].join('.');
            }

            return state;
        }, this);
        states.unshift({
            name: 'app.' + this.name,
            url: '/'+this.name,
            templateUrl: '/' + this.name + '/templates/index.html'
        });
        this.m.config(function ($stateProvider) {
            states.forEach(function (state) {
               $stateProvider.state(state);
            });
        });
        return this;
    };

    metro.module = function (fn) {
        if(angular.isFunction(fn)){
            fn(this.m);
        }
        return this;
    };

    metro.init = function () {
        this.m.run(function ($rootScope) {
            //trigger ui router to match again after new module loaded
            $rootScope.$broadcast('$locationChangeSuccess');
        });

        //load new modules to metroApp
        angular.element(document.body).injector().loadNewModules([this.name]);
        return this;
    };
    return metro;
});