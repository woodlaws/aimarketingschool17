"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type TouchEvent } from "react";

const IMAGE_ALT = "AI 1억 수익화 콘텐츠 커머스 플라이휠 8단계 구조도";

export function FlywheelLightbox({ onClose, returnFocus }: { onClose: () => void; returnFocus: HTMLElement | null }) {
  const [zoom, setZoom] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef(0);
  const pinchRef = useRef<{ distance: number; zoom: number } | null>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousScrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const focusable = Array.from(document.querySelectorAll<HTMLElement>("[data-flywheel-dialog] button, [data-flywheel-dialog] a"));
        const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
        if (focusable.length) {
          event.preventDefault();
          focusable[(currentIndex + (event.shiftKey ? focusable.length - 1 : 1)) % focusable.length].focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      returnFocus?.focus({ preventScroll: true });
      const previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, previousScrollY);
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    };
  }, [onClose, returnFocus]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const handlePinch = (event: globalThis.TouchEvent) => {
      if (event.touches.length !== 2 || !pinchRef.current) return;
      event.preventDefault();
      const distance = Math.hypot(
        event.touches[0].clientX - event.touches[1].clientX,
        event.touches[0].clientY - event.touches[1].clientY,
      );
      setZoom(Math.min(4, Math.max(1, pinchRef.current.zoom * distance / pinchRef.current.distance)));
    };
    element.addEventListener("touchmove", handlePinch, { passive: false });
    return () => element.removeEventListener("touchmove", handlePinch);
  }, []);

  const toggleZoom = () => setZoom((value) => value > 1 ? 1 : 2);
  const touchDistance = (event: TouchEvent) => Math.hypot(
    event.touches[0].clientX - event.touches[1].clientX,
    event.touches[0].clientY - event.touches[1].clientY,
  );
  const onTouchStart = (event: TouchEvent) => {
    if (event.touches.length === 2) pinchRef.current = { distance: touchDistance(event), zoom };
  };
  const onTouchEnd = (event: TouchEvent) => {
    if (event.touches.length > 0 || pinchRef.current) {
      if (event.touches.length < 2) pinchRef.current = null;
      return;
    }
    const now = Date.now();
    if (now - lastTapRef.current < 320) {
      toggleZoom();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  return (
    <div
      data-flywheel-dialog
      role="dialog"
      aria-modal="true"
      aria-label="전체 플라이휠 구조도 확대 보기"
      className="flywheel-lightbox"
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <button ref={closeRef} type="button" className="flywheel-lightbox-close" onClick={onClose} aria-label="구조도 닫기">✕</button>
      <div
        ref={scrollRef}
        data-flywheel-zoom-scroll
        className="flywheel-lightbox-scroll"
        onClick={(event) => { if (event.target === event.currentTarget || (event.target as HTMLElement).classList.contains("flywheel-lightbox-canvas")) onClose(); }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className={`flywheel-lightbox-canvas ${zoom > 1 ? "is-zoomed" : ""}`} style={{ width: `${zoom * 100}%` }}>
          <picture onClick={() => { if (window.matchMedia("(hover: hover)").matches) toggleZoom(); }}>
            <source srcSet="/images/flywheel.webp" type="image/webp" />
            <Image src="/images/flywheel.png" alt={IMAGE_ALT} width={1672} height={941} unoptimized className="flywheel-lightbox-image" draggable={false} />
          </picture>
        </div>
      </div>
      <div className="flywheel-lightbox-footer">
        <span>두 번 탭하거나 두 손가락으로 확대</span>
        <a href="/images/flywheel.png" target="_blank" rel="noopener noreferrer">원본 이미지 새 탭으로 열기 ↗</a>
      </div>
    </div>
  );
}
