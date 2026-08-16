import { FONT_FAMILY_DEFAULT, useFontFamilyStore } from "../stores/fontFamilyStore";
import { useTranslation } from "react-i18next";

export default function FontFamilyInput() {
  const fontFamily = useFontFamilyStore((state) => state.fontFamily);
  const setFontFamily = useFontFamilyStore((state) => state.setFontFamily);

  const { t } = useTranslation();

  return (
    <>
      <input
        type="text"
        value={fontFamily ?? FONT_FAMILY_DEFAULT}
        onChange={(e) => setFontFamily(e.target.value)}
      />
      <br />
      <button onClick={() => setFontFamily(null)}>{t("reset")}</button>
    </>
  );
}
