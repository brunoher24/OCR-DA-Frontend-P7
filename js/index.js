const tagItems = {
        ingredients: { loaded: false, expanded: false, width: "180px" },
        appliance: { loaded: false, expanded: false, width: "180px" },
        ustensils: { loaded: false, expanded: false, width: "180px" },
    },
    $searchInput = _QS("#search-area input"),
    $recipeCardsList = _QS(".recipe-cards-list"),
    $noResultInRecipes = _QS("#recipes .no-result");

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

    _QS(filterSelector + " span").style.display = "none";
    _QS(filterSelector + " input").style.display = "block";
    _QS(filterSelector + " i").className = "fas fa-chevron-up";
    $tagsUls.style.display = "flex";

    if (tagItems[selector].loaded) {
        $filterCtnr.style.width = tagItems[selector].width;
        return;
    }

    let $ingredientsUl = document.createElement("ul");
    $tagsUls.appendChild($ingredientsUl);
    let separator = 12;
    let width = 180;
    if (tags.length > 24) {
        console.log(tags.length, tags);
        separator = Math.ceil(tags.length / 2);
    }
    tags.forEach((ingredient, i) => {
        if (i > 0 && i % separator == 0) {
            $ingredientsUl = document.createElement("ul");
            $tagsUls.appendChild($ingredientsUl);
            width += 180;
        }
        $ingredientsUl.innerHTML += `<li><button>${ingredient}</button></li>`;
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
    _QS(filterSelector).style.width = "180px";

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
    const searchText = $searchInput.value.trim();
    if (searchText.length >= 3) {
        const result = getMatchesWithRecipes(searchText);
        $recipeCardsList.innerHTML = "";
        $noResultInRecipes.innerHTML = "";
        if (result.length === 0) {
            $noResultInRecipes.innerHTML = "<h3>Aucun résultat ne correspond à votre recherche</h3>";
            return;
        }
        result.forEach(recipe => {
            displayRecipe(recipe);
        });
    }
}

_QS("#ustensils-filter > .filter-tags-header > button").addEventListener("click", () => {
    expandFiltertags("ustensils", ustensils);
});

_QS("#ingredients-filter > .filter-tags-header > button").addEventListener("click", () => {
    expandFiltertags("ingredients", ingredients);
});

_QS("#appliance-filter > .filter-tags-header > button").addEventListener("click", () => {
    expandFiltertags("appliance", appliances);
});

_QS("#search-area button").addEventListener("click", displayMatchingRecipes);