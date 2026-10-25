export function Dl({ rows, mono }: { rows: [string, React.ReactNode][]; mono?: boolean }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2.5 text-[13px]">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-foreground-tertiary">{k}</dt>
          <dd className={`text-right font-medium [overflow-wrap:anywhere] ${mono ? "text-[12px]" : ""}`}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}
