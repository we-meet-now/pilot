/**
 * Firebase Configuration
 * Firebase 설정 및 초기화
 */

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyBH9ZyZMr0nGxGvjSp1-LJbXeu0vY9dKd0",
    authDomain: "wemeettalk.firebaseapp.com",
    projectId: "wemeettalk",
    storageBucket: "wemeettalk.firebasestorage.app",
    messagingSenderId: "721247847254",
    appId: "1:721247847254:web:e662acec0d3efb9ff50cf7"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);

// Firestore 데이터베이스 인스턴스
const db = firebase.firestore();

// Firebase Authentication 인스턴스
const auth = firebase.auth();

// 전역으로 내보내기
window.db = db;
window.auth = auth;
window.firebase = firebase;

console.log('🔥 Firebase 초기화 완료');
