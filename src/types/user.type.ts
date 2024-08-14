export type NewUser = { 
  firstname: string; 
  lastname: string; 
  dob: string; 
  email: string; 
  password: string; 
}

export type Authuser = {
  email: string; 
  password: string; 
  authType: string; 
}