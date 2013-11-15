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
            var flatList = [],
                allIngredientRefs = [];

            // create a line with amount, unit and proper name
            var createIngredientLine = function(ingredientRef) {
                var ingredient = dataLoader.getIngredient(ingredientRef.ingredient),
                    result = {};
                result.unit = ingredientRef.unit ? ingredientRef.unit : (ingredient.unit ? ingredient.unit : "");
                result.amount = ingredientRef.amount;
                result.name = (ingredientRef.amount > 1 && ingredient.plural) ? ingredient.plural : ingredient.name;
                return result.amount + " " + result.unit + " " + result.name;
            };

            //first collect all the ingredient refs in all the recipes in the menu
            tool.forEach($scope.data.menu.sections, function(section) {
                tool.forEach(section.recipes, function(recipe) {
                    tool.forEach(recipe.ingredients, function(section) {
                        tool.forEach(section.contents, function(ingredientRef) {
                            allIngredientRefs.push(ingredientRef);
                        });
                    });
                });
            });

            //now make this a list where each ingredient is unique, and add the amounts.
            var uniqueIngredientRefs = [];
            tool.forEach(allIngredientRefs, function(ingredientRef){
                if(uniqueIngredientRefs[ingredientRef.ingredient]){
                    uniqueIngredientRefs[ingredientRef.ingredient].amount = uniqueIngredientRefs[ingredientRef.ingredient].amount + ingredientRef.amount;
                }else{
                    uniqueIngredientRefs[ingredientRef.ingredient] = ingredientRef;
                }
            });


            //for every category: create a list of ingredientrefs that belong to that category
            tool.forEach($scope.data.categories, function(category) {
                var categoryIngredients = tool.filter(uniqueIngredientRefs, function(ingredientRef) {
                    return dataLoader.getIngredient(ingredientRef.ingredient).category === category.code;
                });
                if (categoryIngredients.length > 0) {
                    flatList.push({
                        "class": "category",
                        "text": category.name
                    });
                    tool.forEach(categoryIngredients, function(ingredientRef) {
                        flatList.push({
                            "class": "ingredient",
                            "text": createIngredientLine(ingredientRef)
                        });
                    });
                }
            });


            $log.info(flatList);
            return flatList;
        };

        dataLoader.getData().then(function(_data) {
            $log.info("Start creating shopping list");
            $scope.data = _data;
            $scope.list = createList();
            $log.info("the list:", $scope.list);
        });

    }
]);