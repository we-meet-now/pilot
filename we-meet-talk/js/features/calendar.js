/**
 * Calendar Feature
 * 캘린더 기능 관리 (모임 날짜 조율 및 확정)
 */

// 현재 수정 모드 여부
window.isCalendarEditing = false;

/**
 * 요일 이름 가져오기
 * @param {number} day - 날짜
 * @returns {string} 요일
 */
function getDayName(day) {
    const days = {
        13: '금', 14: '토', 20: '금', 21: '토', 28: '토'
    };
    return days[day] || '일';
}

/**
 * 캘린더 날짜 선택
 * @param {HTMLElement} el - 클릭된 날짜 요소
 */
function selectCalDay(el) {
    // 수정 모드가 아니면서 이미 확정된 상태라면 클릭 무시
    const confirmBtn = document.getElementById('btn-confirm-calendar');
    const isAlreadyConfirmed = confirmBtn && confirmBtn.dataset.confirmed === "true";
    if (isAlreadyConfirmed && !window.isCalendarEditing) {
        if (typeof showToast === 'function') showToast('수정버튼을 눌러야 변경할 수 있습니다. 🔒');
        return;
    }

    // 선택 가능한 날짜인지 확인 (선약이 있는 날은 선택 불가)
    if (el.classList.contains('busy') || el.classList.contains('my-busy') || el.classList.contains('other')) {
        return;
    }

    // 토글 선택 (다중 선택 허용)
    el.classList.toggle('selected');

    const selectedDays = Array.from(document.querySelectorAll('.cal-day.selected'));
    const headerTitle = document.querySelector('.cal-month-title')?.textContent || '2026년 1월';
    const monthStr = headerTitle.split('년 ')[1] || '1월';

    // 선택된 날짜들 정보 업데이트
    const selectedDateEl = document.querySelector('.selected-date');
    const selectedStatusEl = document.querySelector('.selected-status');
    // confirmBtn은 이미 위(line 27)에서 선언됨

    if (selectedDays.length === 0) {
        if (selectedDateEl) selectedDateEl.textContent = '날짜를 선택해주세요';
        if (selectedStatusEl) selectedStatusEl.textContent = '여러 날짜를 후보로 선택할 수 있습니다.';
        if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.textContent = '날짜를 선택해주세요';
        }
        return;
    }

    // 날짜 순 정렬
    const sortedDays = selectedDays.map(d => parseInt(d.textContent)).sort((a, b) => a - b);

    if (selectedDateEl) {
        if (sortedDays.length <= 3) {
            const formatted = sortedDays.map(d => `${d}일`).join(', ');
            selectedDateEl.textContent = `${monthStr} ${formatted}`;
        } else {
            selectedDateEl.textContent = `${monthStr} ${sortedDays[0]}일 외 ${sortedDays.length - 1}곳`;
        }
    }

    if (selectedStatusEl) {
        const allBest = selectedDays.every(d => d.classList.contains('best'));
        if (allBest) {
            selectedStatusEl.textContent = `⭐ 선택한 ${selectedDays.length}개 날짜 모두 전원 가능해요!`;
        } else {
            selectedStatusEl.textContent = `✓ ${selectedDays.length}개의 날짜를 선택했습니다.`;
        }

        if (confirmBtn) {
            confirmBtn.disabled = false;
            const isAlreadyConfirmed = !!confirmBtn.dataset.confirmed;

            if (isAlreadyConfirmed) {
                confirmBtn.textContent = window.isCalendarEditing ? '변경사항 저장하기' : '내 일정 수정하기';
            } else {
                confirmBtn.textContent = '내 일정 확정하기';
            }
        }
    }
}

/**
 * 하단 버튼 통합 핸들러 (확정 또는 수정 전환)
 */
function handleCalendarAction() {
    const confirmBtn = document.getElementById('btn-confirm-calendar');
    const isAlreadyConfirmed = confirmBtn && confirmBtn.dataset.confirmed === "true";

    if (!isAlreadyConfirmed) {
        // 처음 확정하는 경우
        confirmCalendarDate();
    } else {
        if (!window.isCalendarEditing) {
            // 수정 모드 진입
            window.isCalendarEditing = true;
            if (typeof showToast === 'function') showToast('수정 모드가 활성화되었습니다. 🔓');

            // UI 업데이트
            document.querySelector('.calendar-days')?.classList.add('editing-mode');
            confirmBtn.textContent = '변경사항 저장하기';
            const selectedStatusEl = document.querySelector('.selected-status');
            if (selectedStatusEl) selectedStatusEl.textContent = '✎ 원하는 날짜를 다시 선택해주세요.';
        } else {
            // 수정 완료 (저장)
            confirmCalendarDate();
        }
    }
}

