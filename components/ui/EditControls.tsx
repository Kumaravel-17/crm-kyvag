import { Pencil } from "lucide-react";
import { Button } from "./Button";

export function SaveBar({ onSave, onCancel, saving, saveLabel = "Save changes" }: { onSave: () => void; onCancel: () => void; saving?: boolean; saveLabel?: string }) {
  return (
    <div className="flex justify-end gap-2 border-t border-border px-4 py-2.5 sm:px-5">
      <Button variant="ghost" size="sm" onClick={onCancel} disabled={saving}>Cancel</Button>
      <Button size="sm" onClick={onSave} disabled={saving}>{saving ? "Saving…" : saveLabel}</Button>
    </div>
  );
}

export function EditButton({ onClick, children = "Edit" }: { onClick: () => void; children?: React.ReactNode }) {
  return <Button variant="secondary" size="sm" onClick={onClick}><Pencil />{children}</Button>;
}
