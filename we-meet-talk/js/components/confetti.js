/**
 * Confetti Component
 * 축하 컨페티 애니메이션
 */

/**
 * 컨페티 생성 및 애니메이션
 * @param {number} count - 컨페티 개수 (기본값: 40)
 */
function createConfetti(count = 40) {
    const colors = ['#FF6B35', '#00D4AA', '#667EEA', '#F59E0B', '#EF4444'];

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';

            // 랜덤 스타일 적용
            const left = Math.random() * 100;
            const width = Math.random() * 8 + 4;
            const height = Math.random() * 8 + 4;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            const duration = Math.random() * 2 + 2;

            confetti.style.cssText = `
                left: ${left}vw;
                width: ${width}px;
                height: ${height}px;
                background: ${color};
                border-radius: ${borderRadius};
                animation: confetti-fall ${duration}s linear forwards;
            `;

            document.body.appendChild(confetti);

            // 애니메이션 완료 후 제거
            setTimeout(() => confetti.remove(), 4000);
        }, i * 40);
    }
}

// 전역으로 내보내기
window.createConfetti = createConfetti;
