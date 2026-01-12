/**
 * Create Meeting Feature
 * 모임 만들기 기능 관리
 */

// 모임 생성 데이터
const meetingData = {
    date: null,
    time: null,
    type: null,
    location: null,
    dateDecided: true, // 날짜 정해짐 여부
    dateRange: { start: null, end: null }, // 날짜 범위 (미정인 경우)
    timeDecided: true, // 시간 정해짐 여부
    locationDecided: true // 장소 정해짐 여부
};

/**
 * 닉네임 설정 (로컬스토리지에서 가져오기)
 */
function setHostNickname() {
    const nickname = localStorage.getItem('userName') || '주최자';
    const nicknameElement = document.getElementById('host-nickname');
    if (nicknameElement) {
        nicknameElement.textContent = nickname;
    }
}

/**
 * 날짜 결정 상태 토글
 */
function toggleDateDecision(type) {
    const decidedBtn = document.getElementById('btn-date-decided');
    const undecidedBtn = document.getElementById('btn-date-undecided');
    const decidedSection = document.getElementById('decided-date-section');
    const undecidedSection = document.getElementById('undecided-date-section');

    meetingData.dateDecided = (type === 'decided');

    if (type === 'decided') {
        // 날짜 정해진 경우
        decidedBtn.style.background = '#E0F2FE';
        decidedBtn.style.color = '#0284C7';
        decidedBtn.style.borderColor = '#0284C7';
        undecidedBtn.style.background = 'white';
        undecidedBtn.style.color = 'var(--text-secondary)';
        undecidedBtn.style.borderColor = '#E5E7EB';

        decidedSection.style.display = 'block';
        undecidedSection.style.display = 'none';
    } else {
        // 날짜 정하지 않은 경우
        undecidedBtn.style.background = '#E0F2FE';
        undecidedBtn.style.color = '#0284C7';
        undecidedBtn.style.borderColor = '#0284C7';
        decidedBtn.style.background = 'white';
        decidedBtn.style.color = 'var(--text-secondary)';
        decidedBtn.style.borderColor = '#E5E7EB';

        decidedSection.style.display = 'none';
        undecidedSection.style.display = 'block';
    }

    checkStep1Completion();
}

/**
 * Step 1: 시간 선택
 */
function selectTime(button, time) {
    // 기존 선택 해제
    document.querySelectorAll('.time-chip').forEach(chip => {
        chip.classList.remove('selected');
    });

    // 새로운 시간 선택
    button.classList.add('selected');
    meetingData.time = time;
    meetingData.timeDecided = true;

    // 커스텀 시간 입력 숨기기
    const customInput = document.getElementById('meeting-time-custom');
    if (customInput) {
        customInput.style.display = 'none';
    }

    // 다음 버튼 활성화 체크
    checkStep1Completion();
}

/**
 * 시간 선택 스킵
 */
function skipTimeSelection() {
    // 시간 칩 선택 모두 해제
    document.querySelectorAll('.time-chip').forEach(chip => {
        chip.classList.remove('selected');
    });

    // 커스텀 시간 입력 숨기기
    const customInput = document.getElementById('meeting-time-custom');
    if (customInput) {
        customInput.style.display = 'none';
        customInput.value = '';
    }

    // 시간 미정으로 설정
    meetingData.time = null;
    meetingData.timeDecided = false;

    // 다음 버튼 활성화 체크
    checkStep1Completion();
}

/**
 * 커스텀 시간 입력 보이기
 */
function showCustomTimeInput() {
    const customInput = document.getElementById('meeting-time-custom');
    if (customInput) {
        customInput.style.display = 'block';
        customInput.focus();

        // 기존 시간 칩 선택 해제
        document.querySelectorAll('.time-chip').forEach(chip => {
            chip.classList.remove('selected');
        });

        // 커스텀 시간 입력 이벤트
        customInput.addEventListener('change', function () {
            meetingData.time = this.value;
            checkStep1Completion();
        });
    }
}

/**
 * Step 1 완료 체크
 */
