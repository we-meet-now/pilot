# JavaScript 파일 구조 가이드

## 📁 디렉토리 구조

```
js/
├── main.js                  # 앱 초기화 (진입점)
├── router.js                # 화면 전환 관리
│
├── components/              # UI 컴포넌트 로직
│   ├── tabs.js             # 탭 전환 기능
│   ├── toast.js            # 토스트 알림
│   └── confetti.js         # 컨페티 애니메이션
│
├── features/                # 기능별 모듈
│   ├── vote.js             # 투표 기능
│   ├── calendar.js         # 캘린더 기능
│   ├── chat.js             # 채팅 기능
│   ├── name-input.js       # 이름 입력
│   └── departure.js        # 출발 기능
│
└── utils/                   # 유틸리티
    ├── helpers.js          # 헬퍼 함수
    └── constants.js        # 상수 정의
```

## 🎯 사용 방법

### HTML에서 스크립트 로드

모든 JavaScript 파일을 순서대로 로드해야 합니다:

```html
<!-- 1. 유틸리티 (먼저 로드) -->
<script src="js/utils/constants.js"></script>
<script src="js/utils/helpers.js"></script>

<!-- 2. 컴포넌트 -->
<script src="js/components/toast.js"></script>
<script src="js/components/confetti.js"></script>
<script src="js/components/tabs.js"></script>

<!-- 3. 기능 모듈 -->
<script src="js/features/name-input.js"></script>
<script src="js/features/vote.js"></script>
<script src="js/features/calendar.js"></script>
<script src="js/features/chat.js"></script>
<script src="js/features/departure.js"></script>

<!-- 4. 라우터 -->
<script src="js/router.js"></script>

<!-- 5. 메인 (마지막에 로드) -->
<script src="js/main.js"></script>
```

## 📚 API 문서

### Router (router.js)

#### `goToScreen(id)`
특정 화면으로 이동합니다.

```javascript
// 사용 예시
goToScreen('landing');  // 랜딩 화면으로
goToScreen('main');     // 메인 화면으로
goToScreen('complete'); // 완료 화면으로 (컨페티 효과 포함)
```

**파라미터:**
- `id` (string): 화면 ID

**화면 ID 목록:**
- `landing` - 랜딩 화면
- `summary` - 모임 요약
- `name` - 이름 입력
- `main` - 메인 화면
- `save` - 저장 안내
- `auth` - 인증
- `complete` - 완료

---

### Tabs (components/tabs.js)

#### `switchTab(tabId, btn)`
탭을 전환합니다.

```javascript
// HTML에서 사용
<button onclick="switchTab('info', this)">정보</button>

// JavaScript에서 사용
const btn = document.querySelector('.tab-btn');
switchTab('calendar', btn);
```

**파라미터:**
- `tabId` (string): 탭 ID
- `btn` (HTMLElement): 클릭된 버튼 요소

**탭 ID 목록:**
- `info` - 정보
- `calendar` - 캘린더
- `vote` - 투표
- `settle` - 정산
- `photos` - 사진
- `chat` - 채팅

#### `showChatDefault()`
채팅 탭을 기본으로 표시합니다.

```javascript
showChatDefault();
```

---

### Toast (components/toast.js)

#### `showToast(msg, duration)`
토스트 메시지를 표시합니다.

```javascript
showToast('저장되었습니다!');
showToast('오류가 발생했습니다', 3000);
```

**파라미터:**
- `msg` (string): 표시할 메시지
- `duration` (number, optional): 표시 시간 (ms, 기본값: 2500)

---

### Confetti (components/confetti.js)

#### `createConfetti(count)`
컨페티 애니메이션을 생성합니다.

```javascript
createConfetti();      // 기본 40개
createConfetti(100);   // 100개
```

**파라미터:**
- `count` (number, optional): 컨페티 개수 (기본값: 40)

---

### Vote (features/vote.js)

#### `selectVote(el)`
투표 옵션을 선택합니다.

