"use client";

import { useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

interface Props {
  value: string;
  onChange: (dataUrl: string) => void;
}

export function SignaturePad({ value, onChange }: Props) {
  const ref = useRef<SignatureCanvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (value) {
      ref.current.fromDataURL(value);
    }
  }, [value]);

  const clear = () => {
    ref.current?.clear();
    onChange("");
  };

  const save = () => {
    if (!ref.current) return;
    if (ref.current.isEmpty()) {
      onChange("");
      return;
    }
    onChange(ref.current.toDataURL("image/png"));
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={wrapperRef}
        className="rounded-md border border-line bg-white"
        style={{ height: 160 }}
      >
        <SignatureCanvas
          ref={(r) => {
            ref.current = r;
          }}
          canvasProps={{
            className: "h-full w-full rounded-md",
            style: { touchAction: "none" },
          }}
          penColor="#0a0a0a"
          onEnd={save}
        />
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={clear} className="btn-ghost">
          Clear
        </button>
        {value ? (
          <span className="self-center text-xs text-mute">Signature saved</span>
        ) : (
          <span className="self-center text-xs text-mute">Sign above</span>
        )}
      </div>
    </div>
  );
}
