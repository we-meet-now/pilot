/**
 * Utility Helper Functions
 * 공통 유틸리티 함수
 */

/**
 * 요소가 존재하는지 확인
 * @param {string} selector - CSS 선택자
 * @returns {boolean}
 */
function elementExists(selector) {
    return document.querySelector(selector) !== null;
}

/**
 * 안전하게 요소 가져오기
 * @param {string} selector - CSS 선택자
 * @returns {HTMLElement|null}
 */
function getElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
    }
    return element;
}

/**
 * 모든 요소 가져오기
 * @param {string} selector - CSS 선택자
 * @returns {NodeList}
 */
function getElements(selector) {
    return document.querySelectorAll(selector);
}

/**
 * 클래스 토글
 * @param {HTMLElement} element - 대상 요소
 * @param {string} className - 토글할 클래스명
 * @param {boolean} force - 강제 설정 (선택사항)
 */
function toggleClass(element, className, force) {
    if (element) {
        element.classList.toggle(className, force);
    }
}

/**
 * 딜레이 함수
 * @param {number} ms - 밀리초
 * @returns {Promise}
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 전역으로 내보내기 (필요시)
window.elementExists = elementExists;
window.getElement = getElement;
window.getElements = getElements;
window.toggleClass = toggleClass;
window.delay = delay;
