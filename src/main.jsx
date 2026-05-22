// src/main.jsx
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import AppLoadingScreen from "@/components/common/AppLoadingScreen";
import App from "./App";
import "./index.css";
import "./lang/i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback={<AppLoadingScreen />}>
      <App />
    </Suspense>
  </React.StrictMode>
);
