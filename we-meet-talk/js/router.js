/**
 * Router - Screen Navigation
 * 화면 전환 관리
 */

// 메인 화면 진입 여부 추적
let hasEnteredMain = false;

// 현재 선택된 모임 데이터
let currentMeeting = null;

/**
 * 특정 화면으로 이동
 * @param {string} id - 화면 ID (예: 'landing', 'summary', 'name', 'main' 등)
 */
function goToScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + id).classList.add('active');

    // 메인 화면 진입 시 플래그 설정
    if (id === 'main') {
        hasEnteredMain = true;
    }

    // 채팅 리스트 화면 진입 시 채팅방 목록 로드
    if (id === 'chat-list' && typeof loadChatRoomList === 'function') {
        setTimeout(() => {
            loadChatRoomList();
        }, 100);
    }

    // 로그인 화면 진입 시 최근 로그인 수단 표시
    if (id === 'login' && typeof showRecentLoginMethod === 'function') {
        setTimeout(() => {
            showRecentLoginMethod();
        }, 100);
    }

    // 완료 화면일 경우 컨페티 효과
    if (id === 'complete' && typeof createConfetti === 'function') {
        createConfetti();
    }
}

/**
 * 메인 화면의 하단 네비게이션에서 '홈' 활성화
 */
function activateBottomNavHome() {
    // 하단 네비게이션 버튼들의 active 클래스 제거
    const navItems = document.querySelectorAll('#screen-main .bottom-nav .nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // 첫 번째 버튼(홈)에 active 클래스 추가
    if (navItems.length > 0) {
        navItems[0].classList.add('active');
    }
}

/**
 * 하단 네비게이션 버튼 활성화
 * @param {HTMLElement} element - 클릭된 버튼 요소
 */
function activateBottomNav(element) {
    // 현재 활성화된 화면의 모든 하단 네비게이션 버튼의 active 클래스 제거
    const activeScreen = document.querySelector('.screen.active');
    if (activeScreen) {
        const navItems = activeScreen.querySelectorAll('.bottom-nav .nav-item');
        navItems.forEach(item => item.classList.remove('active'));
    }

    // 클릭된 버튼에 active 클래스 추가
    element.classList.add('active');
}

/**
 * 메인 화면에서 뒤로가기 처리
 * 다른 탭에 있으면 채팅 탭으로, 채팅 탭에 있으면 채팅 목록으로
 */
function handleMainBack() {
    // 현재 활성화된 탭 확인
    const activeChatTab = document.querySelector('#screen-main #tab-chat.active');

    // 채팅 탭이 활성화되어 있으면 채팅 목록으로 이동
    if (activeChatTab) {
        goToScreen('chat-list');
    } else {
        // 다른 탭에 있으면 채팅 탭으로 돌아가기
        goBackToChatTab();
    }
}

/**
 * 채팅 탭으로 돌아가기
 */
function goBackToChatTab() {
    // 모든 탭 패널 숨기기
    document.querySelectorAll('#screen-main .tab-panel').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });

    // 모든 탭 버튼 비활성화
    document.querySelectorAll('#screen-main .tab-btn').forEach(b => {
        b.classList.remove('active');
    });

    // 채팅 패널 표시
    const chatPanel = document.getElementById('tab-chat');
    if (chatPanel) {
        chatPanel.classList.add('active');
        chatPanel.style.display = 'flex';
    }
}

/**
 * 현재 모임 설정
 * @param {Object} meeting - 모임 데이터
 */
function setCurrentMeeting(meeting) {
    currentMeeting = meeting;
    // 메인 화면 헤더 업데이트
    updateMainHeader();
}

/**
 * 현재 모임 가져오기
 * @returns {Object|null} 현재 모임 데이터
 */
function getCurrentMeeting() {
    return currentMeeting;
}

/**
 * 메인 화면 헤더 업데이트
 */
function updateMainHeader() {
    if (!currentMeeting) return;

    // 헤더 제목 업데이트
    const headerTitle = document.querySelector('#screen-main .main-header-info h2');
    if (headerTitle) {
        headerTitle.textContent = currentMeeting.name;
    }

    // 참여자 수 업데이트
    const headerCount = document.querySelector('#screen-main .main-header-info span');
    if (headerCount) {
        headerCount.textContent = `${currentMeeting.totalMembers}명 참여 중`;
    }
}

// 전역으로 내보내기 (HTML onclick에서 사용)
window.goToScreen = goToScreen;
window.handleMainBack = handleMainBack;
window.goBackToChatTab = goBackToChatTab;
window.setCurrentMeeting = setCurrentMeeting;
window.getCurrentMeeting = getCurrentMeeting;
window.updateMainHeader = updateMainHeader;
window.activateBottomNav = activateBottomNav;