```javascript
// HTML에서 사용
<div class="vote-option" onclick="selectVote(this)">옵션 1</div>
```

#### `selectSoftVote(el)`
감정 표현 투표를 선택합니다.

#### `submitVote()`
투표를 제출합니다.

---

### Calendar (features/calendar.js)

#### `selectCalDay(el)`
캘린더 날짜를 선택합니다.

```javascript
// HTML에서 사용
<div class="cal-day available" onclick="selectCalDay(this)">21</div>
```

#### `getDayName(day)`
날짜에 해당하는 요일을 반환합니다.

```javascript
const dayName = getDayName(21);  // '토'
```

#### `changeMonth(dir)`
월을 변경합니다.

```javascript
changeMonth(1);   // 다음 달
changeMonth(-1);  // 이전 달
```

#### `confirmCalendarDate()`
선택된 날짜를 확정합니다.

#### `scrollToEvent(eventId)`
특정 이벤트로 스크롤합니다.

---

### Chat (features/chat.js)

#### `sendMessage()`
채팅 메시지를 전송합니다.

```javascript
// HTML에서 사용
<button onclick="sendMessage()">전송</button>
```

---

### Name Input (features/name-input.js)

#### `checkNameInput()`
이름 입력을 검증하고 버튼을 활성화합니다.

```javascript
// HTML에서 사용
<input id="name-input" oninput="checkNameInput()">
```

#### `setQuickName(name)`
빠른 이름을 설정합니다.

```javascript
// HTML에서 사용
<button onclick="setQuickName('도희')">도희</button>
```

---

### Departure (features/departure.js)

#### `startDeparture(btn)`
출발을 시작합니다.

```javascript
// HTML에서 사용
<button class="ready" onclick="startDeparture(this)">출발</button>
```

---

## 🔧 유틸리티 함수

### Helpers (utils/helpers.js)

```javascript
// 요소 존재 확인
elementExists('.my-element');  // true/false

// 안전하게 요소 가져오기
const el = getElement('#my-id');

// 모든 요소 가져오기
const els = getElements('.my-class');

// 클래스 토글
toggleClass(element, 'active', true);

// 딜레이
await delay(1000);  // 1초 대기
```

### Constants (utils/constants.js)

```javascript
// 앱 설정 사용
console.log(APP_CONFIG.APP_NAME);  // '오보톡'
console.log(APP_CONFIG.SCREENS.MAIN);  // 'main'
console.log(APP_CONFIG.TOAST_DURATION.SHORT);  // 1500
```

---

## ⚠️ 중요 사항

### 로드 순서
JavaScript 파일은 **반드시 다음 순서**로 로드해야 합니다:

1. **utils/** - 상수 및 헬퍼 함수
2. **components/** - UI 컴포넌트
3. **features/** - 기능 모듈
4. **router.js** - 라우터
5. **main.js** - 앱 초기화 (마지막)

### 전역 함수
모든 함수는 `window` 객체에 할당되어 HTML의 `onclick` 등에서 직접 사용할 수 있습니다.

```html
<!-- ✅ 가능 -->
<button onclick="goToScreen('main')">메인으로</button>
<button onclick="showToast('성공!')">토스트</button>
```

### 의존성
- `toast.js`를 사용하는 파일들이 많으므로 먼저 로드 필수
- `confetti.js`는 `router.js`에서 사용됨

---

## 🚀 다음 단계

### ES6 모듈로 전환 (선택사항)
더 나은 모듈화를 위해 ES6 모듈 시스템 사용 가능:

```javascript
// export
export function showToast(msg) { ... }

// import
import { showToast } from './components/toast.js';
```

### 빌드 시스템 추가 (선택사항)
- Webpack, Vite 등으로 번들링
- 코드 압축 및 최적화
- 타입스크립트 전환

---

## 📊 파일 크기 (추정)

- Utils: ~2KB
- Components: ~3KB
- Features: ~6KB
- Router + Main: ~1KB
- **Total**: ~12KB (gzip: ~4KB)
