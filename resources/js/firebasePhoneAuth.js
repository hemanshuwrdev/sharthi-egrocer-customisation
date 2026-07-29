import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import axios from 'axios';

let configPromise = null;
let authInstance = null;
const recaptchaVerifiers = {};

function fetchConfig(apiUrl) {
    if (!configPromise) {
        configPromise = axios.get(apiUrl + '/firebase/public_config').then(res => res.data.data);
    }
    return configPromise;
}

async function getFirebaseAuth(apiUrl) {
    if (authInstance) return authInstance;
    const config = await fetchConfig(apiUrl);
    const app = getApps().length ? getApp() : initializeApp({
        apiKey: config.firebase_apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId,
        measurementId: config.measurementId,
    });
    authInstance = getAuth(app);
    return authInstance;
}

/**
 * Sends a real OTP via Firebase Phone Auth. `phoneNumber` must be E.164
 * format (e.g. "+919274048485"). Returns a confirmationResult — pass the
 * code the user enters to confirmFirebaseOtp() to verify it.
 */
function resetRecaptcha(recaptchaContainerId) {
    if (recaptchaVerifiers[recaptchaContainerId]) {
        try {
            recaptchaVerifiers[recaptchaContainerId].clear();
        } catch (e) {
            // widget may already be gone/half-initialized — ignore and fall through to a hard reset
        }
        delete recaptchaVerifiers[recaptchaContainerId];
    }
    // .clear() doesn't always remove a widget left over from a failed attempt
    // (e.g. the auth/captcha-check-failed case) — wipe the container directly
    // so the next render() doesn't collide with a stale iframe.
    const container = document.getElementById(recaptchaContainerId);
    if (container) container.innerHTML = '';
}

export async function sendFirebaseOtp(apiUrl, recaptchaContainerId, phoneNumber) {
    const auth = await getFirebaseAuth(apiUrl);

    resetRecaptcha(recaptchaContainerId);
    recaptchaVerifiers[recaptchaContainerId] = new RecaptchaVerifier(auth, recaptchaContainerId, { size: 'invisible' });

    try {
        return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifiers[recaptchaContainerId]);
    } catch (err) {
        resetRecaptcha(recaptchaContainerId);
        throw err;
    }
}

export function confirmFirebaseOtp(confirmationResult, code) {
    return confirmationResult.confirm(code);
}
