import { HexAlphaColorPicker } from "react-colorful";
import { useBackgroundColorStore } from "../stores/backgroundColorStore";
import { useTranslation } from "react-i18next";

export default function BackgroundColorSelector() {
  const color = useBackgroundColorStore((state) => state.color);
  const setColor = useBackgroundColorStore((state) => state.setColor);

  const { t } = useTranslation();

  return (
    <>
      <HexAlphaColorPicker color={color} onChange={setColor} />
      <button onClick={() => setColor(null)}>{t("reset")}</button>
    </>
  );
}
