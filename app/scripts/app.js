'use strict';

angular.module('metroApp', [
        'ngRoute'
    ])
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
            .otherwise({
                template: "view does not exist for this url!"
            });
    }).value("apps", [
            {
                "title": "Featured",
                "tiles": [
                    {
                        id: "1",
                        name: "Sine News",
                        cords: [0, 2],
                        size: 2
                    },
                    {
                        id: "2",
                        name: "Yahoo Weather",
                        cords: [2, 1]
                    },
                    {
                        id: "3",
                        name: "App Store",
                        cords: [0, 0]
                    },
                    {
                        id: "4",
                        name: "Dropbox",
                        cords: [1, 0],
                        size: 2
                    },
                    {
                        id: "51",
                        name: "Codepen",
                        cords: [1, 3]
                    }
                ]},
            {
                "title": "Newly Add",
                "tiles": [
                    {
                        id: "11",
                        name: "Nokia Camera",
                        cords: [0, 0],
                        size: 2
                    },
                    {
                        id: "21",
                        name: "Google Search",
                        cords: [0, 2]
                    },
                    {
                        id: "31",
                        name: "QQ",
                        cords: [1, 1]
                    },
                    {
                        id: "41",
                        name: "Evernote",
                        cords: [1, 2]
                    },
                    {
                        id: "61",
                        name: "Koding",
                        cords: [2, 2]
                    }
                ]
            },
        {
            "title": "Other",
            "tiles": [
                {
                    id: "11",
                    name: "Nokia Camera",
                    cords: [0, 0],
                    size: 2
                },
                {
                    id: "21",
                    name: "Google Search",
                    cords: [0, 3]
                },
                {
                    id: "31",
                    name: "QQ",
                    cords: [1, 1]
                },
                {
                    id: "41",
                    name: "Evernote",
                    cords: [1, 2]
                },
                {
                    id: "61",
                    name: "Koding",
                    cords: [2, 3]
                }
            ]
        }
        ]);
