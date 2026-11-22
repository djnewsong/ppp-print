# PPP | DTF 출력, 갱시트 빌더

대구 직영 DTF 공장 PPP의 홈페이지와 60cm 갱시트 빌더입니다. 서버 없이 GitHub Pages에서 바로 돕니다.

## 페이지

- `index.html` — 단가 계산기, 임가공, 열프레스 가이드, 스페셜 라인, FAQ, 주문서 모달
- `builder.html` — 60cm × 1m 갱시트 빌더. 도안 업로드, 크기 프리셋, 자동 배치, 300dpi 출력 파일 생성
- `assets/order.css`, `assets/order.js` — 두 페이지가 함께 쓰는 주문서 모달과 플로팅 상담 바
- `assets/fonts.css` — Pretendard(본문), Space Grotesk(영문·숫자), Instrument Serif(포인트)

## 주문 흐름

서버와 결제 대행을 두지 않습니다. 주문서 모달에서 이름, 연락처, 배송지를 적으면 주문번호(`PPP-YYMMDD-XXXX`)와 주문 내역을 클립보드에 복사하고 카카오톡 채널로 넘깁니다. 입금 계좌는 상담에서 안내합니다.

## 라이선스

폰트는 모두 SIL Open Font License 1.1입니다. Pretendard는 원저작자 배포본을, Space Grotesk와 Instrument Serif는 Google Fonts 배포본을 같은 이름으로 자체 호스팅합니다. 자세한 출처는 `assets/CREDITS.md`에 적어 두었습니다.
