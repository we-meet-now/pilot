/**
 * Toast Component
 * 토스트 알림 표시
 */

/**
 * 토스트 메시지 표시
 * @param {string} msg - 표시할 메시지
 * @param {number} duration - 표시 시간 (ms, 기본값: 2500)
 */
function showToast(msg, duration = 2500) {
    const toast = document.getElementById('toast');
    if (!toast) {
        console.warn('Toast element not found');
        return;
    }

    toast.textContent = msg;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// 전역으로 내보내기
window.showToast = showToast;
