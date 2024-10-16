import { auth } from '../firebaseConfig'; // Adjust the import path as needed
import { setPersistence, browserLocalPersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export const signupUser = async (email, password) => {
    try {
        await setPersistence(auth, browserLocalPersistence);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('usercred:')
        console.log(userCredential);

        const user = userCredential.user;
        console.log('User signed up:', user);
        // You can return the user or any other relevant information
        return user;
    } catch (error) {
        console.log('error:')
        console.log()
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
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        await setPersistence(auth, browserLocalPersistence);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User signed in:', user);
        // You can return the user or any other relevant information
        return user;
    } catch (error) {
        console.log('error is:')
        console.log(error.code)
        if(error.code.includes('invalid-credential')){
            return {error: 'Wrong email or password'};
        }
    }
}