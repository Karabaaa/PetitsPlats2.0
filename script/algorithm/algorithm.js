// Normalisation de texte : minuscules + trim.
// Tu peux ajouter la suppression des accents si besoin.
function normalizeText(text) {
  return text.toString().trim().toLowerCase();
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
