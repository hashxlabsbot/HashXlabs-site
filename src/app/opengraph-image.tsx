import { ImageResponse } from "next/og";

/* Default share card for every page without its own (the TOKEN2049 page has
   one). Generated at build time. */

export const alt = "HashX Labs — blockchain and AI engineering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          color: "#fff",
          background: "radial-gradient(80% 90% at 85% 100%, #0b3a8f 0%, #071530 45%, #050914 80%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>
          HASH<span style={{ color: "#3d86ff" }}>X</span>LABS
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3 }}>Smart contracts that</div>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3, color: "#8cf4ff" }}>hold up.</div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "rgba(255,255,255,.75)" }}>
            Blockchain &amp; AI engineering · DeFi · RWA · Custody · Security
          </div>
        </div>
      </div>
    ),
    size
  );
}
