"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type ProofLightboxImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export function ProofLightbox({ image, onClose, returnFocus, wide = false }: { image: ProofLightboxImage; onClose: () => void; returnFocus?: HTMLElement | null; wide?: boolean }) {
  const [missing, setMissing] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      returnFocus?.focus();
    };
  }, [onClose, returnFocus]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${image.alt} 원본 이미지`}
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/85 px-4 py-16 md:px-8"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        className="fixed right-4 top-4 z-[101] rounded-full bg-white px-4 py-3 text-sm font-black text-ink shadow-xl focus-visible:outline focus-visible:outline-4 focus-visible:outline-accent md:right-8 md:top-8"
        aria-label="확대 이미지 닫기"
      >
        닫기 ✕
      </button>
      <div className={`mx-auto w-full overflow-hidden rounded-lg bg-white shadow-2xl ${wide ? "max-w-[95vw]" : "max-w-5xl"}`}>
        {missing ? (
          <div className="flex min-h-[70vh] items-center justify-center text-slate-500">이미지를 불러오지 못했습니다.</div>
        ) : (
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="100vw"
            className="h-auto w-full"
            onError={() => setMissing(true)}
          />
        )}
      </div>
    </div>
  );
}
