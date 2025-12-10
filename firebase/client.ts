import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyANnFtDMp-dfnBcmB6VDL0i5YrZkKqM_Fs',
  authDomain: 'prepme-e5e39.firebaseapp.com',
  projectId: 'prepme-e5e39',
  storageBucket: 'prepme-e5e39.firebasestorage.app',
  messagingSenderId: '755481547628',
  appId: '1:755481547628:web:ec3dbbd9438901f3455949',
  measurementId: 'G-RVY8RKTZ7S',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const dv = getFirestore(app);
