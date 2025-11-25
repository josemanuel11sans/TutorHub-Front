
import { BrowserRouter} from "react-router-dom"; // Importa el Router de react-router-dom
import App from "./App.jsx";
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App/>  
  </BrowserRouter>
);