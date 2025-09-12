// src/components/Header.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-[#C21023] text-white p-4 flex justify-between items-center">
    <Link to="/" >
    <img 
        src="/saboro_logo.png" 
        alt="logo saboro" 
        className="w-12 h-12 object-contain" 
    />
    </Link>

  <div className="flex items-center gap-6">
    {user && (
      <Link
        to="/create"
        className="bg-white text-orange-500 font-medium px-3 py-1 rounded-xl hover:bg-gray-100 transition"
      >
        Criar Receita
      </Link>
    )}

    {!user ? (
      <div className="flex gap-4 mx-4">
        <Link to="/login" className="hover:underline">Login</Link>
        <Link to="/register" className="hover:underline">Registrar</Link>
      </div>
    ) : (
      <div className="relative mx-4">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2"
        >
          <span>{user.name}</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow">
            <Link
              to="/my-recipes"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Minhas receitas
            </Link>
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    )}
  </div>
</header>

  );
}
