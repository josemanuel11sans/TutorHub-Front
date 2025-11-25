import { useState } from "react";

export const LoginForm = ({ onSubmit, loading, error }) => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => { e.preventDefault(); onSubmit(form); };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f9ff]">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Sistema de Gestión Educativa <span className="text-blue-600">TutorHub</span>
        </h1>

        <p className="text-center text-gray-500 mt-1 mb-6">
          Ingresa tu correo institucional
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-700 text-sm">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="ejemplo@utez.edu.mx"
              required
            />
          </div>

          <div>
            <label className="text-gray-700 text-sm">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="mt-6">
          <button className="w-full border py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="font-medium text-gray-700">Ingresar con Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};
