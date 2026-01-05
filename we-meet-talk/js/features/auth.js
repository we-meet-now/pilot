/**
 * Authentication Feature
 * 인증 기능 (로그인/회원가입)
 */

/**
 * 카카오 로그인
 */
function loginWithKakao() {
    // 실제 구현 시 카카오 SDK 연동
    // 데모용으로 임시 로그인 처리
    const userData = {
        id: 'kakao_' + Date.now(),
        name: '카카오 사용자',
        email: 'kakao@example.com',
        provider: 'kakao'
    };

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

/**
 * 구글 로그인
 */
function loginWithGoogle() {
    // 실제 구현 시 구글 SDK 연동
    // 데모용으로 임시 로그인 처리
    const userData = {
        id: 'google_' + Date.now(),
        name: '구글 사용자',
        email: 'google@example.com',
        provider: 'google'
    };

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

        // 메인 화면으로 이동
        if (typeof goToScreen === 'function') {
            goToScreen('main');
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

    // 메인 화면으로 이동
    setTimeout(() => {
        if (typeof goToScreen === 'function') {
            goToScreen('main');
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

// 전역으로 내보내기
window.formatPhoneNumber = formatPhoneNumber;
window.loginWithKakao = loginWithKakao;
window.loginWithGoogle = loginWithGoogle;
window.loginWithPhone = loginWithPhone;
window.submitPhoneSignup = submitPhoneSignup;
window.continueAsGuest = continueAsGuest;
window.handleLogout = handleLogout;
