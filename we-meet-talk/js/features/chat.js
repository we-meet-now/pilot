/**
 * Chat Feature
 * 채팅 기능 관리
 */

/**
 * 채팅방 목록 로드
 */
async function loadChatRoomList() {
    if (!window.db) {
        console.error('Firestore가 초기화되지 않았습니다.');
        return;
    }

    const chatListContainer = document.querySelector('.chat-list-container');
    if (!chatListContainer) return;

    try {
        // 현재 사용자 정보
        const currentUser = window.auth?.currentUser;
        const userId = currentUser?.uid || 'anonymous';

        // Firestore에서 채팅방 목록 가져오기
        // TODO: 나중에 orderBy 추가하려면 Firebase Console에서 복합 인덱스 생성 필요
        const snapshot = await window.db.collection('chatrooms')
            .where('createdBy', '==', userId)
            .limit(20)
            .get();

        // 기존 목록 초기화
        chatListContainer.innerHTML = '';

        if (snapshot.empty) {
            chatListContainer.innerHTML = '<p style="text-align:center;padding:40px;color:#999;">아직 참여한 채팅방이 없어요</p>';
            return;
        }

        // 채팅방 목록 생성
        snapshot.forEach(doc => {
            const chatRoom = doc.data();
            const chatRoomId = doc.id;

            const chatItem = document.createElement('div');
            chatItem.className = 'chat-item';
            chatItem.onclick = () => {
                if (typeof goToChatRoom === 'function') {
                    goToChatRoom(chatRoomId);
                }
            };

            // 아바타 색상 (모임 타입에 따라)
            const avatarColors = ['#FF6B35', '#F7931E', '#FDC830', '#37B3CC', '#8B5CF6', '#EC4899'];
            const avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

            // 이모지 매핑
            const emojiMap = {
                '회식': '🍺',
                '저녁': '🍽️',
                '술자리': '🍻',
                '카페': '☕',
                '점심': '🍱',
                '모임': '👥'
            };
            const emoji = emojiMap[chatRoom.name] || '💬';

            chatItem.innerHTML = `
                <div class="chat-avatar" style="background:${avatarColor}">${emoji}</div>
                <div class="chat-info">
                    <div class="chat-header">
                        <h3 class="chat-name">${chatRoom.name || '새 모임'}</h3>
                        <span class="chat-time">방금 전</span>
                    </div>
                    <p class="chat-last-message">${chatRoom.participantCount || 1}명 참여 중</p>
                </div>
            `;

            chatListContainer.appendChild(chatItem);
        });

    } catch (error) {
        console.error('채팅방 목록 로드 실패:', error);
        chatListContainer.innerHTML = '<p style="text-align:center;padding:40px;color:#999;">채팅방을 불러오는데 실패했어요</p>';
    }
}

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

/**
 * 채팅 리스트 탭 전환 (친구/채팅)
 * @param {string} tab - 'friends' 또는 'chats'
 * @param {HTMLElement} btn - 클릭된 탭 버튼
 */
function switchChatListTab(tab, btn) {
    // 모든 탭 버튼 비활성화
    document.querySelectorAll('.chat-tab-btn').forEach(b => b.classList.remove('active'));

    // 클릭된 버튼 활성화
    btn.classList.add('active');

    // 친구 목록과 채팅 목록
    const friendsList = document.getElementById('friends-list');
    const chatsList = document.querySelector('.chat-list-container');

    if (tab === 'friends') {
        // 친구 탭 표시
        if (friendsList) friendsList.style.display = 'block';
        if (chatsList) chatsList.style.display = 'none';
    } else {
        // 채팅 탭 표시
        if (friendsList) friendsList.style.display = 'none';
        if (chatsList) chatsList.style.display = 'block';
    }

    // 현재 탭 저장 (플러스 버튼 기능 분기용)
    window.currentChatListTab = tab;
}

/**
 * 채팅 리스트 플러스 버튼 클릭 처리
 */
function handleChatListPlusClick() {
    const currentTab = window.currentChatListTab || 'chats';

    if (currentTab === 'friends') {
        // 친구 탭: 친구 추가 모달 열기
        openAddFriendModal();
    } else {
        // 채팅 탭: 모임 채팅방 만들기 (기존 create-meeting 화면으로)
        if (typeof goToScreen === 'function') {
            goToScreen('create-meeting');
        }
    }
}

/**
 * 친구 추가 모달 열기
 */
function openAddFriendModal() {
    const modal = document.getElementById('modal-add-friend');
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * 친구 추가 모달 닫기
 */
function closeAddFriendModal() {
    const modal = document.getElementById('modal-add-friend');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * 카카오톡으로 초대
 */
function inviteViaKakao() {
    if (typeof showToast === 'function') {
        showToast('카카오톡 메시지를 전송했어요! 💬');
    }
    closeAddFriendModal();

    // 실제 구현 시 카카오톡 SDK 사용
    console.log('카카오톡 초대 메시지 전송');
}

/**
 * 연락처로 초대
 */
function inviteViaContacts() {
    if (typeof showToast === 'function') {
        showToast('SMS를 전송했어요! 📱');
    }
    closeAddFriendModal();

    // 실제 구현 시 SMS API 사용
    console.log('SMS 초대 메시지 전송');
}

/**
 * 이메일로 초대
 */
function inviteViaEmail() {
    if (typeof showToast === 'function') {
        showToast('이메일을 전송했어요! 📧');
    }
    closeAddFriendModal();

    // 실제 구현 시 이메일 API 사용
    console.log('이메일 초대장 전송');
}

// 전역으로 내보내기
window.loadChatRoomList = loadChatRoomList;
window.sendMessage = sendMessage;
window.switchChatListTab = switchChatListTab;
window.handleChatListPlusClick = handleChatListPlusClick;
window.openAddFriendModal = openAddFriendModal;
window.closeAddFriendModal = closeAddFriendModal;
window.inviteViaKakao = inviteViaKakao;
window.inviteViaContacts = inviteViaContacts;
window.inviteViaEmail = inviteViaEmail;
