/**
 * Authentication Feature
 * 인증 기능 (로그인/회원가입)
 */

/**
 * 카카오 로그인
 */
function loginWithKakao() {
    // 최근 로그인 수단 저장
    saveRecentLoginMethod('kakao');

    // 실제 구현 시 카카오 SDK 연동
    // localStorage에서 기존 사용자인지 확인
    const existingUser = localStorage.getItem('wemeet_kakao_user');

    if (existingUser) {
        // 기존 회원 - 바로 홈으로
        const userData = JSON.parse(existingUser);
        if (typeof login === 'function') {
            login(userData);
            if (typeof showToast === 'function') {
                showToast(`다시 오셨군요, ${userData.name}님! 👋`);
            }
            setTimeout(() => {
                if (typeof goToScreen === 'function') {
                    goToScreen('home');
                }
            }, 500);
        }
    } else {
        // 신규 회원 - 가입 완료 및 온보딩
        const userData = {
            id: 'kakao_' + Date.now(),
            name: '카카오 사용자',
            email: 'kakao@example.com',
            provider: 'kakao'
        };

        // 사용자 정보 저장
        localStorage.setItem('wemeet_kakao_user', JSON.stringify(userData));

        if (typeof login === 'function') {
            login(userData);
            // 완료 화면으로 이동
            setTimeout(() => {
                if (typeof goToScreen === 'function') {
                    goToScreen('complete');
                }
            }, 500);
        }
    }
}

/**
 * 구글 로그인
 */
function loginWithGoogle() {
    // 최근 로그인 수단 저장
    saveRecentLoginMethod('google');

    // 실제 구현 시 구글 SDK 연동
    // localStorage에서 기존 사용자인지 확인
    const existingUser = localStorage.getItem('wemeet_google_user');

    if (existingUser) {
        // 기존 회원 - 바로 홈으로
        const userData = JSON.parse(existingUser);
        if (typeof login === 'function') {
            login(userData);
            if (typeof showToast === 'function') {
                showToast(`다시 오셨군요, ${userData.name}님! 👋`);
            }
            setTimeout(() => {
                if (typeof goToScreen === 'function') {
                    goToScreen('home');
                }
            }, 500);
        }
    } else {
        // 신규 회원 - 가입 완료 및 온보딩
        const userData = {
            id: 'google_' + Date.now(),
            name: '구글 사용자',
            email: 'google@example.com',
            provider: 'google'
        };

        // 사용자 정보 저장
        localStorage.setItem('wemeet_google_user', JSON.stringify(userData));

        if (typeof login === 'function') {
            login(userData);
            // 완료 화면으로 이동
            setTimeout(() => {
                if (typeof goToScreen === 'function') {
                    goToScreen('complete');
                }
            }, 500);
        }
    }
}

/**
 * 전화번호 자동 포맷 (010-1234-5678)
 * @param {HTMLInputElement} input - 전화번호 입력 필드
 */
function formatPhoneNumber(input) {
    // 숫자만 추출
    let value = input.value.replace(/[^0-9]/g, '');

    // 길이 제한
    if (value.length > 11) {
        value = value.slice(0, 11);
    }

    // 포맷 적용
    let formatted = '';
    if (value.length <= 3) {
        formatted = value;
    } else if (value.length <= 7) {
        formatted = value.slice(0, 3) + '-' + value.slice(3);
    } else {
        formatted = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
    }

    input.value = formatted;
}

/**
 * 전화번호 로그인 - 가입 화면으로 이동
 */
function loginWithPhone() {
    // 최근 로그인 수단 저장
    saveRecentLoginMethod('phone');

    // 전화번호 로그인 화면으로 이동
    if (typeof goToScreen === 'function') {
        goToScreen('phone-login');
    }
}

function signupWithPhone() {
    // 전화번호 회원가입 화면으로 이동
    if (typeof goToScreen === 'function') {
        goToScreen('phone-signup');
    }
}

/**
 * 전화번호 로그인 폼 제출
 * @param {Event} event - 폼 제출 이벤트
 */
function submitPhoneLogin(event) {
    event.preventDefault();

    // 입력값 가져오기
    const phone = document.getElementById('login-phone').value;
    const password = document.getElementById('login-password').value;

    // localStorage에서 등록된 사용자 목록 가져오기
    const users = JSON.parse(localStorage.getItem('wemeet_users') || '{}');

    // 전화번호로 사용자 찾기
    const user = users[phone];

    if (!user) {
        // 등록되지 않은 전화번호
        if (typeof showToast === 'function') {
            showToast('등록되지 않은 전화번호입니다. 😢');
        }
        return;
    }

    // 비밀번호 확인
    if (user.password !== password) {
        // 비밀번호 불일치
        if (typeof showToast === 'function') {
            showToast('비밀번호가 일치하지 않습니다. 다시 시도해주세요. 🔒');
        }
        return;
    }

    // 로그인 성공
    if (typeof login === 'function') {
        login(user);

        if (typeof showToast === 'function') {
            showToast(`환영합니다, ${user.name}님! 👋`);
        }

        // 기존 회원 로그인이므로 바로 홈(지도)으로 이동
        if (typeof goToScreen === 'function') {
            goToScreen('home');
        }
    }
}

