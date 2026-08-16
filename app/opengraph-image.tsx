import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "satumusim: 98 to 97, the closest Premier League title race ever";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0d12",
          padding: "56px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#94a0b1",
            fontSize: 28,
          }}
        >
          <span style={{ color: "#e9eef5", fontWeight: 700, fontSize: 34 }}>
            satumusim
          </span>
          <span>Premier League 2018/19 &middot; a data story</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 36 }}>
          <span
            style={{
              fontSize: 280,
              fontWeight: 800,
              color: "#3e9be0",
              lineHeight: 0.9,
            }}
          >
            98
          </span>
          <span
            style={{
              fontSize: 60,
              color: "#94a0b1",
              lineHeight: 1,
              paddingBottom: 28,
            }}
          >
            to
          </span>
          <span
            style={{
              fontSize: 280,
              fontWeight: 800,
              color: "#f04a5e",
              lineHeight: 0.9,
            }}
          >
            97
          </span>
        </div>
        <div
          style={{
            display: "flex",
            color: "#e9eef5",
            fontSize: 42,
            fontWeight: 600,
          }}
        >
          The closest title race the Premier League has ever seen.
        </div>
      </div>
    ),
    size,
  );
}
