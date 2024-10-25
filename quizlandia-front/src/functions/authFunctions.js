import { getAuth, signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { setPersistence, browserLocalPersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { backEndpoint } from '../envs';
import { setAuthPause } from '../authSlice';

export const signupUser = async (email, password, name, surname, accountType) => {
    try {
        await setPersistence(auth, browserLocalPersistence);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        const user = userCredential.user;

        await fetch(backEndpoint.postUser, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    userID: user.uid,
                    name: name,
                    surname: surname,
                    email: email,
                    accountType: true, // eh?
                }
            )
        }).catch((error) => {
            console.error('Error signing in:', error);
        })
        return user;
    } catch (error) {
        console.log('ERROR')
        console.log(error.code)
        if(error.code.includes('email-already-in-use')){
            return {error: 'Email already in use'};
        } else if(error.code.includes('weak-password')){
            return {error: 'Password is too weak'};
        } else if(error.code.includes('invalid-email')){
            return {error: 'Invalid email'};
        } else {
            console.log('Unknown error:')
            console.log(error);
            return {error: 'Unknown error. Try again later.'};
        }
    }
};

export const loginUser = async (email, password) => {
    try {
        await setPersistence(auth, browserLocalPersistence);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // You can return the user or any other relevant information
        return user;
    } catch (error) {
        if(error.code.includes('invalid-credential')){
            return {error: 'Wrong email, password or authentication method'};
        }
    }
}

export const authWithGoogle = async (dispatch) => {
    const provider = new GoogleAuthProvider();
    try {
        let rtrn;
        dispatch(setAuthPause(true));

        await setPersistence(auth, browserLocalPersistence);
        const userCredential = await signInWithPopup(auth, provider);

        await fetch(backEndpoint.getUser + userCredential.user.uid, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).catch((error) => {
            console.log('err THIS:')
            console.error(error);
        }).then((response) => {
            if (response.statusText === 'Not Found') {
                // new user just created. need to get his name, surname, account type
                rtrn = {displayAdditionalInfo: true, ...userCredential.user};
            } else {
                rtrn = userCredential.user;
            }
        })

        return rtrn;
    } catch (error) {
        console.log('error is:')
        console.log(error.code)
        if(error.code.includes('invalid-credential')){
            return {error: 'Wrong email or password'};
        } else if (error.code.includes('user-canceled')) {
            return {error: 'User cancelled the sign in'};
        }
    }
}

export const logOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
        console.log('User signed out');
        // Optionally, redirect the user to the login page or show a message
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
};