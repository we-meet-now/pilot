/**
 * Application Constants
 * 앱 전역 상수
 */

const APP_NAME = '오보톡';
const APP_VERSION = '1.0.0';

// 화면 ID
const SCREENS = {
    LANDING: 'landing',
    SUMMARY: 'summary',
    NAME: 'name',
    MAIN: 'main',
    SAVE: 'save',
    AUTH: 'auth',
    COMPLETE: 'complete'
};

// 탭 ID
const TABS = {
    INFO: 'info',
    CALENDAR: 'calendar',
    VOTE: 'vote',
    SETTLE: 'settle',
    PHOTOS: 'photos',
    CHAT: 'chat'
};

// 토스트 지속 시간
const TOAST_DURATION = {
    SHORT: 1500,
    MEDIUM: 2500,
    LONG: 3500
};

// 애니메이션 지속 시간
const ANIMATION_DURATION = {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500
};

// 컨페티 색상
const CONFETTI_COLORS = ['#FF6B35', '#00D4AA', '#667EEA', '#F59E0B', '#EF4444'];

// 전역으로 내보내기 (필요시)
window.APP_CONFIG = {
    APP_NAME,
    APP_VERSION,
    SCREENS,
    TABS,
    TOAST_DURATION,
    ANIMATION_DURATION,
    CONFETTI_COLORS
};
