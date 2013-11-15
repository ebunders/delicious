/* Directives */

(function(){
    'use strict';
    angular.module('myApp.directives', [])

    .directive('appVersion', ['version',
        function(version) {
            return function(scope, elm, attrs) {
                elm.text(version);
            };
        }
    ])

    .directive('scrollTo', function($location, $anchorScroll) {
        return function(scope, element, attrs) {
            element.bind('click', function(event) {
                event.stopPropagation();
                scope.$on('$locationChangeStart', function(ev) {
                    ev.preventDefault();
                });
                var location = attrs.scrollTo;
                $location.hash(location);
                $anchorScroll();
            });
        };
    });
})();