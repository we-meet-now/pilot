/**
 * Name Input Feature
 * 이름 입력 기능 관리
 */

/**
 * 이름 입력 검증 및 버튼 활성화
 */
function checkNameInput() {
    const input = document.getElementById('name-input');
    const btn = document.getElementById('btn-name-next');

    if (!input || !btn) return;

    // 입력값이 있으면 버튼 활성화
    const hasValue = input.value.trim().length > 0;
    btn.classList.toggle('active', hasValue);
}

/**
 * 빠른 이름 선택
 * @param {string} name - 선택할 이름
 */
function setQuickName(name) {
    const input = document.getElementById('name-input');

    if (input) {
        input.value = name;
        checkNameInput();
    }
}

// 전역으로 내보내기
window.checkNameInput = checkNameInput;
window.setQuickName = setQuickName;
