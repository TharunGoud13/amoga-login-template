import { Metadata } from 'next';
import LoginForm from '@/components/forms/login-form';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'App Join',
  description: 'Login or Join with Email or Mobile Number or Social'
};

export default function Login() {
  return (
    <div className="relative h-full md:h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        {/* <div className="absolute inset-0 h-full bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Logo
        </div> */}
        <Image src="https://images.tmcnet.com/tmc/misc/articles/image/2024-jan/2858886878-AdobeStock_213370480_automation_future_work_supersize_1200x630.jpeg" 
        alt='Amogademo'
        layout='fill'
        objectFit='cover'
        />
      </div>
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome
            </h1>
            <p className="text-sm text-muted-foreground">
            Sign up or log in to your account
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}