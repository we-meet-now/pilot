/**
 * Departure Feature
 * 출발 기능 관리
 */

/**
 * 출발 시작
 * @param {HTMLElement} btn - 출발 버튼 요소
 */
function startDeparture(btn) {
    if (!btn) return;

    // 버튼 텍스트 변경
    btn.textContent = '이동중';

    // 클래스 변경
    btn.classList.remove('ready');
    btn.classList.add('departed');

    // 토스트 메시지 표시
    if (typeof showToast === 'function') {
        showToast('출발! 도착 예정 시간이 공유되었습니다 🚗');
    }
}

// 전역으로 내보내기
window.startDeparture = startDeparture;
