/**
 * Settlement (Dutch Pay) Feature
 * 정산 기능 관리
 */

let currentSettlementStep = 1;
let selectedSettlementMembers = [];
let totalSettlementAmount = 0;
let perPersonAmount = 0;
let receiptImageSrc = null;

// 계산기 관련 변수
let currentCalcValue = '0';
let previousCalcValue = null;
let currentOperation = null;
let activeInputId = null;

// 정산 요청자 정보
let requesterAccount = {
    name: '',
    bank: '',
    number: ''
};

/**
 * 다음 단계로 이동
 * @param {number} step - 이동할 단계 번호
 */
function nextSettlementStep(step) {
    const panels = document.querySelectorAll('#tab-settle .step');
    panels.forEach(p => p.classList.remove('active'));

    const nextPanel = document.getElementById(`settle-step${step}`);
    if (nextPanel) {
        currentSettlementStep = step;
        nextPanel.classList.add('active');
    }

    // 멤버 선택 단계에서 다음으로 넘어갈 때 선택된 멤버 저장
    if (step === 2) {
        const checks = document.querySelectorAll('.settle-member-check:checked');
        const currentUserName = window.auth?.currentUser?.displayName || '나';
        selectedSettlementMembers = [currentUserName, ...Array.from(checks).map(c => c.value)];
    }
}

/**
 * 모든 멤버 선택/해제
 * @param {HTMLInputElement} checkbox - 전체 선택 체크박스
 */
function toggleAllSettlementMembers(checkbox) {
    const isChecked = checkbox.checked;
    document.querySelectorAll('.settle-member-check').forEach(c => {
        c.checked = isChecked;
    });
}

/**
 * 이전 단계로 이동
 */
function prevSettlementStep() {
    if (currentSettlementStep > 1) {
        nextSettlementStep(currentSettlementStep - 1);
    }
}

/**
 * 영수증 이미지 처리 및 OCR 시뮬레이션
 */
function handleReceiptImage(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            receiptImageSrc = event.target.result;
            const previewImg = document.getElementById('settle-preview-img');
            const placeholder = document.getElementById('settle-upload-placeholder');

            if (previewImg) {
                previewImg.src = receiptImageSrc;
                previewImg.style.display = 'block';
            }
            if (placeholder) {
                placeholder.style.display = 'none';
            }

            // OCR 시뮬레이션 (800ms 대기 후 자동 입력)
            if (typeof showToast === 'function') showToast('영수증을 분석하고 있어요... 🔍');

            setTimeout(() => {
                const storeNameEl = document.getElementById('settle-storeName');
                const totalAmountEl = document.getElementById('settle-totalAmount');

                if (storeNameEl) storeNameEl.value = "위밋 식당 (강남점)";
                if (totalAmountEl) totalAmountEl.value = "51000";

                nextSettlementStep(3);
            }, 800);
        };
        reader.readAsDataURL(file);
    }
}

/**
 * 1/N 정산 초기화 및 계산
 */
function initN1Settlement() {
    const totalInput = document.getElementById('settle-totalAmount');
    totalSettlementAmount = parseInt(totalInput ? totalInput.value : 0) || 0;

    if (selectedSettlementMembers.length > 0) {
        perPersonAmount = Math.floor(totalSettlementAmount / selectedSettlementMembers.length);
    }

    finishSettlement('n1');
}

/**
 * 계좌 정보 입력 완료
 */
function confirmAccountInfo() {
    const name = document.getElementById('settle-account-name')?.value;
    const bank = document.getElementById('settle-bank-name')?.value;
    const number = document.getElementById('settle-account-number')?.value;

    if (!name || !bank || !number) {
        if (typeof showToast === 'function') showToast('모든 정보를 입력해주세요.');
        return;
    }

    requesterAccount = { name, bank, number };
    nextSettlementStep(5);
}

/**
 * 개별 정산 초기화
 */
