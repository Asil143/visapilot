import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "StatusClock — A new country. A clearer path.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f7f5ed",
        color: "#203b30",
        padding: "60px 76px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 29,
            letterSpacing: "-1px",
            fontWeight: 600,
          }}
        >
          <svg width="38" height="38" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="15" stroke="#203b30" strokeWidth="1.5" />
            <path
              d="M18 10v8l6 4M18 4v3M18 29v3M4 18h3M29 18h3"
              stroke="#203b30"
              strokeWidth="1.5"
            />
          </svg>
          <span>StatusClock</span>
        </div>
        <div style={{ fontSize: 13, letterSpacing: "3px" }}>
          YOUR U.S. IMMIGRATION COMPANION
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 80,
            lineHeight: 1.1,
            fontFamily: "serif",
            letterSpacing: "-3px",
          }}
        >
          <span>A new country.</span>
          <span style={{ color: "#ac4c32" }}>A clearer path.</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 210,
            height: 260,
            background: "#203f32",
            color: "#d4e4a4",
            borderRadius: "100px 100px 8px 8px",
            transform: "rotate(8deg)",
            fontSize: 115,
          }}
        >
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <path
              d="M24 76 76 24M25 24h51v51"
              stroke="#d4e4a4"
              strokeWidth="5"
            />
          </svg>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 24,
          borderTop: "1px solid #cdd4c2",
          fontSize: 18,
          color: "#687166",
        }}
      >
        <span>Visa guides. Planning tools. Your next chapter.</span>
        <span>statusclock.com</span>
      </div>
    </div>,
    { ...size },
  );
}
