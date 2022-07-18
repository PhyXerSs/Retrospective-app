import firebase from 'firebase';
const firebaseConfig = {
  apiKey: "AIzaSyAgKnX8BZIqvllnHRWhH7AnmZn08-tma3c",
  authDomain: "retrospective-app.vercel.app",
  databaseURL: "https://retrospective-connectx-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "retrospective-connectx",
  storageBucket: "retrospective-connectx.appspot.com",
  messagingSenderId: "367319099821",
  appId: "1:367319099821:web:d74e35cbd4afd53af51924"
};
try {
  firebase.initializeApp(firebaseConfig);
} catch(err:any){
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)}
}

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => firebase.auth().signInWithPopup(provider);

const fire = firebase;
export default fire;

