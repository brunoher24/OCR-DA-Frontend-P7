const tagItems = {
        ingredients: { expanded: false },
        appliance: { expanded: false },
        ustensils: { expanded: false },
    },

    ingredientTags = [],
    ustensilTags = [],

    $textSearchInput = _QS("#search-area input"),
    $tagsContainer = _QS("#tag-words-selected"),
    $recipeCardsList = _QS(".recipe-cards-list"),
    $noResultInRecipes = _QS("#recipes .no-result");

let filteredRecipes = [...recipes],
    ingredients = [],
    appliances = [],
    ustensils = [],
    applianceTag = "";

function setIngredients() {
    const ingredients_ = [];
    filteredRecipes
        .map(recipe => recipe.ingredients.map(ingredient => ingredient.ingredient))
        .join().split(',').forEach(ingredient => {
            if (ingredients_.indexOf(ingredient) === -1) {
                ingredients_.push(ingredient);
            }
        });
    return ingredients_.sort();
}

function setAppliances() {
    const appliances_ = [];
    filteredRecipes
        .map(recipe => recipe.appliance).forEach(appliance => {
            if (appliances_.indexOf(appliance) === -1) {
                appliances_.push(appliance);
            }
        });
    return appliances_.sort();
}

function setUstensils() {
    const ustensils_ = [];
    filteredRecipes
        .map(recipe => recipe.ustensils)
        .join().split(',').forEach(ustensil => {
            ustensil_ = ustensil.charAt(0).toUpperCase() + ustensil.slice(1)
            if (ustensils_.indexOf(ustensil_) === -1) {
                ustensils_.push(ustensil_);
            }
        });
    return ustensils_.sort();
}


function expandFiltertags(selector, tags) {
    if (tagItems[selector].expanded) {
        reduceFiltertags(selector);
        return;
    }

    tagItems[selector].expanded = true;

    const filterSelector = `#${selector}-filter`;

    for (const key in tagItems) {
        if (key !== selector) {
            reduceFiltertags(key);
        }
    }

    const $filterCtnr = _QS(filterSelector);
    const $tagsUls = _QS(filterSelector + " .filter-tags-body");
    $tagsUls.innerHTML = "";

    _QS(filterSelector + " span").style.display = "none";
    _QS(filterSelector + " input").style.display = "block";
    _QS(filterSelector + " i").className = "fas fa-chevron-up";
    $tagsUls.style.display = "flex";

    let $tagsUl = document.createElement("ul");
    $tagsUls.appendChild($tagsUl);
    let separator = 12;
    let width = 140;
    if (tags.length > 24) {
        // console.log(tags.length, tags);
        separator = Math.ceil(tags.length / 2);
    }

    tags.forEach((tag, i) => {
        if (i > 0 && i % separator == 0) {
            $tagsUl = document.createElement("ul");
            $tagsUls.appendChild($tagsUl);
            width += 140;
        }
        const $li = document.createElement("li"),
            $btn = document.createElement("button");
        $btn.innerText = tag;
        $btn.addEventListener("click", () => {
            if (selector === "appliance" && applianceTag) return;
            filteredRecipes = addTag(selector, tag);
            displayMatchingRecipes();
        });

        $tagsUl.appendChild($li);
        $li.appendChild($btn);
    });

    tagItems[selector].width = width + "px"
    $filterCtnr.style.width = width + "px";

    tagItems[selector].loaded = true;
}

function reduceFiltertags(selector) {
    const filterSelector = `#${selector}-filter`;

    _QS(filterSelector + " span").style.display = "block";
    _QS(filterSelector + " input").style.display = "none";
    _QS(filterSelector + " i").className = "fas fa-chevron-down";
    _QS(filterSelector + " .filter-tags-body").style.display = "none";
    _QS(filterSelector).style.width = null;

    tagItems[selector].expanded = false;
}

