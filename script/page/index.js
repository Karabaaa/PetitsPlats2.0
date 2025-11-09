const searchButton = document.getElementById("search-button");
const searchIcon = document.querySelector(".bi-search");
searchButton.addEventListener("click", function () {
  searchButton.classList.toggle("search-btn-active");
  searchIcon.classList.toggle("text-white");
});

//console.log(recipes);

async function init() {
  recipes.forEach((recipe) => {
    const recipeModel = recipeTemplate(recipe);
    const recipeCard = recipeModel.getRecipeCardDOM();
    document.querySelector(".recipes-container").innerHTML += recipeCard;
  });

  fillAllDropdowns();
}

init();

function populateDropdownItems(selector, items) {
  const container = document.querySelector(selector);
  container.innerHTML = ""; // Vide le container avant d'ajouter
  items.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("dropdown-item");
    li.innerHTML = item;
    container.appendChild(li);
  });
}

function getUniqueSortedList(array) {
  return Array.from(new Set(array)).sort(); // Set = collection qui ne contient que des valeurs uniques, si j'utilise [] je peux avoir des doublons.
}

function fillAllDropdowns() {
  const ingredients = recipes.flatMap((r) =>
    r.ingredients.map((i) => i.ingredient.toLowerCase())
  );
  // rassemble tous les tableaux d’ingrédients en un seul grand tableau.
  populateDropdownItems(
    ".dropdown-items-ingredients",
    getUniqueSortedList(ingredients)
  );

  const appliances = recipes.map((r) => r.appliance.toLowerCase());
  populateDropdownItems(
    ".dropdown-items-appliances",
    getUniqueSortedList(appliances)
  );

  const ustensils = recipes.flatMap((r) =>
    r.ustensils.map((u) => u.toLowerCase())
  );
  populateDropdownItems(
    ".dropdown-items-ustensils",
    getUniqueSortedList(ustensils)
  );
}