function checkStep1Completion() {
    const nextBtn = document.getElementById('btn-step1-next');

    if (!nextBtn) return;

    let isComplete = false;

    if (meetingData.dateDecided) {
        // 날짜가 정해진 경우
        const dateInput = document.getElementById('meeting-date');
        const hasDate = dateInput && dateInput.value !== '';

        if (meetingData.timeDecided) {
            // 시간도 정해진 경우: 날짜 + 시간 필요
            const hasTime = meetingData.time !== null;
            if (hasDate && hasTime) {
                meetingData.date = dateInput.value;
                isComplete = true;
            }
        } else {
            // 시간 미정인 경우: 날짜만 있으면 OK
            if (hasDate) {
                meetingData.date = dateInput.value;
                isComplete = true;
            }
        }
    } else {
        // 날짜가 정해지지 않은 경우
        // 날짜 범위 저장 (선택사항)
        const startInput = document.getElementById('meeting-date-start');
        const endInput = document.getElementById('meeting-date-end');
        if (startInput && endInput) {
            meetingData.dateRange.start = startInput.value || null;
            meetingData.dateRange.end = endInput.value || null;
        }

        if (meetingData.timeDecided) {
            // 시간이 정해진 경우: 시간만 있으면 OK
            const hasTime = meetingData.time !== null;
            if (hasTime) {
                meetingData.date = null; // 날짜 미정
                isComplete = true;
            }
        } else {
            // 시간도 미정인 경우: 바로 다음 단계 가능
            meetingData.date = null; // 날짜 미정
            isComplete = true;
        }
    }

    nextBtn.disabled = !isComplete;
}

// 날짜 선택 이벤트
document.addEventListener('DOMContentLoaded', function () {
    // 닉네임 설정
    setHostNickname();

    // 오늘 날짜
    const today = new Date().toISOString().split('T')[0];

    // 확정 날짜 입력
    const dateInput = document.getElementById('meeting-date');
    if (dateInput) {
        dateInput.setAttribute('min', today);
        dateInput.addEventListener('change', function () {
            meetingData.date = this.value;
            checkStep1Completion();
        });
    }

    // 날짜 범위 입력
    const startInput = document.getElementById('meeting-date-start');
    const endInput = document.getElementById('meeting-date-end');

    if (startInput) {
        startInput.setAttribute('min', today);
        startInput.addEventListener('change', function () {
            if (endInput && this.value) {
                endInput.setAttribute('min', this.value);
            }
            checkStep1Completion();
        });
    }

    if (endInput) {
        endInput.setAttribute('min', today);
        endInput.addEventListener('change', checkStep1Completion);
    }
});

/**
 * Step 2로 이동
 */
function goToCreateStep2() {
    if (typeof goToScreen === 'function') {
        goToScreen('create-step2');
        // 더보기 카운터 초기화
        moreClickCount = 0;
        // 더보기 버튼 보이기
        const moreBtn = document.getElementById('btn-more-meeting-types');
        if (moreBtn) {
            moreBtn.style.display = 'flex';
        }
        // AI 추천 모임 타입 생성
        generateAIMeetingTypes();
    }
}

/**
 * 모임 타입 데이터 (카테고리별 그룹핑)
 */
