# 인증 기능 가이드

## 🔐 로그인 상태 관리

**오보톡**은 로그인/비로그인 사용자 모두 사용할 수 있도록 구현되었습니다.

---

## 📋 주요 기능

### 1. 게스트 모드 (비로그인)

사용자는 **로그인 없이** 다음 기능을 사용할 수 있습니다:

✅ 모임 초대 확인
✅ 모임 정보 보기
✅ 모임 참여
✅ 투표 참여
✅ 채팅
✅ 기본 기능 사용

### 2. 로그인 모드

로그인 시 **추가 기능**이 제공됩니다:

✨ 모든 모임 일정을 캘린더에서 한눈에 보기
✨ 프로필 관리
✨ 참여 이력 저장
✨ 개인화된 경험

---

## 🎯 로그인 유도 지점

### 1️⃣ 캘린더 탭

**비로그인 상태**에서 캘린더 탭 접근 시:

```
┌─────────────────────────────┐
│  📅                         │
│  모임 일정을 한눈에!        │
│                             │
│  로그인하면 참여한 모든     │
│  모임의 일정을 캘린더에서   │
│  모아볼 수 있어요.          │
│                             │
│  [   로그인하기   ]         │
└─────────────────────────────┘
```

→ "로그인하기" 버튼 클릭 시 인증 화면으로 이동

### 2️⃣ 마이페이지

**비로그인 상태**에서 마이페이지 접근 시:

```
프로필: 게스트
[로그인하기] 버튼 표시
```

→ "로그인하기" 버튼 클릭 시 인증 화면으로 이동

---

## 🔧 구현 방식

### 파일 구조

```
js/
├── utils/
│   └── auth.js              # 인증 상태 관리
└── features/
    └── auth.js              # 로그인/로그아웃 기능

css/
└── components/
    └── auth-notice.css      # 로그인 안내 UI
```

### 로컬 스토리지 사용

로그인 정보는 `localStorage`에 저장됩니다:

```javascript
// 저장 형식
{
  "isLoggedIn": true,
  "user": {
    "id": "kakao_1234567890",
    "name": "카카오 사용자",
    "email": "kakao@example.com",
    "provider": "kakao"
  }
}
```

---

## 📚 API 문서

### auth.js (utils)

#### `checkAuthStatus()`
로컬 스토리지에서 로그인 상태 확인

```javascript
const isLoggedIn = checkAuthStatus();
// Returns: boolean
```

#### `login(userData)`
로그인 처리

```javascript
login({
  id: 'user_123',
  name: '홍길동',
  email: 'user@example.com',
  provider: 'kakao'
});
```

#### `logout()`
로그아웃 처리

```javascript
logout();
// 로컬 스토리지 정보 삭제
// UI 업데이트
```

#### `isUserLoggedIn()`
현재 로그인 여부 확인

```javascript
if (isUserLoggedIn()) {
  // 로그인 상태
} else {
  // 비로그인 상태
}
```

#### `getCurrentUser()`
현재 로그인한 사용자 정보 가져오기

```javascript
const user = getCurrentUser();
// Returns: { id, name, email, provider } or null
```

#### `updateUIByAuthStatus()`
로그인 상태에 따라 UI 업데이트

```javascript
updateUIByAuthStatus();
// 캘린더 탭 업데이트
// 마이페이지 업데이트
```

#### `requireAuth(callback, message)`
로그인 필요 기능 실행 전 체크

```javascript
requireAuth(() => {
  // 로그인 후 실행할 코드
}, '이 기능은 로그인이 필요합니다.');
```

---

### auth.js (features)

#### `loginWithKakao()`
카카오 로그인

```javascript
loginWithKakao();
// 카카오 SDK 연동 (현재는 데모)
// 로그인 성공 → 완료 화면
```

#### `loginWithGoogle()`
구글 로그인

```javascript
loginWithGoogle();
// 구글 SDK 연동 (현재는 데모)
// 로그인 성공 → 완료 화면
```

#### `loginWithPhone()`
전화번호 로그인

```javascript
loginWithPhone();
// 전화번호 인증 프로세스 (현재는 데모)
// 로그인 성공 → 완료 화면
```

