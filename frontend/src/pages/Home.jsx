// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch("/api")
      .then(res => res.json())
      .then(setRecipes)
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {recipes.map(r => (
        <div
          key={r.id}
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center"
        >
          {r.image && (
            <img
              src={r.image}
              alt={r.title}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
          )}
          <h2 className="text-2xl font-semibold text-black-600 mb-6">{r.title}</h2>
          <Link
            to={`/recipe/${r.id}`}
            className="bg-[#F0761F] text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors"
          >
            Ver Detalhes
          </Link>
        </div>
      ))}
    </div>
  );
}
