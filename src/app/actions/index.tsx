"use server"

import { signIn,signOut } from "@/auth"

export async function login(formData:any){
    const source = formData
    await signIn(source,{redirectTo:"/"})
}

export async function logout(){
    await signOut({redirectTo:'/applogin'})
}