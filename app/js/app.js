// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers'])

.config(['$routeProvider',
    function($routeProvider) {
        "use strict";

        $routeProvider.when('/view4', {
            templateUrl: 'partials/menu.html',
            controller: 'MenuController'
        });
        $routeProvider.when('/view5', {
            templateUrl: 'partials/shoppinglist.html',
            controller: 'ShoppingListController'
        });
        $routeProvider.otherwise({
            redirectTo: '/view4'
        });
    }
]);