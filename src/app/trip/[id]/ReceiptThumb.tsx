"use client";

import { useEffect, useMemo, useState } from "react";

export function ReceiptThumb({ blob, type }: { blob: Blob; type: string }) {
  const url = useMemo(() => URL.createObjectURL(blob), [blob]);
  const [revoked, setRevoked] = useState(false);

  useEffect(() => () => URL.revokeObjectURL(url), [url]);

  if (revoked) return null;

  if (type.startsWith("image/")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt="receipt"
        className="h-32 w-full rounded-md object-cover"
        onError={() => setRevoked(true)}
      />
    );
  }
  if (type === "application/pdf") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="group relative block h-32 w-full overflow-hidden rounded-md border border-line bg-white"
        title="Open PDF"
      >
        <object
          data={`${url}#toolbar=0&navpanes=0&view=FitH`}
          type="application/pdf"
          aria-label="PDF preview"
          className="pointer-events-none h-[260px] w-full origin-top-left scale-[0.5]"
        />
        <span className="absolute right-1 top-1 rounded bg-ink/85 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-paper">
          PDF
        </span>
      </a>
    );
  }
  return (
    <div className="flex h-32 w-full items-center justify-center rounded-md border border-line bg-paper text-xs text-mute">
      Receipt
    </div>
  );
}
