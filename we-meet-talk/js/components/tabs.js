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

    // 투표 탭 진입 시 데이터 갱신
    if (tabId === 'vote' && window.currentChatRoomId && window.db) {
        refreshVoteTab(window.currentChatRoomId);
    }
}

/**
 * 투표 탭 데이터 갱신
 */
async function refreshVoteTab(chatRoomId) {
    try {
        const doc = await window.db.collection('chatrooms').doc(chatRoomId).get();
        if (doc.exists) {
            const data = doc.data();
            if (typeof renderVoteOptions === 'function') {
                renderVoteOptions(data.locationCandidates || []);
            }
        }
    } catch (error) {
        console.error('Failed to refresh vote tab:', error);
    }
}

/**
 * 채팅 목록 화면으로 이동
 */
function showChatDefault() {
    if (typeof goToScreen === 'function') {
        goToScreen('chat-list');
    }
}

/**
 * 채팅방으로 이동
 * @param {string} chatRoomId - 채팅방 ID
 */
async function goToChatRoom(chatRoomId) {
    // screen-main으로 화면 전환
    if (typeof goToScreen === 'function') {
        goToScreen('main');
    }

    // Firestore에서 채팅방 데이터 로드
    if (chatRoomId && window.db) {
        try {
            const docRef = window.db.collection('chatrooms').doc(chatRoomId);
            const doc = await docRef.get();

            if (doc.exists) {
                const chatRoomData = doc.data();
                console.log('채팅방 데이터 로드:', chatRoomData);

                // 채팅방 헤더 업데이트
                const mainScreen = document.getElementById('screen-main');
                if (mainScreen) {
                    const titleEl = mainScreen.querySelector('.main-header-info h2');

                    if (titleEl) {
                        titleEl.textContent = chatRoomData.name || '새 모임';
                    }

                    // 투표 탭 데이터 렌더링
                    if (typeof renderVoteOptions === 'function') {
                        renderVoteOptions(chatRoomData.locationCandidates || []);
                    }
                    const participantCountEl = mainScreen.querySelector('.main-header-info span');

                    if (titleEl) {
                        titleEl.textContent = chatRoomData.name || '새 모임';
                    }
                    if (participantCountEl) {
                        const count = chatRoomData.participantCount || 1;
                        participantCountEl.textContent = `${count}명 참여 중`;
                    }

                    // 현재 채팅방 ID 저장
                    window.currentChatRoomId = chatRoomId;

                    // 세션 유지를 위해 로컬 스토리지에 저장
                    localStorage.setItem('lastChatRoomId', chatRoomId);
                }
            } else {
                console.error('채팅방을 찾을 수 없습니다:', chatRoomId);
                if (typeof showToast === 'function') {
                    showToast('채팅방을 불러올 수 없습니다.');
                }
            }
        } catch (error) {
            console.error('채팅방 데이터 로드 실패:', error);
        }
    }

    // screen-main 내부의 탭만 초기화
    const mainScreen = document.getElementById('screen-main');
    if (mainScreen) {
        // 상단 탭 버튼 모두 비활성화
        mainScreen.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

        // 모든 탭 패널 숨기기
        mainScreen.querySelectorAll('.tab-panel').forEach(p => {
            p.classList.remove('active');
            p.style.display = 'none';
        });

        // 채팅 패널만 표시
        const chatPanel = mainScreen.querySelector('#tab-chat');
        if (chatPanel) {
            chatPanel.classList.add('active');
            chatPanel.style.display = 'flex';
        }
    }

    // 하단 네비게이션에서 "톡" 버튼 활성화
    const bottomNavItems = document.querySelectorAll('#screen-main .bottom-nav .nav-item');
    bottomNavItems.forEach(item => item.classList.remove('active'));

    // "톡" 버튼 찾아서 활성화
    const chatNavBtn = Array.from(bottomNavItems).find(item =>
        item.textContent.trim() === '톡'
    );
    if (chatNavBtn) {
        chatNavBtn.classList.add('active');
    }
}

/**
 * 현재 채팅방 공유하기
 */
async function shareCurrentChatRoom() {
    const chatRoomId = window.currentChatRoomId;

    if (!chatRoomId) {
        if (typeof showToast === 'function') {
            showToast('채팅방 정보를 불러올 수 없습니다.');
        }
        return;
    }

    // Firestore에서 채팅방 데이터 가져오기
    if (window.db) {
        try {
            const docRef = window.db.collection('chatrooms').doc(chatRoomId);
            const doc = await docRef.get();

            if (doc.exists) {
                const chatRoomData = doc.data();
                const inviteUrl = `https://wemeettalk.com/join/${chatRoomId}`;

                // Web Share API 지원 여부 확인
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: `${chatRoomData.name || '모임'} 초대`,
                            text: `${chatRoomData.name || '모임'}에 초대합니다! 함께 참여해주세요 😊`,
                            url: inviteUrl
                        });

                        if (typeof showToast === 'function') {
                            showToast('초대 링크를 공유했어요! 📤');
                        }
                    } catch (error) {
                        // 사용자가 공유를 취소한 경우
                        if (error.name !== 'AbortError') {
                            console.error('공유 실패:', error);
                        }
                    }
                } else {
                    // Web Share API를 지원하지 않는 경우 클립보드에 복사
                    try {
                        await navigator.clipboard.writeText(inviteUrl);
                        if (typeof showToast === 'function') {
                            showToast('초대 링크가 복사되었어요! 📋');
                        }
                    } catch (error) {
                        console.error('클립보드 복사 실패:', error);
                        if (typeof showToast === 'function') {
                            showToast('링크: ' + inviteUrl);
                        }
                    }
                }
            } else {
                if (typeof showToast === 'function') {
                    showToast('채팅방을 찾을 수 없습니다.');
                }
            }
        } catch (error) {
            console.error('채팅방 데이터 로드 실패:', error);
            if (typeof showToast === 'function') {
                showToast('초대 링크를 불러올 수 없습니다.');
            }
        }
    } else {
        // Firestore가 없는 경우 임시 링크 공유
        const inviteUrl = `https://wemeettalk.com/join/${chatRoomId}`;

        try {
            await navigator.clipboard.writeText(inviteUrl);
            if (typeof showToast === 'function') {
                showToast('초대 링크가 복사되었어요! 📋');
            }
        } catch (error) {
            console.error('클립보드 복사 실패:', error);
            if (typeof showToast === 'function') {
                showToast('링크: ' + inviteUrl);
            }
        }
    }
}

// 전역으로 내보내기
window.switchTab = switchTab;
window.showChatDefault = showChatDefault;
window.goToChatRoom = goToChatRoom;
window.shareCurrentChatRoom = shareCurrentChatRoom;
