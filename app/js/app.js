'use strict';

angular.module('lk', ['lk.controllers', 'lk.services', 'lk.directives',
    'ui.bootstrap.pagination', 'ui.bootstrap.carousel'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                controller:'IndexCtrl',
                templateUrl:'./partials/index.html'
            })
            .when('/about/fi', {
                templateUrl:'./partials/fi/about.html'
            })
            .when('/about/en', {
                templateUrl:'./partials/en/about.html'
            })
            .when('/about', {
                templateUrl:'./partials/en/about.html'
            })
            .when('/cv', {
                controller:'CVCtrl',
                templateUrl:'./partials/cv.html'
            })
            .when('/works', {
                controller:'WorksCtrl',
                templateUrl:'./partials/works.html'
            })
            .when('/poems', {
                templateUrl:'./partials/poems.html'
            })
            .when('/jewelry', {
                templateUrl:'./partials/jewelry.html'
            })
            .when('/other', {
                templateUrl:'./partials/other.html'
            })
            .when('/contact', {
                templateUrl:'./partials/contact.html'
            })
            .otherwise(
            {
                redirectTo:'/'
            });
    });
