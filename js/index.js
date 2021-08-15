class FilterTag {
    constructor(selector, color, items, getMatchesWithRecipesWithTagsCallback) {
        this.selector = selector;
        this.color = color;
        this.items = items;
        this.loweredCollection = [];
        this.collection = [];
        this.filteredCollection = [];
        this.tags = [];
        this.expanded = false;
        this.getMatchesWithRecipesWithTags = getMatchesWithRecipesWithTagsCallback;
        this.setHtmlElements();
        this.addEventListeners();
    }

    setHtmlElements() {
        const filterSelector = `#${this.selector}-filter`;
        this.$filterCtnr = _QS(filterSelector);
        this.$expandBtn = _QS(filterSelector + " > .filter-tags-header > button");
        this.$tagsUls = _QS(filterSelector + " .filter-tags-body");
        this.$span = _QS(filterSelector + " span");
        this.$i = _QS(filterSelector + " i");
        this.$input = _QS(filterSelector + " input");
    }

    setCollection() {
        const collection = [];
        this.items().forEach(item => {
            const item_ = item.charAt(0).toUpperCase() + item.slice(1)
            if (collection.indexOf(item_) === -1) {
                collection.push(item_);
            }
        });
        return collection.sort();
    }

    addEventListeners() {
        this.$expandBtn.addEventListener("click", () => {
            if (this.collection.length === 0) {
                this.collection = this.setCollection();
                this.loweredCollection = this.collection.map(tag => tag.toLowerCase());
                this.filteredCollection = [...this.collection];
            } else {
                this.filteredCollection = this.setCollection();
            }

            this.expand();
        });
        this.$input.addEventListener("input", e => {
            const searchText = e.target.value.trim();
            if (searchText.length < 3) return;
            this.filteredCollection = this.setMatchingTags(searchText);
            this.displayTags();
        });
    }

    setMatchingTags(searchText) {
        return this.loweredCollection.filter(tag => tag.match(searchText.toLowerCase()));
    }

    addTag(tag) {
        const $li = document.createElement("li");
        $tagsContainer.appendChild($li);
        $li.innerText = tag;
        const $btn = document.createElement("button");
        $btn.innerHTML = "<i class='far fa-times-circle'></i>";
        $li.appendChild($btn);
        let i = this.tags.length;
        this.tags.push(tag);
        $li.className = this.color;
        $btn.addEventListener("click", () => {
            this.tags.splice(i, 1);
            resetFilteredRecipesAfterRemovingTag();
            $tagsContainer.removeChild($li);
        });
        return this.getMatchesWithRecipesWithTags(this.tags, filteredRecipes);
    }

    expand() {
        if (this.expanded) {
            this.reduce();
            return;
        }

        this.expanded = true;

        for (const key in filterTags) {
            if (key !== this.selector) {
                filterTags[key].reduce();
            }
        }
        this.$span.style.display = "none";
        this.$input.style.display = "block";
        this.$i.className = "fas fa-chevron-up";
        this.$tagsUls.style.display = "flex";

        this.displayTags()
    }

    reduce() {
        this.$span.style.display = "block";
        this.$input.style.display = "none";
        this.$i.className = "fas fa-chevron-down";
        this.$tagsUls.style.display = "none";
        this.$filterCtnr.style.width = null;

        this.expanded = false;
    }

    displayTags() {
        this.$tagsUls.innerHTML = "";
        let $tagsUl = document.createElement("ul");
        this.$tagsUls.appendChild($tagsUl);
        let separator = 12;
        let width = 140;
        if (this.filteredCollection.length > 24) {
            // console.log(tags.length, tags);
            separator = Math.ceil(this.filteredCollection.length / 2);
        }

        this.filteredCollection.forEach((tag, i) => {
            if (i > 0 && i % separator == 0) {
                $tagsUl = document.createElement("ul");
                this.$tagsUls.appendChild($tagsUl);
                width += 140;
            }
            const $li = document.createElement("li"),
                $btn = document.createElement("button");
            $btn.innerText = tag;
            $btn.addEventListener("click", () => {
                if (this.selector === "appliance" && this.tags.length > 0) return;
                filteredRecipes = this.addTag(tag);

                this.$input.value = "";
                displayMatchingRecipes();
            });

            $tagsUl.appendChild($li);
            $li.appendChild($btn);
        });

        this.$filterCtnr.style.width = width + "px";
        // tagItems[this.selector].width = width + "px"
        // tagItems[selector].loaded = true;
    }

}

let filteredRecipes = [...recipes];

const filterTags = {
        ingredients: new FilterTag(
            "ingredients", "blue",
            () => filteredRecipes.map(recipe => recipe.ingredients.map(ingredient => ingredient.ingredient)).join().split(','),
            _getMatchesWithRecipesWithIngredientTags
        ),
        appliance: new FilterTag(
            "appliance", "green",
            () => filteredRecipes.map(recipe => recipe.appliance),
            _getMatchesWithRecipesWithApplianceTag
        ),
        ustensils: new FilterTag(
            "ustensils", "red",
            () => filteredRecipes.map(recipe => recipe.ustensils).join().split(','),
            _getMatchesWithRecipesWithUstensilTags
        ),
    },
    $textSearchInput = _QS("#search-area input"),
    $tagsContainer = _QS("#tag-words-selected"),
    $recipeCardsList = _QS(".recipe-cards-list"),
    $noResultInRecipes = _QS("#recipes .no-result");


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
        filteredRecipes = _getMatchesWithRecipes(searchText);
        displayMatchingRecipes();
    } else {
        filteredRecipes = [...recipes];
        $noResultInRecipes.innerHTML = "";
    }
}

function resetFilteredRecipesAfterRemovingTag() {
    displayMatchingRecipesByText();
    // console.log(filteredRecipes);
    filteredRecipes = _getMatchesWithRecipesWithIngredientTags(filterTags["ingredients"].tags, filteredRecipes);
    filteredRecipes = _getMatchesWithRecipesWithApplianceTag(filterTags["appliance"].tags, filteredRecipes);
    filteredRecipes = _getMatchesWithRecipesWithUstensilTags(filterTags["ustensils"].tags, filteredRecipes);
    // console.log(filteredRecipes, filterTags["ingredients"].tags, filterTags["appliance"].tags, filterTags["ustensils"].tags);
    displayMatchingRecipes();
}

_QS("#search-area input").addEventListener("input", displayMatchingRecipesByText);