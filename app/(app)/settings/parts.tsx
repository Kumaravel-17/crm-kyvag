// Small controls shared by the settings cards

export const fieldLabel = "flex flex-col gap-1 text-[12px] font-semibold text-foreground-secondary";
export const input =
  "rounded-lg border border-input-border bg-input-bg px-3 py-2 text-[13px] font-normal text-foreground outline-none transition-colors focus:border-accent disabled:opacity-60";

export function InlineError({ message }: { message: string | null }) {
  if (!message) return null;
  return <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-[12.5px] font-medium text-error">{message}</p>;
}
