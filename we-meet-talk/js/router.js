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

    // 완료 화면일 경우 컨페티 효과
    if (id === 'complete' && typeof createConfetti === 'function') {
        createConfetti();
    }
}

/**
 * 메인 화면에서 뒤로가기 처리
 * 첫 진입: name 화면으로
 * 재진입: mycalendar 화면으로
 */
function handleMainBack() {
    if (hasEnteredMain) {
        // 이미 한 번 들어온 경우 - 내 캘린더로
        goToScreen('mycalendar');
    } else {
        // 첫 진입인 경우 - 이름 입력 화면으로
        goToScreen('name');
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
window.setCurrentMeeting = setCurrentMeeting;
window.getCurrentMeeting = getCurrentMeeting;
window.updateMainHeader = updateMainHeader;
