import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";
import "./index.css";
import { ApplicationsProvider } from "./features/applications/ApplicationProvider.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <ApplicationsProvider>
        <App />
      </ApplicationsProvider>
    </HashRouter>
  </StrictMode>,
);