function initIndividualSettlement() {
    const totalInput = document.getElementById('settle-totalAmount');
    totalSettlementAmount = parseInt(totalInput ? totalInput.value : 0) || 0;

    const container = document.getElementById('individual-inputs');
    if (!container) return;

    container.innerHTML = '';

    // 영수증 이미지 세팅
    const receiptViewImg = document.getElementById('settle-receipt-view-img');
    const noReceiptText = document.getElementById('no-receipt-text');

    if (receiptImageSrc) {
        if (receiptViewImg) {
            receiptViewImg.src = receiptImageSrc;
            receiptViewImg.style.display = 'block';
        }
        if (noReceiptText) noReceiptText.style.display = 'none';
    }

    selectedSettlementMembers.forEach((m, index) => {
        const row = document.createElement('div');
        row.className = 'individual-row';
        const inputId = `indiv-input-${index}`;

        row.innerHTML = `
            <span style="font-weight: 500;">${m}</span>
            <input type="text" id="${inputId}" class="input-field indiv-amt" data-name="${m}" 
                   style="width: 50%; margin-bottom:0; text-align:right; font-weight:bold;" 
                   placeholder="0원" readonly onclick="openSettlementCalculator('${inputId}', '${m}')">
        `;
        container.appendChild(row);
    });

    updateRemainingAmount();
    nextSettlementStep(6);
}

/**
 * 남은 금액 업데이트
 */
function updateRemainingAmount() {
    let currentTotal = 0;
    document.querySelectorAll('.indiv-amt').forEach(i => {
        const val = parseInt(i.value.replace(/[^0-9]/g, '')) || 0;
        currentTotal += val;
    });

    const remaining = totalSettlementAmount - currentTotal;
    const remainingEl = document.getElementById('remaining-amount');
    if (remainingEl) {
        remainingEl.innerText = remaining.toLocaleString();
        remainingEl.style.color = remaining === 0 ? '#10B981' : '#FF6B35';
    }
}

/**
 * 계산기 모달 열기
 */
function openSettlementCalculator(inputId, name) {
    activeInputId = inputId;
    const targetNameEl = document.getElementById('calc-target-name');
    if (targetNameEl) targetNameEl.innerText = name;

    clearSettlementCalc();
    const modal = document.getElementById('calculator-modal');
    if (modal) modal.classList.add('show');
}

/**
 * 계산기 모달 닫기
 */
function closeSettlementCalculator() {
    const modal = document.getElementById('calculator-modal');
    if (modal) modal.classList.remove('show');
}

/**
 * 계산기 숫자 입력
 */
function appendSettlementCalc(num) {
    if (currentCalcValue === '0') currentCalcValue = num;
    else currentCalcValue += num;
    updateSettlementCalcDisplay();
}

/**
 * 계산기 연산자 설정
 */
function setSettlementOperation(op) {
    calculateSettlementResult();
    previousCalcValue = currentCalcValue;
    currentOperation = op;
    currentCalcValue = '0';
}

/**
 * 계산기 결과 계산
 */
function calculateSettlementResult() {
    if (!previousCalcValue || !currentOperation) return;
    const prev = parseFloat(previousCalcValue);
    const current = parseFloat(currentCalcValue);
    let result = 0;

    switch (currentOperation) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '/': result = current !== 0 ? prev / current : 0; break;
    }

    currentCalcValue = Math.floor(result).toString();
    currentOperation = null;
    previousCalcValue = null;
    updateSettlementCalcDisplay();
}

/**
 * 계산기 초기화
 */
function clearSettlementCalc() {
    currentCalcValue = '0';
    previousCalcValue = null;
    currentOperation = null;
    updateSettlementCalcDisplay();
}

/**
 * 계산기 디스플레이 업데이트
 */
function updateSettlementCalcDisplay() {
    const display = document.getElementById('calc-display');
    if (display) display.innerText = parseInt(currentCalcValue).toLocaleString();
}

/**
 * 계산 결과 적용
 */
function applySettlementCalculation() {
    calculateSettlementResult();
    if (activeInputId) {
        const finalValue = parseInt(currentCalcValue) || 0;
        const input = document.getElementById(activeInputId);
        if (input) {
            input.value = finalValue.toLocaleString() + "원";
            updateRemainingAmount();
        }
    }
    closeSettlementCalculator();
}

/**
 * 정산 최종 완료 처리
 */
