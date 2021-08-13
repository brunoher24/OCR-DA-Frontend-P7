tagItems = {
    ingredients: { loaded: false, expanded: false, width: "180px" },
    appliance: { loaded: false, expanded: false, width: "180px" },
    ustensils: { loaded: false, expanded: false, width: "180px" },
};

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
    let separator = 11;
    let width = 180;
    if (tags.length > 20) {
        separator = Math.floor(tags.length / 2) + 1;
    }
    tags.forEach((ingredient, i) => {
        if ((i + 1) % separator == 0) {
            $ingredientsUl = document.createElement("ul");
            $tagsUls.appendChild($ingredientsUl);
            width += 180;
        } else {
            $ingredientsUl.innerHTML += `<li><button>${ingredient}</button></li>`;
        }
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



_QS("#ingredients-filter > .filter-tags-header > button").addEventListener("click", () => {
    expandFiltertags("ingredients", ingredients);
});

_QS("#appliance-filter > .filter-tags-header > button").addEventListener("click", () => {
    expandFiltertags("appliance", appliances);
});

_QS("#ustensils-filter > .filter-tags-header > button").addEventListener("click", () => {
    expandFiltertags("ustensils", ustensils);
});