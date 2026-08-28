import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function NotFound() {
  const { t } = useTranslation();

  return (
    <main>
      <h1>404</h1>
      <p>{t("page-not-found")}</p>
      <p>{t("page-not-found-pages")}</p>
      <ul>
        <li>
          <Link to="/">{t("page-home-title")}</Link>
        </li>
        <li>
          <Link to="/edit">{t("page-edit-title")}</Link>
        </li>
      </ul>
    </main>
  );
}

export default NotFound;