function finishSettlement(type) {
    const storeNameEl = document.getElementById('settle-storeName');
    const finalStoreEl = document.getElementById('final-store');
    const finalAmountEl = document.getElementById('final-amount');

    if (finalStoreEl) {
        finalStoreEl.innerText = (storeNameEl && storeNameEl.value) ? storeNameEl.value : "위밋톡 모임";
    }

    if (finalAmountEl) {
        if (type === 'n1') {
            finalAmountEl.innerText = perPersonAmount.toLocaleString() + "원";
        } else {
            // 개별 정산의 경우 '나'를 제외한 다른 멤버 중 첫 번째 사람의 금액을 예시로 표시하거나 합계를 표시
            // 여기서는 사용자 본인이 '받을' 금액(또는 총액) 개념으로 표현
            finalAmountEl.innerText = totalSettlementAmount.toLocaleString() + "원";
        }
    }

    nextSettlementStep(7);
}

/**
 * 정산 요청 전송 (채팅방 알림 및 탭 전환)
 */
function copyAndOpenToss() {
    const account = "카카오뱅크 3333111834594";
    const storeNameEl = document.getElementById('settle-storeName');
    const storeName = storeNameEl ? storeNameEl.value : "위밋 식당";
    const amountEl = document.getElementById('final-amount');
    const amountStr = amountEl ? amountEl.innerText : '0원';
    const amount = amountStr.replace(/[^0-9]/g, '');
    const copyText = `${account} ${amount}`;

    // 1. 현재 사용자 이름 가져오기
    const currentUser = window.auth?.currentUser?.displayName || '주최자';

    // 2. 채팅방에 전송할 리치 메시지 구성
    const richContent = `
        <div style="text-align: left;">
            <p style="margin-bottom: 12px; font-weight: 500;">🔔 ${currentUser}님이 <strong>정산 요청</strong>을 보냈어요.</p>
            <div style="background: white; padding: 16px; border-radius: 12px; border: 1px solid #E2E8F0; margin-bottom: 12px;">
                <p style="font-size: 13px; color: #64748B; margin-bottom: 4px;">${storeName}</p>
                <p style="font-size: 18px; font-weight: 800; color: #1E293B;">${amountStr}</p>
            </div>
            <button class="btn-settle-toss" style="padding: 12px; font-size: 14px; box-shadow: none;" 
                    onclick="handleChatSettlementPayment('${requesterAccount.bank} ${requesterAccount.number}', '${amount}')">
                계좌복사 및 송금하기
            </button>
        </div>
    `;

    // 3. 채팅 탭으로 전환 및 메시지 전송
    if (typeof switchTab === 'function') {
        switchTab('chat');
    }

    // 4. AI 메시지 전송
    if (typeof sendRichAIMessage === 'function') {
        sendRichAIMessage(richContent);
    }

    // 5. 모임 상태 업데이트 (정산 중으로)
    if (window.currentChatRoomId && window.db) {
        const updateData = {
            status: 'settling',
            settlementData: {
                storeName: storeName,
                amount: amountStr,
                requester: currentUser,
                account: `${requesterAccount.bank} ${requesterAccount.number}`,
                type: 'request'
            }
        };

        window.db.collection('chatrooms').doc(window.currentChatRoomId).update(updateData).then(() => {
            if (typeof updateAIProgress === 'function') {
                updateAIProgress({ status: 'settling' });
            }
            renderSettlementStatus(updateData.settlementData);
        });
    }

    // 6. 클립보드 복사 (편의성)
    navigator.clipboard.writeText(copyText).then(() => {
        if (typeof showToast === 'function') showToast('정산 요청을 보냈습니다! 💸');
    });
}

/**
 * 채팅방 내부 정산 버튼 클릭 처리
 */
function handleChatSettlementPayment(account, amount) {
    const copyText = `${account} ${amount}`;
    navigator.clipboard.writeText(copyText).then(() => {
        if (typeof showToast === 'function') showToast('계좌와 금액이 복사되었습니다! 📋');
        setTimeout(() => {
            window.location.href = "supertoss://send";
        }, 500);

        // 정산 완료 알리기 버튼 추가 (채팅 내)
        showCompletionButtonInChat(account, amount);
    });
}

/**
 * 채팅방 내 송금 버튼 아래에 완료 알림 버튼 표시
 */
