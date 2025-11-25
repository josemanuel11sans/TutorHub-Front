
import { BrowserRouter} from "react-router-dom"; // Importa el Router de react-router-dom
import App from "./App.jsx";
import { createRoot } from 'react-dom/client'
import "./index.css";

// import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App/>  
    <Toaster position="top-right" reverseOrder={false} />
  </BrowserRouter>
);