#### `continueAsGuest()`
게스트로 계속하기

```javascript
continueAsGuest();
// 메인 화면으로 이동
```

#### `handleLogout()`
로그아웃

```javascript
handleLogout();
// 로그아웃 처리
// 랜딩 화면으로 이동
```

---

## 🎨 UI 커스터마이징

### 로그인 안내 카드 스타일

[css/components/auth-notice.css](css/components/auth-notice.css) 수정:

```css
.login-notice-card {
    background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
    border: 1px solid #BAE6FD;
    /* 원하는 스타일로 변경 */
}
```

### 로그인 버튼 스타일

```css
.btn-login {
    padding: 12px 32px;
    background: var(--primary);
    /* 원하는 스타일로 변경 */
}
```

---

## 🔄 사용자 플로우

### 비로그인 사용자

```
1. 링크로 모임 초대받음
   ↓
2. 랜딩 화면 (모임 정보 확인)
   ↓
3. 이름 입력
   ↓
4. 메인 화면 진입 (게스트 모드)
   ↓
5. 캘린더 탭 접근 시
   → "로그인하면 모든 일정을 볼 수 있어요" 안내
   → [로그인하기] 버튼
   ↓
6. (선택) 로그인 화면으로 이동
```

### 로그인 사용자

```
1. 링크로 모임 초대받음
   ↓
2. 랜딩 화면 (모임 정보 확인)
   ↓
3. 이름 입력
   ↓
4. 메인 화면 진입 (로그인 모드)
   ↓
5. 캘린더 탭
   → 모든 모임 일정 표시 ✓
   → 로그인 안내 없음
   ↓
6. 마이페이지
   → 프로필 정보 표시
   → [로그아웃] 버튼
```

---

## 🚀 향후 개선 사항

### 실제 인증 연동

현재는 **데모 버전**으로, 실제 구현 시:

1. **카카오 로그인**
   ```javascript
   // Kakao SDK 연동
   Kakao.Auth.login({
     success: function(authObj) {
       // 토큰 받아서 백엔드 전송
     }
   });
   ```

2. **구글 로그인**
   ```javascript
   // Google Sign-In 연동
   gapi.auth2.getAuthInstance().signIn()
   ```

3. **전화번호 인증**
   ```javascript
   // Firebase Phone Auth 또는 자체 SMS 인증
   ```

### JWT 토큰 관리

```javascript
// 토큰 저장
localStorage.setItem('access_token', token);

// API 요청 시 헤더에 포함
headers: {
  'Authorization': `Bearer ${token}`
}
```

### 자동 로그인

```javascript
// 페이지 로드 시 토큰 검증
checkAuthStatus();
// 유효한 토큰 → 자동 로그인
// 만료된 토큰 → 로그아웃
```

---

## 📝 테스트 방법

### 1. 게스트 모드 테스트

1. 브라우저 시크릿 모드 열기
2. `index.html` 실행
3. 캘린더 탭 접근 → 로그인 안내 확인
4. 마이페이지 접근 → 게스트 프로필 확인

### 2. 로그인 테스트

1. 인증 화면에서 "카카오로 시작하기" 클릭
2. 완료 화면 표시 확인
3. 메인 화면 이동
4. 캘린더 탭 → 로그인 안내 없음 확인
5. 마이페이지 → 프로필 정보 확인

### 3. 로그아웃 테스트

1. 마이페이지 메뉴에서 로그아웃
2. 랜딩 화면으로 이동 확인
3. 다시 캘린더 접근 → 로그인 안내 표시 확인

### 4. 로컬 스토리지 확인

```javascript
// 개발자 도구 콘솔에서
localStorage.getItem('wemeettalk_auth');
// 로그인 정보 확인
```

---

## ⚠️ 주의사항

1. **보안**: 현재는 클라이언트 사이드만 구현. 실제 서비스는 백엔드 인증 필수
2. **토큰 관리**: JWT 토큰 사용 시 만료 시간 관리 필요
3. **CORS**: 실제 OAuth 연동 시 CORS 설정 필요
4. **HTTPS**: 프로덕션 환경에서는 HTTPS 필수

---

**Updated**: 2024년 12월 17일
