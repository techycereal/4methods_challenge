import React, { useState, useEffect } from 'react';

const RECIPE_API = 'YOUR_API_URL';

export default function RecipeApp() {
  const [recipes, setRecipes] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Dinner');
  const [ingredients, setIngredients] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', category: '', ingredients: '' });

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    
  };

  const addRecipe = async () => {
    
  };

  const startEditing = (recipe) => {
    setEditingId(recipe.id);
    setEditData({ name: recipe.name, category: recipe.category, ingredients: recipe.ingredients });
  };

  const updateRecipe = async (id) => {
    
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({ name: '', category: '', ingredients: '' });
  };

  const deleteRecipe = async (id) => {
    
  };

  const getCategoryBadge = (category) => {
    const colors = {
      Breakfast: 'bg-yellow-300 text-yellow-900',
      Lunch: 'bg-green-200 text-green-800',
      Dinner: 'bg-purple-200 text-purple-800',
      Dessert: 'bg-pink-200 text-pink-800'
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors[category] || 'bg-gray-200 text-gray-800'}`}>
        {category}
      </span>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-orange-50 shadow-xl rounded-xl mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-orange-700">🍳 Recipe Box</h2>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-lg p-2"
          placeholder="Recipe Name"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg p-2"
        >
          <option>Dinner</option>
          <option>Lunch</option>
          <option>Breakfast</option>
          <option>Dessert</option>
        </select>
        <input
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="border border-gray-300 rounded-lg p-2"
          placeholder="Ingredients (comma separated)"
        />
      </div>

      <button
        onClick={addRecipe}
        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition mb-6"
      >
        Add Recipe
      </button>

      <ul className="space-y-4">
        {recipes.map(recipe => (
          <li
            key={recipe.id}
            className="bg-white p-4 rounded-lg shadow flex flex-col gap-2"
          >
            {editingId === recipe.id ? (
              <div className="space-y-2">
                <input
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full border p-2 rounded-md"
                />
                <select
                  value={editData.category}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                  className="w-full border p-2 rounded-md"
                >
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Dinner</option>
                  <option>Dessert</option>
                </select>
                <input
                  value={editData.ingredients}
                  onChange={(e) => setEditData({ ...editData, ingredients: e.target.value })}
                  className="w-full border p-2 rounded-md"
                  placeholder="Ingredients"
                />
                <div className="space-x-2">
                  <button
                    onClick={() => updateRecipe(recipe.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">{recipe.name}</h3>
                  {getCategoryBadge(recipe.category)}
                </div>
                {recipe.ingredients && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium text-gray-700">Ingredients:</span> {recipe.ingredients}
                  </p>
                )}
                <div className="space-x-4 mt-2">
                  <button
                    onClick={() => startEditing(recipe)}
                    className="text-yellow-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteRecipe(recipe.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
