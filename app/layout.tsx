import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aimarketingschool17.vercel.app"),
  title: "AI로 돈이 들어오는 구조 | AI마케팅스쿨 무료특강",
  description: "콘텐츠·광고·홈페이지·AI직원까지 한 줄로 연결하는 구조를 2시간 30분에 공개합니다.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://aimarketingschool17.vercel.app",
    siteName: "AI마케팅스쿨",
    title: "AI로 돈이 들어오는 구조 | AI마케팅스쿨 무료특강",
    description: "콘텐츠·광고·홈페이지·AI직원까지 한 줄로 연결하는 구조를 2시간 30분에 공개합니다.",
    images: [
      {
        url: "https://aimarketingschool17.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI마케팅스쿨 무료특강",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI로 돈이 들어오는 구조 | AI마케팅스쿨 무료특강",
    description: "콘텐츠·광고·홈페이지·AI직원까지 한 줄로 연결하는 구조를 2시간 30분에 공개합니다.",
    images: ["https://aimarketingschool17.vercel.app/og-image.png"],
  },
};

// 메타 픽셀 ID. 변경 시 여기만 수정합니다.
const META_PIXEL_ID = "982117705203167";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preload" href="/fonts/pretendard-variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        {/* Meta Pixel 베이스 코드 (PageView 포함) */}
        <Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}</Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`} />
        </noscript>
        {children}
      </body>
    </html>
  );
}
