# 프로젝트 구조 상세 문서

## 📊 전체 파일 구조

```
we-meet-talk/
├── index.html                    # ⭐ 메인 진입점
├── wemeettalk.html              # 📦 원본 파일 (백업)
├── README.md                    # 📖 프로젝트 문서
├── STRUCTURE.md                 # 📋 이 파일
│
├── css/ (27개 파일)
│   ├── main.css                 # 🎯 CSS 진입점 (모든 CSS import)
│   ├── variables.css            # 🎨 디자인 시스템 변수
│   ├── reset.css                # 🔄 CSS 리셋
│   ├── layout.css               # 📐 레이아웃 & 애니메이션
│   ├── README.md                # 📖 CSS 사용 가이드
│   │
│   ├── components/              # 🧩 재사용 컴포넌트 (9개)
│   │   ├── avatars.css         # 👤 아바타
│   │   ├── badges.css          # 🏷️ 배지
│   │   ├── buttons.css         # 🔘 버튼
│   │   ├── cards.css           # 🎴 카드
│   │   ├── headers.css         # 📌 헤더
│   │   ├── inputs.css          # ⌨️ 입력창
│   │   ├── navigation.css      # 🧭 네비게이션
│   │   ├── tabs.css            # 📑 탭
│   │   └── toast.css           # 💬 토스트 & 컨페티
│   │
│   ├── screens/                 # 🖥️ 화면별 스타일 (8개)
│   │   ├── landing.css         # 1️⃣ 랜딩
│   │   ├── summary.css         # 2️⃣ 모임 요약
│   │   ├── name-input.css      # 3️⃣ 이름 입력
│   │   ├── home.css            # 4️⃣ 홈 (지도)
│   │   ├── save.css            # 5️⃣ 저장 안내
│   │   ├── auth.css            # 6️⃣ 인증
│   │   ├── complete.css        # 7️⃣ 완료
│   │   └── mypage.css          # 8️⃣ 마이페이지
│   │
│   └── tabs/                    # 📑 탭 콘텐츠 스타일 (6개)
│       ├── info.css            # ℹ️ 정보
│       ├── calendar.css        # 📅 캘린더
│       ├── vote.css            # 🗳️ 투표
│       ├── settle.css          # 💰 정산
│       ├── photos.css          # 📷 사진
│       └── chat.css            # 💬 채팅
│
└── js/ (13개 파일)
    ├── main.js                  # 🎯 앱 초기화
    ├── router.js                # 🚦 화면 전환
    ├── README.md                # 📖 JS 사용 가이드
    │
    ├── components/              # 🧩 UI 컴포넌트 (3개)
    │   ├── tabs.js             # 📑 탭 전환
    │   ├── toast.js            # 💬 토스트 알림
    │   └── confetti.js         # 🎉 컨페티 애니메이션
    │
    ├── features/                # ⚙️ 기능 모듈 (5개)
    │   ├── vote.js             # 🗳️ 투표 기능
    │   ├── calendar.js         # 📅 캘린더 기능
    │   ├── chat.js             # 💬 채팅 기능
    │   ├── name-input.js       # ⌨️ 이름 입력
    │   └── departure.js        # 🚗 출발 기능
    │
    └── utils/                   # 🛠️ 유틸리티 (2개)
        ├── helpers.js          # 🔧 헬퍼 함수
        └── constants.js        # 📦 상수 정의
```

## 📈 파일 통계

### 전체 요약
- **총 파일 수**: 44개
- **HTML**: 2개 (index.html + 원본)
- **CSS**: 27개
- **JavaScript**: 13개
- **문서**: 3개 (README.md 파일들)

### CSS 파일 분류
- **기본**: 4개 (main, variables, reset, layout)
- **컴포넌트**: 9개
- **화면**: 8개
- **탭**: 6개

### JavaScript 파일 분류
- **코어**: 2개 (main, router)
- **컴포넌트**: 3개
- **기능**: 5개
- **유틸리티**: 2개
- **문서**: 1개

## 🔗 의존성 관계

### CSS 로드 순서 (중요!)
```
variables.css (1순위 - 필수)
    ↓
reset.css (2순위)
    ↓
layout.css (3순위)
    ↓
components/*.css (4순위)
    ↓
screens/*.css (5순위)
    ↓
tabs/*.css (6순위)
```

### JavaScript 로드 순서 (중요!)
```
utils/constants.js (1순위)
    ↓
utils/helpers.js (2순위)
    ↓
components/*.js (3순위)
    ↓
features/*.js (4순위)
    ↓
router.js (5순위)
    ↓
main.js (6순위 - 마지막)
```

## 🎯 파일별 책임

### CSS

#### variables.css
- CSS 변수 정의
- 디자인 시스템 (색상, 간격 등)
- 모든 CSS 파일에서 참조

