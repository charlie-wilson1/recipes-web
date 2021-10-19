import { createContext, useContext, useState } from "react";
import { PropTypes } from "prop-types";

const RecipeContext = createContext();

export function RecipeProvider({ children }) {
  const [recipes, setRecipes] = useState([]);

  const handleSetRecipes = (recipes) => {
    setRecipes(recipes);
  };

  const recipeState = {
    recipes,
    handleSetRecipes,
  };

  return (
    <RecipeContext.Provider value={recipeState}>
      {children}
    </RecipeContext.Provider>
  );
}

RecipeProvider.propTypes = {
  children: PropTypes.node,
};

export function useRecipeContext() {
  return useContext(RecipeContext);
}
