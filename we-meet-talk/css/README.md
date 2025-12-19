# CSS 파일 구조 가이드

## 📁 디렉토리 구조

```
css/
├── main.css                 # 메인 진입점 (모든 CSS import)
├── variables.css            # CSS 변수 (디자인 시스템)
├── reset.css                # CSS 리셋
├── layout.css               # 레이아웃 & 애니메이션
│
├── components/              # 재사용 컴포넌트
│   ├── avatars.css         # 아바타 스타일
│   ├── badges.css          # 배지 스타일
│   ├── buttons.css         # 버튼 스타일
│   ├── cards.css           # 카드 스타일
│   ├── headers.css         # 헤더 스타일
│   ├── inputs.css          # 인풋 스타일
│   ├── navigation.css      # 네비게이션 바
│   ├── tabs.css            # 탭 네비게이션
│   └── toast.css           # 토스트 & 컨페티
│
├── screens/                 # 화면별 스타일
│   ├── landing.css         # 랜딩 화면
│   ├── summary.css         # 모임 요약 화면
│   ├── name-input.css      # 이름 입력 화면
│   ├── home.css            # 홈 (지도) 화면
│   ├── save.css            # 저장 안내 화면
│   ├── auth.css            # 인증 화면
│   ├── complete.css        # 완료 화면
│   └── mypage.css          # 마이페이지
│
└── tabs/                    # 탭 콘텐츠 스타일
    ├── info.css            # 정보 탭
    ├── calendar.css        # 캘린더 탭
    ├── vote.css            # 투표 탭
    ├── settle.css          # 정산 탭
    ├── photos.css          # 사진 탭
    └── chat.css            # 채팅 탭
```

## 🎯 사용 방법

### 옵션 1: 메인 CSS 파일 사용 (권장)
HTML에서 `main.css` 하나만 import하면 모든 스타일이 적용됩니다.

```html
<link rel="stylesheet" href="css/main.css">
```

### 옵션 2: 필요한 파일만 선택적으로 import
페이지별로 필요한 CSS만 로드하고 싶다면:

```html
<!-- 기본 (필수) -->
<link rel="stylesheet" href="css/variables.css">
<link rel="stylesheet" href="css/reset.css">
<link rel="stylesheet" href="css/layout.css">

<!-- 필요한 컴포넌트만 선택 -->
<link rel="stylesheet" href="css/components/buttons.css">
<link rel="stylesheet" href="css/components/cards.css">

<!-- 필요한 화면만 선택 -->
<link rel="stylesheet" href="css/screens/landing.css">
```

## ⚠️ 중요 사항

### Import 순서
CSS는 반드시 다음 순서로 로드해야 합니다:

1. **variables.css** - CSS 변수 정의 (가장 먼저!)
2. **reset.css** - 리셋 스타일
3. **layout.css** - 레이아웃 & 애니메이션
4. **components/** - 컴포넌트
5. **screens/** - 화면별 스타일
6. **tabs/** - 탭 스타일

### 의존성
- 모든 파일이 `variables.css`의 CSS 변수를 사용합니다
- `layout.css`의 애니메이션을 다른 파일에서 참조합니다
- 순서를 지키지 않으면 스타일이 제대로 적용되지 않을 수 있습니다

## 🎨 CSS 변수 (Design System)

[variables.css](variables.css)에 정의된 디자인 시스템:

```css
--primary: #3B82F6
--primary-light: #60A5FA
--secondary: #2D3047
--accent: #00D4AA
--bg: #FAFAFA
--card: #FFFFFF
--text: #1A1A2E
--text-secondary: #6B7280
--text-light: #9CA3AF
--border: #E5E7EB
--success: #10B981
--warning: #F59E0B
--shadow: 0 4px 20px rgba(0,0,0,0.08)
--radius: 16px
```

## 📊 파일 크기 (추정)

- Base (variables + reset + layout): ~2KB
- Components (전체): ~15KB
- Screens (전체): ~12KB
- Tabs (전체): ~8KB
- **Total**: ~37KB (gzip: ~8KB)

## 🔧 커스터마이징

### 색상 변경
[variables.css](variables.css)에서 CSS 변수만 수정하면 전체 색상 테마가 변경됩니다.

### 컴포넌트 수정
각 컴포넌트는 독립적이므로 해당 파일만 수정하면 됩니다.

### 새 컴포넌트 추가
1. `components/` 폴더에 새 CSS 파일 생성
2. [main.css](main.css)에 `@import` 추가

## 📝 다음 단계

- [ ] JS 파일 분리
- [ ] HTML 컴포넌트화
- [ ] index.html 재구성
- [ ] 빌드 시스템 추가 (선택사항)
