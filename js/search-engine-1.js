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
            recipe.appliance.match(formated) ||
            recipe.description.match(formated) ||
            recipe.ustensils.join("").match(formated) ||
            recipe.ingredients.map(item => item.ingredient).join("").match(formated)
        ) {
            return true;
        }
        return false;
    });
}