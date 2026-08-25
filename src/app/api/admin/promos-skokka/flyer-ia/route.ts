import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { NUMERO_WHATSAPP } from "@/lib/whatsapp";
import { clp } from "@/lib/precios";
import {
  SKOKKA_PROMO_HORARIOS,
  SKOKKA_PROMO_PLANES,
  SKOKKA_PROMO_PLAN_LABEL,
  etiquetaComboSkokka,
} from "@/lib/promos-pagina-skokka";

type Body = {
  subidas: number;
  dias: number;
  /** plan → horarios → precio CLP */
  precios: Record<string, Record<string, number>>;
};

function formatoWhatsApp(num: string): string {
  if (num.length === 11 && num.startsWith("56")) {
    return `+${num.slice(0, 2)} ${num.slice(2, 3)} ${num.slice(3, 7)} ${num.slice(7)}`;
  }
  return `+${num}`;
}

async function cargarReferencia(): Promise<{
  mediaType: "image/png" | "image/jpeg" | "image/webp" | "image/gif";
  data: string;
}> {
  const filePath = path.join(
    process.cwd(),
    "assets",
    "flyer-skokka-referencia.png"
  );
  const buf = await readFile(filePath);
  const mediaType =
    buf[0] === 0xff && buf[1] === 0xd8
      ? "image/jpeg"
      : buf[0] === 0x89 && buf[1] === 0x50
        ? "image/png"
        : buf[0] === 0x52 && buf[1] === 0x49
          ? "image/webp"
          : buf[0] === 0x47 && buf[1] === 0x49
            ? "image/gif"
            : "image/jpeg";
  return { mediaType, data: buf.toString("base64") };
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Falta ANTHROPIC_API_KEY. Agrégala en cotizador-destacados/.env o .env.local y reinicia npm run dev.",
      },
      { status: 503 }
    );
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const subidas = Number(body.subidas);
  const dias = Number(body.dias);
  if (![3, 6].includes(subidas) || ![1, 3, 7].includes(dias)) {
    return NextResponse.json({ error: "Combo inválido" }, { status: 400 });
  }

  const badge = etiquetaComboSkokka(subidas, dias);
  const wa = formatoWhatsApp(NUMERO_WHATSAPP);

  const bloques = SKOKKA_PROMO_PLANES.map((plan) => {
    const label = SKOKKA_PROMO_PLAN_LABEL[plan];
    const filas = SKOKKA_PROMO_HORARIOS.map((h) => {
      const precio = body.precios?.[plan]?.[String(h)];
      if (typeof precio !== "number" || precio < 0) {
        throw new Error(`Falta precio para ${label} · ${h} horarios`);
      }
      return { horarios: h, precio, precioFmt: clp(precio) };
    });
    return { plan, label, filas, esAllInOne: plan === "FULL DESTACADO" };
  });

  const datosFijos = {
    badge,
    whatsapp: wa,
    whatsappPlain: NUMERO_WHATSAPP,
    slogan: "¡NUESTROS ANUNCIOS VENDEN!",
    marca: "skokka",
    planes: bloques,
  };

  let referencia: { mediaType: "image/png" | "image/jpeg" | "image/webp" | "image/gif"; data: string };
  try {
    referencia = await cargarReferencia();
  } catch {
    return NextResponse.json(
      {
        error:
          "No se encontró assets/flyer-skokka-referencia.png. Vuelve a guardar la imagen de referencia.",
      },
      { status: 500 }
    );
  }

  const prompt = `La imagen adjunta es la REFERENCIA VISUAL OBLIGATORIA del flyer.
Debes CLONAR ese diseño lo más fiel posible (layout, jerarquía, colores, badges, cards, CTA verde).
No inventes otro estilo. No hagas un diseño genérico distinto. No agregues sidebar lateral ni franja inferior extra que no estén en la foto.

Devuelve SOLO HTML válido: un único <div>...</div> raíz.
Sin markdown, sin \`\`\`, sin explicaciones, sin <html>/<head>/<body>, sin <script>, sin <img> externas, sin URLs.

DATOS DINÁMICOS (únicos valores que puedes cambiar respecto a la referencia):
${JSON.stringify(datosFijos, null, 2)}

REGLAS DE CONTENIDO:
1) Banner amarillo superior: "!NUEVOS VALORES REBAJADOS¡" (como la referencia).
2) Badge del combo: píldora amarilla con cohete + usa EXACTAMENTE "badge" del JSON (ej. "3 SUBIDAS 3 DÍAS"), no el de la foto si difiere.
3) Precios: en cada plan usa SOLO las filas del JSON con precioFmt EXACTO. No inventes, no redondees, no copies precios de la foto.
4) Planes en este orden:
   - TOP (borde/textos rosa #E5167B, pestaña rosa, ícono gráfico)
   - SUPER TOP (borde/textos morado #5B2C8A, pestaña morada, ícono corona)
   - ★ TOP ALL IN ONE ★ (borde/textos naranja/dorado #E8910A, pestaña naranja, ícono diamante) + nota megáfono: "Incluye ubicación en SUPER TOP + etiqueta NOVEDAD (máxima exposición)."
5) Badge circular rosa a la derecha del headline: "MÁS VISIBILIDAD / MÁS CLIENTES / MÁS RESULTADOS" (blanco, con estrella).
6) CTA verde inferior como la referencia: ícono WhatsApp con notificación "1", "¡PUBLICA AHORA!", subtítulo WhatsApp, "RESPUESTA RÁPIDA ⚡", botón amarillo "ESCRÍBENOS AHORA" + cursor mano.
   Junto o bajo el CTA muestra el número EXACTO: ${wa}
7) Logo skokka: círculo rosa con corazón blanco + texto "skokka" rosa. Slogan "¡NUESTROS ANUNCIOS VENDEN!" con VENDEN! más grande y magenta.

LAYOUT TÉCNICO (igual a la referencia — flyer vertical limpio, SIN sidebar izquierda):
- Contenedor raíz width:720px; padding generoso; background degradado rosa suave → blanco; patrón de puntos halftone sutil en esquinas (CSS radial-gradient o similar); box-sizing:border-box; border-radius ~24px.
- Header centrado: banner amarillo → logo → slogan → badge circular flotante a la derecha → píldora amarilla del combo.
- Tres cards blancas con sombra suave, border-radius ~18px, borde de color del plan, título tipo pestaña centrada sobre el borde superior, ícono circular arriba-derecha, filas "N Horario(s)" …… precio con puntos líderes del mismo color del plan.
- Footer CTA verde ancho completo, border-radius ~16px, layout flex (WhatsApp | textos | botón amarillo).
- Tipografía sans-serif muy bold (Arial Black, Impact, Montserrat vía font-family genérico).
- TODO el CSS debe ir INLINE en style="" (no uses <style>).
- Emojis/íconos unicode OK (🚀 ★ ♥ ⚡ 📢 👑 💎 📈 etc.).

Prioridad: fidelidad visual a la imagen > creatividad. Precios del JSON > precios de la foto.

Responde únicamente con el HTML.`;

  try {
    const anthropic = new Anthropic({ apiKey });
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: referencia.mediaType,
                data: referencia.data,
              },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    });

    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => ("text" in b ? b.text : ""))
      .join("\n")
      .trim();

    let html = text;
    const fence = text.match(/```(?:html)?\s*([\s\S]*?)```/i);
    if (fence?.[1]) html = fence[1].trim();

    const divMatch = html.match(/<div[\s\S]*<\/div>\s*$/i);
    if (divMatch) html = divMatch[0];

    if (!html.toLowerCase().includes("<div")) {
      return NextResponse.json(
        { error: "La IA no devolvió HTML válido. Reintenta." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      html,
      model: message.model,
      usage: message.usage,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error Anthropic";
    console.error("flyer-ia:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
