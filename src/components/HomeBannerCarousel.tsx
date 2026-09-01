"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const BANNERS = [
  {
    src: "/banners/banner-escorcitas.png",
    href: "https://escorcitas.cl",
    alt: "Publica en Escorcitas.cl — más visibilidad y contactos",
  },
  {
    src: "/banners/banner-chimbis.png",
    href: "https://chimbis.com",
    alt: "Publica en Chimbis — conecta y vende",
  },
  {
    src: "/banners/banner-skokka.png",
    href: "https://skokka.com",
    alt: "Publica en Skokka — avisos destacados",
  },
] as const;

const INTERVAL_MS = 5000;
const SWIPE_THRESHOLD = 40;

export default function HomeBannerCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((next: number) => {
    setIndex((next + BANNERS.length) % BANNERS.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % BANNERS.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    goTo(delta < 0 ? index + 1 : index - 1);
  };

  return (
    <section
      className="home-banner"
      aria-roledescription="carrusel"
      aria-label="Publicidad de sitios de publicación"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="home-banner__viewport">
        <div
          className="home-banner__track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {BANNERS.map((banner) => (
            <a
              key={banner.href}
              href={banner.href}
              className="home-banner__slide"
              target="_blank"
              rel="noopener noreferrer sponsored"
              aria-label={banner.alt}
            >
              <Image
                src={banner.src}
                alt={banner.alt}
                width={1200}
                height={600}
                sizes="(max-width: 520px) 100vw, 460px"
                className="home-banner__img"
                priority={banner.href === BANNERS[0].href}
              />
            </a>
          ))}
        </div>
      </div>

      <div className="home-banner__dots" role="tablist" aria-label="Elegir banner">
        {BANNERS.map((banner, dotIndex) => (
          <button
            key={banner.href}
            type="button"
            role="tab"
            className={`home-banner__dot${dotIndex === index ? " is-active" : ""}`}
            aria-label={`Ver banner ${dotIndex + 1} de ${BANNERS.length}`}
            aria-selected={dotIndex === index}
            onClick={() => goTo(dotIndex)}
          />
        ))}
      </div>
    </section>
  );
}
