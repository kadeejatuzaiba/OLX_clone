import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider,signOut } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCXQZf0BjYOz42zSZ8l9sGLadhO8tz0XRQ",
  authDomain: "olx-clone-4a1ee.firebaseapp.com",
  projectId: "olx-clone-4a1ee",
  storageBucket: "olx-clone-4a1ee.firebasestorage.app",
  messagingSenderId: "1063481302418",
  appId: "1:1063481302418:web:050ef47620595eb920f54b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
const fireStore = getFirestore(app);
const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

const fetchFromFireStore = async () => {
  try {
    const productsCollection = collection(fireStore, 'Products');
    const productSnapshot = await getDocs(productsCollection);
    const productList = productSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log('Fetched products from Firestore', productList);
    return productList;
  } catch (error) {
    console.error('Error fetching products from Firestore', error);
    return [];
  }
};

export { auth,logout, provider, storage, fireStore, fetchFromFireStore };