import { useTranslation } from "../../node_modules/react-i18next";
import { useCallback } from "react";
import { useNoteStore } from "../stores/noteStore";

export default function NoteInput() {
  const note = useNoteStore((state) => state.note);
  const setNote = useNoteStore((state) => state.setNote);
  const { t } = useTranslation();

  const reset = useCallback(() => setNote(null), [setNote]);

  return (
    <>
      <input type="text" value={note ?? ""} onChange={(e) => setNote(e.target.value)} />
      <br />
      <button onClick={reset}>{t("reset")}</button>
    </>
  );
}
