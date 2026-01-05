/**
 * 온보딩 관련 기능
 */

let currentOnboardingSlide = 0;
const totalOnboardingSlides = 5;

/**
 * 다음 온보딩 슬라이드로 이동
 */
function nextOnboardingSlide() {
    if (currentOnboardingSlide < totalOnboardingSlides - 1) {
        currentOnboardingSlide++;
        updateOnboardingSlide();
    }
}

/**
 * 특정 온보딩 슬라이드로 이동
 * @param {number} index - 슬라이드 인덱스
 */
function goToOnboardingSlide(index) {
    currentOnboardingSlide = index;
    updateOnboardingSlide();
}

/**
 * 온보딩 슬라이드 업데이트
 */
function updateOnboardingSlide() {
    const slidesContainer = document.getElementById('onboarding-slides');
    const dots = document.querySelectorAll('.onboarding-dots .dot');
    const btnNext = document.getElementById('btn-onboarding-next');
    const btnStart = document.getElementById('btn-onboarding-start');

    if (!slidesContainer) return;

    // 슬라이드 이동
    slidesContainer.style.transform = `translateX(-${currentOnboardingSlide * 20}%)`;

    // 진행도 점 업데이트
    dots.forEach((dot, index) => {
        if (index === currentOnboardingSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // 마지막 슬라이드인 경우 "시작하기" 버튼 표시
    if (currentOnboardingSlide === totalOnboardingSlides - 1) {
        btnNext.style.display = 'none';
        btnStart.style.display = 'block';
    } else {
        btnNext.style.display = 'block';
        btnStart.style.display = 'none';
    }
}

/**
 * 온보딩 건너뛰기
 */
function skipOnboarding() {
    // localStorage에 온보딩 완료 표시
    localStorage.setItem('wemeet_onboarding_completed', 'true');

    if (typeof goToScreen === 'function') {
        goToScreen('home'); // 홈(지도) 화면으로 이동
    }
}

/**
 * 앱 시작하기
 */
function startApp() {
    // localStorage에 온보딩 완료 표시
    localStorage.setItem('wemeet_onboarding_completed', 'true');

    if (typeof goToScreen === 'function') {
        goToScreen('home'); // 홈(지도) 화면으로 이동
    }
}

/**
 * 온보딩 화면 초기화
 */
function initOnboarding() {
    currentOnboardingSlide = 0;
    updateOnboardingSlide();

    // 터치 스와이프 지원
    const slidesContainer = document.getElementById('onboarding-slides');
    if (slidesContainer) {
        let touchStartX = 0;
        let touchEndX = 0;

        slidesContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        slidesContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                // 왼쪽으로 스와이프 (다음)
                nextOnboardingSlide();
            }
            if (touchEndX > touchStartX + 50) {
                // 오른쪽으로 스와이프 (이전)
                if (currentOnboardingSlide > 0) {
                    currentOnboardingSlide--;
                    updateOnboardingSlide();
                }
            }
        }
    }
}

// 온보딩 화면 진입 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    const onboardingScreen = document.getElementById('screen-onboarding');
    if (onboardingScreen) {
        // MutationObserver로 화면 활성화 감지
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('active') &&
                    mutation.target.id === 'screen-onboarding') {
                    initOnboarding();
                }
            });
        });

        observer.observe(onboardingScreen, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
});
