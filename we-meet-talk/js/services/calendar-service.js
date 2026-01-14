/**
 * Google Calendar Service
 * 구글 캘린더 연동 및 일정 동기화 관리
 */

const GOOGLE_CONFIG = {
    apiKey: '', // 사용자가 제공해야 함
    clientId: '', // 사용자가 제공해야 함
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
    scopes: "https://www.googleapis.com/auth/calendar.readonly"
};

let tokenClient;
let gapiInited = false;
let gisInited = false;

/**
 * Google API 초기화
 */
function initGoogleCalendar() {
    // 1. Load the GAPI client
    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.onload = () => {
        gapi.load('client', initializeGapiClient);
    };
    document.head.appendChild(gapiScript);

    // 2. Load the GIS SDK
    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    gisScript.onload = () => {
        if (GOOGLE_CONFIG.clientId) {
            try {
                tokenClient = google.accounts.oauth2.initTokenClient({
                    client_id: GOOGLE_CONFIG.clientId,
                    scope: GOOGLE_CONFIG.scopes,
                    callback: '', // defined at sync time
                });
                gisInited = true;
            } catch (err) {
                console.error('GIS initialization failed:', err);
                gisInited = true; // Still mark as inited so sync button can at least trigger simulation
            }
        } else {
            console.warn('Google Client ID is missing. GIS will not be initialized.');
            gisInited = true; // Mark as inited to allow simulation mode
        }
    };
    document.head.appendChild(gisScript);
}

async function initializeGapiClient() {
    if (GOOGLE_CONFIG.apiKey) {
        try {
            await gapi.client.init({
                apiKey: GOOGLE_CONFIG.apiKey,
                discoveryDocs: GOOGLE_CONFIG.discoveryDocs,
            });
            gapiInited = true;
        } catch (err) {
            console.error('GAPI client initialization failed:', err);
            gapiInited = true;
        }
    } else {
        console.warn('Google API Key is missing. GAPI client will not be initialized.');
        gapiInited = true;
    }
}

/**
 * 구글 캘린더 동기화 시작
 */
async function syncGoogleCalendar() {
    if (!gapiInited || !gisInited) {
        if (typeof showToast === 'function') showToast('구글 API를 초기화 중입니다. 잠시만 기다려주세요.');
        return;
    }

    if (!GOOGLE_CONFIG.clientId || !GOOGLE_CONFIG.apiKey) {
        if (typeof showToast === 'function') {
            showToast('구글 클라이언트 ID와 API 키 설정이 필요합니다.');
        }
        // 시뮬레이션 모드로 작동 (데모용)
        simulateSync();
        return;
    }

    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        await startFetchingEvents();
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

/**
 * 캘린더 이벤트 가져오기
 */
async function startFetchingEvents() {
    try {
        const response = await gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 50,
            'orderBy': 'startTime',
        });

        const events = response.result.items;
        processEvents(events);
    } catch (err) {
        console.error('Error fetching events:', err);
    }
}

/**
 * 가져온 이벤트를 분석하여 바쁜 날짜 추출
 */
function processEvents(events) {
    if (!events || events.length === 0) {
        if (typeof showToast === 'function') showToast('가져올 일정이 없습니다.');
        return;
    }

    /**
     * 개인정보 보호: 이벤트의 제목, 장소, 설명 등 세부 내용은 절대 수집/공유하지 않습니다.
     * 오직 해당 날짜에 일정이 있는지 여부(바쁨 상태)만 추출하여 공유합니다.
     */
    const busyDates = events.map(event => {
        const start = event.start.dateTime || event.start.date;
        return start.split('T')[0]; // YYYY-MM-DD 형식만 추출
    });

    // 중복 제거
    const uniqueBusyDates = [...new Set(busyDates)];

    // Firestore에 저장 및 UI 업데이트 로직 호출
    saveBusyDates(uniqueBusyDates);
}

/**
 * 내 바쁜 날짜를 Firestore에 저장
 */
async function saveBusyDates(dates) {
    const chatRoomId = window.currentChatRoomId;
    const userId = window.auth?.currentUser?.uid || 'anonymous';

    if (!chatRoomId || !window.db) return;

    try {
        const docRef = window.db.collection('chatrooms').doc(chatRoomId);

        await window.db.runTransaction(async (transaction) => {
            const doc = await transaction.get(docRef);
            if (!doc.exists) return;

            const data = doc.data();
            let participants = data.participants || [];
            const userName = window.auth?.currentUser?.name || '나';

            if (Array.isArray(participants)) {
                // 배열인 경우 - 객체를 찾아 업데이트하거나 추가
                const targetIndex = participants.findIndex(p => (p.uid || p.id) === userId || p.name === userName);
                if (targetIndex !== -1) {
                    participants[targetIndex].busyDates = dates;
                    participants[targetIndex].isSynced = true;
                } else {
                    participants.push({
                        uid: userId,
                        name: userName,
                        busyDates: dates,
                        isSynced: true
                    });
                }
            } else {
                // 객체인 경우
                if (participants[userId]) {
                    participants[userId].busyDates = dates;
                    participants[userId].isSynced = true;
                } else {
                    participants[userId] = {
                        name: userName,
                        busyDates: dates,
                        isSynced: true
                    };
                }
            }

            transaction.update(docRef, { participants: participants });
        });

        if (typeof showToast === 'function') showToast('일정이 동기화되었습니다! 🗓️');

        // 캘린더 화면 갱신
        if (typeof refreshCalendar === 'function') refreshCalendar();

    } catch (error) {
        console.error('Error saving busy dates:', error);
    }
}

/**
 * 데모용 시뮬레이션 동기화
 */
function simulateSync() {
    if (typeof showToast === 'function') {
        showToast('일정 분석을 시작합니다... (데모 모드) 🔍');
    }

    // 실제 로직과 유사하게 약간의 딜레이를 줌
    const mockBusyDates = ['2026-01-14', '2026-01-16', '2026-01-19', '2026-01-23', '2026-01-24', '2026-01-25', '2026-01-30', '2026-01-31'];
    setTimeout(() => {
        saveBusyDates(mockBusyDates);
    }, 1500);
}

// 전역으로 내보내기
window.initGoogleCalendar = initGoogleCalendar;
window.syncGoogleCalendar = syncGoogleCalendar;
