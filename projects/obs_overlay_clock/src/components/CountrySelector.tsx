import { countries } from "country-flag-icons";
import { useCountryStore } from "../stores/countryStore";
import { useTranslation } from "react-i18next";

const NO_COUNTRY = "null" as const;

export default function CountrySelector() {
  const country = useCountryStore((state) => state.country);
  const setCountry = useCountryStore((state) => state.setCountry);

  const { t } = useTranslation();

  return (
    <>
      <select
        value={country ?? NO_COUNTRY}
        onChange={(e) => setCountry(e.target.value === NO_COUNTRY ? null : e.target.value)}
      >
        <option value={NO_COUNTRY}>{t("none")}</option>
        {countries.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
      <button onClick={() => setCountry(null)}>{t("reset")}</button>
    </>
  );
}
