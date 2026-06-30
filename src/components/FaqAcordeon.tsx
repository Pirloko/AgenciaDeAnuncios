"use client";

import { useState } from "react";
import Link from "next/link";
import { enlaceFaqAnuncios } from "@/lib/anuncios-seo";

export default function FaqAcordeon({
  sitioSlug,
  faq,
}: {
  sitioSlug: string;
  faq: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card faq faq--acordeon">
      <button
        type="button"
        className="faq-acordeon__hdr"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="faq-acordeon-panel"
      >
        <span className="faq-acordeon__title">Preguntas frecuentes</span>
        <span className="faq-acordeon__icon" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <dl id="faq-acordeon-panel" className="faq faq--solo-preguntas faq-acordeon__panel">
          {faq.map((f, i) => (
            <dt key={i}>
              <Link href={enlaceFaqAnuncios(sitioSlug, f.q, i)}>{f.q}</Link>
            </dt>
          ))}
        </dl>
      )}
    </div>
  );
}
