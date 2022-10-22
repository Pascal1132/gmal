//https://firebase.google.com/docs/auth/web/start

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPhoneNumber,
    onAuthStateChanged,
    RecaptchaVerifier,
} from "firebase/auth";

export const createUser = async (email, password) => {
    const auth = getAuth();
    const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    ).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
    return credentials;
};

export const setupVerifier = (container) => {
    const auth = getAuth();
    const verifier = new RecaptchaVerifier(container, {
        size: "invisible",
        callback: (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            // ...
        },
    }, auth);
    return verifier;
};

export const signInUser = async (phone, verifier) => {
    const auth = getAuth();

    const credentials = await signInWithPhoneNumber(
        auth,
        phone,
        verifier
    );
    window.confirmationResult = credentials;
    return credentials;
};

export const initUser = async () => {
    const auth = getAuth();
    const firebaseUser = useFirebaseUser();
    firebaseUser.value = auth.currentUser;

    const userCookie = useCookie("userCookie");

    const router = useRouter();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
        } else {
            //if signed out
            router.push("/");
        }

        firebaseUser.value = user;

        // @ts-ignore
        userCookie.value = user; //ignore error because nuxt will serialize to json

        $fetch("/api/auth", {
            method: "POST",
            body: { user },
        });
    });
};

export const signOutUser = async () => {
    const auth = getAuth();
    const result = await auth.signOut();
    return result;
};