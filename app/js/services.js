/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])

.factory("MenuDataLoader", ['$log', '$http', 'Tool',
    function($log, $http, tool) {
        "use strict";

        var data;

        function getData() {
            $log.info("Start loading menu data");
            return $http.get("data/menu.json");
        }


        /*
         * This function replaces all the recipe refs in the menu section of the data
         * with the actual recipes.
         */
        function fetchRecipes() {
            tool.forEach(data.menu.sections, function(section) {
                section.recipes = tool.map(section.recipes, function(id) {
                    return fetchRecipe(id);
                });
            });
        }

        function fetchRecipe(id) {
            return tool.find(data.recipes, function(recipe) {
                return recipe.id === id;
            });
        }

        return {
            getData: function() {
                return getData().then(function(response) {
                    data = response.data;
                    fetchRecipes();
                    return data;
                });
            },

            getCategory: function(code) {
                return tool.find(data.categories, function(_c) {
                    return _c.code === code;
                });
            },

            getIngredient: function(code) {
                return tool.find(data.ingredients, function(_i) {
                    return _i.code === code;
                });
            }

        };

    }
])



.factory('Tool', ["$log",
    function($log) {
        "use strict";

        var tool = {};

        /*
         * Executes the function for each element in the array.
         */
        tool.forEach = function(array, func) {
            var i;
            if (array.length) {
                for (i = 0; i < array.length; i++) {
                    func(array[i], i);
                }
            } else {
                for (i in array) {
                    func(array[i], i);
                }
            }
        };

        /*
         * This function maps an array to another array. The function is called on each element of input array.
         * And a new array is built with the output result.
         */
        tool.map = function(inputArray, func) {
            var result = [];
            this.forEach(inputArray, function(element) {
                result.push(func(element));
            });
            return result;
        };

        /*
         * Returns the first object in the array for which the function returns true.
         */
        tool.find = function(array, func) {
            for (var i = 0; i < array.length; i++) {
                if (func(array[i], i)) return array[i];
            }
            return null;
        };

        /*
         * Creates a new array with all objects of inputArray for which func returns 'true'
         */
        tool.filter = function(inputArray, func) {
            var result = [];
            this.forEach(inputArray, function(element) {
                if (true === func(element)) {
                    result.push(element);
                }
            });
            return result;
        };

        /*
         * Adds the object to the array, when it is not null and not undefined.
         */
        tool.addWhenContent = function(array, value) {
            if (value !== null && value !== undefined) array.push(value);
        };


        /*
         * creates a new array that contains only unique objects from the input array
         * what is unique? The hashFn should create a identifying string for the object
         */
        tool.asSet = function(inputArray, hashFn) {
            var result = [],
                set = [];
            this.forEach(inputArray, function(element) {
                var hash = hashFn(element);
                if (!set[hash]) {
                    result.push(element);
                    set[hash] = true;
                }
            });
            return result;
        };

        return tool;
    }
]);