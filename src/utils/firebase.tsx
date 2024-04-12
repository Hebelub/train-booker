import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyBYZwTFSNj0fjPu_j2FGx7fmkx_cW3dLNs",
    authDomain: "train-booker.firebaseapp.com",
    projectId: "train-booker",
    storageBucket: "train-booker.appspot.com",
    messagingSenderId: "569148385313",
    appId: "1:569148385313:web:2f443593bb2bf212221b60",
    measurementId: "G-M1P5SWD8XF"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export default app;