// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erro ao registrar");
      }

      // Se o backend retornar os dados do usuário
      const data = await res.json();
      console.log("Registrado com sucesso:", data);

      // Redireciona para login
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Registrar</h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded-xl"
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded-xl"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded-xl"
          required
        />
        <button
          type="submit"
          className="bg-[#F0761F] text-white px-4 py-2 rounded-xl hover:bg-green-600"
        >
          Criar Conta
        </button>
      </form>

      {error && (
        <p className="text-red-500 text-center mt-4">{error}</p>
      )}

      <p className="text-center mt-4 text-gray-600">
        Já tem conta?{" "}
        <Link to="/login" className="text-orange-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
