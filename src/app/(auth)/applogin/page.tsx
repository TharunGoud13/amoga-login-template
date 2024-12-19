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