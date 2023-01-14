import { createContext, useState } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [userData, setUser] = useState({_id:'',email:'',name:'',about:'',avatar:''})

  const updateUser = (newUser) => {
    setUser({...userData,...newUser})
  }
  return (
    <UserContext.Provider value={{ userData, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
