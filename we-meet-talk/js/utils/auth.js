/**
 * Authentication State Management
 * 로그인 상태 관리
 */

// 로그인 상태 (로컬 스토리지 또는 세션 기반)
let isLoggedIn = false;
let currentUser = null;

/**
 * 로그인 상태 확인
 * @returns {boolean} 로그인 여부
 */
function checkAuthStatus() {
    // 로컬 스토리지에서 로그인 정보 확인
    const authData = localStorage.getItem('wemeettalk_auth');

    if (authData) {
        try {
            const data = JSON.parse(authData);
            isLoggedIn = data.isLoggedIn || false;
            currentUser = data.user || null;
        } catch (e) {
            isLoggedIn = false;
            currentUser = null;
        }
    }

    return isLoggedIn;
}

/**
 * 로그인 처리
 * @param {Object} userData - 사용자 정보
 */
function login(userData) {
    isLoggedIn = true;
    currentUser = userData;

    // 로컬 스토리지에 저장
    localStorage.setItem('wemeettalk_auth', JSON.stringify({
        isLoggedIn: true,
        user: userData
    }));

    // UI 업데이트
    updateUIByAuthStatus();

    if (typeof showToast === 'function') {
        showToast('로그인되었습니다!');
    }
}

/**
 * 로그아웃 처리
 */
function logout() {
    isLoggedIn = false;
    currentUser = null;

    // 로컬 스토리지에서 제거
    localStorage.removeItem('wemeettalk_auth');

    // UI 업데이트
    updateUIByAuthStatus();

    if (typeof showToast === 'function') {
        showToast('로그아웃되었습니다.');
    }
}

/**
 * 현재 사용자 정보 가져오기
 * @returns {Object|null} 사용자 정보
 */
function getCurrentUser() {
    return currentUser;
}

/**
 * 로그인 여부 확인
 * @returns {boolean}
 */
function isUserLoggedIn() {
    return isLoggedIn;
}

/**
 * 로그인 상태에 따라 UI 업데이트
 */
function updateUIByAuthStatus() {
    // 캘린더 탭 업데이트
    updateCalendarTab();

    // 마이페이지 업데이트
    updateMyPage();

    // 내 캘린더 업데이트
    if (typeof updateMyCalendar === 'function') {
        updateMyCalendar();
    }

    // 갤러리 업데이트
    if (typeof updateGallery === 'function') {
        updateGallery();
    }
}

/**
 * 캘린더 탭 업데이트
 */
function updateCalendarTab() {
    const calendarTab = document.getElementById('tab-calendar');
    if (!calendarTab) return;

    // 로그인 안내 메시지 찾기 또는 생성
    let loginNotice = calendarTab.querySelector('.calendar-login-notice');

    if (!isLoggedIn) {
        // 로그인하지 않은 경우 - 안내 메시지 표시
        if (!loginNotice) {
            loginNotice = document.createElement('div');
            loginNotice.className = 'calendar-login-notice';
            loginNotice.innerHTML = `
                <div class="login-notice-card">
                    <div class="notice-icon">📅</div>
                    <h3 class="notice-title">모임 일정을 한눈에!</h3>
                    <p class="notice-desc">로그인하면 참여한 모든 모임의 일정을<br>캘린더에서 모아볼 수 있어요.</p>
                    <button class="btn-login" onclick="goToScreen('auth')">로그인하기</button>
                </div>
            `;

            // 캘린더 상단에 추가
            const calendarHeader = calendarTab.querySelector('.calendar-header');
            if (calendarHeader) {
                calendarHeader.after(loginNotice);
            } else {
                calendarTab.insertBefore(loginNotice, calendarTab.firstChild);
            }
        }
        loginNotice.style.display = 'block';
    } else {
        // 로그인한 경우 - 안내 메시지 숨김
        if (loginNotice) {
            loginNotice.style.display = 'none';
        }
    }
}

/**
 * 마이페이지 업데이트
 */
function updateMyPage() {
    const profileSection = document.querySelector('.mypage-profile');
    if (!profileSection) return;

    const profileName = profileSection.querySelector('.profile-name');
    const profileEmail = profileSection.querySelector('.profile-email');
    const logoutBtn = profileSection.querySelector('.btn-logout');

    if (!isLoggedIn) {
        // 로그인하지 않은 경우
        if (profileName) {
            profileName.textContent = '게스트';
        }
        if (profileEmail) {
            profileEmail.innerHTML = `
                <button class="btn-profile-login" onclick="goToScreen('auth')" style="
                    margin-top: 12px;
                    padding: 10px 24px;
                    background: var(--primary);
                    color: white;
                    border: none;
                    border-radius: 50px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                ">로그인하기</button>
            `;
        }
        // 로그아웃 버튼 숨김
        if (logoutBtn) {
            logoutBtn.style.display = 'none';
        }
    } else {
        // 로그인한 경우
        if (profileName && currentUser) {
            profileName.textContent = currentUser.name || '사용자';
        }
        if (profileEmail && currentUser) {
            // 전화번호 로그인인 경우 phone 표시, 아니면 email 표시
            if (currentUser.provider === 'phone' && currentUser.phone) {
                profileEmail.textContent = currentUser.phone;
            } else {
                profileEmail.textContent = currentUser.email || 'user@example.com';
            }
        }
        // 로그아웃 버튼 표시
        if (logoutBtn) {
            logoutBtn.style.display = 'block';
        }
    }
}

/**
 * 로그인 필요 기능 실행 전 체크
 * @param {Function} callback - 로그인 후 실행할 콜백
 * @param {string} message - 로그인 안내 메시지
 */
function requireAuth(callback, message = '로그인이 필요한 기능입니다.') {
    if (!isLoggedIn) {
        if (typeof showToast === 'function') {
            showToast(message);
        }
        // 2초 후 로그인 화면으로 이동
        setTimeout(() => {
            goToScreen('auth');
        }, 2000);
        return false;
    }

    if (callback && typeof callback === 'function') {
        callback();
    }
    return true;
}

// 페이지 로드 시 인증 상태 확인
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        checkAuthStatus();
        updateUIByAuthStatus();
    });
} else {
    checkAuthStatus();
    updateUIByAuthStatus();
}

// 전역으로 내보내기
window.checkAuthStatus = checkAuthStatus;
window.login = login;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.isUserLoggedIn = isUserLoggedIn;
window.updateUIByAuthStatus = updateUIByAuthStatus;
window.requireAuth = requireAuth;
