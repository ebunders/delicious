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


        function fetchRecipes() {
            var recipes = [];
            tool.forEach(data.menu.recipes, function(recipeId) {
                tool.addWhenContent(recipes, tool.find(data.recipes, function(recipe) {
                    return recipe.id === recipeId;
                }));
            });
            data.menu.recipes = recipes;
        }

        function fetchRecipe(ref) {
            for (var i = 0; i < data.recipes.length; i++) {
                var recipe = data.recipes[i];
                if (recipe.ref === ref) return recipe;
            }
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
            for (var i = 0; i < array.length; i++) {
                func(array[i], i);
            }
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
        * Adds the object to the array, when it is truthy
        */
        tool.addWhenContent = function(array, value) {
            if (value) array.push(value);
        };

        return tool;
    }
]);