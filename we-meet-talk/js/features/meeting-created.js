/**
 * Meeting Created Feature
 * 모임 생성 완료 화면 기능
 */

/**
 * 초대 링크 복사
 */
function copyInviteLink() {
    const linkInput = document.getElementById('invite-link');
    if (!linkInput) return;

    // 링크 복사
    linkInput.select();
    linkInput.setSelectionRange(0, 99999); // 모바일 지원

    try {
        document.execCommand('copy');
        if (typeof showToast === 'function') {
            showToast('링크가 복사되었어요! 📋');
        }
    } catch (err) {
        console.error('링크 복사 실패:', err);
        if (typeof showToast === 'function') {
            showToast('링크 복사에 실패했어요');
        }
    }

    // 선택 해제
    window.getSelection().removeAllRanges();
}

/**
 * 초대 링크 공유
 */
function shareInviteLink() {
    const link = document.getElementById('invite-link');
    if (!link) return;

    const url = link.value;
    const text = '위밋톡 모임에 초대합니다!';

    // Web Share API 지원 확인
    if (navigator.share) {
        navigator.share({
            title: '위밋톡 모임 초대',
            text: text,
            url: url
        })
        .then(() => {
            if (typeof showToast === 'function') {
                showToast('공유했어요! 🎉');
            }
        })
        .catch((err) => {
            if (err.name !== 'AbortError') {
                console.error('공유 실패:', err);
            }
        });
    } else {
        // Web Share API 미지원 시 링크 복사
        copyInviteLink();
    }
}

/**
 * 생성된 채팅방으로 이동
 */
function goToCreatedChatRoom() {
    // 저장된 채팅방 ID 가져오기
    const chatRoomId = window.latestCreatedChatRoomId || 'new-meeting-room';

    if (typeof showToast === 'function') {
        showToast('채팅방으로 이동합니다! 💬');
    }

    // 채팅방으로 이동
    setTimeout(() => {
        if (typeof goToChatRoom === 'function') {
            goToChatRoom(chatRoomId);
        } else if (typeof goToScreen === 'function') {
            // goToChatRoom이 없으면 직접 화면 전환
            goToScreen('main');
        }
    }, 300);
}

/**
 * 모임 생성 완료 화면으로 이동
 * @param {string} chatRoomUrl - 생성된 채팅방 URL
 * @param {string} chatRoomId - 생성된 채팅방 ID
 */
function showMeetingCreatedScreen(chatRoomUrl, chatRoomId) {
    // 채팅방 ID 저장
    if (chatRoomId) {
        window.latestCreatedChatRoomId = chatRoomId;
    }

    // URL이 제공되면 input에 설정
    if (chatRoomUrl) {
        const linkInput = document.getElementById('invite-link');
        if (linkInput) {
            linkInput.value = chatRoomUrl;
        }
    }

    // 화면 전환
    if (typeof goToScreen === 'function') {
        goToScreen('meeting-created');
    }
}

// 전역으로 내보내기
window.copyInviteLink = copyInviteLink;
window.shareInviteLink = shareInviteLink;
window.goToCreatedChatRoom = goToCreatedChatRoom;
window.showMeetingCreatedScreen = showMeetingCreatedScreen;
