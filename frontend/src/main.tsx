import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "./tailwind.css";
import "./mapbox.css";
import "./result.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
