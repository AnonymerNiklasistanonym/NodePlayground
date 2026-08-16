import { HexAlphaColorPicker } from "react-colorful";
import { useFontColorStore } from "../stores/fontColorStore";
import { useTranslation } from "react-i18next";

export default function FontColorSelector() {
  const color = useFontColorStore((state) => state.color);
  const setColor = useFontColorStore((state) => state.setColor);

  const { t } = useTranslation();

  return (
    <>
      <HexAlphaColorPicker color={color} onChange={setColor} />
      <button onClick={() => setColor(null)}>{t("reset")}</button>
    </>
  );
}
