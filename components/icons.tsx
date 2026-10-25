import type { SVGProps } from "react";
import type { Channel } from "@/lib/data";

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
});

/* Channel glyphs: simplified monoline marks, not official logos */
const CH: Record<Channel, (p: P) => React.ReactElement> = {
  instagram: (p) => (<svg {...base(p)}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".6" fill="currentColor" /></svg>),
  facebook: (p) => (<svg {...base(p)}><path d="M14.5 21v-7.5H17l.5-3h-3V8.6c0-.9.4-1.6 1.7-1.6h1.4V4.3A17 17 0 0 0 15.5 4c-2.6 0-4 1.5-4 4.2v2.3H9v3h2.5V21" /></svg>),
  whatsapp: (p) => (<svg {...base(p)}><path d="M4 20l1.2-3.8A8.5 8.5 0 1 1 8 19z" /><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .8a4.5 4.5 0 0 1-2.2-2.2l.8-1-1-2z" /></svg>),
  google: (p) => (<svg {...base(p)}><path d="M20 12.2h-8v3.2h4.6A5 5 0 1 1 15.3 7.6l2.3-2.3A8.3 8.3 0 1 0 20.3 12.2z" /></svg>),
  youtube: (p) => (<svg {...base(p)}><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="m10 9 5 3-5 3z" fill="currentColor" /></svg>),
  website: (p) => (<svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z" /></svg>),
  linkedin: (p) => (<svg {...base(p)}><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M8 10.5V16M8 7.8v.1M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.3-2.6 1.4 0 2.2.9 2.2 2.6V16" /></svg>),
  csv: (p) => (<svg {...base(p)}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 13h6M9 16h6M9 10h2" /></svg>),
  referral: (p) => (<svg {...base(p)}><path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z" /></svg>),
  email: (p) => (<svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6 8.5 7 8.5-7" /></svg>),
  sms: (p) => (<svg {...base(p)}><path d="M4 5h16v11H9l-5 4z" /><path d="M8 10h.01M12 10h.01M16 10h.01" /></svg>),
};

export function ChannelGlyph({ channel, ...p }: { channel: Channel } & P) {
  return CH[channel](p);
}
