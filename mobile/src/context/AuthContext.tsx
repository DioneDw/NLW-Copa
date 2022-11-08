import { createContext, ReactNode, useEffect, useState} from 'react';

import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

interface UserProps{
  name: string;
  avatarUrl: string;
}

export interface AuthContextDataProps{
  user: UserProps;
  isUserLoading: boolean;
  signIn: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextDataProps);

interface AuthContextProps{
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProps){
 const [isUserLoading, setIsUserLoading] = useState(false);
 const [user, setUser] = useState<UserProps>({} as UserProps)

 const [request, response, promptAsync] = Google.useAuthRequest({
  clientId: '419526569503-g80lacq27srqk3jjeud870fuomko43l5.apps.googleusercontent.com',
  redirectUri: AuthSession.makeRedirectUri({useProxy: true}),
  scopes:[ 'profile', 'email']
 })

  async function signIn(){
 try{
  setIsUserLoading(true)
  await promptAsync();
 }catch(error){
  console.log(error)
  throw error;
 } finally{
  setIsUserLoading(false)
 }
}

async function signInWithGoogle(access_token: string){
 console.log('Token de autenticação: ', access_token);
}
useEffect(()=>{
 if(response?.type === 'success' && response.authentication?.accessToken){
  signInWithGoogle(response.authentication.accessToken)
 }
},[response])




  return (
  <AuthContext.Provider value={{
    signIn,
    isUserLoading,
    user,
  }}>
  {children}
  </AuthContext.Provider>
  );
}