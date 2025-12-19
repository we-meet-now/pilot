/**
 * Chat Feature
 * 채팅 기능 관리
 */

/**
 * 메시지 전송
 */
function sendMessage() {
    const input = document.getElementById('chat-input');
    if (!input) return;

    const msg = input.value.trim();
    if (!msg) return;

    const container = document.getElementById('chat-messages');
    if (!container) return;

    // 메시지 HTML 생성
    const messageHtml = `
        <div class="message sent">
            <div class="message-avatar" style="background:#8B5CF6">도</div>
            <div class="message-content">
                <div class="message-bubble">${msg}</div>
                <span class="message-time">방금 전</span>
            </div>
        </div>
    `;

    // 메시지 추가
    container.innerHTML += messageHtml;

    // 입력창 초기화
    input.value = '';

    // 스크롤을 최하단으로
    container.scrollTop = container.scrollHeight;
}

// 전역으로 내보내기
window.sendMessage = sendMessage;
