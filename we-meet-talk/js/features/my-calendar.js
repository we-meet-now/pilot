/**
 * My Calendar Feature
 * 내 캘린더 기능 - 로그인 상태에 따라 다른 모임 표시
 */

// 게스트 모임 데이터 (초대받은 모임 1개만)
const guestEvents = [
    {
        id: 'event-21',
        day: 21,
        dow: '토',
        name: '대학 동기 모임',
        detail: '오후 6:30 · 강남역',
        members: [
            { name: '민', color: '#FF6B35' },
            { name: '수', color: '#667EEA' },
            { name: '지', color: '#00D4AA' }
        ],
        extraCount: 3,
        totalMembers: 6,
        status: 'confirmed',
        statusText: '확정',
        dday: 6
    }
];

// 로그인 사용자 모임 데이터 (모든 모임)
const loggedInEvents = [
    {
        id: 'event-21',
        day: 21,
        dow: '토',
        name: '대학 동기 모임',
        detail: '오후 6:30 · 강남역',
        members: [
            { name: '민', color: '#FF6B35' },
            { name: '수', color: '#667EEA' },
            { name: '지', color: '#00D4AA' }
        ],
        extraCount: 3,
        totalMembers: 6,
        status: 'confirmed',
        statusText: '확정',
        dday: 6
    },
    {
        id: 'event-25',
        day: 25,
        dow: '수',
        name: '가족 크리스마스 모임',
        detail: '오후 12:00 · 본가',
        members: [
            { name: '엄', color: '#EC4899' },
            { name: '아', color: '#8B5CF6' },
            { name: '동', color: '#06B6D4' }
        ],
        extraCount: 0,
        totalMembers: 3,
        status: 'confirmed',
        statusText: '확정',
        dday: 10
    },
    {
        id: 'event-31',
        day: 31,
        dow: '화',
        name: '회사 송년회',
        detail: '오후 7:00 · 장소 미정',
        members: [
            { name: '팀', color: '#F59E0B' },
            { name: '장', color: '#10B981' }
        ],
        extraCount: 8,
        totalMembers: 10,
        status: 'pending',
        statusText: '조율중',
        dday: 16
    }
];

/**
 * 내 캘린더 업데이트
 */
function updateMyCalendar() {
    const eventsContainer = document.getElementById('my-events-list');
    const upcomingContainer = document.getElementById('upcoming-events-list');

    if (!eventsContainer || !upcomingContainer) return;

    // 로그인 상태 확인
    const isLoggedIn = typeof isUserLoggedIn === 'function' ? isUserLoggedIn() : false;
    const events = isLoggedIn ? loggedInEvents : guestEvents;

    // 이번 달 모임 목록 렌더링
    renderMonthlyEvents(eventsContainer, events);

    // 다가오는 모임 렌더링
    renderUpcomingEvents(upcomingContainer, events);
}

/**
 * 이번 달 모임 목록 렌더링
 */
function renderMonthlyEvents(container, events) {
    // 기존 이벤트 카드들 제거 (제목은 유지)
    const existingCards = container.querySelectorAll('.my-event-card');
    existingCards.forEach(card => card.remove());

    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'my-event-card';
        card.id = event.id;

        // 멤버 아바타 HTML 생성
        const membersHTML = event.members.map(member =>
            `<div class="sync-avatar small" style="background:${member.color}">${member.name}</div>`
        ).join('');

        const extraCountHTML = event.extraCount > 0 ?
            `<span class="member-count">+${event.extraCount}</span>` : '';

        card.innerHTML = `
            <div class="my-event-date">
                <span class="event-day">${event.day}</span>
                <span class="event-dow">${event.dow}</span>
            </div>
            <div class="my-event-info">
                <p class="my-event-name">${event.name}</p>
                <p class="my-event-detail">${event.detail}</p>
                <div class="my-event-members">
                    ${membersHTML}
                    ${extraCountHTML}
                </div>
            </div>
            <div class="my-event-actions">
                <div class="my-event-status ${event.status}">${event.statusText}</div>
                <button class="btn-goto-chat">바로가기</button>
            </div>
        `;

        container.appendChild(card);

        // 대화하러가기 버튼 클릭 이벤트 설정
        const gotoBtn = card.querySelector('.btn-goto-chat');
        if (gotoBtn) {
            gotoBtn.onclick = (e) => {
                e.stopPropagation(); // 이벤트 버블링 방지

                // 클릭한 모임 데이터 저장
                if (typeof setCurrentMeeting === 'function') {
                    setCurrentMeeting(event);
                }

                if (typeof goToScreen === 'function') {
                    goToScreen('main');
                    // 채팅 탭으로 전환
                    setTimeout(() => {
                        if (typeof showChatDefault === 'function') {
                            showChatDefault();
                        }
                    }, 100);
                }
            };
        }
    });
}

/**
 * 다가오는 모임 렌더링
 */
function renderUpcomingEvents(container, events) {
    // 기존 카드들 제거 (제목은 유지)
    const existingCards = container.querySelectorAll('.upcoming-card');
    existingCards.forEach(card => card.remove());

    // D-day 기준으로 정렬 (가장 가까운 모임)
    const sortedEvents = [...events].sort((a, b) => a.dday - b.dday);
    const nearestEvent = sortedEvents[0];

    if (nearestEvent) {
        const card = document.createElement('div');
        card.className = 'upcoming-card';
        card.innerHTML = `
            <div class="upcoming-dday">D-${nearestEvent.dday}</div>
            <div class="upcoming-info">
                <p class="upcoming-name">${nearestEvent.name}</p>
                <p class="upcoming-date">12월 ${nearestEvent.day}일 (${nearestEvent.dow}) ${nearestEvent.detail.split(' · ')[0]}</p>
            </div>
            <button class="upcoming-btn" id="upcoming-goto-btn">바로가기</button>
        `;

        container.appendChild(card);

        // 바로가기 버튼 클릭 이벤트
        const gotoBtn = document.getElementById('upcoming-goto-btn');
        if (gotoBtn) {
            gotoBtn.onclick = () => {
                // 가장 가까운 모임 데이터 저장
                if (typeof setCurrentMeeting === 'function') {
                    setCurrentMeeting(nearestEvent);
                }

                if (typeof goToScreen === 'function') {
                    goToScreen('main');
                    // 채팅 탭으로 전환
                    setTimeout(() => {
                        if (typeof showChatDefault === 'function') {
                            showChatDefault();
                        }
                    }, 100);
                }
            };
        }
    }
}

/**
 * 캘린더 날짜 클릭 시 해당 이벤트로 스크롤
 */
function scrollToEvent(eventId) {
    const eventCard = document.getElementById(eventId);
    if (eventCard) {
        eventCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // 강조 효과
        eventCard.style.transform = 'scale(1.02)';
        setTimeout(() => {
            eventCard.style.transform = 'scale(1)';
        }, 300);
    }
}

// 페이지 로드 시 캘린더 업데이트
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateMyCalendar);
} else {
    updateMyCalendar();
}

// 전역으로 내보내기
window.updateMyCalendar = updateMyCalendar;
window.scrollToEvent = scrollToEvent;
