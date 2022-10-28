//https://firebase.google.com/docs/auth/web/start

import {
    getAuth,
    //createUserWithEmailAndPassword,
    //signInWithEmailAndPassword,
    signInWithPhoneNumber,
    onAuthStateChanged,
    RecaptchaVerifier,
    updateEmail,
    updateProfile,
} from "firebase/auth";


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

const codeToMessage = {
    "auth/invalid-verification-code": "Mauvais code de vérification",
    "auth/missing-verification-code": "Code de vérification manquant",
    "auth/invalid-verification-id": "Mauvais ID de vérification",
    "auth/missing-verification-id": "ID de vérification manquant",
    "auth/credential-already-in-use": "Ce numéro est déjà utilisé",
    "auth/invalid-credential": "Mauvaise authentification",
    "auth/missing-credential": "Authentification manquante",
    "auth/invalid-phone-number": "Mauvais numéro de téléphone",
    "auth/missing-phone-number": "Num de téléphone manquant",
    "auth/invalid-verification-code": "Mauvais code de vérification",
    "auth/missing-verification-code": "Code de vérification manquant",
    "auth/invalid-verification-id": "Mauvais ID de vérification",
    "auth/missing-verification-id": "ID de vérification manquant",
    "auth/credential-already-in-use": "Ce numéro est déjà utilisé",
    "auth/invalid-credential": "Mauvaise authentification",
    "auth/missing-credential": "Authentification manquante",
    "auth/invalid-phone-number": "Mauvais numéro de téléphone",
    "auth/missing-phone-number": "Num de téléphone manquant",
    "auth/internal-error": "Une erreur est survenue, veuillez réessayer plus tard."
};

/**
 * Sign in with phone, return true if sucess or false if not
 * @param {string} phone 
 * @param {RecaptchaVerifier} verifier 
 * @return {true | object} result
 */
export const signInUser = async (phone, verifier) => {
    const auth = getAuth();
    try {
        const credentials = await signInWithPhoneNumber(
            auth,
            phone,
            verifier
        );
        window.confirmationResult = credentials;
        return true;
    } catch (err) {
        return {
            code: err.code,
            message: codeToMessage[err.code] ?? ''
        };
    }
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

        const { init } = useInitializerStore();
        init();
    });
};

export const signOutUser = async () => {
    const auth = getAuth();
    const result = await auth.signOut();
    return result;
};

export const updateUser = async (user) => {
    // update user profile and email
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
        await updateProfile(currentUser, {
            displayName: user.displayName,
            photoURL: user.photoURL,
        });
    }
};

export const firestoreFetch = async (path, needAuth = true) => {
    if (needAuth && !isAuth()) return null;
    let response = null;
    try {
        response = await useFetch('/api/' + path);
        if ((response?.status || 200) !== 200) {
            throw new Error(response.message);
        }
    } catch (err) {
        console.log(err);
    }
    return response;
}

export const firestoreUpdate = async (path, data, needAuth = true) => {
    if (needAuth && !isAuth()) return null;
    let response = null;
    try {
        response = await $fetch('/api/' + path, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if ((response?.status || 200) !== 200) {
            throw new Error(response.message);
        }
    } catch (err) {
        console.log(err);
    }
    return response;
}

export const firestoreDelete = async (path, needAuth = true) => {
    if (needAuth && !isAuth()) return null;
    let response = null;
    try {
        response = await $fetch('/api/' + path, {
            method: 'DELETE'
        });
        if ((response?.status || 200) !== 200) {
            throw new Error(response.message);
        }
    } catch (err) {
        console.log(err);
    }
    return response;
}

export const firestoreAdd = async (path, data, needAuth = true) => {
    if (needAuth && !isAuth()) return null;
    let response = null;
    try {
        response = await $fetch('/api/' + path, {
            method: 'PUT',
            body: data
        });
        if ((response?.status || 200) !== 200) {
            throw new Error(response.message);
        }
    } catch (err) {
        console.log(err);
    }
    return response;
}

export const isAuth = () => {
    const auth = getAuth();
    return auth.currentUser !== null;
}