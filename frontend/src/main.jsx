import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/base.css";
import { AppProvider } from "./context/admin/app/AppProvider.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppProvider>
      <App />
    </AppProvider>
  </BrowserRouter>,
);
