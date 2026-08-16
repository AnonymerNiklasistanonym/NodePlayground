import {
  type PositionHorizontal,
  type PositionVertical,
  positionsHorizontal,
  positionsVertical,
  usePositionStore,
} from "../stores/positionStore";
import { useTranslation } from "react-i18next";

export default function PositionSelector() {
  const positionHorizontal = usePositionStore((state) => state.positionHorizontal);
  const positionVertical = usePositionStore((state) => state.positionVertical);
  const setPositionHorizontal = usePositionStore((state) => state.setPositionHorizontal);
  const setPositionVertical = usePositionStore((state) => state.setPositionVertical);

  const { t } = useTranslation();

  return (
    <>
      <select
        value={positionVertical}
        onChange={(e) => {
          setPositionVertical(e.target.value as PositionVertical);
          setPositionHorizontal(positionHorizontal);
        }}
      >
        {positionsVertical.map((code) => (
          <option key={code} value={code}>
            {t("positionVertical")}: {t(code)}
          </option>
        ))}
      </select>
      <select
        value={positionHorizontal}
        onChange={(e) => {
          setPositionHorizontal(e.target.value as PositionHorizontal);
          setPositionVertical(positionVertical);
        }}
      >
        {positionsHorizontal.map((code) => (
          <option key={code} value={code}>
            {t("positionHorizontal")}: {t(code)}
          </option>
        ))}
      </select>
    </>
  );
}
