import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

// StrictMode is intentionally off: its double-invoked effects spin up two
// WebGL contexts and two GSAP timelines per mount in dev, which makes the
// scroll-driven scenes impossible to judge. Every effect here still cleans
// up after itself.
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
