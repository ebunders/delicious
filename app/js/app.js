// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', ])

.config(['$routeProvider',
    function($routeProvider) {
        "use strict";

        $routeProvider.when('/menu', {
            templateUrl: 'partials/menu.html',
            controller: 'MenuController'
        });
        $routeProvider.when('/list', {
            templateUrl: 'partials/shoppinglist.html',
            controller: 'ShoppingListController'
        });
        $routeProvider.otherwise({
            redirectTo: '/menu'
        });
    }
]);