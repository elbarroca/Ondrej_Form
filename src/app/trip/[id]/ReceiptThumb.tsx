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
  return (
    <div className="flex h-32 w-full items-center justify-center rounded-md border border-line bg-paper text-xs text-mute">
      PDF receipt
    </div>
  );
}
