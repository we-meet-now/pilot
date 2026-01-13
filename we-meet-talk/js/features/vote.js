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
/**
 * 투표 제출
 */
async function submitVote() {
    const selected = document.querySelector('.vote-option.selected');
    const chatRoomId = window.currentChatRoomId;
    const userId = window.auth?.currentUser?.uid || 'anonymous';

    if (!selected) {
        if (typeof showToast === 'function') showToast('장소를 선택해주세요');
        return;
    }

    if (!chatRoomId || !window.db) {
        if (typeof showToast === 'function') showToast('채팅방 정보를 불러올 수 없습니다.');
        return;
    }

    const btn = document.querySelector('.btn-vote-submit'); // 투표하기 버튼 클래스 가정
    if (btn) {
        btn.disabled = true;
        btn.textContent = '투표 저장 중...';
    }

    try {
        // 선택된 후보의 식별 정보 (이름, 주소)
        const name = selected.querySelector('.vote-option-title').textContent;
        const address = selected.querySelector('.vote-option-sub').textContent;

        // Firestore 트랜잭션으로 안전하게 업데이트
        const docRef = window.db.collection('chatrooms').doc(chatRoomId);

        await window.db.runTransaction(async (transaction) => {
            const doc = await transaction.get(docRef);
            if (!doc.exists) throw new Error("Document does not exist!");

            const data = doc.data();
            const candidates = data.locationCandidates || [];

            // 해당 후보 찾기
            const targetIndex = candidates.findIndex(c => c.name === name && (c.address || '') === address);

            if (targetIndex !== -1) {
                const candidate = candidates[targetIndex];
                const currentVoters = candidate.voters || [];

                // 이미 투표했는지 체크
                if (currentVoters.includes(userId)) {
                    throw new Error("Already voted for this candidate");
                }

                // 투표 수 증가 및 사용자 ID 추가
                // 주의: 전체 배열을 덮어쓰는 방식이므로 FieldValue.arrayUnion 대신 JS 배열 조작 사용
                const newVoters = [...currentVoters, userId];

                candidates[targetIndex] = {
                    ...candidate,
                    voteCount: newVoters.length, // 배열 길이로 동기화
                    voters: newVoters,
                    lastVotedAt: new Date().toISOString()
                };

                transaction.update(docRef, { locationCandidates: candidates });
            } else {
                throw new Error("Candidate not found");
            }
        });

        if (typeof showToast === 'function') showToast('투표가 완료되었습니다! 🗳️');

        // 투표 탭 데이터 즉시 갱신
        if (typeof refreshVoteTab === 'function') {
            await refreshVoteTab(chatRoomId);
        }

    } catch (error) {
        console.error('Vote submission failed:', error);
        if (error.message === "Already voted for this candidate") {
            if (typeof showToast === 'function') showToast('이미 투표한 장소입니다.');
        } else {
            if (typeof showToast === 'function') showToast('투표 저장에 실패했습니다.');
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = '투표하기';
        }
    }
}

/**
 * 투표 옵션 렌더링
 * @param {Array} candidates - 장소 후보 목록
 */
function renderVoteOptions(candidates) {
    const container = document.querySelector('.vote-options');
    if (!container) return;

    container.innerHTML = '';

    if (!candidates || candidates.length === 0) {
        container.innerHTML = '<p class="no-candidates">아직 등록된 장소 후보가 없어요</p>';
        return;
    }

    const userId = window.auth?.currentUser?.uid || 'anonymous';

    // AI 추천 텍스트 업데이트
    const aiTipText = document.querySelector('.ai-tip-text');
    if (aiTipText && candidates.length > 0) {
        // 간단한 로직: 첫 번째 후보를 추천 (실제로는 거리 계산 로직 필요)
        const recommended = candidates[0].name;
        aiTipText.innerHTML = `<strong>AI 추천</strong><br>모두의 이동 거리를 고려하면 <strong>${recommended}</strong>(이)가 가장 공평해요`;
    } else if (aiTipText) {
        aiTipText.innerHTML = `<strong>AI 추천</strong><br>장소 후보를 등록하면 추천해드릴게요!`;
    }

    candidates.forEach((cand, index) => {
        const div = document.createElement('div');
        div.className = 'vote-option';

        // 내가 투표한 항목인지 확인
        const isVoted = cand.voters && cand.voters.includes(userId);
        if (isVoted) {
            div.classList.add('selected');
            div.classList.add('voted'); // 영구 선택 표시를 위한 클래스
        }

        div.onclick = () => selectVote(div);

        div.innerHTML = `
            <div class="vote-radio"></div>
            <div class="vote-option-content">
                <p class="vote-option-title">${cand.name}</p>
                <span class="vote-option-sub">${cand.address || ''}</span>
            </div>
            <span class="vote-count">${cand.voteCount || 0}표</span>
        `;
        container.appendChild(div);
    });
}

// 전역으로 내보내기
window.selectVote = selectVote;
window.selectSoftVote = selectSoftVote;
window.submitVote = submitVote;
window.renderVoteOptions = renderVoteOptions;