/**
 * 전화번호 가입 폼 제출
 * @param {Event} event - 폼 제출 이벤트
 */
function submitPhoneSignup(event) {
    event.preventDefault();

    // 입력값 가져오기
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;

    // localStorage에서 기존 사용자 목록 가져오기
    const users = JSON.parse(localStorage.getItem('wemeet_users') || '{}');

    // 이미 등록된 전화번호인지 확인
    if (users[phone]) {
        if (typeof showToast === 'function') {
            showToast('이미 가입된 전화번호입니다. 로그인 페이지로 이동합니다. 📱');
        }

        // 1초 후 로그인 화면으로 이동하면서 전화번호 자동 입력
        setTimeout(() => {
            if (typeof goToScreen === 'function') {
                goToScreen('phone-login');

                // 로그인 화면의 전화번호 필드에 자동으로 입력
                setTimeout(() => {
                    const loginPhoneInput = document.getElementById('login-phone');
                    if (loginPhoneInput) {
                        loginPhoneInput.value = phone;
                        // 비밀번호 필드로 포커스 이동
                        const loginPasswordInput = document.getElementById('login-password');
                        if (loginPasswordInput) {
                            loginPasswordInput.focus();
                        }
                    }
                }, 100);
            }
        }, 1000);

        return;
    }

    // 유저 데이터 생성
    const userData = {
        id: 'phone_' + Date.now(),
        name: name,
        email: email,
        phone: phone,
        password: password, // 실제로는 해시 처리 필요
        provider: 'phone'
    };

    // 전화번호를 키로 사용자 정보 저장
    users[phone] = userData;
    localStorage.setItem('wemeet_users', JSON.stringify(users));

    // 로그인 처리
    if (typeof login === 'function') {
        login(userData);

        if (typeof showToast === 'function') {
            showToast('가입이 완료되었습니다! 🎉');
        }

        // 완료 화면으로 이동
        setTimeout(() => {
            if (typeof goToScreen === 'function') {
                goToScreen('complete');
            }
        }, 500);
    }
}

/**
 * 비밀번호 재설정 요청
 * @param {Event} event - 폼 제출 이벤트
 */
function submitPasswordReset(event) {
    event.preventDefault();

    // 입력값 가져오기
    const phone = document.getElementById('reset-phone').value;

    // localStorage에서 사용자 찾기
    const users = JSON.parse(localStorage.getItem('wemeet_users') || '{}');
    const user = users[phone];

    if (!user) {
        if (typeof showToast === 'function') {
            showToast('등록되지 않은 전화번호입니다. 😢');
        }
        return;
    }

    // 이메일로 재설정 링크 전송 (시뮬레이션)
    if (typeof showToast === 'function') {
        showToast(`${user.email}로 재설정 링크를 전송했습니다! 📧`);
    }

    // 실제로는 서버에서 이메일 발송 처리
    console.log(`비밀번호 재설정 이메일 전송: ${user.email}`);

    // 2초 후 로그인 화면으로 이동
    setTimeout(() => {
        if (typeof goToScreen === 'function') {
            goToScreen('phone-login');
        }
    }, 2000);
}

/**
 * 게스트로 계속하기
 */
function continueAsGuest() {
    if (typeof showToast === 'function') {
        showToast('게스트 모드로 계속합니다');
    }

    // 홈(지도) 화면으로 이동
    setTimeout(() => {
        if (typeof goToScreen === 'function') {
            goToScreen('home');
        }
    }, 500);
}

/**
 * 로그아웃 버튼 클릭
 */
function handleLogout() {
    if (typeof logout === 'function') {
        logout();
        // 랜딩 화면으로 이동
        setTimeout(() => {
            if (typeof goToScreen === 'function') {
                goToScreen('landing');
            }
        }, 500);
    }
}

/**
 * 최근 로그인 수단 저장
 * @param {string} provider - 'kakao', 'google', 'phone'
 */
function saveRecentLoginMethod(provider) {
    localStorage.setItem('wemeet_recent_login', provider);
}

/**
 * 최근 로그인 수단 불러오기
 * @returns {string|null} - 'kakao', 'google', 'phone' 또는 null
 */
function getRecentLoginMethod() {
    return localStorage.getItem('wemeet_recent_login');
}

/**
 * 최근 로그인 수단으로 빠른 로그인
 */
function loginWithRecentMethod() {
    const recent = getRecentLoginMethod();

    if (recent === 'kakao') {
        loginWithKakao();
    } else if (recent === 'google') {
        loginWithGoogle();
    } else if (recent === 'phone') {
        loginWithPhone();
    }
}