const meetingTypesByCategory = {
    events: [
        { emoji: '🎄', name: '연말 송년회', desc: '한 해를 마무리하는 특별한 시간', bg: '#FFF7ED' },
        { emoji: '🎂', name: '생일 파티', desc: '특별한 날을 축하해요', bg: '#FFEDD5' },
        { emoji: '🎉', name: '기념일 모임', desc: '소중한 순간을 함께', bg: '#FEF3C7' },
        { emoji: '🏠', name: '집들이', desc: '새로운 보금자리 축하', bg: '#DBEAFE' },
        { emoji: '👶', name: '돌잔치', desc: '첫 생일 축하해요', bg: '#FFF7ED' },
        { emoji: '💌', name: '청첩장 모임', desc: '좋은 소식 전하는 날', bg: '#FFEDD5' },
        { emoji: '🎓', name: '졸업 축하', desc: '새로운 시작을 응원해', bg: '#FEF3C7' },
        { emoji: '👋', name: '송별회', desc: '아쉬운 작별의 시간', bg: '#E0E7FF' },
        { emoji: '🤝', name: '환영회', desc: '새로운 만남을 반겨요', bg: '#F0FDF4' },
        { emoji: '🎤', name: '세미나', desc: '지식과 경험의 공유', bg: '#DBEAFE' },
        { emoji: '🌐', name: '네트워킹', desc: '새로운 인맥을 넓혀요', bg: '#EFF6FF' }
    ],
    hobby: [
        { emoji: '📚', name: '스터디 모임', desc: '함께 공부하고 성장해요', bg: '#DBEAFE' },
        { emoji: '🎮', name: '게임 모임', desc: '취미를 공유하는 시간', bg: '#E0E7FF' },
        { emoji: '🎨', name: '문화 모임', desc: '전시회, 공연 감상', bg: '#FFF7ED' },
        { emoji: '📖', name: '독서 모임', desc: '책으로 나누는 이야기', bg: '#FEF3C7' },
        { emoji: '🎤', name: '노래방 모임', desc: '신나게 노래 불러요', bg: '#FFEDD5' },
        { emoji: '🎸', name: '밴드 연습', desc: '음악으로 하나되는 시간', bg: '#E0E7FF' },
        { emoji: '📸', name: '사진 출사', desc: '아름다운 순간 포착', bg: '#E0F2FE' },
        { emoji: '💃', name: '댄스 모임', desc: '리듬에 몸을 맡겨요', bg: '#FFEDD5' },
        { emoji: '🧶', name: '뜨개질/공예', desc: '손으로 만드는 즐거움', bg: '#FFF7ED' },
        { emoji: '💻', name: '코딩 스터디', desc: '함께 성장하는 개발자', bg: '#DBEAFE' },
        { emoji: '🗣️', name: '언어 교환', desc: '외국어 실력 쑥쑥', bg: '#FEF3C7' },
        { emoji: '✍️', name: '글쓰기 모임', desc: '나만의 이야기 기록', bg: '#F0FDF4' },
        { emoji: '🪴', name: '식집사 모임', desc: '반려식물 키우기', bg: '#DCFCE7' }
    ],
    sports: [
        { emoji: '🏃', name: '운동 모임', desc: '건강한 취미 생활', bg: '#DCFCE7' },
        { emoji: '⛰️', name: '등산 모임', desc: '자연을 즐기는 시간', bg: '#F0FDF4' },
        { emoji: '🚴', name: '자전거 라이딩', desc: '시원한 바람을 가르며', bg: '#DBEAFE' },
        { emoji: '🏊', name: '수영 모임', desc: '건강한 수영 시간', bg: '#E0E7FF' },
        { emoji: '🧘', name: '요가 모임', desc: '몸과 마음의 균형', bg: '#F0FDF4' },
        { emoji: '🎳', name: '볼링 한판', desc: '스트라이크의 쾌감', bg: '#E0E7FF' },
        { emoji: '🏸', name: '배드민턴', desc: '가볍게 즐기는 운동', bg: '#FEF3C7' },
        { emoji: '🎾', name: '테니스', desc: '다함께 랠리', bg: '#DCFCE7' },
        { emoji: '🏀', name: '농구 모임', desc: '코트 위의 열정', bg: '#FFEDD5' },
        { emoji: '⚽', name: '축구/풋살', desc: '팀워크를 다져요', bg: '#DBEAFE' },
        { emoji: '🎱', name: '당구/포켓볼', desc: '집중력의 승부', bg: '#F1F5F9' },
        { emoji: '🥊', name: '클라이밍', desc: '한계에 도전해요', bg: '#FFF7ED' }
    ],
    food: [
        { emoji: '☕', name: '카페 모임', desc: '따뜻한 음료와 함께', bg: '#FFF7ED' },
        { emoji: '🍽️', name: '식사 모임', desc: '맛있는 음식을 함께', bg: '#FFEDD5' },
        { emoji: '🍜', name: '맛집 탐방', desc: '새로운 맛을 찾아서', bg: '#FEF3C7' },
        { emoji: '🍰', name: '베이킹 모임', desc: '함께 만들고 나눠요', bg: '#FFF7ED' },
        { emoji: '🥐', name: '브런치 모임', desc: '여유로운 아침 식사', bg: '#FFEDD5' },
        { emoji: '🍷', name: '와인 파티', desc: '우아한 테이스팅', bg: '#F3E8FF' },
        { emoji: '🍺', name: '맥주 페스티벌', desc: '시원한 한 잔의 여유', bg: '#FEF3C7' },
        { emoji: '🍗', name: '치맥 모임', desc: '진리의 치킨과 맥주', bg: '#FFEDD5' },
        { emoji: '🥗', name: '비건 탐방', desc: '건강하고 맛있는 식사', bg: '#DCFCE7' },
        { emoji: '🍱', name: '도시락 소풍', desc: '야외에서 즐기는 점심', bg: '#F0FDF4' },
        { emoji: '🍵', name: '티 타임', desc: '향긋한 차의 여유', bg: '#F0FDF4' }
    ],
    entertainment: [
        { emoji: '🎬', name: '영화 관람', desc: '오후의 여유로운 영화 감상', bg: '#E0E7FF' },
        { emoji: '🎭', name: '연극 관람', desc: '문화 생활을 함께', bg: '#FFF7ED' },
        { emoji: '🎲', name: '보드게임', desc: '재미있는 게임의 세계', bg: '#DBEAFE' },
        { emoji: '🕵️', name: '방탈출 게임', desc: '두뇌 풀가동', bg: '#E0E7FF' },
        { emoji: '🛍️', name: '쇼핑 투어', desc: '득템의 즐거움', bg: '#FFF7ED' },
        { emoji: '🎢', name: '놀이공원', desc: '짜릿한 어트랙션', bg: '#FFEDD5' },
        { emoji: '🎪', name: '축제/페스티벌', desc: '뜨거운 열기의 현장', bg: '#FEF3C7' },
        { emoji: '⚾', name: '야구 관람', desc: '하나되는 응원전', bg: '#DBEAFE' },
        { emoji: '🏕️', name: '캠핑/글램핑', desc: '자연 속 힐링', bg: '#DCFCE7' }
    ]
};

