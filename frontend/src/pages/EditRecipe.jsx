// src/pages/EditRecipe.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditRecipe() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/find-recipe/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setDescription(data.description);
        setPreview(data.image); // mostra a imagem atual como preview
      })
      .catch(console.error);
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    await fetch(`/api/edit-recipe/${id}`, {
      method: "POST", // ou PUT, depende de como você definiu no backend
      body: formData,
      credentials: "include",
    });

    navigate("/my-recipes");
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Receita</h1>
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
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-xl"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setImage(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
          }}
          className="p-2 border rounded-xl"
        />
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}