/**
 * 로그인 화면 진입 시 최근 로그인 수단 표시
 */
function showRecentLoginMethod() {
    const recent = getRecentLoginMethod();
    const recentSection = document.getElementById('recent-login-method');

    if (!recent || !recentSection) return;

    // 타이틀과 서브타이틀 변경
    const loginTitle = document.getElementById('login-title');
    const loginSubtitle = document.getElementById('login-subtitle');

    if (loginTitle) {
        loginTitle.textContent = '다시 오셨네요! 👋';
    }

    if (loginSubtitle) {
        loginSubtitle.textContent = '최근 사용한 방법으로 빠르게 로그인하세요';
    }

    const recentIcon = document.getElementById('recent-icon');
    const recentTitle = document.getElementById('recent-title');
    const recentDesc = document.getElementById('recent-desc');

    if (recent === 'kakao') {
        recentIcon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="#3C1E1E" d="M12 3c-5.52 0-10 3.59-10 8 0 2.69 1.78 5.06 4.46 6.43-.13.47-.85 3.04-.87 3.25 0 0-.02.18.09.25.11.07.24.02.24.02.32-.05 3.72-2.43 4.3-2.86.58.09 1.18.13 1.78.13 5.52 0 10-3.59 10-8s-4.48-8-10-8z"/></svg>';
        recentIcon.className = 'auth-btn-icon kakao';
        recentTitle.textContent = '카카오로 계속하기';
        recentDesc.textContent = '마지막으로 사용한 방법';
    } else if (recent === 'google') {
        recentIcon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>';
        recentIcon.className = 'auth-btn-icon google';
        recentTitle.textContent = 'Google로 계속하기';
        recentDesc.textContent = '마지막으로 사용한 방법';
    } else if (recent === 'phone') {
        recentIcon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>';
        recentIcon.className = 'auth-btn-icon phone';
        recentTitle.textContent = '전화번호로 계속하기';
        recentDesc.textContent = '마지막으로 사용한 방법';
    }

    // 최근 로그인 섹션 표시
    // 최근 로그인 섹션 표시
    recentSection.style.display = 'block';
}

/**
 * 앱 초기화 시 인증 상태 확인
 */
/**
 * 앱 초기화 시 인증 상태 확인
 */
function initAuth() {
    // 1. Firebase Auth 대신 로컬 스토리지 기반 인증 확인 (js/utils/auth.js와 연동)
    // utils/auth.js가 먼저 로드되므로 checkAuthStatus()가 이미 실행되었을 수 있음.
    // 안전하게 localStorage를 직접 확인.

    const authData = localStorage.getItem('wemeettalk_auth');
    let isLoggedIn = false;
    let currentUser = null;

    if (authData) {
        try {
            const parsed = JSON.parse(authData);
            isLoggedIn = parsed.isLoggedIn;
            currentUser = parsed.user;
        } catch (e) {
            console.error('Auth data parse error', e);
        }
    }

    if (isLoggedIn && currentUser) {
        console.log('✅ Auto-login: User detected (Local)', currentUser.id);

        // localStorage에서 마지막 채팅방 확인
        const lastChatRoomId = localStorage.getItem('lastChatRoomId');

        // 이미 로그인된 상태에서 랜딩 페이지나 로그인 페이지에 있다면 이동
        const currentScreen = document.querySelector('.screen.active');
        // 화면이 로드되는 시점이라 active 클래스가 없을 수도 있음, 혹은 기본이 landing
        const isLandingOrLogin = !currentScreen || currentScreen.id === 'screen-landing' || currentScreen.id.includes('login');

        if (isLandingOrLogin) {
            if (lastChatRoomId) {
                console.log('🔄 Redirecting to last chat room:', lastChatRoomId);

                // goToChatRoom이 비동기 데이터 로딩을 포함하므로 호출
                if (typeof goToChatRoom === 'function') {
                    // 약간의 지연을 주어 DOM이 완전히 준비된 후 실행되도록 함
                    setTimeout(() => {
                        goToChatRoom(lastChatRoomId);
                    }, 100);
                } else {
                    if (typeof goToScreen === 'function') goToScreen('home');
                }
            } else {
                console.log('🔄 Redirecting to home');
                if (typeof goToScreen === 'function') goToScreen('home');
            }
        }
    } else {
        console.log('ℹ️ No active session (Local)');
    }
}

// 전역으로 내보내기
window.formatPhoneNumber = formatPhoneNumber;
window.loginWithKakao = loginWithKakao;
window.loginWithGoogle = loginWithGoogle;
window.loginWithPhone = loginWithPhone;
window.submitPhoneSignup = submitPhoneSignup;
window.continueAsGuest = continueAsGuest;
window.handleLogout = handleLogout;
window.loginWithRecentMethod = loginWithRecentMethod;
window.showRecentLoginMethod = showRecentLoginMethod;
window.initAuth = initAuth;