/**
 * AI 추천 모임 타입 생성 (카테고리별, 랜덤)
 */
function generateAIMeetingTypes() {
    const container = document.getElementById('ai-meeting-types');
    if (!container) return;

    // 1. 전체 모임 리스트 평탄화
    let candidates = [];
    Object.keys(meetingTypesByCategory).forEach(category => {
        candidates.push(...meetingTypesByCategory[category]);
    });

    // 2. 가중치 계산을 위한 시각 정보 분석
    const now = new Date();
    let month = now.getMonth() + 1; // 1-12
    let hour = now.getHours(); // 0-23
    let isWeekend = false;

    // 사용자가 입력한 날짜가 있으면 그 정보를 우선 사용
    if (meetingData.date) {
        const dateObj = new Date(meetingData.date);
        month = dateObj.getMonth() + 1;
        const day = dateObj.getDay();
        isWeekend = (day === 0 || day === 6); // 일(0), 토(6)
    }

    // 사용자가 입력한 시간이 있으면 그 정보를 사용
    if (meetingData.time) {
        hour = parseInt(meetingData.time.split(':')[0]);
    }

    // 3. 점수 부여 (기본 점수 10점)
    candidates = candidates.map(item => {
        let score = 10;
        const name = item.name;

        // --- 시간대별 규칙 ---
        if (hour >= 5 && hour < 11) { // 아침/오전
            if (name.includes('브런치') || name.includes('등산') || name.includes('요가') || name.includes('조깅')) score += 30;
            if (name.includes('술') || name.includes('맥주') || name.includes('와인') || name.includes('노래방')) score -= 20;
        } else if (hour >= 11 && hour < 14) { // 점심
            if (name.includes('식사') || name.includes('맛집') || name.includes('브런치')) score += 20;
        } else if (hour >= 14 && hour < 17) { // 오후
            if (name.includes('카페') || name.includes('디저트') || name.includes('전시회') || name.includes('티 타임')) score += 25;
            if (name.includes('술')) score -= 10;
        } else if (hour >= 17) { // 저녁/밤
            if (name.includes('술') || name.includes('맥주') || name.includes('와인') || name.includes('칵테일') || name.includes('저녁')) score += 30;
            if (name.includes('야경') || name.includes('노래방') || name.includes('볼링')) score += 20;
            if (name.includes('브런치')) score -= 20;
        }

        // --- 계절/월별 규칙 ---
        if (month === 12) { // 12월
            if (name.includes('연말') || name.includes('송년회') || name.includes('크리스마스')) score += 50;
        } else if (month >= 3 && month <= 5) { // 봄
            if (name.includes('꽃') || name.includes('피크닉') || name.includes('도시락') || name.includes('자전거')) score += 20;
        } else if (month >= 6 && month <= 8) { // 여름
            if (name.includes('수영') || name.includes('수상') || name.includes('냉면') || name.includes('맥주')) score += 20;
            if (name.includes('등산')) score -= 10; // 너무 더움
        } else if (month >= 9 && month <= 11) { // 가을
            if (name.includes('독서') || name.includes('단풍') || name.includes('등산') || name.includes('캠핑')) score += 25;
        }

        // --- 요일별 규칙 ---
        if (isWeekend) { // 주말
            if (name.includes('결혼') || name.includes('돌잔치') || name.includes('여행') || name.includes('캠핑') || name.includes('등산')) score += 30;
        } else { // 평일
            if (name.includes('번개') || name.includes('간단') || name.includes('저녁')) score += 10;
        }

        return { ...item, score };
    });

    // 4. 가중치 기반 랜덤 선택 (Weighted Random Selection)
    // 점수가 높을수록 뽑힐 확률이 높아짐 + 약간의 랜덤성(Noise) 추가하여 매번 똑같은 것만 나오지 않게 함
    candidates.sort((a, b) => {
        const scoreA = a.score + (Math.random() * 20); // 0~20점의 랜덤 변수 추가
        const scoreB = b.score + (Math.random() * 20);
        return scoreB - scoreA;
    });

    // 5. 상위 추천 선택 및 다양성 확보
    // 단순히 상위 3개를 뽑기보다, 카테고리가 겹치지 않게 노력하면서 상위권을 추출
    const recommendations = [];
    const usedCategories = new Set();

    // 카테고리를 역추적하기 위해 원본 데이터 참조가 필요하지만, 
    // 여기서는 name으로 category를 찾는 대신 단순무식하게 상위권부터 훑되 중복 방지
    for (let item of candidates) {
        if (recommendations.length >= 3) break;

        // 해당 아이템의 카테고리 찾기
        let category = '';
        for (const [cat, items] of Object.entries(meetingTypesByCategory)) {
            if (items.some(i => i.name === item.name)) {
                category = cat;
                break;
            }
        }

        // 카테고리 중복 피하기 (가능하면)
        if (!usedCategories.has(category)) {
            recommendations.push(item);
            usedCategories.add(category);
        }
    }

    // 만약 3개를 못 채웠으면(카테고리 중복 때문에), 그냥 점수 높은 순으로 나머지 채우기
    if (recommendations.length < 3) {
        for (let item of candidates) {
            if (recommendations.length >= 3) break;
            if (!recommendations.includes(item)) {
                recommendations.push(item);
            }
        }
    }

    // 6. UI 렌더링
    container.innerHTML = '';
    recommendations.forEach((rec) => {
        const card = document.createElement('div');
        card.className = 'meeting-type-card';
        card.innerHTML = `
            <div class="type-icon" style="background:${rec.bg}">${rec.emoji}</div>
            <div class="type-content">
                <div class="type-name">${rec.name}</div>
                <div class="type-desc">${rec.desc}</div>
            </div>
        `;

        card.onclick = () => selectMeetingType(card, rec.name);
        container.appendChild(card);
    });

    // 직접 입력 이벤트는 한 번만 바인딩되도록 체크하거나 기존 코드 유지
    // (이 함수가 자주 호출된다면 이벤트 리스너 중복 방지가 필요하지만, 
    // 현재 구조상 goToCreateStep2에서 호출되므로 괜찮음)
}

