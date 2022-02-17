import { initializeApp } from 'firebase/app';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJUINANA7kw6hXiX684vZV6ds9hmYOpW0",
  authDomain: "gatekeeper-d13f9.firebaseapp.com",
  databaseURL: "https://gatekeeper-d13f9-default-rtdb.firebaseio.com",
  projectId: "gatekeeper-d13f9",
  storageBucket: "gatekeeper-d13f9.appspot.com",
  messagingSenderId: "602825357952",
  appId: "1:602825357952:web:037e39f9448c077e374465"
};

const app = initializeApp(firebaseConfig);