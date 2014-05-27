'use strict';

angular.module('metroApp')
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
    });
