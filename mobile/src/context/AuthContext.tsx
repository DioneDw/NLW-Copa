import { createContext, ReactNode } from "react"


interface UserProps {
  name: string;
  avatarUrl: string;
}

export interface AuthContextDataProps{
  user: UserProps;
  signIn: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps); 

export function AuthContextProvider({children}: AuthProviderProps){

 async function signIn(){
  console.log("Vamos logar")
 }
   return (
    <AuthContext.Provider value={{
      signIn,
      user: {
        name: 'Dione',
        avatarUrl: 'https://github.com/dionedw.png',
       }}
    }>
     {children}
    </AuthContext.Provider>
   )
}