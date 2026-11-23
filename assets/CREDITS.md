# PPP 사이트 미디어와 디자인 출처

## 디자인 기준 템플릿

2026-11 리뉴얼에서 레이아웃 규격을 참고한 오픈소스 템플릿입니다. 코드를 그대로 복사하지 않고, 그리드 폭과 여백 리듬, 헤더 구조, 섹션 간격, 카드 테두리 기준만 가져와 PPP 색과 타이포로 다시 만들었습니다.

| 저장소 | 라이선스 | 별 | 데모 | 판단 |
|---|---|---|---|---|
| [matt765/Tailcast](https://github.com/matt765/Tailcast) | MIT | 414 | https://tailcast.vercel.app | **채택.** 올다크 배경, 1단 단일 헤더, 넉넉한 섹션 리듬, 상업형 구조(가격, FAQ, CTA) |
| [anthonylan/angie](https://github.com/anthonylan/angie) | MIT | 95 | https://angie.temaly.com | 크림 배경과 스티커 브루탈리즘. 올블랙이 아니라 제외 |
| [heshify/monolume](https://github.com/heshify/monolume) | MIT | 29 | https://monolume.vercel.app | 초대형 타이포와 여백만 참고. 라이트 톤이라 제외 |
| [markhorn-dev/astro-nano](https://github.com/markhorn-dev/astro-nano) | MIT | 957 | https://astro-nano-demo.vercel.app | 다크지만 개발자 블로그형이라 제외 |
| [CloudCannon/urban-jekyll-template](https://github.com/CloudCannon/urban-jekyll-template) | MIT | 185 | https://teal-worm.cloudvent.net | 라이트 에이전시 템플릿이라 제외 |
| [mearashadowfax/ScrewFast](https://github.com/mearashadowfax/ScrewFast) | MIT | 1.4k | https://screwfast.uk | 라이트 커머스 톤이라 제외 |

Tailcast에서 가져온 규격은 `src/styles/Theme.css`와 `src/components/Navbar.astro`에 적힌 값입니다. 컨테이너 폭 62.5rem / 68.75rem / 75rem, 헤더 80px, 카드 테두리 5~15% 화이트, 섹션 상하 리듬(12/24 단위)을 PPP 그리드에 맞춰 다시 잡았습니다.

Tailcast 원문 라이선스: MIT License, Copyright (c) 2022-2026 Mateusz Wyrębek. 전문은 저장소의 `license` 파일에 있습니다. `assets/site.css`와 `builder.html` 상단 주석에도 같은 내용을 적어 두었습니다.

## 사진

사이트에 쓰는 사진은 PPP가 사이트용으로 제작한 스튜디오 컷입니다. 외부에 판매하거나 재배포하지 않고, 홈페이지와 공유 썸네일 배경으로만 사용합니다.

| 파일 | 내용 | 쓰는 곳 |
|---|---|---|
| `scene-hero.jpg` (1122×1402) | 헤비웨이트 검정 티셔츠 뒷면, 웜 톤 콘크리트 스튜디오 | 홈 히어로 |
| `scene-film.jpg` (1536×1024) | 매트한 DTF 전사 필름 롤과 가장자리 도안 | DTF 필름 상단, 홈 서비스 카드 |
| `scene-press.jpg` (1400×1120) | 접어 둔 아이보리, 검정 티셔츠와 열프레스 | 프레스 임가공 상단, 홈 서비스 카드 |
| `scene-special.jpg` (1536×1024) | 렌티큘러 3D 프린트 원단 매크로 | 180cm 승화·스페셜 상단, 홈 서비스 카드 |
| `scene-builder.jpg` (900×1500) | 갱시트 빌더에서 도안을 꽉 채운 60cm × 1m 화면 캡처 | 홈 갱시트 빌더 카드, 빌더 소개 |
| `og-image.jpg` (1200×630) | 로고와 티셔츠 컷 합성 | 카카오톡, 스레드 등 공유 썸네일 |

## 로고

| 파일 | 내용 |
|---|---|
| `logo.png` (640×640) | PPP 로고 원본. 파비콘, 애플 터치 아이콘, 푸터 |
| `logo-band.png` (848×328) | 로고의 삼색 별 띠만 잘라 낸 헤더용 마크 |

## 폰트

폰트는 모두 SIL Open Font License 1.1입니다. Pretendard는 원저작자 배포본을, Space Grotesk와 Instrument Serif는 Google Fonts 배포본을 같은 이름으로 자체 호스팅합니다.

## 이전 버전

2026-11 이전 페이지에 쓰던 Pexels 무료 라이선스 영상과 사진(`hero-fabric.mp4`, `studio-film.mp4`, `photo-*.jpg`)은 새 디자인에서 쓰지 않아 저장소에서 제거했습니다. 이전 커밋에서 확인할 수 있습니다.