// 직접 입력 이벤트
const customInput = document.getElementById('meeting-type-custom');
if (customInput) {
    customInput.addEventListener('input', function () {
        if (this.value.trim()) {
            // 기존 선택 해제
            document.querySelectorAll('.meeting-type-card').forEach(card => {
                card.classList.remove('selected');
            });
            meetingData.type = this.value.trim();
            checkStep2Completion();
        }
    });
}


/**
 * 모임 타입 선택
 */
function selectMeetingType(card, typeName) {
    // 기존 선택 해제
    document.querySelectorAll('.meeting-type-card').forEach(c => {
        c.classList.remove('selected');
    });

    // 새로운 타입 선택
    card.classList.add('selected');
    meetingData.type = typeName;

    // 직접 입력 초기화
    const customInput = document.getElementById('meeting-type-custom');
    if (customInput) {
        customInput.value = '';
    }

    checkStep2Completion();
}

/**
 * Step 2 완료 체크
 */
function checkStep2Completion() {
    const nextBtn = document.getElementById('btn-step2-next');
    if (nextBtn) {
        nextBtn.disabled = !meetingData.type;
    }
}

// 더보기 클릭 횟수 추적
let moreClickCount = 0;

/**
 * 더 많은 모임 보기 (카테고리별 그룹핑, 5개씩 3번)
 */
