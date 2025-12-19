/**
 * Main Application Entry Point
 * 앱 초기화 및 전역 설정
 */

(function() {
    'use strict';

    /**
     * 앱 초기화
     */
    function initApp() {
        console.log('🎉 오보톡 앱 초기화 완료');

        // 필요한 초기화 로직 추가
        // 예: 이벤트 리스너 등록, 초기 데이터 로드 등
    }

    // DOM 로드 완료 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
})();
