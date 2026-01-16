import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabase'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null) // 👈 New state for role
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserAndRole = async () => {
      // 🔹 Get current session
      const { data: { session } } = await supabase.auth.getSession()
      const currentUser = session?.user || null
      setUser(currentUser)

      if (currentUser) {
        // 🔹 Fetch role from profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single()

        if (!error && data) {
          setRole(data.role)
        }
      }

      setLoading(false)
    }

    fetchUserAndRole()

    // 🔹 Listen to auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        // Fetch role again when auth state changes
        supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => setRole(data?.role || 'user'))
      } else {
        setUser(null)
        setRole(null)
      }
      setLoading(false)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook for easy access
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
