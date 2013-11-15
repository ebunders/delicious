/* Controllers */


angular.module('myApp.controllers', [])

.controller('MenuController', ['$scope', '$http', '$log', 'MenuDataLoader',
    function($scope, $http, $log, dataLoader) {
        dataLoader.getData().then(function(_data) {
            $scope.data = _data;
            $log.info("Data added to the model", _data);
        });
    }
])


.controller("ShoppingListController", ["$scope", "$log", 'MenuDataLoader', 'Tool',
    function($scope, $log, dataLoader, tool) {
        "use strict";

        $log.info("ShoppingListController");


        //iterate over all recipes in menu. for each ingredient in ieach recipe:
        // - fetch the category. if not in list, add it. if it is in there:
        //      - check if the ingredient is in there. if it is, add the amount, if it isn't add it. check if the name should be plural.

        var createList = function() {
            var list = {
                categories: []
            };
            tool.forEach($scope.data.menu.recipes, function(recipe) {
                tool.forEach(recipe.ingredients, function(section) {
                    tool.forEach(section.contents, function(ingredient) {

                        //check if this category is in the result yet. If not add it.

                        var ingredientDesc = dataLoader.getIngredient(ingredient.ingredient);
                        if (ingredientDesc.shoppinglist === undefined || ingredientDesc.shoppinglist === true) {

                            var filterFn = function(_category) {
                                return ingredientDesc.category === _category.code;
                            };

                            var cat = tool.find(list.categories, filterFn);
                            if (!cat) {
                                cat = angular.copy(dataLoader.getCategory(ingredientDesc.category));
                                // $log.info(ingredientDesc);
                                // $log.info(ingredientDesc.category + " yealds ", cat);
                                cat.ingredients = [];
                                list.categories.push(cat);
                            }

                            //now we have the category, see if the ingredient is in the list.
                            //if not, add it. if so, add the amount, and re-evaluate the name/plural of the ingredient.
                            filterFn = function(_ingredient) {
                                return _ingredient.code === ingredient.ingredient;
                            };
                            var ingr = tool.find(cat.ingredients, filterFn);


                            if (ingr) {
                                //update the amount, and possibly the name
                                ingr.amount = ingr.amount + ingredient.amount;
                            } else {
                                //create an object for this ingredient in the proper category
                                ingr = {
                                    "code": ingredient.ingredient
                                };
                                ingr.unit = ingredient.unit ? ingredient.unit : (ingredientDesc.unit ? ingredientDesc.unit : "");
                                ingr.amount = ingredient.amount;
                                cat.ingredients.push(ingr);
                            }
                            ingr.name = (ingr.amount > 1 && ingredientDesc.plural) ?  ingredientDesc.plural : ingredientDesc.name;
                        }
                    });
                });
            });
            $log.info(list);
            return list;
        };

        dataLoader.getData().then(function(_data) {
            $log.info("Start creating shopping list");
            $scope.data = _data;
            $scope.list = createList();
            $log.info("the list:", $scope.list);
        });

    }
]);