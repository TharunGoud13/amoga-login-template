import { auth } from '@/auth'
import LogoutButton from '@/components/forms/logout-button'
import React from 'react'

const Home = async() => {
  const session = await auth()
  console.log("session---",session)
  return (
    <div className='flex h-screen w-screen items-center justify-center'>Home Page
    <LogoutButton/>
    </div>
  )
}

export default Home