import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aimarketingschool17.vercel.app"),
  title: "AI로 돈이 들어오는 구조 | AI마케팅스쿨 무료특강 (9/18 밤 8시)",
  description: "ChatGPT 2년째 쓰는데 통장은 그대로인 이유. 콘텐츠·광고·홈페이지·AI직원까지 한 줄로 연결하는 구조를 2시간 30분 동안 화면 켜고 보여드립니다. 참가비 0원, 녹화본 없음.",
  openGraph: {
    title: "AI로 돈이 들어오는 구조 | AI마케팅스쿨 무료특강",
    description: "콘텐츠·광고·홈페이지·AI직원까지 한 줄로 연결하는 구조를 2시간 30분 동안 보여드립니다.",
    images: ["/og.png"],
    locale: "ko_KR",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css" />
      </head>
      <body>
        {children}
        {pixelId ? (
          <Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}</Script>
        ) : null}
      </body>
    </html>
  );
}