/**
 * 월 변경
 * @param {number} dir - 방향 (1: 다음 달, -1: 이전 달)
 */
function changeMonth(dir) {
    const message = dir > 0 ? '다음 달로 이동' : '이전 달로 이동';
    if (typeof showToast === 'function') {
        showToast(message);
    }
}

/**
 * 캘린더 날짜 확정 (Firestore 저장)
 */
async function confirmCalendarDate() {
    const selectedDays = Array.from(document.querySelectorAll('.cal-day.selected'));
    const chatRoomId = window.currentChatRoomId;
    const userId = window.auth?.currentUser?.uid || 'anonymous';

    if (selectedDays.length > 0 && chatRoomId && window.db) {
        const year = 2026;
        const month = 1;

        const dates = selectedDays.map(el => {
            const day = String(el.textContent).padStart(2, '0');
            return `${year}-${String(month).padStart(2, '0')}-${day}`;
        });

        try {
            const docRef = window.db.collection('chatrooms').doc(chatRoomId);
            await window.db.runTransaction(async (transaction) => {
                const doc = await transaction.get(docRef);
                if (!doc.exists) return;

                const data = doc.data();
                let participants = data.participants || [];
                const userName = window.auth?.currentUser?.name || '나';

                if (Array.isArray(participants)) {
                    const targetIndex = participants.findIndex(p => (p.uid || p.id) === userId || p.name === userName);
                    if (targetIndex !== -1) {
                        participants[targetIndex].availableDates = dates;
                        participants[targetIndex].isConfirmed = true;
                    } else {
                        participants.push({
                            uid: userId,
                            name: userName,
                            availableDates: dates,
                            isConfirmed: true,
                            isSynced: false
                        });
                    }
                } else {
                    if (!participants[userId]) participants[userId] = { name: userName };
                    participants[userId].availableDates = dates;
                    participants[userId].isConfirmed = true;
                }

                transaction.update(docRef, { participants: participants });
            });

            // 성공 시 수정 모드 해제
            window.isCalendarEditing = false;
            document.querySelector('.calendar-days')?.classList.remove('editing-mode');

            if (typeof showToast === 'function') {
                showToast(`일정이 확정(수정)되어 팀원들에게 공유되었습니다! 📤`);
            }

            // 캘린더 갱신
            refreshCalendar();

        } catch (error) {
            console.error('Failed to confirm dates:', error);
            if (typeof showToast === 'function') showToast('일정 처리에 실패했습니다.');
        }
    }
}

/**
 * 이벤트로 스크롤 (또는 강조 표시)
 */
function scrollToEvent(eventId) {
    const el = document.getElementById(eventId);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.transform = 'scale(1.02)';
        setTimeout(() => { el.style.transform = ''; }, 300);
    }
}

/**
 * 캘린더 새로고침 (데이터 다시 로드)
 */
async function refreshCalendar() {
    const chatRoomId = window.currentChatRoomId;
    if (!chatRoomId || !window.db) return;

    try {
        const doc = await window.db.collection('chatrooms').doc(chatRoomId).get();
        if (!doc.exists) return;

        const data = doc.data();
        renderSyncedParticipants(data.participants || {});
        renderCalendarDays(data.participants || {});
    } catch (error) {
        console.error('Error refreshing calendar:', error);
    }
}

/**
 * 연동된 참가자 목록 렌더링
 */
