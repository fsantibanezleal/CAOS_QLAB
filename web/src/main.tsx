import "@fasl-work/caos-app-shell/styles.css";
import { applyTheme, readTheme } from "@fasl-work/caos-app-shell";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

applyTheme(readTheme());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
