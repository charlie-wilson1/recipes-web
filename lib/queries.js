export const allRecipesQuery = `
  *[_type == "recipe" && defined(slug.current)] | order(title asc) [] {
    title,
    image,
    cookTime,
    prepTime,
    restTime,
    'slug': slug.current,
  }
`;

export const recipeQuery = `
{
  "currentRecipe": *[_type == "recipe" && slug.current == $slug][0] {
    notes,
    youTubeUrls,
    ingredients,
    instructions,
    title,
    image,
    cookTime,
    prepTime,
    restTime,
    'slug': slug.current,
  },
  "allRecipes": ${allRecipesQuery}
}`;

export const recipeSlugsQuery = `*[_type == "recipe" && defined(slug.current)][].slug.current`;
