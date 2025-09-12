// src/pages/RecipeDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetch(`/api/find-recipe-user/${id}`)
      .then((res) => res.json())
      .then(setRecipe)
      .catch(console.error);
  }, [id]);

  if (!recipe) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="max-w-2xl mx-auto py-6 bg-white p-6 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-black-600 mb-2">{recipe.title}</h1>
      <p className="text-gray-500 mb-4">
        Por: {recipe.user?.name || "Desconhecido"}
      </p>

      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
        className="w-full max-h-96 object-cover rounded-xl mb-6"
        />
      )}

      <p className="text-gray-700 mb-6 whitespace-pre-wrap">{recipe.description}</p>

      <Link
        to="/"
        className="mt-6 inline-block text-orange-500 hover:underline"
      >
        Voltar para Home
      </Link>
    </div>
  );
}
