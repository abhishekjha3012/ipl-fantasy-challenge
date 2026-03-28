
  import { createRoot } from "react-dom/client";
  import App from "./app/App.jsx";
  import { MatchDataProvider } from "./app/MatchDataContext.jsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <MatchDataProvider>
      <App />
    </MatchDataProvider>
  );
  