function showCompletionButtonInChat(account, amount) {
    // 가장 최근의 AI 정산 카드 찾기 (버튼 이벤트 대상)
    const bubbles = document.querySelectorAll('.ai-bubble');
    if (bubbles.length === 0) return;

    const lastBubble = bubbles[bubbles.length - 1];
    // 이미 버튼이 있는지 확인
    if (lastBubble.querySelector('.btn-notify-complete')) return;

    const btn = document.createElement('button');
    btn.className = 'btn-notify-complete';
    btn.innerText = '송금 완료 알리기 ✅';
    btn.onclick = () => notifySettlementCompletion();

    lastBubble.appendChild(btn);
}

/**
 * 정산 완료 알림 메시지 전송
 */
async function notifySettlementCompletion() {
    const currentUser = window.auth?.currentUser?.displayName || '멤버';
    const message = `**${currentUser}**님이 송금을 완료했어요! ✅`;

    if (typeof sendRichAIMessage === 'function') {
        // AI 메시지로 알림 (rich-ai 타입으로 저장됨)
        await sendRichAIMessage(`<p style="margin:0; font-weight:600; color:#10B981;">${message}</p>`);

        if (typeof showToast === 'function') showToast('송금 완료 알림을 보냈습니다.');

        // 버튼 제거 (중복 방지)
        document.querySelectorAll('.btn-notify-complete').forEach(b => b.remove());
    }
}

// 전역 내보내기
window.handleChatSettlementPayment = handleChatSettlementPayment;

/**
 * 정산 현황 렌더링
 */
function renderSettlementStatus(data) {
    if (!data) return;

    const panels = document.querySelectorAll('#tab-settle .step');
    panels.forEach(p => p.classList.remove('active'));

    const statusView = document.getElementById('settle-status-view');
    if (statusView) {
        statusView.classList.add('active');

        document.getElementById('status-store').innerText = data.storeName || '위밋 식당';
        document.getElementById('status-amount').innerText = data.amount || '0원';
        document.getElementById('status-requester').innerText = data.requester || '주최자';
        document.getElementById('status-account').innerText = data.account || '';

        // 데이터 전역 저장 (송금 시 사용)
        window.currentSettlementData = data;
    }
}

/**
 * 정산 현황에서 송금하기
 */
function copyAndOpenTossFromStatus() {
    const data = window.currentSettlementData;
    if (!data) return;

    handleChatSettlementPayment(data.account, data.amount.replace(/[^0-9]/g, ''));

    // 정산 탭 내 완료 알리기 버튼 표시
    const container = document.getElementById('settle-completion-container');
    if (container && !container.querySelector('.btn-notify-complete')) {
        const btn = document.createElement('button');
        btn.className = 'btn-notify-complete';
        btn.innerText = '송금 완료 알리기 ✅';
        btn.onclick = () => notifySettlementCompletion();
        container.appendChild(btn);
    }
}

/**
 * 정산 취소/종료 (상태 초기화)
 */
function resetSettlement() {
    if (!confirm('정산 요청을 종료하시겠습니까?')) return;

    if (window.currentChatRoomId && window.db) {
        window.db.collection('chatrooms').doc(window.currentChatRoomId).update({
            status: 'finalized', // 또는 'completed'? 일단 초기화 의미로
            settlementData: null
        }).then(() => {
            if (typeof showToast === 'function') showToast('정산이 종료되었습니다.');
            location.reload(); // 간단하게 페이지 리로드로 UI 초기화
        });
    }
}

// 전역 내보내기
window.nextSettlementStep = nextSettlementStep;
window.prevSettlementStep = prevSettlementStep;
window.toggleAllSettlementMembers = toggleAllSettlementMembers;
window.handleReceiptImage = handleReceiptImage;
window.initN1Settlement = initN1Settlement;
window.initIndividualSettlement = initIndividualSettlement;
window.openSettlementCalculator = openSettlementCalculator;
window.closeSettlementCalculator = closeSettlementCalculator;
window.appendSettlementCalc = appendSettlementCalc;
window.setSettlementOperation = setSettlementOperation;
window.clearSettlementCalc = clearSettlementCalc;
window.applySettlementCalculation = applySettlementCalculation;
window.finishSettlement = finishSettlement;
window.copyAndOpenToss = copyAndOpenToss;
window.confirmAccountInfo = confirmAccountInfo;
window.copyAndOpenTossFromStatus = copyAndOpenTossFromStatus;
window.resetSettlement = resetSettlement;
window.renderSettlementStatus = renderSettlementStatus;
window.notifySettlementCompletion = notifySettlementCompletion;
