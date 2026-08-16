import { useNoteStore } from "../stores/noteStore";
import { useTranslation } from "react-i18next";

export default function NoteInput() {
  const note = useNoteStore((state) => state.note);
  const setNote = useNoteStore((state) => state.setNote);

  const { t } = useTranslation();

  return (
    <>
      <input type="text" value={note ?? ""} onChange={(e) => setNote(e.target.value)} />
      <button onClick={() => setNote(null)}>{t("reset")}</button>
    </>
  );
}
