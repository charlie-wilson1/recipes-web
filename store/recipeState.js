import { createContext, useContext, useState } from 'react';

const RecipeContext = createContext();

export function RecipeProvider({ children }) {
  const [recipes, setRecipes] = useState([]);

  const handleSetRecipes = recipes => {
    setRecipes(recipes);
  }

  const recipeState = {
    recipes,
    handleSetRecipes
  }

  return (
    <RecipeContext.Provider value={recipeState}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipeContext() {
  return useContext(RecipeContext);
}