function showMoreMeetingTypes() {
    const container = document.getElementById('ai-meeting-types');
    const moreBtn = document.getElementById('btn-more-meeting-types');
    if (!container) return;

    moreClickCount++;

    // 전체 모임 타입을 카테고리별로 평탄화
    const allTypes = [];
    Object.keys(meetingTypesByCategory).forEach(category => {
        allTypes.push(...meetingTypesByCategory[category]);
    });

    // 이미 표시된 모임 제외
    const displayedTypes = Array.from(container.querySelectorAll('.meeting-type-card .type-name'))
        .map(el => el.textContent);

    const remainingTypes = allTypes.filter(type => !displayedTypes.includes(type.name));

    // 5개씩 추가
    let typesToAdd = [];

    if (moreClickCount === 1) {
        // 1차 더보기: 5개 추가 (총 8개)
        typesToAdd = remainingTypes.slice(0, 5);
    } else if (moreClickCount === 2) {
        // 2차 더보기: 5개 추가 (총 13개)
        typesToAdd = remainingTypes.slice(0, 5);
    } else if (moreClickCount === 3) {
        // 3차 더보기: 5개 추가 (총 18개)
        typesToAdd = remainingTypes.slice(0, 5);
        // 버튼 숨기기
        if (moreBtn) {
            moreBtn.style.display = 'none';
        }
    }

    // 카드 생성
    typesToAdd.forEach(type => {
        const card = document.createElement('div');
        card.className = 'meeting-type-card';
        card.innerHTML = `
            <div class="type-icon" style="background:${type.bg}">${type.emoji}</div>
            <div class="type-content">
                <div class="type-name">${type.name}</div>
                <div class="type-desc">${type.desc}</div>
            </div>
        `;

        card.onclick = () => selectMeetingType(card, type.name);
        container.appendChild(card);
    });
}

/**
 * Step 3으로 이동
 */
function goToCreateStep3() {
    if (typeof goToScreen === 'function') {
        goToScreen('create-step3');
    }
}

/**
 * 장소 옵션 선택
 */
