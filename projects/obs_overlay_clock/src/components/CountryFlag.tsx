import * as Flags from "country-flag-icons/react/3x2";
import { useCountryStore } from "../stores/countryStore";

export function CountryFlag() {
  const country = useCountryStore((state) => state.country);
  if (country == null) return null;

  const Flag = Flags[country as keyof typeof Flags];
  if (!Flag) return null;

  return <Flag title={country} />;
}
