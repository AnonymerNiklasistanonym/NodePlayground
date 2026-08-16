import * as Flags from "country-flag-icons/react/3x2";
import { useCountryStore } from "../stores/countryStore";
import { useTranslation } from "../../node_modules/react-i18next";

export default function CountrySelector() {
  const country = useCountryStore((state) => state.country);
  const setCountry = useCountryStore((state) => state.setCountry);
  const { t } = useTranslation();

  const countryCodes = Object.keys(Flags);

  return (
    <select value={country ?? undefined} onChange={(e) => setCountry(e.target.value)}>
      <option key={"null"} value={"null"}>
        {t("none")}
      </option>
      {countryCodes.map((code) => (
        <option key={code} value={code}>
          {code}
        </option>
      ))}
    </select>
  );
}
