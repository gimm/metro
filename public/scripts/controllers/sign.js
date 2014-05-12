'use strict';

angular.module('metroApp')
    .controller('SignCtrl', function ($scope, User, $location) {
        $scope.user = {
            name: 'Gimm',
            email: 'yucc2008@gmail.com'
        };
        $scope.submit = function (valid) {
            console.log(valid);
            if(valid){
                var newUser = new User($scope.user);
                newUser.$save().then(function (user) {
                    console.log('user', user);
                    $scope.result = {
                        success: true,
                        message: 'Accunt created, redirect to home ....'
                    };
                    $location.url('/');
                }, function (err) {
                    console.log('err', err);
                    $scope.result = {
                        success: false,
                        message: err.data.error.err
                    };
                });
            }
        };
    });
