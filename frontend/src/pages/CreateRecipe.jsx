// src/pages/CreateRecipe.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateRecipe() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null); // estado para o arquivo
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Criar FormData para enviar arquivo + dados
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) formData.append("image", file); // nome do campo que o backend espera

    await fetch("/api/create-recipe", {
      method: "POST",
      body: formData, // FormData já define o Content-Type correto
      credentials: "include", // envia cookies de sessão
    });

    navigate("/");
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Criar Receita</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded-xl"
          required
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 border rounded-xl"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])} // seleciona arquivo
        />
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600"
        >
          Criar
        </button>
      </form>
    </div>
  );
}
