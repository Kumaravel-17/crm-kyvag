import Image from "next/image";

// public/kyvag.png: the purple K from kyvag.com, 330 × 395 on a transparent background
const RATIO = 330 / 395;

/** The Kyvag K on its own, `height` px tall */
export function LogoMark({ height = 32, className = "" }: { height?: number; className?: string }) {
  return <Image src="/kyvag.png" alt="" width={Math.round(height * RATIO)} height={height} className={className} />;
}

/** The K followed by the wordmark. `light` is for dark backgrounds. */
export function Logo({ tag, light }: { tag?: string; light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      {/* On dark backgrounds the purple K would disappear, so it turns white */}
      <LogoMark height={30} className={light ? "brightness-0 invert" : ""} />
      <span className="flex items-baseline gap-1.5">
        <span className={`text-[19px] font-bold tracking-[0.04em] ${light ? "text-white" : "text-foreground"}`}>KYVAG</span>
        {tag && (
          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${light ? "bg-white/15 text-white" : "bg-accent/10 text-accent"}`}>
            {tag}
          </span>
        )}
      </span>
    </span>
  );
}
