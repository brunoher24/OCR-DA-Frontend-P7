// const specialChars = "aàäâ,oöôò,uùüû,iïìî";

// function formatString(str) {
//     const specialChars_ = specialChars.split(',');
//     return str.toLowerCase().split('').map(char => {
//         specialChars_.forEach(specialChar => {
//             if(specialChar.match(char)) {
//                 return specialChar[0];
//             }
//         });
//         return char;
//     }).join('');
// }

// function _getMatchesWithRecipes(searchTxt) {
//     const formated = searchTxt.toLowerCase();
//     return recipes.filter(recipe => {
//         if (recipe.name.match(formated) ||
//             recipe.description.match(formated) ||
//             recipe.ingredients.map(item => item.ingredient).join("").match(formated)
//         ) {
//             return true;
//         }
//         return false;
//     });
// }

const searchRecipes = recipes.map(recipe => {
    return (recipe.name + "|$|" +
        recipe.ingredients.map(item => item.ingredient).join("") + "|$|" +
        recipe.appliance + "|$|" +
        recipe.ustensils.join("")).toLowerCase();
});

function _getMatchesWithRecipes(searchTxt) {
    const formated = searchTxt.toLowerCase();
    return searchRecipes.filter(recipe => {
        return recipe.match(formated);
    });
}

function _getMatchesWithRecipes(searchTxt) {
    const formated = searchTxt.toLowerCase();
    return recipes.filter(recipe => {
        if (recipe.name.match(formated) ||
            recipe.description.match(formated) ||
            recipe.ingredients.map(item => item.ingredient).join("").match(formated)
        ) {
            return true;
        }
        return false;
    });
}

function _getMatchesWithRecipesWithIngredientTags(tagWords, filteredRecipes) {
    if (tagWords.length === 0) return filteredRecipes;
    const formatedTagWords = tagWords.map(tagWord => tagWord.toLowerCase());
    return filteredRecipes.filter(recipe => {
        const formatedIngredients = recipe.ingredients.map(item => item.ingredient.toLowerCase()).join("");
        let output = true;
        for (let i = 0, l = formatedTagWords.length; i < l; i++) {
            const tagWord = formatedTagWords[i];
            if (!formatedIngredients.match(tagWord)) {
                // console.log("not match", formatedIngredients, tagWord)
                output = false;
                break;
            }
        }
        return output;
    });
}

function _getMatchesWithRecipesWithApplianceTag(tagWords, filteredRecipes) {
    if (tagWords.length === 0) return filteredRecipes;
    const formatedTagWord = tagWords[0].toLowerCase();
    return filteredRecipes.filter(recipe => {
        if (!recipe.appliance.toLowerCase().match(formatedTagWord)) {
            return false;
        }
        return true;
    });
}

function _getMatchesWithRecipesWithUstensilTags(tagWords, filteredRecipes) {
    if (tagWords.length === 0) return filteredRecipes;
    const formatedTagWords = tagWords.map(tagWord => tagWord.toLowerCase());
    return filteredRecipes.filter(recipe => {
        const formatedUstensils = recipe.ustensils.map(ustensil => ustensil.toLowerCase()).join("");
        let output = true;
        for (let i = 0, l = formatedTagWords.length; i < l; i++) {
            const tagWord = formatedTagWords[i];
            if (!formatedUstensils.match(tagWord)) {
                // console.log("not match", formatedIngredients, tagWord)
                output = false;
                break;
            }
        }
        return output;
    });
}