function renderSyncedParticipants(participants) {
    const container = document.querySelector('.calendar-sync-status');
    if (!container) return;

    const participantList = Array.isArray(participants) ? participants : Object.values(participants);
    const colors = ['#FF6B35', '#667EEA', '#00D4AA', '#F59E0B', '#8B5CF6'];
    let html = '';

    participantList.forEach((p, index) => {
        const color = colors[index % colors.length];
        const isSynced = p.isSynced || false;
        const isConfirmed = p.isConfirmed || false;
        const statusClass = (isSynced || isConfirmed) ? 'synced' : '';

        let badgeClass = 'pending';
        let badgeText = '대기중';

        if (isConfirmed) {
            badgeClass = 'done';
            badgeText = '확정완료';
        } else if (isSynced) {
            badgeClass = 'done';
            badgeText = '연동완료';
        }

        html += `
            <div class="sync-item ${statusClass}">
                <div class="sync-avatar" style="background:${color}">${p.name ? p.name.charAt(0) : '?'}</div>
                <span class="sync-name">${p.name || '알 수 없음'}</span>
                <span class="sync-badge ${badgeClass}">${badgeText}</span>
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * 캘린더 날짜 렌더링 및 시각화
 */
function renderCalendarDays(participants) {
    const container = document.querySelector('.calendar-days');
    const headerTitle = document.querySelector('.cal-month-title');
    if (!container) return;

    const year = 2026;
    const month = 1; // 1월

    if (headerTitle) {
        headerTitle.textContent = `${year}년 ${month}월`;
    }

    const days = container.querySelectorAll('.cal-day:not(.other)');

    let participantMap = {};
    if (Array.isArray(participants)) {
        participants.forEach(p => {
            const id = p.uid || p.id || p.name || 'unknown';
            participantMap[id] = p;
        });
    } else {
        participantMap = participants;
    }

    const participantCount = Object.keys(participantMap).length;

    days.forEach(dayEl => {
        const day = parseInt(dayEl.textContent);
        if (isNaN(day)) return;

        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        let busyCount = 0;
        let syncedCount = 0;
        let availableOverlapCount = 0;

        Object.values(participantMap).forEach(p => {
            const isSynced = p.isSynced || false;
            const isConfirmed = p.isConfirmed || false;

            if (isSynced || isConfirmed) {
                syncedCount++;
                if (isSynced && p.busyDates && p.busyDates.includes(dateStr)) {
                    busyCount++;
                }
                if (isConfirmed && p.availableDates && p.availableDates.includes(dateStr)) {
                    availableOverlapCount++;
                }
            }
        });

        // 클래스 초기화
        dayEl.classList.remove('busy', 'available', 'best', 'my-busy', 'selected');

        if (syncedCount > 0) {
            const currentUserId = window.auth?.currentUser?.uid || 'anonymous';
            const me = participantMap[currentUserId];

            const isMeBusy = me && me.isSynced && me.busyDates && me.busyDates.includes(dateStr);
            const isMeConfirmedAvailable = me && me.isConfirmed && me.availableDates && me.availableDates.includes(dateStr);

            if (isMeBusy) {
                dayEl.classList.add('my-busy');
            }

            if (isMeConfirmedAvailable) {
                dayEl.classList.add('selected');
            }

            if (busyCount === 0 && (availableOverlapCount === participantCount || syncedCount === participantCount)) {
                dayEl.classList.add('best');
            } else if (availableOverlapCount > 0 || (busyCount === 0 && syncedCount > 0)) {
                dayEl.classList.add('available');
            }

            if (busyCount > 0) {
                dayEl.classList.add('busy');
            }
        }
    });

    // 버튼 상태 업데이트 (수정 모드 감지)
    const currentUserId = window.auth?.currentUser?.uid || 'anonymous';
    const me = participantMap[currentUserId];
    const confirmBtn = document.getElementById('btn-confirm-calendar');
    if (confirmBtn && me && me.isConfirmed) {
        confirmBtn.dataset.confirmed = "true";
        if (!window.isCalendarEditing) {
            confirmBtn.textContent = '내 일정 수정하기';
            document.querySelector('.calendar-days')?.classList.remove('editing-mode');
        } else {
            confirmBtn.textContent = '변경사항 저장하기';
            document.querySelector('.calendar-days')?.classList.add('editing-mode');
        }
        confirmBtn.disabled = false;
    }
}

// 전역으로 내보내기
window.getDayName = getDayName;
window.selectCalDay = selectCalDay;
window.handleCalendarAction = handleCalendarAction;
window.changeMonth = changeMonth;
window.confirmCalendarDate = confirmCalendarDate;
window.scrollToEvent = scrollToEvent;
window.refreshCalendar = refreshCalendar;
