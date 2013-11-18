
/* Filters */
/*globals angular */
angular.module('myApp.filters', [])

/*
* returns an amount (as a string) with at most two decimals, and zero decimals if the given igredientDef points to an undevidable ingredient.
* in this case the amount is always rounded up.
*/
.filter("removeExcessDecimals", ['MenuDataLoader', '$filter', '$log', function(dataLoader, $filter, $log){
    return function(ingredientRef){
        var amount = ingredientRef.amount;

        if(angular.isNumber(amount) && amount % 1 > 0){
            var ingredient = dataLoader.getIngredient(ingredientRef.ingredient);
            amount = ingredient.undevidable  ? $filter("number")(amount, 0) : $filter("number")(amount, 2);
            if(amount < ingredientRef.amount) amount++; /*to make sure we always round up*/
        }
        if(ingredientRef.ingredient === "ei"){
            $log.info("en dan:"+amount);
        }
        return amount;
    };
}])

/*
* returns a new ingredientDef, where the amount is multiplied with the ration between the number of people on the menu
* and the number of people on the recipe.
*/
.filter("calculateAmount", ['$log', 'MenuDataLoader', function($log, dataLoader){
    return function(ingredientRef){
        var result = angular.copy(ingredientRef);
        if(result.amount){
            var ratio = dataLoader.getMenu().persons / dataLoader.getRecipe(ingredientRef.recipe).persons;
            result.amount = result.amount * ratio;
        }
        if(ingredientRef.ingredient === "ei"){
            $log.info(result.amount+" eieren");
        }
        return result;
    };

}])


.filter("readableIngredient", ['$log', '$filter', 'MenuDataLoader', 'Tool',
    function($log, $filter, dataLoader, tool) {
    'use strict';
        return function(ingredientRef) {
            var amount, unitName;

            var ingredient = dataLoader.getIngredient(ingredientRef.ingredient);
            if(ingredientRef.amount){
                amount = $filter('removeExcessDecimals')(ingredientRef);
                unitName = resolveUnitName(ingredientRef, amount);
            }
            var ingredientName = resolveIngredientName(ingredientRef, amount);
            var modifier = ingredientRef.modifier;
            var note = ingredientRef.note;
            // return  amount  + " " + unit + " " + (modifier ? modifier + " " : "") + ingredientName + (note ? " (" + note + ")" : "");
            return tool.stringWhen(amount, amount + " ") + tool.stringWhen(unitName, unitName + " ") + tool.stringWhen(modifier, modifier+" ") + ingredientName + tool.stringWhen(note, "("+note+")");
        };



        function resolveUnitName(ingredientRef, amount){
            var unitRef = ingredientRef.unit ? ingredientRef.unit : dataLoader.getIngredient(ingredientRef.ingredient).unit;
            var unit =  unitRef ? dataLoader.getUnit(unitRef) : undefined;
            return unit ?  (amount > 1 && unit.plural ? unit.plural : unit.name) : undefined;
        }

        function resolveIngredientName(ingredientRef, amount){
            var ingredient = dataLoader.getIngredient(ingredientRef.ingredient);
            return amount && amount > 1 && ingredient.plural ? ingredient.plural : ingredient.name;
        }
    }
]);