// src/pages/MyRecipes.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch("/api/recipes-by-user", { credentials: "include" })
      .then(res => res.json())
      .then(setRecipes)
      .catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta receita?")) return;

    await fetch(`/api/delete-recipe/${id}`, { method: "POST", credentials: "include" });
    setRecipes(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Minhas Receitas</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(r => (
          <div key={r.id} className="bg-white p-4 rounded-2xl shadow flex flex-col">
            <h2 className="text-xl font-semibold">{r.title}</h2>
         
            <div className="flex justify-between mt-4">
              <Link
                to={`/edit/${r.id}`}
                className="bg-blue-500 text-white px-3 py-1 rounded-xl hover:bg-blue-600"
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(r.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-xl hover:bg-red-600"
              >
                Deletar
              </button>
            </div>
          </div>
        ))}
        {recipes.length === 0 && <p className="text-gray-500">Você ainda não criou nenhuma receita.</p>}
      </div>
    </div>
  );
}
