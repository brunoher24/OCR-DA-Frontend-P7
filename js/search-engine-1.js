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

function getMatchesWithRecipes(searchTxt) {
    const formated = searchTxt.toLowerCase();
    return recipes.filter(recipe => {
        if (recipe.name.match(formated) ||
            // recipe.appliance.match(formated) ||
            recipe.description.match(formated) ||
            // recipe.ustensils.join("").match(formated) ||
            recipe.ingredients.map(item => item.ingredient).join("").match(formated)
        ) {
            return true;
        }
        return false;
    });
}

function getMatchesWithRecipesWithIngredientTags(tagWords, filteredRecipes) {
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

function getMatchesWithRecipesWithApplianceTag(tagWord, filteredRecipes) {
    const formatedTagWord = tagWord.toLowerCase();
    return filteredRecipes.filter(recipe => {
        if (!recipe.appliance.toLowerCase().match(formatedTagWord)) {
            return false;
        }
        return true;
    });
}

function getMatchesWithRecipesWithUstensilTags(tagWords, filteredRecipes) {
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