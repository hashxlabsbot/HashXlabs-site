import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/* Share card for /token2049: the same Marina Bay photo as the hero (cropped by
   scripts/make-marina.mjs), faded into navy under the headline. Generated at
   build time. */

export const alt = "HashX Labs at TOKEN2049 Singapore, 7–10 October 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const photo = await readFile(join(process.cwd(), "public/img/marina-og.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#050914", color: "#fff" }}>
        <img src={src} width={1200} height={630} alt="" style={{ position: "absolute", inset: 0, width: 1200, height: 630 }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "linear-gradient(90deg, rgba(5,9,20,.96) 0%, rgba(5,9,20,.86) 38%, rgba(5,9,20,.25) 68%, rgba(5,9,20,.05) 100%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", padding: "56px 64px", width: 760 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", padding: "8px 16px", borderRadius: 999, background: "#fff", color: "#050914", fontSize: 20, fontWeight: 700, letterSpacing: 2 }}>
              TOKEN2049
            </div>
            <div style={{ display: "flex", fontSize: 22, color: "rgba(255,255,255,.8)" }}>Singapore · 7–8 Oct 2026</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 40, fontSize: 96, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}>
            <span>See you in</span>
            <span style={{ color: "#8cf4ff" }}>Singapore.</span>
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 28, lineHeight: 1.35, color: "rgba(255,255,255,.8)" }}>
            HashX Labs · blockchain &amp; AI engineering. Meet us 7–10 October, Marina Bay Sands.
          </div>
        </div>
      </div>
    ),
    size
  );
}
