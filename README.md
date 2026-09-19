# AI마케팅스쿨 17기 무료특강 랜딩페이지

Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion으로 만든 전환형 롱스크롤 랜딩페이지입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

## 환경변수

메타 픽셀 ID는 `app/layout.tsx`의 `META_PIXEL_ID` 상수에 있습니다(환경변수 불필요). 신청 정보는 브라우저에서 구글폼으로 직접 전송합니다.

환경변수가 없는 상태에서도 페이지는 정상 렌더링되며, 신청 API는 설정 누락을 명확한 오류로 반환합니다.
