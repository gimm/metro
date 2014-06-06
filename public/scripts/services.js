'use strict';
angular.module('metro.service', [])
    .provider('appRoute', function ($routeProvider) {
        this.$get = $routeProvider.$get;

        this.app = function (app) {
            this.pathPrefix = '/' + app;
            this.templatePrefix = '/apps' + this.pathPrefix + '/';
            return this;
        };
        this.when = function (path, route) {
            path = this.pathPrefix + path;
            if(angular.isString(route.templateUrl)){
                route.templateUrl = this.templatePrefix + route.templateUrl;
            }
            $routeProvider.when(path, route);
            return this;
        };
    })
    .provider('appState', function ($stateProvider) {
        this.$get = $stateProvider.$get;

        this.app = function (app) {
            this.pathPrefix = '/' + app;
            this.templatePrefix = '/apps' + this.pathPrefix + '/';
            return this;
        };
        this.state = function (path, route) {
            path = this.pathPrefix + path;
            if(angular.isString(route.templateUrl)){
                route.templateUrl = this.templatePrefix + route.templateUrl;
            }
            $stateProvider.when(path, route);
            return this;
        };
    })
//user service
    .factory("User", function ($resource) {
        return $resource('user/:id', {}, {
            login: {
                method: 'POST',
                url: 'user/auth',
                responseType: 'json'
            },
            populate: {
                method: 'POST',
                url: '/user/populate',
                responseType: 'json',
                transformResponse: function (user, headersGetter) {
                    user.groups.forEach(function (group) {
                        group.tiles.forEach(function (tile) {
                            tile._id = tile.app._id;
                            tile.title = tile.app.title;
                            tile.identity = tile.app.identity;
                            delete tile.app;
                        });
                    });
                    return user;
                }
            }
        });
    })
//metro service
    .service("metro", function ($q, User) {
        this.MAX_ROW = 3;
        this.tiles = [];
        this.groups = [];
        this.vars = {
            size: 0,    //panaroma size
            moving: false,  //dragging state
            delay: 300  //dragging animation delay
        };

        this.load = function () {
            var that = this;
            var defer = $q.defer();
            if(this.user){  //user already available
                defer.resolve();
            }else{  //get user info
                User.populate(function(user){
                    that.start.call(that, user.groups);
                    defer.resolve();
                }, function () {
                    console.log('err get user tiles!');
                });
            }
            return defer.promise;
        };

        this.tileById = function (appId) {
            return this.tiles.filter(function (tile) {
                return tile.id == appId;
            }).pop();
        };
        this.tileHasSibling = function (tile) {
            if(tile.size === 'default'){
                var siblingOrder = tile.order%1 ? (tile.order-0.5) : (tile.order+0.5);
                return this.groupById(tile.group).tiles.filter(function (t) {
                    return t.order == siblingOrder;
                }).length > 0;
            }
            return false;
        };

        this.tileByGroup = function (groupId) {
            return this.tiles.filter(function (tile) {
                return tile.group == groupId;
            });
        };
        this.groupById = function (groupId) {
            return this.groups.filter(function (group) {
                return group.id == groupId;
            }).pop();
        };
        this.groupSize = function (groupId) {
            var tiles = this.tileByGroup(groupId);
            tiles.sort(function (t1, t2) {
                return t1.order - t2.order;
            });
            var maxOrder = tiles[tiles.length-1].order;
            return (Math.ceil(maxOrder / this.MAX_ROW));
        };

        //generate layout for group
        this.init = function () {
            angular.forEach(this.groups, function (group) {
                group.tiles = this.tileByGroup(group.id);
                group.size = this.groupSize(group.id);
                this.vars.size += (group.size*10 +2);
            }, this);
        };
        this.start = function (groups) {
            var totalSize = 0;
            groups.forEach(function (group) {
                group.size = (Math.ceil(group.tiles[group.tiles.length-1].order / this.MAX_ROW));//TODO fix this reference
                totalSize += (group.size*10 +2);
            }, this);
            this.groups = groups;
            this.vars.size = totalSize;
        };
    })
//group service
    .factory("Group", function ($resource) {
        return $resource('group/:id', {}, {
            update: {
                method: 'PUT'
            }
        });
    });