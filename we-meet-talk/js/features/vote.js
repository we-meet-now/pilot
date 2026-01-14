/**
 * Vote Feature
 * 투표 기능 관리
 */

/**
 * 투표 옵션 선택
 * @param {HTMLElement} el - 클릭된 투표 옵션 요소
 */
function selectVote(el) {
    // 투표가 마감된 경우 선택 불가
    if (document.body.dataset.voteStatus === 'closed') {
        if (typeof showToast === 'function') showToast('투표가 이미 마감되었습니다. 🔒');
        return;
    }

    const isSelected = el.classList.contains('selected');

    // 모든 옵션 선택 해제
    document.querySelectorAll('.vote-option').forEach(o => o.classList.remove('selected'));

    // 토글: 이미 선택된 상태였다면 해제만 하고 종료, 아니면 새로 선택
    if (!isSelected) {
        el.classList.add('selected');
    }

    // 버튼 상태 업데이트
    updateVoteButton();
}

/**
 * 투표 버튼 텍스트 및 상태 업데이트
 */
function updateVoteButton() {
    const btn = document.getElementById('btn-vote-submit');
    if (!btn) return;

    const selected = document.querySelector('.vote-option.selected');
    const currentUserId = window.auth?.currentUser?.uid || 'anonymous';

    // 현재 내가 투표한 항목 찾기 (voted 클래스)
    const votedItem = document.querySelector('.vote-option.voted');

    if (document.body.dataset.voteStatus === 'closed') {
        btn.textContent = '투표 마감됨';
        btn.disabled = true;
        return;
    }

    if (!votedItem) {
        // 아직 투표 전
        btn.textContent = '투표하기';
        btn.disabled = false;
    } else {
        // 이미 투표함
        btn.disabled = false;
        if (!selected) {
            // 선택된 게 없음 -> 취소 동작
            btn.textContent = '투표 취소';
        } else if (selected === votedItem) {
            // 내가 투표한 걸 다시 선택함 -> 취소 동작
            btn.textContent = '투표 취소';
        } else {
            // 다른 걸 선택함 -> 다시 투표하기 (변경)
            btn.textContent = '다시 투표하기';
        }
    }
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
/**
 * 투표 제출
 */
async function submitVote() {
    const selected = document.querySelector('.vote-option.selected');
    const chatRoomId = window.currentChatRoomId;
    const userId = window.auth?.currentUser?.uid || 'anonymous';

    if (!chatRoomId || !window.db) {
        if (typeof showToast === 'function') showToast('채팅방 정보를 불러올 수 없습니다.');
        return;
    }

    const btn = document.getElementById('btn-vote-submit');
    const currentAction = btn ? btn.textContent : '투표하기';

    if (btn) {
        btn.disabled = true;
        btn.textContent = '처리 중...';
    }

    try {
        let name = null;
        let address = null;

        if (selected) {
            name = selected.querySelector('.vote-option-title').textContent;
            address = selected.querySelector('.vote-option-sub').textContent;
        }

        const docRef = window.db.collection('chatrooms').doc(chatRoomId);

        await window.db.runTransaction(async (transaction) => {
            const doc = await transaction.get(docRef);
            if (!doc.exists) throw new Error("Document does not exist!");

            const data = doc.data();
            const candidates = data.locationCandidates || [];

            // 1. 기존 투표 제거
            candidates.forEach(cand => {
                if (cand.voters && cand.voters.includes(userId)) {
                    cand.voters = cand.voters.filter(uid => uid !== userId);
                    cand.voteCount = cand.voters.length;
                }
            });

            // 2. 새로운 투표 추가 (취소가 아닌 경우에만)
            if (currentAction !== '투표 취소' && selected) {
                const targetIndex = candidates.findIndex(c => c.name === name && (c.address || '') === address);
                if (targetIndex !== -1) {
                    const candidate = candidates[targetIndex];
                    candidate.voters = [...(candidate.voters || []), userId];
                    candidate.voteCount = candidate.voters.length;
                    candidate.lastVotedAt = new Date().toISOString();
                }
            }

            transaction.update(docRef, { locationCandidates: candidates });
        });

        const successMsg = currentAction === '투표 취소' ? '투표가 취소되었습니다.' : '투표가 완료되었습니다! 🗳️';
        if (typeof showToast === 'function') showToast(successMsg);

        // 투표 탭 데이터 즉시 갱신
        if (typeof refreshVoteTab === 'function') {
            await refreshVoteTab(chatRoomId);
        }

    } catch (error) {
        console.error('Vote submission failed:', error);
        if (typeof showToast === 'function') showToast('투표 처리에 실패했습니다.');
    } finally {
        if (btn) {
            btn.disabled = false;
            // 로드 후 updateVoteButton이 다시 호출될 것이므로 기본값만
            btn.textContent = '투표하기';
        }
    }
}

/**
 * 투표 옵션 렌더링
 * @param {Object} chatRoomData - 채팅방 데이터 전체
 */
function renderVoteOptions(chatRoomData) {
    const candidates = chatRoomData.locationCandidates || [];
    const container = document.querySelector('.vote-options');
    if (!container) return;

    // 상태 저장 (전역 데이터셋 활용)
    const voteStatus = chatRoomData.voteStatus || 'active';
    document.body.dataset.voteStatus = voteStatus;

    // 최종 확정 장소 배너 처리
    const finalBanner = document.getElementById('final-location-banner');
    if (finalBanner) {
        if (chatRoomData.finalLocation) {
            finalBanner.style.display = 'flex';
            document.getElementById('final-location-name').textContent = chatRoomData.finalLocation.name;
            document.getElementById('final-location-address').textContent = chatRoomData.finalLocation.address || '';
        } else {
            finalBanner.style.display = 'none';
        }
    }

    // 투표 탭 뱃지 업데이트
    const voteTabBtn = document.querySelector('.tab-btn[onclick*="\'vote\'"]');
    if (voteTabBtn) {
        const badge = voteTabBtn.querySelector('.badge');
        if (badge) {
            const count = candidates ? candidates.length : 0;
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-flex' : 'none';
        }
    }

    container.innerHTML = '';

    if (!candidates || candidates.length === 0) {
        container.innerHTML = '<p class="no-candidates">아직 등록된 장소 후보가 없어요</p>';
        return;
    }

    const currentUserId = window.auth?.currentUser?.uid || 'anonymous';
    const isHost = chatRoomData.createdBy === currentUserId;

    candidates.forEach((cand, index) => {
        const div = document.createElement('div');
        div.className = 'vote-option';
        if (voteStatus === 'closed') div.classList.add('read-only');

        // 내가 투표한 항목인지 확인
        const isVoted = cand.voters && cand.voters.includes(currentUserId);
        if (isVoted) {
            div.classList.add('selected');
            div.classList.add('voted');
        }

        if (voteStatus !== 'closed') {
            div.onclick = () => selectVote(div);
        }

        // 삭제 권한 체크
        const canDelete = (voteStatus !== 'closed') && (isHost || (cand.addedBy === currentUserId));

        // 최종 선택 버튼 노출 여부 (마감됨 + 방장 + 아직 최종선정 전)
        const showFinalizeBtn = (voteStatus === 'closed' && isHost && !chatRoomData.finalLocation);

        div.innerHTML = `
            <div class="vote-radio"></div>
            <div class="vote-option-content">
                <p class="vote-option-title">${cand.name}</p>
                <span class="vote-option-sub">${cand.address || ''}</span>
            </div>
            <div class="vote-option-right">
                <span class="vote-count">${cand.voteCount || 0}표</span>
                ${canDelete ? `
                    <button class="btn-delete-candidate" onclick="deleteVoteCandidate(event, '${cand.name}', '${cand.address || ''}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                ` : ''}
                ${showFinalizeBtn ? `
                    <button class="btn-finalize" onclick="finalizeLocation(event, '${cand.name}', '${cand.address || ''}')">최종 선택</button>
                ` : ''}
            </div>
        `;
        container.appendChild(div);
    });

    // 방장 도구 노출 제어
    const hostActions = document.getElementById('host-vote-actions');
    const closeBtn = document.getElementById('btn-close-vote');
    if (hostActions && closeBtn) {
        if (isHost && voteStatus !== 'closed') {
            hostActions.style.display = 'flex';
            closeBtn.style.display = 'block';
        } else {
            hostActions.style.display = 'none';
        }
    }

    // 버튼 상태 업데이트 (마감 상태 대응)
    updateVoteButton();
}

/**
 * 투표 마감하기 (방장 전용)
 */
async function closeVote() {
    if (!confirm('투표를 마감하시겠습니까? 마감 후에는 투표를 수정할 수 없으며 최종 장소를 선정할 수 있습니다.')) return;

    const chatRoomId = window.currentChatRoomId;
    if (!chatRoomId || !window.db) return;

    try {
        await window.db.collection('chatrooms').doc(chatRoomId).update({
            voteStatus: 'closed'
        });

        if (typeof showToast === 'function') showToast('투표가 마감되었습니다. 🔒');

        // 데이터 갱신
        if (typeof refreshVoteTab === 'function') refreshVoteTab(chatRoomId);
    } catch (error) {
        console.error('Failed to close vote:', error);
        if (typeof showToast === 'function') showToast('마감 처리에 실패했습니다.');
    }
}

/**
 * 최종 장소 확정 (방장 전용)
 */
async function finalizeLocation(event, name, address) {
    if (event) event.stopPropagation();
    if (!confirm(`'${name}'을(를) 최종 약속 장소로 확정하시겠습니까?`)) return;

    const chatRoomId = window.currentChatRoomId;
    if (!chatRoomId || !window.db) return;

    try {
        await window.db.collection('chatrooms').doc(chatRoomId).update({
            finalLocation: { name, address },
            status: 'finalized' // 채팅방 전체 상태도 변경 가능
        });

        if (typeof showToast === 'function') showToast('최종 장소가 확정되었습니다! 🎉');

        // 데이터 갱신
        if (typeof refreshVoteTab === 'function') refreshVoteTab(chatRoomId);
    } catch (error) {
        console.error('Failed to finalize location:', error);
        if (typeof showToast === 'function') showToast('장소 확정에 실패했습니다.');
    }
}

/**
 * 투표 후보 삭제
 */
async function deleteVoteCandidate(event, name, address) {
    // 이벤트 전파 중단 (부모 div 클릭 방지)
    if (event) event.stopPropagation();

    if (!confirm('정말로 이 장소를 삭제하시겠습니까?')) return;

    const chatRoomId = window.currentChatRoomId;
    if (!chatRoomId || !window.db) return;

    try {
        const docRef = window.db.collection('chatrooms').doc(chatRoomId);

        await window.db.runTransaction(async (transaction) => {
            const doc = await transaction.get(docRef);
            if (!doc.exists) throw new Error("Document does not exist!");

            const data = doc.data();
            const candidates = data.locationCandidates || [];

            // 해당 후보 찾기
            const targetIndex = candidates.findIndex(c => c.name === name && (c.address || '') === address);

            if (targetIndex !== -1) {
                candidates.splice(targetIndex, 1);
                transaction.update(docRef, { locationCandidates: candidates });
            } else {
                throw new Error("Candidate not found");
            }
        });

        if (typeof showToast === 'function') showToast('장소가 삭제되었습니다.');

        // 데이터 갱신
        if (typeof refreshVoteTab === 'function') {
            refreshVoteTab(chatRoomId);
        }
    } catch (error) {
        console.error('Candidate deletion failed:', error);
        if (typeof showToast === 'function') showToast('삭제에 실패했습니다.');
    }
}

// 전역으로 내보내기
window.selectVote = selectVote;
window.selectSoftVote = selectSoftVote;
window.submitVote = submitVote;
window.renderVoteOptions = renderVoteOptions;
window.deleteVoteCandidate = deleteVoteCandidate;
window.closeVote = closeVote;
window.finalizeLocation = finalizeLocation;
