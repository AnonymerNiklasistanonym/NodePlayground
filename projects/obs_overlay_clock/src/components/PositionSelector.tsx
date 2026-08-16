import { useEffect } from "react";
import { useTranslation } from "../../node_modules/react-i18next";
import {
  positionsHorizontal,
  positionsVertical,
  usePositionStore,
  type PositionHorizontal,
  type PositionVertical,
} from "../stores/positionStore";

export default function PositionSelector() {
  const positionHorizontal = usePositionStore((state) => state.positionHorizontal);
  const positionVertical = usePositionStore((state) => state.positionVertical);
  const setPositionHorizontal = usePositionStore((state) => state.setPositionHorizontal);
  const setPositionVertical = usePositionStore((state) => state.setPositionVertical);
  const { t } = useTranslation();

  useEffect(() => {
    console.log({ positionHorizontal, positionVertical });
  }, [positionHorizontal, positionVertical]);

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
            {t("positionVertical")} {t(code)}
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
            {t("positionHorizontal")} {t(code)}
          </option>
        ))}
      </select>
    </>
  );
}
