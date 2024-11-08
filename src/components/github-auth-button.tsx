'use client';

import { Button } from './ui/button';
import { login } from '@/app/actions';
import { GithubIcon } from 'lucide-react';

export default function GithubSignInButton() {

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={() =>
        login("github")
      }
    >
      <GithubIcon className='mr-2 h-4 w-4'/>
       Github
    </Button>
  );
}