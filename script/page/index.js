const searchButton = document.getElementById("search-button");
const searchIcon = document.querySelector(".bi-search");
const searchInput = document.getElementById("search-input");

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

// Fonction d'initialisation
async function init() {
  recipes.forEach((recipe) => {
    const recipeModel = recipeTemplate(recipe);
    const recipeCard = recipeModel.getRecipeCardDOM();
    document.querySelector(".recipes-container").innerHTML += recipeCard;
  });
  fillAllDropdowns();
  updateRecipeCount(recipes.length);
}

// Fonction centrale de recherche
function runSearch(query) {
  const filteredRecipes = searchRecipesWithFunctions(recipes, query);
  const container = document.querySelector(".recipes-container");
  container.innerHTML = "";
  filteredRecipes.forEach((recipe) => {
    const recipeModel = recipeTemplate(recipe);
    const recipeCard = recipeModel.getRecipeCardDOM();
    container.innerHTML += recipeCard;
  });
  updateRecipeCount(filteredRecipes.length);
}

// Met à jour dynamiquement le nombre de recettes
function updateRecipeCount(count) {
  const subtitle = document.querySelector(".subtitle");
  const displayCount = count < 10 ? `0${count}` : count;
  subtitle.textContent = `${displayCount} recette${count === 1 ? "" : "s"}`;
}

// Animation couleur bouton recherche + recherche explicite
searchButton.addEventListener("click", function () {
  searchButton.classList.toggle("search-btn-active");
  searchIcon.classList.toggle("text-white");
  runSearch(searchInput.value);
});

// Bouton clear : vide l'input et réaffiche toutes les recettes
const clearButton = document.getElementById("clear-button");
clearButton.addEventListener("click", function () {
  searchInput.value = "";
  runSearch("");
});

// Recherche en direct sur l'input principal
searchInput.addEventListener("input", (event) => {
  runSearch(event.target.value);
});

// Lancement de l'app
init();
