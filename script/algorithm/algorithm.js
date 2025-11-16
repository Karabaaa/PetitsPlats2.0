// Normalisation de texte : minuscules + trim + suppression des accents.
function normalizeText(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

// Vérifie si un texte contient la requête normalisée
function textMatchesQuery(text, normalizedQuery) {
  return normalizeText(text).includes(normalizedQuery);
}

// Recherche principale en utilisant les méthodes de tableau (filter / some).
function searchRecipesWithFunctions(recipes, query) {
  const normalizedQuery = normalizeText(query);

  if (normalizedQuery.length < 3) {
    return recipes;
  }

  return recipes.filter((recipe) => {
    const nameMatches = textMatchesQuery(recipe.name, normalizedQuery);
    const descriptionMatches = textMatchesQuery(
      recipe.description,
      normalizedQuery
    );

    const ingredientsMatch = recipe.ingredients.some((ingredientObj) =>
      textMatchesQuery(ingredientObj.ingredient, normalizedQuery)
    );

    return nameMatches || descriptionMatches || ingredientsMatch;
  });
}

const selectedTags = {
  ingredients: [], // ex: ["coco", "chocolat"]
  appliances: [], // ex: ["four"]
  ustensils: [], // ex: ["casserole"]
};

// Filtrer par tags (intersection)
function filterByTags(recipes, selectedTags) {
  const { ingredients, appliances, ustensils } = selectedTags;

  return recipes.filter((recipe) => {
    // INGREDIENTS : chaque tag doit apparaître dans les ingrédients (ou aucun tag = tout passe)
    const ingredientsOK =
      ingredients.length === 0 ||
      ingredients.every((tag) =>
        recipe.ingredients.some((ingredientObj) =>
          textMatchesQuery(ingredientObj.ingredient, normalizeText(tag))
        )
      );

    // APPAREIL : en général, un seul appareil par recette
    // Si aucun tag appareil sélectionné => OK par défaut
    const applianceOK =
      appliances.length === 0 ||
      appliances.some((tag) =>
        textMatchesQuery(recipe.appliance, normalizeText(tag))
      );

    // USTENSILES : même logique que les ingrédients
    const ustensilsOK =
      ustensils.length === 0 ||
      ustensils.every((tag) =>
        recipe.ustensils.some(
          (ustensil) => textMatchesQuery(ustensil),
          normalizeText(tag)
        )
      );

    return ingredientsOK && applianceOK && ustensilsOK;
  });
}

// Combiner recherche principale + tags
function getFilteredRecipes(allRecipes, query, selectedTags) {
  // 1. Recherche principale (boucles ou fonctionnel)
  const baseResults = searchRecipesWithFunctions(allRecipes, query);
  // const baseResults = searchRecipesWithLoops(allRecipes, query);

  // 2. Filtrage par tags
  const finalResults = filterByTags(baseResults, selectedTags);

  return finalResults;
}
