/**
 * Vote Feature
 * 투표 기능 관리
 */

/**
 * 투표 옵션 선택
 * @param {HTMLElement} el - 클릭된 투표 옵션 요소
 */
function selectVote(el) {
    // 모든 옵션 선택 해제
    document.querySelectorAll('.vote-option').forEach(o => o.classList.remove('selected'));

    // 클릭된 옵션 선택
    el.classList.add('selected');
}

/**
 * 소프트 투표 선택 (감정 표현)
 * @param {HTMLElement} el - 클릭된 소프트 투표 버튼
 */
function selectSoftVote(el) {
    // 모든 버튼 선택 해제
    document.querySelectorAll('.soft-vote-btn').forEach(b => b.classList.remove('selected'));

    // 클릭된 버튼 선택
    el.classList.add('selected');
}

/**
 * 투표 제출
 */
function submitVote() {
    const selected = document.querySelector('.vote-option.selected');

    if (selected && typeof showToast === 'function') {
        showToast('투표 완료! ✓');
    } else if (typeof showToast === 'function') {
        showToast('장소를 선택해주세요');
    }
}

// 전역으로 내보내기
window.selectVote = selectVote;
window.selectSoftVote = selectSoftVote;
window.submitVote = submitVote;
