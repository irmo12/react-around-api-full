import { createContext, useState } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [userData, setUser] = useState([])

  const updateUser = (newUser) => {
    setUser((prevState) =>  [...prevState, {...newUser }])
  }
  return (
    <UserContext.Provider value={{ userData, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
