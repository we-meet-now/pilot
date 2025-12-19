/**
 * Tabs Component
 * 탭 전환 관리
 */

/**
 * 탭 전환
 * @param {string} tabId - 탭 ID (예: 'info', 'calendar', 'vote', 'settle', 'photos', 'chat')
 * @param {HTMLElement} btn - 클릭된 탭 버튼 요소
 */
function switchTab(tabId, btn) {
    // 모든 탭 버튼 비활성화
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    // 모든 탭 패널 숨기기
    document.querySelectorAll('.tab-panel').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });

    // 클릭된 버튼 활성화
    if (btn) btn.classList.add('active');

    // 선택된 패널 표시
    const panel = document.getElementById('tab-' + tabId);
    panel.classList.add('active');
    panel.style.display = tabId === 'chat' ? 'flex' : 'block';
}

/**
 * 채팅 탭을 기본으로 표시
 * (초기 진입 시 채팅 탭이 기본으로 열림)
 */
function showChatDefault() {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });

    const chatPanel = document.getElementById('tab-chat');
    chatPanel.classList.add('active');
    chatPanel.style.display = 'flex';
}

// 전역으로 내보내기
window.switchTab = switchTab;
window.showChatDefault = showChatDefault;
