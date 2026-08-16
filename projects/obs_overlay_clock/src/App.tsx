import { useEffect } from "react";
import { useTranslation } from "../node_modules/react-i18next";
import { HashRouter, Route, Routes } from "react-router-dom";
import Overlay from "./pages/Overlay";

function App() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("pageTitle");
  }, [t]);

  // HashRouter enables multiple routes using the '/#' prefix
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Overlay edit={false} />} />
        <Route path="/edit" element={<Overlay edit={true} />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
