/**
 * Calendar Feature
 * 캘린더 기능 관리
 */

/**
 * 요일 이름 가져오기
 * @param {number} day - 날짜
 * @returns {string} 요일 ('금', '토' 등)
 */
function getDayName(day) {
    const days = {
        13: '금',
        14: '토',
        20: '금',
        21: '토',
        28: '토'
    };
    return days[day] || '일';
}

/**
 * 캘린더 날짜 선택
 * @param {HTMLElement} el - 클릭된 날짜 요소
 */
function selectCalDay(el) {
    // 선택 가능한 날짜인지 확인
    if (!el.classList.contains('available') && !el.classList.contains('best')) {
        return;
    }

    // 모든 날짜 선택 해제
    document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));

    // 클릭된 날짜 선택
    el.classList.add('selected');

    const day = el.textContent;
    const dayName = getDayName(parseInt(day));

    // 선택된 날짜 표시
    const selectedDateEl = document.querySelector('.selected-date');
    if (selectedDateEl) {
        selectedDateEl.textContent = `12월 ${day}일 (${dayName})`;
    }

    // 추천일 여부에 따라 상태 메시지 변경
    const selectedStatusEl = document.querySelector('.selected-status');
    if (selectedStatusEl) {
        if (day === '21') {
            selectedStatusEl.textContent = '⭐ AI 추천! 4명 모두 가능한 최적의 날이에요';
        } else {
            selectedStatusEl.textContent = '✓ 4명 모두 가능한 날이에요!';
        }
    }
}

/**
 * 월 변경
 * @param {number} dir - 방향 (1: 다음 달, -1: 이전 달)
 */
function changeMonth(dir) {
    const message = dir > 0 ? '다음 달로 이동' : '이전 달로 이동';
    if (typeof showToast === 'function') {
        showToast(message);
    }
}

/**
 * 캘린더 날짜 확정
 */
function confirmCalendarDate() {
    const selected = document.querySelector('.cal-day.selected');

    if (selected && typeof showToast === 'function') {
        const day = selected.textContent;
        showToast(`12월 ${day}일로 일정이 확정되었습니다! 🎉`);
    }
}

/**
 * 이벤트로 스크롤
 * @param {string} eventId - 이벤트 요소 ID
 */
function scrollToEvent(eventId) {
    const el = document.getElementById(eventId);

    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.transform = 'scale(1.02)';

        setTimeout(() => {
            el.style.transform = '';
        }, 300);
    }
}

// 전역으로 내보내기
window.getDayName = getDayName;
window.selectCalDay = selectCalDay;
window.changeMonth = changeMonth;
window.confirmCalendarDate = confirmCalendarDate;
window.scrollToEvent = scrollToEvent;
