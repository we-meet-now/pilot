/**
 * AI Manager Feature
 * AI 매니저 탭 기능 관리 (장소 추천 및 투표 연동)
 */

// currentChatData is already declared in global scope or another file if integrated tightly,
// but let's check if it's uniquely needed here.
// The error says it's already declared.
// I will check where else it's declared.

/**
 * AI 매니저 초기화
 * @param {Object} chatRoomData - 채팅방 데이터
 */
function initAIManager(chatRoomData) {
    currentChatData = chatRoomData;

    // 결과 영역 초기화
    const container = document.getElementById('ai-recommendation-results');
    if (container) {
        container.innerHTML = '';
        container.style.display = 'none';
    }
}

/**
 * AI 장소 추천 실행
 */
async function triggerAIRecommendation() {
    // 데이터가 없으면 복구 시도
    if (!currentChatData && window.currentChatRoomId && window.db) {
        try {
            console.log('⚠️ Chat data missing, fetching from Firestore...');
            const doc = await window.db.collection('chatrooms').doc(window.currentChatRoomId).get();
            if (doc.exists) {
                currentChatData = doc.data();
                console.log('✅ Chat data recovered:', currentChatData);
            }
        } catch (e) {
            console.error('Failed to recover chat data:', e);
        }
    }

    if (!currentChatData) {
        showToast('채팅방 정보를 불러올 수 없습니다. 다시 입장해주세요.');
        return;
    }

    const btn = document.querySelector('.btn-ai-recommend');
    const originalBtnText = btn ? btn.innerHTML : '';

    // 위치 정보 확인
    let locationName = '강남역'; // 기본값
    if (currentChatData.location && currentChatData.location.name) {
        locationName = currentChatData.location.name;
    } else if (typeof currentChatData.location === 'string') {
        locationName = currentChatData.location;
    } else {
        // 위치 정보가 없는 경우 사용자 입력 요청
        const input = prompt('어디 근처로 추천해드릴까요?', '강남역');
        if (!input) return; // 취소 시 중단
        locationName = input;
    }

    try {
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span class="loading-spinner"></span> AI가 장소를 찾고 있어요...';
        }

        const type = currentChatData.name || '모임';
        const time = currentChatData.time || '저녁';

        // AI 서비스 호출
        const recommendations = await AIService.getRecommendations(type, locationName, time);

        // 결과 렌더링
        renderAIRecommendations(recommendations);

    } catch (error) {
        console.error('AI Recommendation Failed:', error);
        showToast('장소를 추천하는데 실패했어요. 다시 시도해주세요.');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<span class="ai-sparkle">✨</span> 다른 장소도 추천받기';
        }
    }
}

/**
 * 추천 결과 렌더링
 */
function renderAIRecommendations(recommendations) {
    const container = document.getElementById('ai-recommendation-results');
    if (!container) return;

    container.style.display = 'grid';
    container.innerHTML = '';

    recommendations.forEach(place => {
        const card = document.createElement('div');
        card.className = 'ai-place-card';
        card.innerHTML = `
            <div class="place-info">
                <div class="place-name">${place.name}</div>
                <div class="place-desc">${place.reason}</div>
                <div class="place-addr">${place.address}</div>
            </div>
            <button class="btn-add-vote" onclick="addCandidateToVote(this, '${place.name}', '${place.address}')">
                투표에 추가
            </button>
        `;
        container.appendChild(card);
    });

    // 닫기 버튼 추가
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn-close-recommendations';
    closeBtn.innerHTML = '닫기';
    closeBtn.onclick = closeAIRecommendations;
    container.appendChild(closeBtn);

    // 스크롤을 결과 영역으로 이동
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * 추천 결과 닫기
 */
function closeAIRecommendations() {
    const container = document.getElementById('ai-recommendation-results');
    if (container) {
        container.style.display = 'none';
        container.innerHTML = '';
    }
}

/**
 * 투표 후보에 추가
 */
async function addCandidateToVote(btn, name, address) {
    if (!window.currentChatRoomId || !window.db) return;

    try {
        btn.disabled = true;
        btn.textContent = '추가 중...';

        const candidate = {
            name: name,
            address: address,
            addedBy: window.auth?.currentUser?.uid || 'anonymous',
            createdAt: new Date().toISOString()
        };

        // Firestore 업데이트 (arrayUnion)
        await window.db.collection('chatrooms').doc(window.currentChatRoomId).update({
            locationCandidates: firebase.firestore.FieldValue.arrayUnion(candidate)
        });

        btn.textContent = '추가 완료 ✓';
        btn.classList.add('added');
        showToast('투표 후보에 추가되었습니다! 🗳️');

        // 투표 탭 데이터 갱신을 위해 현재 데이터를 다시 로드하는 로직이 필요할 수 있음
        // 여기서는 UI상 완료 표시만

    } catch (error) {
        console.error('Failed to add candidate:', error);
        showToast('투표 후보 추가에 실패했어요.');
        btn.disabled = false;
        btn.textContent = '투표에 추가';
    }
}

/**
 * AI 매니저 진행 상황 업데이트
 * @param {Object} chatRoomData - 채팅방 데이터
 */
function updateAIProgress(chatRoomData) {
    if (!chatRoomData) return;

    const status = chatRoomData.status || 'ready';
    const statusDescEl = document.getElementById('ai-status-desc');

    // 모든 스텝 비활성화 및 완료 처리 초기화
    document.querySelectorAll('.step-item').forEach(item => {
        item.classList.remove('active', 'done');
    });

    if (statusDescEl) {
        if (status === 'finalized') {
            // 1단계 완료, 2단계 활성
            const step1 = document.getElementById('step-1');
            const step2 = document.getElementById('step-2');
            if (step1) step1.classList.add('done');
            if (step2) step2.classList.add('active');

            statusDescEl.innerHTML = '약속 장소가 <strong>확정</strong>되었어요! 🎉';
        } else if (status === 'settling') {
            // 1, 2단계 완료, 3단계 활성
            const step1 = document.getElementById('step-1');
            const step2 = document.getElementById('step-2');
            const step3 = document.getElementById('step-3');
            if (step1) step1.classList.add('done');
            if (step2) step2.classList.add('done');
            if (step3) step3.classList.add('active');

            statusDescEl.innerHTML = '즐거운 모임 되셨나요? <strong>정산</strong>을 시작해요 💸';
        } else {
            // 기본: 1단계 활성
            const step1 = document.getElementById('step-1');
            if (step1) step1.classList.add('active');

            statusDescEl.innerHTML = '현재 <strong>장소 선정</strong> 중이에요 📍';
        }
    }
}

// 전역 내보내기
window.initAIManager = initAIManager;
window.triggerAIRecommendation = triggerAIRecommendation;
window.addCandidateToVote = addCandidateToVote;
window.closeAIRecommendations = closeAIRecommendations;
window.updateAIProgress = updateAIProgress;
