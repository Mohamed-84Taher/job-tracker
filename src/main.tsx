import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ApplicationsProvider } from "./features/applications/ApplicationProvider.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApplicationsProvider>
      <App />
    </ApplicationsProvider>
  </StrictMode>,
);
