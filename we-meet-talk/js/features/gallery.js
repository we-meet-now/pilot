/**
 * Gallery Feature
 * 갤러리 기능 - 로그인 상태에 따라 다른 모임 사진 표시
 */

// 게스트 갤러리 데이터 (초대받은 모임 1개만)
const guestGalleries = [
    {
        title: '대학 동기 모임',
        date: '2024.12.21',
        count: 12,
        photos: [
            'linear-gradient(135deg,#667eea,#764ba2)',
            'linear-gradient(135deg,#f093fb,#f5576c)',
            'linear-gradient(135deg,#4facfe,#00f2fe)',
            'linear-gradient(135deg,#43e97b,#38f9d7)'
        ],
        moreCount: 8
    }
];

// 로그인 사용자 갤러리 데이터 (모든 모임)
const loggedInGalleries = [
    {
        title: '대학 동기 모임',
        date: '2024.12.21',
        count: 12,
        photos: [
            'linear-gradient(135deg,#667eea,#764ba2)',
            'linear-gradient(135deg,#f093fb,#f5576c)',
            'linear-gradient(135deg,#4facfe,#00f2fe)',
            'linear-gradient(135deg,#43e97b,#38f9d7)'
        ],
        moreCount: 8
    },
    {
        title: '가족 크리스마스 모임',
        date: '2024.12.25',
        count: 8,
        photos: [
            'linear-gradient(135deg,#fa709a,#fee140)',
            'linear-gradient(135deg,#a8edea,#fed6e3)',
            'linear-gradient(135deg,#d299c2,#fef9d7)',
            'linear-gradient(135deg,#89f7fe,#66a6ff)'
        ],
        moreCount: 4
    },
    {
        title: '11월 북클럽',
        date: '2024.11.15',
        count: 5,
        photos: [
            'linear-gradient(135deg,#c471f5,#fa71cd)',
            'linear-gradient(135deg,#48c6ef,#6f86d6)',
            'linear-gradient(135deg,#f6d365,#fda085)',
            'linear-gradient(135deg,#a1c4fd,#c2e9fb)',
            'linear-gradient(135deg,#d4fc79,#96e6a1)'
        ],
        moreCount: 0
    },
    {
        title: '회사 워크샵',
        date: '2024.10.28',
        count: 23,
        photos: [
            'linear-gradient(135deg,#ff9a9e,#fecfef)',
            'linear-gradient(135deg,#a18cd1,#fbc2eb)',
            'linear-gradient(135deg,#ffecd2,#fcb69f)',
            'linear-gradient(135deg,#ff8177,#cf556c)'
        ],
        moreCount: 19
    }
];

/**
 * 갤러리 업데이트
 */
function updateGallery() {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer) return;

    // 로그인 상태 확인
    const isLoggedIn = typeof isUserLoggedIn === 'function' ? isUserLoggedIn() : false;
    const galleries = isLoggedIn ? loggedInGalleries : guestGalleries;

    // 기존 갤러리 섹션 제거
    galleryContainer.innerHTML = '';

    // 갤러리 섹션 렌더링
    galleries.forEach(gallery => {
        const section = createGallerySection(gallery);
        galleryContainer.appendChild(section);
    });
}

/**
 * 갤러리 섹션 생성
 */
function createGallerySection(gallery) {
    const section = document.createElement('div');
    section.className = 'gallery-section';

    // 사진 아이템 HTML 생성
    const photosHTML = gallery.photos.map(gradient =>
        `<div class="gallery-item" style="background:${gradient}"></div>`
    ).join('');

    // +더보기 아이템 HTML (moreCount가 0보다 크면 표시)
    const morePhotosHTML = gallery.moreCount > 0 ?
        `<div class="gallery-item more-photos"><span>+${gallery.moreCount}</span></div>` : '';

    section.innerHTML = `
        <div class="gallery-section-header">
            <div class="gallery-section-info">
                <h3 class="gallery-section-title">${gallery.title}</h3>
                <span class="gallery-section-date">${gallery.date}</span>
            </div>
            <span class="gallery-section-count">${gallery.count}장</span>
        </div>
        <div class="gallery-grid">
            ${photosHTML}
            ${morePhotosHTML}
        </div>
    `;

    return section;
}

// 페이지 로드 시 갤러리 업데이트
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateGallery);
} else {
    updateGallery();
}

// 전역으로 내보내기
window.updateGallery = updateGallery;
