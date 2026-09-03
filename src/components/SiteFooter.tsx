import type { ReactNode } from "react";
import { SITE_NAME } from "@/lib/seo";

type Props = {
  note?: ReactNode;
};

export default function SiteFooter({ note }: Props) {
  return (
    <footer className="foot site-footer">
      <div className="site-footer__note">
        {note ?? `${SITE_NAME} · Publicidad y avisos destacados en todo Chile`}
      </div>
    </footer>
  );
}
