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
async function sendMessage() {
    const input = document.getElementById('chat-input');
    if (!input || !window.currentChatRoomId || !window.db) return;

    const msg = input.value.trim();
    if (!msg) return;

    const currentUser = window.auth?.currentUser;
    const userName = currentUser?.displayName || '나';
    const userPhoto = currentUser?.photoURL || '';
    const userId = currentUser?.uid || 'anonymous';

    const messageData = {
        text: msg,
        senderId: userId,
        senderName: userName,
        senderPhoto: userPhoto,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        type: 'text'
    };

    try {
        // Firestore에 저장
        await window.db.collection('chatrooms').doc(window.currentChatRoomId)
            .collection('messages').add(messageData);

        // 입력창 초기화
        input.value = '';

        // 실시간 리스너가 아니므로 수동 갱신 (사용자 경험을 위해)
        loadChatMessages(window.currentChatRoomId);
    } catch (error) {
        console.error('메시지 전송 실패:', error);
        if (typeof showToast === 'function') showToast('메시지 전송에 실패했습니다.');
    }
}

/**
 * AI 매니저 카드 메시지 전송 (DB 저장 포함)
 * @param {string} htmlContent - 메시지 버블 안에 들어갈 HTML 내용
 */
async function sendRichAIMessage(htmlContent) {
    if (!window.currentChatRoomId || !window.db) return;

    const messageData = {
        text: htmlContent,
        senderId: 'ai-manager',
        senderName: 'AI 매니저',
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        type: 'rich-ai'
    };

    try {
        await window.db.collection('chatrooms').doc(window.currentChatRoomId)
            .collection('messages').add(messageData);

        loadChatMessages(window.currentChatRoomId);
    } catch (error) {
        console.error('AI 메시지 저장 실패:', error);
    }
}

/**
 * 채팅방 메시지 로드
 */
async function loadChatMessages(chatRoomId) {
    if (!chatRoomId || !window.db) return;

    const container = document.getElementById('chat-messages');
    if (!container) return;

    try {
        const snapshot = await window.db.collection('chatrooms').doc(chatRoomId)
            .collection('messages').orderBy('timestamp', 'asc').get();

        container.innerHTML = '';

        snapshot.forEach(doc => {
            const data = doc.data();
            renderMessage(data);
        });

        // 스크롤 최하단
        container.scrollTop = container.scrollHeight;
    } catch (error) {
        console.error('메시지 로드 실패:', error);
    }
}

/**
 * 개별 메시지 렌더링
 */
function renderMessage(data) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const currentUser = window.auth?.currentUser;
    const isMine = data.senderId === (currentUser?.uid || 'anonymous');
    const time = data.timestamp ? new Date(data.timestamp.toDate()).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '방금 전';

    let html = '';

    if (data.type === 'rich-ai') {
        html = `
            <div class="message ai-message">
                <div class="message-avatar" style="background:#EEF2FF; border:1px solid #C7D2FE">✨</div>
                <div class="message-content">
                    <span class="message-name">AI 매니저</span>
                    <div class="message-bubble ai-bubble">${data.text}</div>
                    <span class="message-time">${time}</span>
                </div>
            </div>
        `;
    } else {
        const initial = data.senderName ? data.senderName.charAt(0) : '익';
        const color = isMine ? '#C084FC' : '#8B5CF6'; // 단순화를 위해

        if (isMine) {
            html = `
                <div class="message sent">
                    <div class="message-content">
                        <div class="message-bubble">${data.text}</div>
                        <span class="message-time">${time}</span>
                    </div>
                    <div class="message-avatar" style="background:${color}; color:white">${initial}</div>
                </div>
            `;
        } else {
            html = `
                <div class="message">
                    <div class="message-avatar" style="background:#F3F4F6; border:1px solid #E5E7EB">${initial}</div>
                    <div class="message-content">
                        <span class="message-name">${data.senderName}</span>
                        <div class="message-bubble">${data.text}</div>
                        <span class="message-time">${time}</span>
                    </div>
                </div>
            `;
        }
    }

    container.insertAdjacentHTML('beforeend', html);
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
window.sendRichAIMessage = sendRichAIMessage;
window.loadChatMessages = loadChatMessages;

// 페이지 로드 시 구글 캘린더 서비스 초기화
if (typeof initGoogleCalendar === 'function') {
    initGoogleCalendar();
}
