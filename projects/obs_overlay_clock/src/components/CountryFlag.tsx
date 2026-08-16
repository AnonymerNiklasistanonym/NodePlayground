import * as Flags from "country-flag-icons/react/3x2";

export interface CountryFlagProps {
  country: string;
}

export default function CountryFlag({ country }: CountryFlagProps) {
  const Flag = Flags[country as keyof typeof Flags];
  if (!Flag) return null;

  return <Flag title={country} />;
}