function displayRecipe(recipe) {
    const ingredients = recipe.ingredients.slice(0, 7).map(item => `<li>${item.ingredient}${item.quantity ? ": "+item.quantity : ""} ${item.unit || ""}</li>`).join("");

    $recipeCardsList.innerHTML += `
    <li>
        <img src="img/cuisine.jpeg" alt="cuisine">
        <div class="recipe-card-bottom">
            <div class="recipe-card-bottom-first-line">
                <h3>${recipe.name}</h3>
                <div class="recipe-card-time-ctnr">
                    <i class="far fa-clock"></i>
                    <span>${recipe.time} min</span>
                </div>
            </div>
            <div class="recipe-card-bottom-second-line">
                <ul class="recipe-ingredients-list">
                    ${ingredients}
                </ul>
                <p>${recipe.description}</p>
            </div>
        </div>
    </li>`;
}


function displayMatchingRecipes() {
    $recipeCardsList.innerHTML = "";
    $noResultInRecipes.innerHTML = "";
    if (filteredRecipes.length === 0) {
        $noResultInRecipes.innerHTML = "<h3>Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.</h3>";
        return;
    }
    filteredRecipes.forEach(recipe => {
        displayRecipe(recipe);
    });
}

function displayMatchingRecipesByText() {
    const searchText = $textSearchInput.value.trim();
    if (searchText.length >= 3) {
        filteredRecipes = getMatchesWithRecipes(searchText);
        displayMatchingRecipes();
    } else {
        filteredRecipes = [...recipes];
        $noResultInRecipes.innerHTML = "";
    }
}

function addTag(selector, tag) {
    const $li = document.createElement("li");
    $tagsContainer.appendChild($li);
    $li.innerText = tag;
    const $btn = document.createElement("button");
    $btn.innerHTML = "<i class='far fa-times-circle'></i>";
    $li.appendChild($btn);
    let i;
    switch (selector) {
        case "ingredients":
            i = ingredientTags.length;
            ingredientTags.push(tag);
            $li.className = "blue";
            $btn.addEventListener("click", () => {
                ingredientTags.splice(i, 1);
                resetFilteredRecipesAfterRemovingTag();
                $tagsContainer.removeChild($li);
            });
            return getMatchesWithRecipesWithIngredientTags(ingredientTags, filteredRecipes);
        case "appliance":
            applianceTag = tag;
            $li.className = "green";
            $btn.addEventListener("click", () => {
                applianceTag = "";
                resetFilteredRecipesAfterRemovingTag();
                $tagsContainer.removeChild($li);
            });
            return getMatchesWithRecipesWithApplianceTag(applianceTag, filteredRecipes);
        case "ustensils":
            i = ustensilTags.length;
            ustensilTags.push(tag);
            $li.className = "red";
            $btn.addEventListener("click", () => {
                ustensilTags.splice(i, 1);
                resetFilteredRecipesAfterRemovingTag();
                $tagsContainer.removeChild($li);
            });
            return getMatchesWithRecipesWithUstensilTags(ustensilTags, filteredRecipes);
        default:
            return [...recipes];
    }
}

function resetFilteredRecipesAfterRemovingTag() {
    displayMatchingRecipesByText();
    console.log(filteredRecipes);
    filteredRecipes = getMatchesWithRecipesWithIngredientTags(ingredientTags, filteredRecipes);
    filteredRecipes = getMatchesWithRecipesWithApplianceTag(applianceTag, filteredRecipes);
    filteredRecipes = getMatchesWithRecipesWithUstensilTags(ustensilTags, filteredRecipes);

    console.log(ingredientTags, applianceTag, ustensilTags);
    displayMatchingRecipes();

}

_QS("#ustensils-filter > .filter-tags-header > button").addEventListener("click", () => {
    ustensils = setUstensils();
    expandFiltertags("ustensils", ustensils);
});

_QS("#ingredients-filter > .filter-tags-header > button").addEventListener("click", () => {
    ingredients = setIngredients();
    expandFiltertags("ingredients", ingredients);
});

_QS("#appliance-filter > .filter-tags-header > button").addEventListener("click", () => {
    appliances = setAppliances();
    expandFiltertags("appliance", appliances);
});

_QS("#search-area input").addEventListener("input", displayMatchingRecipesByText);