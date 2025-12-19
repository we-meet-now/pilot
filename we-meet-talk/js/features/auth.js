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
    // 전화번호 가입 화면으로 이동
    if (typeof goToScreen === 'function') {
        goToScreen('phone-signup');
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

    // 유저 데이터 생성
    const userData = {
        id: 'phone_' + Date.now(),
        name: name,
        email: email,
        phone: phone,
        provider: 'phone'
    };

    // localStorage에 저장 (DB 시뮬레이션)
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