function selectLocationOption(type) {
    // 모든 옵션 버튼 비활성화
    document.querySelectorAll('.location-option-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 모든 섹션 숨기기
    const searchSection = document.getElementById('location-search');
    const aiSection = document.getElementById('ai-recommendation-section');
    const voteSection = document.getElementById('vote-location-section');
    const decidedSection = document.getElementById('decided-location-section');

    if (searchSection) searchSection.style.display = 'none';
    if (aiSection) aiSection.style.display = 'none';
    if (voteSection) voteSection.style.display = 'none';

    if (type === 'undecided') {
        // AI 추천 보기
        const btn = document.getElementById('btn-location-undecided');
        if (btn) btn.classList.add('active');

        meetingData.locationDecided = true;
        meetingData.location = null;

        // AI 추천 섹션 표시
        if (aiSection) {
            aiSection.style.display = 'block';
            // 자동으로 위치 권한 요청
            requestLocationPermission();
        }
    } else if (type === 'vote') {
        // 투표로 정하기
        const btn = document.getElementById('btn-location-vote');
        if (btn) btn.classList.add('active');

        meetingData.locationDecided = false;
        meetingData.location = null;

        // 투표 섹션 표시
        if (voteSection) voteSection.style.display = 'block';
    }

    checkStep3Completion();
}

/**
 * 장소 검색 보이기
 */
function showLocationSearch() {
    // 모든 옵션 버튼 비활성화
    document.querySelectorAll('.location-option-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 검색 버튼 활성화
    const searchBtn = document.getElementById('btn-location-search');
    if (searchBtn) searchBtn.classList.add('active');

    // 모든 섹션 숨기기
    const searchSection = document.getElementById('location-search');
    const aiSection = document.getElementById('ai-recommendation-section');
    const voteSection = document.getElementById('vote-location-section');

    if (aiSection) aiSection.style.display = 'none';
    if (voteSection) voteSection.style.display = 'none';

    // 검색 섹션 표시
    if (searchSection) {
        searchSection.style.display = 'block';

        // 검색 입력 포커스
        const searchInput = document.getElementById('location-search-input');
        if (searchInput) {
            searchInput.focus();

            // 검색 이벤트 (실제로는 API 연동 필요)
            searchInput.addEventListener('input', function () {
                if (this.value.length >= 2) {
                    performLocationSearch(this.value);
                }
            });
        }
    }

    meetingData.locationDecided = true;
    checkStep3Completion();
}

/**
 * 장소 검색 수행 (Mock)
 */
function performLocationSearch(query) {
    const resultsContainer = document.getElementById('location-search-results');
    if (!resultsContainer) return;

    // Mock 검색 결과
    const mockResults = [
        { name: '스타벅스 강남역점', address: '서울 강남구 강남대로 지하 396' },
        { name: '강남역 CGV', address: '서울 강남구 강남대로 428' },
        { name: '강남역 교보문고', address: '서울 서초구 강남대로 465' }
    ];

    resultsContainer.innerHTML = '';
    mockResults.forEach(result => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
            <div class="result-name">${result.name}</div>
            <div class="result-address">${result.address}</div>
        `;

        item.onclick = () => selectLocation(item, result.name, result.address);
        resultsContainer.appendChild(item);
    });
}


/**
 * 위치 정보 권한 요청
 */
function requestLocationPermission() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // 위치 정보 획득 성공
                const { latitude, longitude } = position.coords;
                generateAILocationRecommendations(latitude, longitude);

                if (typeof showToast === 'function') {
                    showToast('위치 정보를 기반으로 추천해드려요!');
                }
            },
            (error) => {
                // 위치 정보 획득 실패
                if (typeof showToast === 'function') {
                    showToast('위치 정보 권한이 필요합니다');
                }
                // 권한 없어도 기본 추천 제공
                generateAILocationRecommendations(37.4979, 127.0276); // 강남역 기본값
            }
        );
    } else {
        if (typeof showToast === 'function') {
            showToast('위치 정보를 지원하지 않는 브라우저입니다');
        }
        generateAILocationRecommendations(37.4979, 127.0276);
    }
}

/**
 * AI 장소 추천 생성
 */
function generateAILocationRecommendations(lat, lng) {
    const container = document.getElementById('ai-location-recommendations');
    if (!container) return;

    // 모임 타입과 시간대를 기반으로 추천
    const timeHour = parseInt(meetingData.time.split(':')[0]);
    let recommendations = [];

    if (meetingData.type.includes('카페') || meetingData.type.includes('브런치')) {
        recommendations = [
            { name: '스타벅스 강남점', address: '서울 강남구 강남대로 396', reason: '조용한 분위기' },
            { name: '블루보틀 성수점', address: '서울 성동구 아차산로 64', reason: '감성적인 공간' },
            { name: '커피빈 신사점', address: '서울 강남구 압구정로 173', reason: '접근성 좋음' }
        ];
    } else if (meetingData.type.includes('식사') || meetingData.type.includes('저녁')) {
        recommendations = [
            { name: '한우마을 강남점', address: '서울 강남구 테헤란로 152', reason: '모임에 적합' },
            { name: '스시 사토', address: '서울 강남구 논현로 652', reason: '분위기 좋음' },
            { name: '마포갈매기 강남점', address: '서울 강남구 강남대로 428', reason: '단체 예약 가능' }
        ];
    } else if (meetingData.type.includes('영화') || meetingData.type.includes('문화')) {
        recommendations = [
            { name: 'CGV 강남', address: '서울 강남구 강남대로 428', reason: '최신 시설' },
            { name: '메가박스 코엑스점', address: '서울 강남구 영동대로 513', reason: '다양한 상영관' },
            { name: '롯데시네마 월드타워점', address: '서울 송파구 올림픽로 300', reason: '프리미엄 좌석' }
        ];
    } else {
        // 기본 추천
        recommendations = [
            { name: '강남역 근처 카페거리', address: '서울 강남구 강남대로 지하 396', reason: '접근성 우수' },
            { name: '코엑스몰', address: '서울 강남구 영동대로 513', reason: '다양한 선택지' },
            { name: '가로수길', address: '서울 강남구 신사동', reason: '여유로운 분위기' }
        ];
    }

    // 권한 안내 숨기기
    const permissionNotice = document.querySelector('.location-permission-notice');
    if (permissionNotice) {
        permissionNotice.style.display = 'none';
    }

    // 카드 생성
    container.innerHTML = '';
    recommendations.forEach((rec, index) => {
        const card = document.createElement('div');
        card.className = 'ai-location-card';
        card.innerHTML = `
            <div class="location-name">${rec.name}</div>
            <div class="location-address">${rec.address}</div>
            <span class="location-reason">✨ ${rec.reason}</span>
        `;

        card.onclick = () => selectLocation(card, rec.name, rec.address);
        container.appendChild(card);
    });
}

/**
 * 장소 선택
 */
function selectLocation(element, name, address) {
    // 기존 선택 해제
    document.querySelectorAll('.search-result-item, .ai-location-card').forEach(item => {
        item.classList.remove('selected');
    });

    // 새로운 장소 선택
    element.classList.add('selected');
    meetingData.location = { name, address };

    checkStep3Completion();
}

/**
 * Step 3 완료 체크
 */
function checkStep3Completion() {
    const nextBtn = document.getElementById('btn-step3-next');
    if (!nextBtn) return;

    let isComplete = false;

    if (meetingData.locationDecided) {
        // 장소가 정해진 경우: 장소 필수
        isComplete = meetingData.location !== null;
    } else {
        // 장소 투표로 정하는 경우: 바로 진행 가능
        isComplete = true;
    }

    nextBtn.disabled = !isComplete;
}

/**
 * 더 많은 장소 보기
 */
function showMoreLocations() {
    const moreLocations = [
        { name: '서울숲', address: '서울 성동구 뚝섬로 273', reason: '야외 모임에 적합' },
        { name: '북촌한옥마을', address: '서울 종로구 계동길 37', reason: '전통 분위기' },
        { name: '여의도 한강공원', address: '서울 영등포구 여의동로 330', reason: '넓은 공간' }
    ];

    const container = document.getElementById('ai-location-recommendations');
    if (!container) return;

    moreLocations.forEach(loc => {
        const card = document.createElement('div');
        card.className = 'ai-location-card';
        card.innerHTML = `
            <div class="location-name">${loc.name}</div>
            <div class="location-address">${loc.address}</div>
            <span class="location-reason">✨ ${loc.reason}</span>
        `;

        card.onclick = () => selectLocation(card, loc.name, loc.address);
        container.appendChild(card);
    });

    // 버튼 숨기기
    const moreBtn = document.querySelectorAll('.btn-more-types')[1];
    if (moreBtn) {
        moreBtn.style.display = 'none';
    }
}

/**
 * 모임 만들기 완료
 */
async function completeMeetingCreation() {
    console.log('=== 모임 생성 시작 ===');
    console.log('모임 생성 데이터:', meetingData);
    console.log('Firebase 초기화 상태:', {
        firebase: typeof firebase !== 'undefined',
        db: !!window.db,
        auth: !!window.auth
    });

    try {
        // 현재 사용자 정보 가져오기
        const currentUser = window.auth?.currentUser;
        const userId = currentUser?.uid || 'anonymous';
        const userName = currentUser?.displayName || localStorage.getItem('userName') || '익명';

        console.log('사용자 정보:', { userId, userName });

        // Firestore에 채팅방 생성
        if (!window.db) {
            console.error('window.db가 없습니다!');
            throw new Error('Firebase가 초기화되지 않았습니다.');
        }

        console.log('Firestore DB 확인 완료');

        // 채팅방 데이터 구성
        const chatRoomData = {
            name: meetingData.type || '새 모임',
            date: meetingData.date || null,
            time: meetingData.time || null,
            dateDecided: meetingData.dateDecided || false,
            location: meetingData.location || null,
            locationDecided: meetingData.locationDecided || false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: userId,
            creatorName: userName,
            participants: [{
                userId: userId,
                name: userName,
                joinedAt: new Date().toISOString()
            }],
            participantCount: 1,
            lastMessage: null,
            lastMessageAt: null
        };

        console.log('채팅방 데이터:', chatRoomData);

        if (typeof showToast === 'function') {
            showToast('채팅방을 생성하는 중입니다...');
        }

        console.log('Firestore에 문서 추가 시작...');

        // Firestore에 문서 추가
        const docRef = await window.db.collection('chatrooms').add(chatRoomData);
        const chatRoomId = docRef.id;

        console.log('✅ 채팅방 생성 완료! ID:', chatRoomId);

        // 초대 URL 생성
        const chatRoomUrl = `https://wemeettalk.com/join/${chatRoomId}`;

        if (typeof showToast === 'function') {
            showToast('모임이 생성되었습니다! 🎉');
        }

        // 모임 생성 완료 화면으로 이동
        setTimeout(() => {
            if (typeof showMeetingCreatedScreen === 'function') {
                showMeetingCreatedScreen(chatRoomUrl, chatRoomId);
            }
        }, 1000);

    } catch (error) {
        console.error('❌ 채팅방 생성 실패:', error);
        console.error('에러 상세:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });

        if (typeof showToast === 'function') {
            showToast(`채팅방 생성 실패: ${error.message}`);
        }
    }
}

// 전역으로 내보내기
window.selectTime = selectTime;
window.skipTimeSelection = skipTimeSelection;
window.showCustomTimeInput = showCustomTimeInput;
window.toggleDateDecision = toggleDateDecision;
window.goToCreateStep2 = goToCreateStep2;
window.selectMeetingType = selectMeetingType;
window.showMoreMeetingTypes = showMoreMeetingTypes;
window.goToCreateStep3 = goToCreateStep3;
window.selectLocationOption = selectLocationOption;
window.showLocationSearch = showLocationSearch;
window.requestLocationPermission = requestLocationPermission;
window.selectLocation = selectLocation;
window.showMoreLocations = showMoreLocations;
window.completeMeetingCreation = completeMeetingCreation;
