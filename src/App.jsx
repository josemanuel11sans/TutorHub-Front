export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md text-center border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          TutorHub ⚡
        </h1>
        <p className="text-gray-600 mb-6">
          Bienvenido Jos, listo para arrancar con React + Tailwind 4
        </p>

        <button
          className="px-6 py-3 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all duration-200 w-full"
        >
          Probar botón 🚀
        </button>
      </div>
    </div>
  );
}
