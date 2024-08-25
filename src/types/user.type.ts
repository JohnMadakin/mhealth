export type NewUser = { 
  firstname: string; 
  lastname: string; 
  dob: string; 
  email: string; 
  password: string;
  sex: string;
}

export type Authuser = {
  email: string; 
  pin: string; 
  password: string; 
  authType: string; 
}

export type JWTUser = {
  refreshToken: string; 
  token: string; 
  tokenExpires: number; 
}

export type AuthGoogleLoginDto = {
  idToken: string; 
}
export type CreatePin = {
  pin: string; authId: string; 
}
export type PhoneLogin = {
  pin: string; phoneNo: string; 
}

export interface SocialInterface {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export type TokenData = {
  token: string;
  refreshToken: string;
  tokenExpires: number;
}