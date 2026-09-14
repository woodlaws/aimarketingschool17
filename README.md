# AI마케팅스쿨 17기 무료특강 랜딩페이지

GitHub 저장소에 업로드한 뒤 Vercel에서 바로 배포할 수 있는 정적 사이트 패키지입니다.

## 포함 파일

- `index.html`: 랜딩페이지 본문
- `styles.css`: 반응형 디자인
- `script.js`: 신청폼 검증과 화면 동작
- `assets/`: 페이지 이미지
- `vercel.json`: Vercel 정적 배포 설정

## GitHub → Vercel 배포

1. GitHub에서 빈 저장소를 만듭니다.
2. 이 폴더 안의 파일을 저장소 최상위에 업로드하고 `main` 브랜치에 커밋합니다.
3. Vercel에서 **Add New → Project**를 선택합니다.
4. 해당 GitHub 저장소를 Import합니다.
5. Framework Preset은 **Other**, Root Directory는 `./`로 둡니다.
6. Build Command와 Output Directory는 비워 둔 채 Deploy합니다.

이후 `main` 브랜치에 변경사항을 올리면 Vercel이 자동으로 다시 배포합니다.

## 중요

현재 신청폼은 화면 입력 검증까지 구현되어 있습니다. 실제 신청 접수를 저장하거나 전송하려면 별도의 폼·데이터베이스·자동화 서비스 연결이 필요합니다.
