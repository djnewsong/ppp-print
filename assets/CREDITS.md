# PPP 사이트 미디어 출처

Pexels 무료 라이선스(출처 표기 불필요, 상업적 사용 가능) 소재입니다. 재배포·판매는 하지 않고 사이트 배경/섹션 이미지로만 사용합니다.

## 영상

| 파일 | 원본 | 용도 |
|---|---|---|
| `hero-fabric.mp4` (1280×720, 11s loop) | Pexels 30104841 — "Close-up Textured White Fabric Waves" (Nova lv) | 히어로 배경 |
| `studio-film.mp4` (1280×720, 15s loop) | Pexels 4621703 — "A man is working on clothes in a room" (cottonbro studio) | 스튜디오 필름 섹션 |

## 사진

| 파일 | 원본 | 용도 |
|---|---|---|
| `hero-poster.jpg` | `hero-fabric.mp4` 1초 프레임 | 히어로 포스터/저해상 폴백 |
| `studio-poster.jpg` | `studio-film.mp4` 8초 프레임 | 필름 포스터 |
| `photo-rack.jpg` | Pexels 3965557 — 아틀리에 행거와 원단 | 필름 스트립, 상세페이지 |
| `photo-press.jpg` | Pexels 9314012 — 티셔츠 프린트 작업 | 필름 스트립, 상세페이지 |
| `photo-color.jpg` | Pexels 8146451 — 빨강·노랑·파랑 티셔츠 | 필름 스트립, 상세페이지 |
| `photo-fabric.jpg` | Pexels 8465947 — 아이보리 원단의 결 | 강점 섹션 텍스처 밴드 |
| `photo-warm.jpg` | Pexels 37704845 — 햇빛 아래 흰 티셔츠 | 임가공 섹션, 상세페이지 |
| `photo-model.jpg` | Pexels 16069737 — 검정 무지티 착용 컷 | 완성티 섹션 |

상세페이지는 `work/ppp-detail-page/assets/`에 필요한 컷만 복사해 두었습니다.

## 재생성

```bash
python3 .render/build.py
PLAYWRIGHT_BROWSERS_PATH=/workspace/.pw-browsers \
LD_LIBRARY_PATH=/workspace/.deps/root/usr/lib/x86_64-linux-gnu \
python3 .render/shoot_web.py
PLAYWRIGHT_BROWSERS_PATH=/workspace/.pw-browsers \
LD_LIBRARY_PATH=/workspace/.deps/root/usr/lib/x86_64-linux-gnu \
python3 .render/shoot_detail.py
```
