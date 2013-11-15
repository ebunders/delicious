
/* Filters */
/*globals angular */
angular.module('myApp.filters', [])


.filter("readableIngredient", ['$log',
    function($log) {
    'use strict';
        return function(ingredient, recipe, data) {
            var persons = data.menu.persons;
            var recipePersons = recipe.persons;
            var ratio = persons / recipePersons;

            var amount = ingredient.amount * ratio || "";
            var unit = resolveUnit(ingredient, ratio, data);
            var ingredientName = resolveIngredientName(ingredient, ratio, data);
            var modifier = ingredient.modifier;
            var note = ingredient.note;
            return  amount  + " " + unit + " " + (modifier ? modifier + " " : "") + ingredientName + (note ? " (" + note + ")" : "");
        };

        function resolveUnit(ingredientRef, ratio, data){
            //in some cases we use the unit of the ingredient.
            if(!ingredientRef.unit || ingredientRef.unit === "unit"){
                var ingredient = resolveIngredient(ingredientRef.ingredient, data);
                if(!ingredient) $log.error("no ingredient found with code ", ingredientRef);
                return ingredient.unit ? ingredient.unit : "";
            }

            //find the unit
            for (var i = data.units.length - 1; i >= 0; i--) {
                var unit = data.units[i];
                if(unit.code === ingredientRef.unit){
                    if((ingredientRef.amount * ratio) > 1 && unit.plural){
                        return unit.plural;
                    }
                    return unit.name;
                }
            }
        }

        function resolveIngredientName(ingredientRef, ratio, data){
            var ingredient = resolveIngredient(ingredientRef.ingredient, data);
            if(ingredient){
                if((ingredientRef.amount * ratio) > 1 && ingredient.plural){
                    return ingredient.plural;
                }
                return ingredient.name;
            }
            return "no ingredient found";
        }

        function resolveIngredient(code, data){
            for (var i = data.ingredients.length - 1; i >= 0; i--) {
                var ingredient = data.ingredients[i];
                if(ingredient.code === code) return ingredient;
            }
            return null;
        }
    }
]);