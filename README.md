# TAEYANG · QUINTESSENCE

HTML, CSS, JavaScript로 구성한 앨범 소개 페이지입니다.

## 주요 파일

- `index.html`: 전체 페이지 마크업
- `css/style.css`: 스타일 및 반응형 레이아웃
- `js/main.js`: 스크롤 애니메이션, 영상 재생, 앨범 갤러리, 맨 위로 이동
- `js/model-viewer.min.js`: 3D 모델을 표시하는 로컬 라이브러리
- `images/`, `video/`, `fonts/`, `models/`: 원본 미디어

## 실행

`index.html`을 브라우저에서 열면 페이지를 확인할 수 있습니다. 3D 모델까지 확인하려면 브라우저의 로컬 파일 접근 제한 때문에 로컬 서버로 실행해 주세요.

VS Code의 Live Server로 `index.html`을 열거나, Python이 설치되어 있다면 프로젝트 폴더에서 실행합니다.

```sh
python -m http.server 8000
```

브라우저에서 `http://localhost:8000`으로 접속합니다. npm 설치나 빌드는 필요하지 않습니다.

## 배포

프로젝트 폴더를 정적 웹사이트로 배포합니다. Vercel 설정도 일반 정적 사이트에 맞춰 변경했습니다. 이번 작업에서는 실제 배포를 실행하지 않았습니다.

## 확인

Chrome에서 메뉴 연결 및 미디어 경로, 스크롤 구간, 맨 위로 이동 버튼, 3D 컴포넌트 등록, 모바일 크기의 동작 감소 설정을 확인했습니다. 누락된 이미지, 영상 오류, JavaScript 예외가 없었습니다.
