import { initializeApp } from "firebase/app";
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDU07ZRTprWTEqUUrOX43-kXrqRNHOk6nc",
  authDomain: "speedy-go.firebaseapp.com",
  projectId: "speedy-go",
  storageBucket: "speedy-go.firebasestorage.app",
  messagingSenderId: "151732953330",
  appId: "1:151732953330:web:6d8f189040b5e9024bb06b"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
