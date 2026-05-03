import { createContext, useContext, useEffect, useState } from 'react'
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  onIdTokenChanged
} from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import api from '../services/api'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      setUser(currentUser)
      setLoading(false)
      
      if (currentUser) {
        const token = await currentUser.getIdToken()
        localStorage.setItem('matpath_token', token)
        localStorage.setItem('matpath_user', JSON.stringify({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName
        }))
      } else {
        localStorage.removeItem('matpath_user')
        localStorage.removeItem('matpath_token')
        sessionStorage.clear() // Clear all session data (chat history, session ID) on logout
      }
    })

    return () => unsubscribe()
  }, [])

  const signup = async (email, password, name) => {
    const res = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(res.user, { displayName: name })
    return res.user
  }

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const googleSignIn = () => {
    return signInWithPopup(auth, googleProvider)
  }

  const logout = async () => {
    try {
      // Clear chat history on server before logging out if token exists
      const token = localStorage.getItem('matpath_token')
      if (token) {
        await api.delete('/chat/history').catch(err => console.error('Failed to clear server chat history:', err))
      }
    } finally {
      localStorage.removeItem('matpath_token')
      localStorage.removeItem('matpath_user')
      localStorage.removeItem('matpath_completed_steps')
      sessionStorage.clear()
      return signOut(auth)
    }
  }

  const value = {
    user,
    signup,
    login,
    googleSignIn,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