#### components/buttons.css
**포함 클래스:**
- `.btn-primary` - 메인 버튼
- `.btn-join` - 참여 버튼
- `.btn-next` - 다음 버튼
- `.btn-vote` - 투표 버튼
- `.back-btn` - 뒤로가기 버튼
- `.upload-btn` - 업로드 버튼
- `.send-btn` - 전송 버튼
- 등등...

#### components/cards.css
**포함 클래스:**
- `.info-card` - 정보 카드
- `.notice-card` - 공지 카드
- `.meeting-card` - 모임 카드
- `.vote-card` - 투표 카드
- `.ai-tip` - AI 팁
- 등등...

#### screens/landing.css
**포함 클래스:**
- `.landing-screen` - 랜딩 화면
- `.landing-content` - 컨텐츠
- `.landing-icon` - 아이콘
- `.landing-title` - 제목
- 등등...

### JavaScript

#### router.js
**함수:**
- `goToScreen(id)` - 화면 전환

#### components/tabs.js
**함수:**
- `switchTab(tabId, btn)` - 탭 전환
- `showChatDefault()` - 채팅 탭 기본 표시

#### components/toast.js
**함수:**
- `showToast(msg, duration)` - 토스트 표시

#### features/vote.js
**함수:**
- `selectVote(el)` - 투표 선택
- `selectSoftVote(el)` - 감정 투표
- `submitVote()` - 투표 제출

#### features/calendar.js
**함수:**
- `selectCalDay(el)` - 날짜 선택
- `getDayName(day)` - 요일 가져오기
- `changeMonth(dir)` - 월 변경
- `confirmCalendarDate()` - 날짜 확정
- `scrollToEvent(eventId)` - 이벤트 스크롤

## 📊 코드 라인 수

### HTML
- `index.html`: ~1,000줄
- `wemeettalk.html`: ~2,700줄 (원본)

### CSS (추정)
- Base: ~100줄
- Components: ~1,000줄
- Screens: ~800줄
- Tabs: ~600줄
- **Total**: ~2,500줄

### JavaScript (추정)
- Core: ~50줄
- Components: ~150줄
- Features: ~300줄
- Utils: ~100줄
- **Total**: ~600줄

## 🎨 컴포넌트 매핑

| 디자인 컴포넌트 | CSS 파일 | JS 파일 |
|---------------|---------|---------|
| alarm-card | cards.css | - |
| switch | buttons.css | - |
| header | headers.css | - |
| tab | tabs.css | tabs.js |
| GNB | navigation.css | - |
| button | buttons.css | - |
| chip | badges.css | - |
| calendar | calendar.css | calendar.js |
| chat-people-card | cards.css | chat.js |
| label | badges.css | - |
| search field | inputs.css | - |
| event-schedule | calendar.css | calendar.js |

## 🔄 화면 흐름

```
Landing (screen-landing)
    ↓ (모임 확인하기)
Summary (screen-summary)
    ↓ (참여하기)
Name Input (screen-name)
    ↓ (참여하기)
Main (screen-main)
    ├─ Info Tab
    ├─ Calendar Tab
    ├─ Vote Tab
    ├─ Settle Tab
    ├─ Photos Tab
    └─ Chat Tab (기본)
    ↓ (저장하기)
Save (screen-save)
    ↓ (계속하기)
Auth (screen-auth)
    ↓ (인증)
Complete (screen-complete)
    ↓ (모임으로 돌아가기)
Main (screen-main)
```

## 🛠️ 개발 워크플로우

### 1. 새 화면 추가
```bash
1. css/screens/new-screen.css 생성
2. css/main.css에 @import 추가
3. index.html에 HTML 마크업 추가
4. 필요시 js/features/new-feature.js 생성
```

### 2. 새 컴포넌트 추가
```bash
1. css/components/new-component.css 생성
2. css/main.css에 @import 추가
3. 필요시 js/components/new-component.js 생성
4. index.html에 <script> 추가
```

### 3. 기능 수정
```bash
1. 해당 기능의 CSS/JS 파일 찾기
2. 파일 수정
3. 브라우저 새로고침으로 테스트
```

## 📚 참고 문서

- [프로젝트 README](README.md)
- [CSS 가이드](css/README.md)
- [JavaScript 가이드](js/README.md)

## 🔍 빠른 검색

### "투표 기능을 수정하고 싶어요"
→ `js/features/vote.js` + `css/tabs/vote.css`

### "버튼 스타일을 바꾸고 싶어요"
→ `css/components/buttons.css`

### "랜딩 화면을 수정하고 싶어요"
→ `css/screens/landing.css` + `index.html` (<!-- Screen 1: Landing -->)

### "색상 테마를 변경하고 싶어요"
→ `css/variables.css` (--primary, --accent 등)

### "채팅 기능을 추가하고 싶어요"
→ `js/features/chat.js` + `css/tabs/chat.css`

---

**Last Updated**: 2024년 12월 17일
