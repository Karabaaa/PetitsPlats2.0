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

// Recherche de recettes avec des boucles for
function searchRecipesWithLoops(recipes, query) {
  const normalizedQuery = normalizeText(query);

  // Règle métier : moins de 3 caractères => on ne filtre pas
  if (normalizedQuery.length < 3) {
    return recipes;
  }

  const results = [];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];

    const nameMatches = textMatchesQuery(recipe.name, normalizedQuery);
    const descriptionMatches = textMatchesQuery(
      recipe.description,
      normalizedQuery
    );

    // on fait la vérification dans une autre boucle
    let ingredientsMatch = false;
    for (let j = 0; j < recipe.ingredients.length; j++) {
      const ingredientName = recipe.ingredients[j].ingredient;
      if (textMatchesQuery(ingredientName, normalizedQuery)) {
        ingredientsMatch = true;
        break; // pas besoin de continuer sur les autres ingrédients
      }
    }

    if (nameMatches || descriptionMatches || ingredientsMatch) {
      results.push(recipe);
    }
  }

  return results;
}
