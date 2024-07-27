import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';



import { app } from '../firebase/firebase.config';

export const AuthContext = createContext(null);
const auth =getAuth(app); 





const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setloading] = useState(true);
const googleProvider = new GoogleAuthProvider();


  const createUser = (email, password) => {
    setloading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setloading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    setloading(true);
    return signOut(auth);
  };

  const gooleSignIn = ()=>{
    setloading(true); 
    return signInWithPopup(auth , googleProvider); 
  }



  // update profile 

  const updateUserProfile = (name , photo)=>{

    return updateProfile(auth.currentUser , {
      displayName : name, 
      photoURL : photo,
    })
  }





  // 

    useEffect(()=>{

        const unsubscribe = onAuthStateChanged(auth , (currentUser)=>{
            // console.log('user name of authprovider  ' , currentUser)
            // console.log('oauth state changed ')
            setloading(false); 
            setUser(currentUser); 
            // console.log('loading state of auth state changed ' , loading)
        })  

        return ()=>{
           return unsubscribe()
        }
    } , [loading])

  const authInfo = {
    user,
    createUser,
    signIn,
    logOut,
    loading,
    updateUserProfile,
    gooleSignIn
    
  };

  return (
    <>
      <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
