/**
 * Create Meeting Feature
 * 모임 만들기 기능 관리
 */

// 모임 생성 데이터
const meetingData = {
    date: null,
    time: null,
    type: null,
    location: null
};

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

    // 커스텀 시간 입력 숨기기
    const customInput = document.getElementById('meeting-time-custom');
    if (customInput) {
        customInput.style.display = 'none';
    }

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
        customInput.addEventListener('change', function() {
            meetingData.time = this.value;
            checkStep1Completion();
        });
    }
}

/**
 * Step 1 완료 체크
 */
function checkStep1Completion() {
    const dateInput = document.getElementById('meeting-date');
    const nextBtn = document.getElementById('btn-step1-next');

    if (dateInput && nextBtn) {
        const hasDate = dateInput.value !== '';
        const hasTime = meetingData.time !== null;

        if (hasDate && hasTime) {
            nextBtn.disabled = false;
            meetingData.date = dateInput.value;
        } else {
            nextBtn.disabled = true;
        }
    }
}

// 날짜 선택 이벤트
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('meeting-date');
    if (dateInput) {
        // 오늘 날짜를 최소값으로 설정
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);

        dateInput.addEventListener('change', function() {
            meetingData.date = this.value;
            checkStep1Completion();
        });
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
        { emoji: '🎉', name: '기념일 모임', desc: '소중한 순간을 함께', bg: '#FEF3C7' }
    ],
    hobby: [
        { emoji: '📚', name: '스터디 모임', desc: '함께 공부하고 성장해요', bg: '#DBEAFE' },
        { emoji: '🎮', name: '게임 모임', desc: '취미를 공유하는 시간', bg: '#E0E7FF' },
        { emoji: '🎨', name: '문화 모임', desc: '전시회, 공연 감상', bg: '#FFF7ED' },
        { emoji: '📖', name: '독서 모임', desc: '책으로 나누는 이야기', bg: '#FEF3C7' },
        { emoji: '🎤', name: '노래방 모임', desc: '신나게 노래 불러요', bg: '#FFEDD5' },
        { emoji: '🎸', name: '밴드 연습', desc: '음악으로 하나되는 시간', bg: '#E0E7FF' }
    ],
    sports: [
        { emoji: '🏃', name: '운동 모임', desc: '건강한 취미 생활', bg: '#DCFCE7' },
        { emoji: '⛰️', name: '등산 모임', desc: '자연을 즐기는 시간', bg: '#F0FDF4' },
        { emoji: '🚴', name: '자전거 라이딩', desc: '시원한 바람을 가르며', bg: '#DBEAFE' },
        { emoji: '🏊', name: '수영 모임', desc: '건강한 수영 시간', bg: '#E0E7FF' },
        { emoji: '🧘', name: '요가 모임', desc: '몸과 마음의 균형', bg: '#F0FDF4' }
    ],
    food: [
        { emoji: '☕', name: '카페 모임', desc: '따뜻한 음료와 함께', bg: '#FFF7ED' },
        { emoji: '🍽️', name: '식사 모임', desc: '맛있는 음식을 함께', bg: '#FFEDD5' },
        { emoji: '🍜', name: '맛집 탐방', desc: '새로운 맛을 찾아서', bg: '#FEF3C7' },
        { emoji: '🍰', name: '베이킹 모임', desc: '함께 만들고 나눠요', bg: '#FFF7ED' },
        { emoji: '🥐', name: '브런치 모임', desc: '여유로운 아침 식사', bg: '#FFEDD5' }
    ],
    entertainment: [
        { emoji: '🎬', name: '영화 관람', desc: '오후의 여유로운 영화 감상', bg: '#E0E7FF' },
        { emoji: '🎭', name: '연극 관람', desc: '문화 생활을 함께', bg: '#FFF7ED' },
        { emoji: '🎲', name: '보드게임', desc: '재미있는 게임의 세계', bg: '#DBEAFE' }
    ]
};

/**
 * AI 추천 모임 타입 생성 (카테고리별, 랜덤)
 */
function generateAIMeetingTypes() {
    const container = document.getElementById('ai-meeting-types');
    if (!container) return;

    // 각 카테고리에서 랜덤하게 선택
    const allTypes = [];

    // 각 카테고리에서 1-2개씩 랜덤 선택
    Object.keys(meetingTypesByCategory).forEach(category => {
        const categoryTypes = meetingTypesByCategory[category];
        const shuffled = categoryTypes.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 1); // 각 카테고리에서 1개씩
        allTypes.push(...selected);
    });

    // 전체를 섞고 3개만 선택
    const shuffledAll = allTypes.sort(() => 0.5 - Math.random());
    const recommendations = shuffledAll.slice(0, 3);

    // 카드 생성
    container.innerHTML = '';
    recommendations.forEach((rec, index) => {
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

    // 직접 입력 이벤트
    const customInput = document.getElementById('meeting-type-custom');
    if (customInput) {
        customInput.addEventListener('input', function() {
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
 * 장소 검색 보이기
 */
function showLocationSearch() {
    const searchSection = document.getElementById('location-search');
    const aiSection = document.getElementById('ai-locations');

    if (searchSection && aiSection) {
        searchSection.style.display = 'block';
        aiSection.style.display = 'none';

        // 검색 입력 포커스
        const searchInput = document.getElementById('location-search-input');
        if (searchInput) {
            searchInput.focus();

            // 검색 이벤트 (실제로는 API 연동 필요)
            searchInput.addEventListener('input', function() {
                if (this.value.length >= 2) {
                    performLocationSearch(this.value);
                }
            });
        }
    }
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
 * AI 장소 추천 보이기
 */
function showAILocationRecommendations() {
    const searchSection = document.getElementById('location-search');
    const aiSection = document.getElementById('ai-locations');

    if (searchSection && aiSection) {
        searchSection.style.display = 'none';
        aiSection.style.display = 'block';
    }
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
    if (nextBtn) {
        nextBtn.disabled = !meetingData.location;
    }
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
function completeMeetingCreation() {
    console.log('모임 생성 데이터:', meetingData);

    // 실제로는 Firebase나 백엔드에 데이터 저장
    if (typeof showToast === 'function') {
        showToast('모임이 생성되었습니다! 🎉');
    }

    // 홈 화면으로 이동
    setTimeout(() => {
        if (typeof goToScreen === 'function') {
            goToScreen('home');
        }
    }, 1000);
}

// 전역으로 내보내기
window.selectTime = selectTime;
window.showCustomTimeInput = showCustomTimeInput;
window.goToCreateStep2 = goToCreateStep2;
window.selectMeetingType = selectMeetingType;
window.showMoreMeetingTypes = showMoreMeetingTypes;
window.goToCreateStep3 = goToCreateStep3;
window.showLocationSearch = showLocationSearch;
window.showAILocationRecommendations = showAILocationRecommendations;
window.requestLocationPermission = requestLocationPermission;
window.selectLocation = selectLocation;
window.showMoreLocations = showMoreLocations;
window.completeMeetingCreation = completeMeetingCreation;
