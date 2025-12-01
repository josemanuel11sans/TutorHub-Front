import { RoutesConfig } from "./routes/RoutesConfig";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <RoutesConfig />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
